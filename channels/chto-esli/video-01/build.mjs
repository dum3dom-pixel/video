import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(fs.readFileSync(path.join(root, 'spec/timeline.json'), 'utf8'));
const duration = Math.ceil(spec.total * 24) / 24;
fs.mkdirSync(path.join(root, 'engine'), {recursive: true});
fs.mkdirSync(path.join(root, 'assets/fonts'), {recursive: true});
// Reuse the deterministic paper material helpers from the approved channel engine.
fs.copyFileSync(path.resolve(root, '../../../nauka-frames/engine/paper.js'), path.join(root, 'engine/paper.js'));
for (const [src, dst] of [['arialbd.ttf', 'arial-bold.ttf'], ['georgiab.ttf', 'georgia-bold.ttf'], ['georgia.ttf', 'georgia.ttf']]) {
  fs.copyFileSync(path.join('C:/Windows/Fonts', src), path.join(root, 'assets/fonts', dst));
}
fs.writeFileSync(path.join(root, 'engine/data.js'), `window.PILOT = ${JSON.stringify({...spec, duration})};\n`);

function html(variant) {
  const prefix=variant==='dynamic'?'../':'';
  return `<!doctype html>
<html lang="ru" data-resolution="landscape"><head><meta charset="UTF-8">
<meta name="viewport" content="width=1920, height=1080">
<style>
@font-face{font-family:PilotSans;src:url('${prefix}assets/fonts/arial-bold.ttf');font-weight:700}
@font-face{font-family:PilotSerif;src:url('${prefix}assets/fonts/georgia.ttf')}
@font-face{font-family:PilotSerif;src:url('${prefix}assets/fonts/georgia-bold.ttf');font-weight:700}
*{box-sizing:border-box;margin:0}html,body{width:1920px;height:1080px;overflow:hidden;background:#a59b8c}
#stage{position:absolute;inset:0;width:1920px;height:1080px}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${duration}" data-width="1920" data-height="1080" data-fps="24" data-no-timeline>
<canvas id="stage" width="1920" height="1080" data-layout-allow-overflow></canvas>
<audio id="master" class="clip" data-start="0" data-duration="${spec.total}" data-track-index="2" data-volume="1" src="${prefix}assets/master.wav"></audio>
</div>
<script>window.PILOT_VARIANT=${JSON.stringify(variant)};window.PILOT_ASSET_BASE=${JSON.stringify(prefix+'assets/')};</script>
<script src="${prefix}engine/data.js"></script><script src="${prefix}engine/paper.js"></script><script src="${prefix}engine/pilot.js"></script>
<script>
const ready=Promise.all([document.fonts.load('700 68px PilotSans'),document.fonts.load('700 150px PilotSerif'),document.fonts.load('40px PilotSerif'),PILOT_ENGINE.load()]).then(()=>PILOT_ENGINE.render(0));
window.__hf=window.__hf||{};window.__hf.buildReady=window.__hf.buildReady||{};window.__hf.buildReady.main=ready;
window.addEventListener('hf-seek',e=>PILOT_ENGINE.render(e.detail.time));
</script></body></html>`;
}
fs.writeFileSync(path.join(root, 'index.html'), html('calm'));
fs.mkdirSync(path.join(root, 'compositions'), {recursive:true});
fs.writeFileSync(path.join(root, 'compositions/dynamic.html'), html('dynamic'));
if(fs.existsSync(path.join(root, 'dynamic.html')))fs.unlinkSync(path.join(root, 'dynamic.html'));
console.log(`Built two HyperFrames compositions: ${duration}s at 24 fps; animation at 12 fps.`);
