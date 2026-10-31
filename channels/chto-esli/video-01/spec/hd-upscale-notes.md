# HD originals

On 2026-11-01 the user selected local neural upscaling of five approved pilot plates and the three character sheets.

- Five plates: approved 1536×864 sources in `assets/hd-refs/` → exact 2560×1440 PNG.
- Three sheets: existing 1536×1024 sources → exact 3072×2048 PNG, preserving 3:2.
- Mama uses the latest `mama_sheet-v2.png`.
- Originals are retained. The earlier generative p4 preview is `assets/shots/p4_sasha_rerender-preview.png`.
- Engine references and rendered videos are unchanged.

## Selected method

[FSRCNN ×2](https://github.com/Saafke/FSRCNN_Tensorflow) through OpenCV contrib 4.12.0, with Lanczos downsampling for the exact plate dimensions. Sheets use the native 2× result. Face restoration and additional sharpening are disabled.

A Real-ESRGAN x4plus trial simplified Kostya's eyes and paper texture too much. The FSRCNN comparison preserved those details more closely; the rejected trial is documented separately in `hd-upscale-realesrgan-trials.json`.

Neural upscaling improves sampling and edges but remains limited by detail present in the approved source. It does not provide the detail of a newly drawn high-resolution original.

## Reproduce

Dependencies are isolated outside the repository. From `channels/chto-esli/video-01`:

```powershell
$hdToolRoot = Join-Path $env:LOCALAPPDATA 'CodexTools\fsrcnn'
New-Item -ItemType Directory -Path $hdToolRoot -Force | Out-Null
python -m pip install --no-deps --target (Join-Path $hdToolRoot 'python') opencv-contrib-python==4.12.0.88
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/Saafke/FSRCNN_Tensorflow/master/models/FSRCNN_x2.pb' -OutFile (Join-Path $hdToolRoot 'FSRCNN_x2.pb')
python scripts/upscale_hd.py
```

The project requirements already include Pillow and NumPy. The runner records the model SHA-256 so the downloaded weight can be checked.

Use `--only p4_sasha` or other IDs from the plan to select assets. Verified unchanged outputs are skipped. Unexpected output files are not overwritten. `--replace-managed` replaces only earlier task outputs whose hashes still match the processing log.

## Review

Open [hd-review.html](../renders/hd-review.html) to compare each source and final PNG at a shared zoom and position. The default 2.6× matches the strongest pilot push-in.

[hd-upscale-log.json](hd-upscale-log.json) records all eight source/output hashes, dimensions, processing times, model and opacity checks.
[hd-upscale-plan.json](hd-upscale-plan.json) records all eight source/output paths.
