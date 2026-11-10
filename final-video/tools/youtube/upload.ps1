$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms

function Select-File($title, $filter, $directory) {
    $picker = New-Object Windows.Forms.OpenFileDialog
    try {
        $picker.Title = $title
        $picker.Filter = $filter
        $picker.InitialDirectory = $directory
        if ($picker.ShowDialog() -eq 'OK') { return $picker.FileName }
    } finally {
        $picker.Dispose()
    }
}

try {
    $node = (Get-Command node.exe -ErrorAction Stop).Source
    $workspace = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
    $package = Select-File 'Выбери паспорт нового Shorts' 'Паспорт ролика (*.youtube.json)|*.youtube.json' $workspace
    if (!$package) { exit 0 }

    $entry = Join-Path $PSScriptRoot 'upload.mjs'
    & $node $entry preview $package
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    $storage = Join-Path $env:LOCALAPPDATA 'ShortsPublisher'
    $credentials = Join-Path $storage 'google-client.json'
    if (!(Test-Path -LiteralPath $credentials)) {
        $choice = [Windows.Forms.MessageBox]::Show(
            'При первом запуске нужен JSON клиента Google OAuth типа Desktop app. Уже скачал его?',
            'Подключение YouTube', 'YesNoCancel', 'Question')
        if ($choice -eq 'No') {
            Start-Process 'https://console.cloud.google.com/auth/clients'
            Start-Process (Join-Path $PSScriptRoot 'README.md')
            exit 0
        }
        if ($choice -ne 'Yes') { exit 0 }
        $download = Select-File 'Выбери скачанный JSON клиента Google OAuth' 'Google OAuth (*.json)|*.json' (Join-Path $env:USERPROFILE 'Downloads')
        if (!$download) { exit 0 }
        & $node $entry setup $download
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }

    & $node $entry upload $package
    exit $LASTEXITCODE
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
