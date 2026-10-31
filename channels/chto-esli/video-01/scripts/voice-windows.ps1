param([Parameter(Mandatory=$true)][string]$RequestPath)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$pilotRequest = Get-Content -LiteralPath $RequestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$pilotSynth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$pilotSynth.SelectVoice('Microsoft Irina Desktop')
$pilotSynth.Rate = 0
$pilotSynth.Volume = 100
foreach ($pilotChunk in $pilotRequest) {
    $pilotEventId = 'pilot-voice-' + $pilotChunk.id
    Register-ObjectEvent -InputObject $pilotSynth -EventName SpeakProgress -SourceIdentifier $pilotEventId | Out-Null
    $pilotSynth.SetOutputToWaveFile($pilotChunk.path)
    if ($pilotChunk.id -eq 'brother') {
        $pilotEscaped = [System.Security.SecurityElement]::Escape($pilotChunk.text)
        $pilotSynth.SpeakSsml("<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='ru-RU'><prosody pitch='+12%'>$pilotEscaped</prosody></speak>")
    } else {
        $pilotSynth.Speak([string]$pilotChunk.text)
    }
    $pilotSynth.SetOutputToNull()
    $pilotTimings = @(Get-Event -SourceIdentifier $pilotEventId -ErrorAction SilentlyContinue | ForEach-Object {
        [pscustomobject]@{ w=$_.SourceEventArgs.Text; t=$_.SourceEventArgs.AudioPosition.TotalSeconds; d=0.15 }
    })
    Unregister-Event -SourceIdentifier $pilotEventId
    Remove-Event -SourceIdentifier $pilotEventId -ErrorAction SilentlyContinue
    @{ key=$pilotChunk.key; text=$pilotChunk.text; words=$pilotTimings } | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $pilotChunk.timing -Encoding UTF8
    Write-Output ($pilotChunk.id + ': Windows Russian draft voice ready')
}
$pilotSynth.Dispose()
