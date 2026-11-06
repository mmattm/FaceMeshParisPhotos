param([string]$ChromePath, [string]$ChromeArguments)

$ErrorActionPreference = 'Stop'
$deadline = (Get-Date).AddSeconds(60)
do {
    try {
        $response = Invoke-WebRequest 'http://localhost:5173/' -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) { break }
    } catch { }
    Start-Sleep -Milliseconds 300
} while ((Get-Date) -lt $deadline)
if ((Get-Date) -ge $deadline) { throw 'Le serveur ne repond pas sur le port 5173.' }

Add-Type @'
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
public static class ChromeFocus {
    private delegate bool EnumWindowsProc(IntPtr window, IntPtr parameter);
    [DllImport("user32.dll")] private static extern bool EnumWindows(EnumWindowsProc callback, IntPtr parameter);
    [DllImport("user32.dll")] private static extern uint GetWindowThreadProcessId(IntPtr window, out uint processId);
    [DllImport("user32.dll")] private static extern bool IsWindowVisible(IntPtr window);
    [DllImport("user32.dll")] public static extern bool ShowWindowAsync(IntPtr window, int command);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr window);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    public static IntPtr[] Windows() {
        var windows = new List<IntPtr>();
        EnumWindows((window, parameter) => {
            uint processId;
            GetWindowThreadProcessId(window, out processId);
            try {
                if (IsWindowVisible(window) && Process.GetProcessById((int)processId).ProcessName == "chrome")
                    windows.Add(window);
            } catch (ArgumentException) { }
            return true;
        }, IntPtr.Zero);
        return windows.ToArray();
    }
}
'@

# Chrome can reuse an existing process: identify the new window, not the PID
# returned by Start-Process (which can exit immediately).
$existingWindows = @([ChromeFocus]::Windows())
$startupToken = [guid]::NewGuid().ToString()
Start-Process -FilePath $ChromePath -ArgumentList "$ChromeArguments http://localhost:5173/?startup=$startupToken"
$deadline = (Get-Date).AddSeconds(20)
do {
    $window = [ChromeFocus]::Windows() | Where-Object { $_ -notin $existingWindows } | Select-Object -First 1
    if ($window) { break }
    Start-Sleep -Milliseconds 200
} while ((Get-Date) -lt $deadline)
if (-not $window) { throw 'La nouvelle fenetre Chrome est introuvable.' }

$shell = New-Object -ComObject WScript.Shell
for ($attempt = 0; $attempt -lt 10; $attempt++) {
    [void][ChromeFocus]::ShowWindowAsync($window, 9)
    # ALT releases Windows' foreground lock before requesting activation.
    $shell.SendKeys('%')
    [void][ChromeFocus]::SetForegroundWindow($window)
    Start-Sleep -Milliseconds 200
    if ([ChromeFocus]::GetForegroundWindow() -eq $window) { break }
}
if ([ChromeFocus]::GetForegroundWindow() -ne $window) {
    Write-Warning 'Windows a refuse de donner le focus a Chrome.'
}

$deadline = (Get-Date).AddMinutes(3)
$appReady = $false
do {
    try {
        $response = Invoke-WebRequest "http://localhost:5173/api/startup-ready?token=$startupToken" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) { $appReady = $true; break }
    } catch { }
    Start-Sleep -Milliseconds 500
} while ((Get-Date) -lt $deadline)
if (-not $appReady) { throw "L'application n'est pas prete : OBS ne sera pas lance." }

if (Get-Process obs64 -ErrorAction SilentlyContinue) { return }
$obsPath = @(
    "$env:ProgramFiles\obs-studio\bin\64bit\obs64.exe"
    "${env:ProgramFiles(x86)}\obs-studio\bin\64bit\obs64.exe"
) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $obsPath) { throw 'OBS introuvable.' }
Start-Process -FilePath $obsPath -ArgumentList '--disable-shutdown-check' -WorkingDirectory (Split-Path -Parent $obsPath) -WindowStyle Hidden
