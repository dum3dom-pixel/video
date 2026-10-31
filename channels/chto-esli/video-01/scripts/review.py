"""Validate rendered media and export a contact sheet from each actual MP4."""
import io
import hashlib
import json
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
FFMPEG=imageio_ffmpeg.get_ffmpeg_exe()
TIMES=[0.75,3.65,6.25,12.9,16.1,20.25]


def review(variant):
    path=ROOT/'renders'/f'pilot-01-{variant}.mp4'
    if not path.exists():return None
    raw=subprocess.run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)],capture_output=True,check=True).stdout
    probe=json.loads(raw)
    video=next(s for s in probe['streams'] if s['codec_type']=='video')
    audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
    assert (video['width'],video['height'])==(1920,1080)
    assert video['codec_name']=='h264' and audio['codec_name']=='aac'
    assert video['avg_frame_rate']=='24/1'
    assert abs(float(probe['format']['duration'])-21.25)<0.08
    # Decode every video frame and the complete audio to catch corrupt/truncated output.
    subprocess.run([FFMPEG,'-v','error','-i',str(path),'-f','null','-'],capture_output=True,check=True)
    pcm=subprocess.run([FFMPEG,'-v','error','-i',str(path),'-vn','-f','f32le','-ac','1','-ar','22050','-'],capture_output=True,check=True).stdout
    samples=np.frombuffer(pcm,dtype=np.float32)
    rms=float(np.sqrt(np.mean(samples**2)))
    assert rms>0.005 and np.max(np.abs(samples))<1.001
    sheet=Image.new('RGB',(1440,1320),'#F1E6CF')
    draw=ImageDraw.Draw(sheet)
    font=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',22)
    for i,t in enumerate(TIMES):
        raw=subprocess.run([FFMPEG,'-v','error','-ss',str(t),'-i',str(path),'-frames:v','1','-f','image2pipe','-vcodec','png','-'],capture_output=True,check=True).stdout
        frame=Image.open(io.BytesIO(raw)).convert('RGB')
        # A decoded frame must contain actual image detail, not a blank render.
        assert max(frame.getextrema()[j][1]-frame.getextrema()[j][0] for j in range(3))>60
        frame=frame.resize((720,405),Image.Resampling.LANCZOS)
        x=(i%2)*720;y=(i//2)*440
        sheet.paste(frame,(x,y+30))
        draw.text((x+12,y+3),f'{variant}  {t:.2f}s',font=font,fill='#463e35')
    dest=ROOT/'renders'/f'review-{variant}.jpg'
    sheet.save(dest,quality=92)
    result={'file':str(path.relative_to(ROOT)),'width':video['width'],'height':video['height'],'fps':video['avg_frame_rate'],'video_codec':video['codec_name'],'audio_codec':audio['codec_name'],'duration':float(probe['format']['duration']),'bytes':path.stat().st_size,'full_decode':'passed','audio_rms':rms,'audio_sha256':hashlib.sha256(pcm).hexdigest(),'contact_sheet':str(dest.relative_to(ROOT))}
    print(json.dumps(result,ensure_ascii=False))
    return result


if __name__=='__main__':
    target=ROOT/'spec'/'render-review.json'
    existing=json.loads(target.read_text(encoding='utf-8')) if target.exists() else []
    merged={r['file']:r for r in existing}
    for variant in sys.argv[1:] or ['calm','dynamic']:
        result=review(variant)
        if result:merged[result['file']]=result
    target.write_text(json.dumps(list(merged.values()),ensure_ascii=False,indent=2),encoding='utf-8')
