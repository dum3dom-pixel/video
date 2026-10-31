param([ValidateSet('calm','dynamic')][string]$Variant='calm')
$ErrorActionPreference='Stop'
$pilotRoot=Split-Path -Parent $PSScriptRoot
$pilotBin=Join-Path $pilotRoot '.hyperframes/tooling'
New-Item -ItemType Directory -Force -Path $pilotBin | Out-Null
$pilotFfmpeg=(& python -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())").Trim()
if (!(Test-Path -LiteralPath (Join-Path $pilotBin 'ffmpeg.exe'))) {
    Copy-Item -LiteralPath $pilotFfmpeg -Destination (Join-Path $pilotBin 'ffmpeg.exe')
}
$env:PATH=$pilotBin+';'+$env:PATH
$pilotEntry=if($Variant -eq 'dynamic'){'compositions/dynamic.html'}else{'index.html'}
$pilotOutput=Join-Path $pilotRoot ('renders/pilot-01-'+$Variant+'.mp4')
Push-Location $pilotRoot
try {
    & npx --yes hyperframes@0.8.221 render --composition=$pilotEntry --output=$pilotOutput --fps=24 --quality=looks --workers=2
    if($LASTEXITCODE -ne 0){throw "Render failed: $LASTEXITCODE"}
} finally { Pop-Location }
