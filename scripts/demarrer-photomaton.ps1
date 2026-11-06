$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

$chromePath = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $chromePath) { throw 'Google Chrome introuvable.' }

# Keep the normal Chrome profile (camera permissions and application settings).
# Continue rendering the WebRTC canvas when OBS is in front of Chrome.
$chromeArguments = '--new-window --disable-background-timer-throttling --disable-renderer-backgrounding --disable-backgrounding-occluded-windows'

# OBS uses a fixed URL on port 5173. Never silently start on 5174 when
# another instance already owns 5173, otherwise OBS and Chrome are separated.
# Open localhost explicitly, as with npm run dev, to retain the same origin
# for localStorage and camera permissions.
Write-Host 'Demarrage du serveur de developpement sur le port 5173.'
Write-Host 'OBS : http://127.0.0.1:5173/receiver.html?output=obs'
$browserJob = Start-Job -FilePath "$PSScriptRoot/ouvrir-chrome.ps1" -ArgumentList $chromePath, $chromeArguments
try {
    & npm.cmd run dev -- --port 5173 --strictPort
    $serverExitCode = $LASTEXITCODE
} finally {
    Receive-Job -Job $browserJob
    Stop-Job -Job $browserJob
    Remove-Job -Job $browserJob
}
exit $serverExitCode
