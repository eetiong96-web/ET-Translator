$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $root
$ndkRoot = "C:\Users\ETChua\Downloads\android-ndk-r27d-windows\android-ndk-r27d"
$llamaRoot = Join-Path $repoRoot "third_party\llama.cpp"
$cmakeRoots = @(
  (Join-Path $env:LOCALAPPDATA "Android\Sdk\cmake"),
  "C:\Program Files\Android\Android Studio"
)

function Show-PathStatus {
  param(
    [Parameter(Mandatory = $true)][string]$Label,
    [Parameter(Mandatory = $true)][string]$Path
  )

  if (Test-Path -LiteralPath $Path) {
    Write-Output "[OK] $Label`: $Path"
    return
  }

  Write-Output "[MISSING] $Label`: $Path"
}

$ok = $true

Show-PathStatus -Label "Android NDK" -Path $ndkRoot
if (!(Test-Path -LiteralPath $ndkRoot)) { $ok = $false }

$ndkBuild = Join-Path $ndkRoot "ndk-build.cmd"
Show-PathStatus -Label "ndk-build" -Path $ndkBuild
if (!(Test-Path -LiteralPath $ndkBuild)) { $ok = $false }

Show-PathStatus -Label "llama.cpp source" -Path $llamaRoot
if (!(Test-Path -LiteralPath $llamaRoot)) { $ok = $false }

$cmake = $null
foreach ($cmakeRoot in $cmakeRoots) {
  if (Test-Path -LiteralPath $cmakeRoot) {
    $cmake = Get-ChildItem -LiteralPath $cmakeRoot -Recurse -Filter cmake.exe -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($cmake) {
      break
    }
  }
}

if ($cmake) {
  Write-Output "[OK] CMake: $($cmake.FullName)"
} else {
  Write-Output "[MISSING] Android SDK CMake. Install it from Android Studio SDK Manager."
  $ok = $false
}

if ($ok) {
  Write-Output "Offline runtime prerequisites are present."
  exit 0
}

Write-Output "Offline runtime prerequisites are not complete yet."
exit 1
