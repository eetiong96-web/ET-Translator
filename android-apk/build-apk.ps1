$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$sdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$buildTools = Join-Path $sdk "build-tools\37.0.0"
$platformJar = Join-Path $sdk "platforms\android-36.1\android.jar"
$javaHome = "C:\Program Files\Android\Android Studio\jbr"
$javac = Join-Path $javaHome "bin\javac.exe"
$jar = Join-Path $javaHome "bin\jar.exe"
$keytool = Join-Path $javaHome "bin\keytool.exe"
$aapt2 = Join-Path $buildTools "aapt2.exe"
$d8 = Join-Path $buildTools "d8.bat"
$zipalign = Join-Path $buildTools "zipalign.exe"
$apksigner = Join-Path $buildTools "apksigner.bat"

$out = Join-Path ([System.IO.Path]::GetTempPath()) "ettranslator-android-build"
$finalOut = Join-Path $root "build"
$compiled = Join-Path $out "compiled"
$gen = Join-Path $out "gen"
$classes = Join-Path $out "classes"
$dex = Join-Path $out "dex"
$localPlatformJar = Join-Path $out "android.jar"
$apkUnsignedRaw = Join-Path $out "ETTranslator-unsigned-raw.apk"
$apkUnsigned = Join-Path $out "ETTranslator-unsigned.apk"
$apkSigned = Join-Path $out "ETTranslator-debug-signed.apk"
$keystore = Join-Path $out "debug.keystore"
$finalApkUnsigned = Join-Path $finalOut "ETTranslator-unsigned.apk"
$finalApkSigned = Join-Path $finalOut "ETTranslator-debug-signed.apk"

function Invoke-Checked {
  param(
    [Parameter(Mandatory = $true)][string]$FilePath,
    [Parameter(Mandatory = $true)][string[]]$ToolArguments
  )

  & $FilePath @ToolArguments
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed: $FilePath $($ToolArguments -join ' ')"
  }
}

Remove-Item -LiteralPath $out -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $finalOut -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $compiled, $gen, $classes, $dex | Out-Null
New-Item -ItemType Directory -Force -Path $finalOut | Out-Null
Copy-Item -LiteralPath $platformJar -Destination $localPlatformJar -Force

$aaptCompileArgs = @("compile", "--dir", (Join-Path $root "res"), "-o", (Join-Path $compiled "resources.zip"))
Invoke-Checked -FilePath $aapt2 -ToolArguments $aaptCompileArgs

$aaptLinkArgs = @(
  "link",
  "-o", $apkUnsignedRaw,
  "-I", $localPlatformJar,
  "--manifest", (Join-Path $root "AndroidManifest.xml"),
  "--java", $gen,
  "--min-sdk-version", "23",
  "--target-sdk-version", "36",
  (Join-Path $compiled "resources.zip")
)
Invoke-Checked -FilePath $aapt2 -ToolArguments $aaptLinkArgs

$javaFiles = @(
  (Join-Path $root "src\com\eetiong96\ettranslator\MainActivity.java"),
  (Join-Path $gen "com\eetiong96\ettranslator\R.java")
)
$javacArgs = @("-encoding", "UTF-8", "-source", "8", "-target", "8", "-classpath", $localPlatformJar, "-d", $classes) + $javaFiles
Invoke-Checked -FilePath $javac -ToolArguments $javacArgs

$classFiles = Get-ChildItem -LiteralPath $classes -Recurse -Filter *.class | ForEach-Object { $_.FullName }
$d8Args = @("--min-api", "23", "--lib", $localPlatformJar, "--output", $dex) + $classFiles
Invoke-Checked -FilePath $d8 -ToolArguments $d8Args

Invoke-Checked -FilePath $jar -ToolArguments @("uf", $apkUnsignedRaw, "-C", $dex, "classes.dex")
Invoke-Checked -FilePath $zipalign -ToolArguments @("-f", "-p", "4", $apkUnsignedRaw, $apkUnsigned)

Invoke-Checked -FilePath $keytool -ToolArguments @(
  "-genkeypair",
  "-keystore", $keystore,
  "-storepass", "android",
  "-keypass", "android",
  "-alias", "androiddebugkey",
  "-keyalg", "RSA",
  "-keysize", "2048",
  "-validity", "10000",
  "-dname", "CN=Android Debug,O=Android,C=US"
)
Invoke-Checked -FilePath $apksigner -ToolArguments @(
  "sign",
  "--ks", $keystore,
  "--ks-pass", "pass:android",
  "--key-pass", "pass:android",
  "--out", $apkSigned,
  $apkUnsigned
)

Copy-Item -LiteralPath $apkUnsigned -Destination $finalApkUnsigned -Force
Copy-Item -LiteralPath $apkSigned -Destination $finalApkSigned -Force

Write-Output $finalApkUnsigned
Write-Output $finalApkSigned
