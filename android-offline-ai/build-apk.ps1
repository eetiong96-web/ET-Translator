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
$ndkBuild = "C:\Users\ETChua\Downloads\android-ndk-r27d-windows\android-ndk-r27d\ndk-build.cmd"
$llamaRuntime = Join-Path (Split-Path -Parent $root) "third_party\llama-b9672"
$bundledModel = Join-Path $root "bundled-model\qwen-offline.gguf"

$out = Join-Path ([System.IO.Path]::GetTempPath()) "ettranslator-offline-android-build"
$finalOut = Join-Path $root "build"
$compiled = Join-Path $out "compiled"
$gen = Join-Path $out "gen"
$classes = Join-Path $out "classes"
$dex = Join-Path $out "dex"
$nativeLibs = Join-Path $out "native-libs"
$nativeObj = Join-Path $out "native-obj"
$nativeProject = Join-Path $out "native-project"
$apkNativeLibs = Join-Path $out "apk-native-libs"
$apkAssets = Join-Path $out "apk-assets"
$localPlatformJar = Join-Path $out "android.jar"
$apkUnsignedRaw = Join-Path $out "ETTranslatorOffline-unsigned-raw.apk"
$apkUnsigned = Join-Path $out "ETTranslatorOffline-unsigned.apk"
$apkSigned = Join-Path $out "ETTranslatorOffline-debug-signed.apk"
$keystore = Join-Path $out "debug.keystore"
$finalApkUnsigned = Join-Path $finalOut "ETTranslatorOffline-unsigned.apk"
$finalApkSigned = Join-Path $finalOut "ETTranslatorOffline-debug-signed.apk"

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
New-Item -ItemType Directory -Force -Path $compiled, $gen, $classes, $dex, $nativeLibs, $nativeObj, $apkNativeLibs, $apkAssets | Out-Null
New-Item -ItemType Directory -Force -Path $finalOut | Out-Null
Remove-Item -LiteralPath $nativeProject -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path (Join-Path $nativeProject "jni") | Out-Null
Copy-Item -LiteralPath (Join-Path $root "jni\Android.mk") -Destination (Join-Path $nativeProject "jni\Android.mk") -Force
Copy-Item -LiteralPath (Join-Path $root "jni\Application.mk") -Destination (Join-Path $nativeProject "jni\Application.mk") -Force
Copy-Item -LiteralPath (Join-Path $root "jni\qwen_bridge.cpp") -Destination (Join-Path $nativeProject "jni\qwen_bridge.cpp") -Force
Copy-Item -LiteralPath $platformJar -Destination $localPlatformJar -Force

Invoke-Checked -FilePath $aapt2 -ToolArguments @("compile", "--dir", (Join-Path $root "res"), "-o", (Join-Path $compiled "resources.zip"))

Invoke-Checked -FilePath $aapt2 -ToolArguments @(
  "link",
  "-o", $apkUnsignedRaw,
  "-I", $localPlatformJar,
  "--manifest", (Join-Path $root "AndroidManifest.xml"),
  "--java", $gen,
  "--min-sdk-version", "28",
  "--target-sdk-version", "36",
  (Join-Path $compiled "resources.zip")
)

$javaFiles = @(Get-ChildItem -LiteralPath (Join-Path $root "src") -Recurse -Filter *.java | ForEach-Object { $_.FullName })
$generatedFiles = @(Get-ChildItem -LiteralPath $gen -Recurse -Filter *.java | ForEach-Object { $_.FullName })
$javacArgs = @("-encoding", "UTF-8", "-source", "8", "-target", "8", "-classpath", $localPlatformJar, "-d", $classes) + $javaFiles + $generatedFiles
Invoke-Checked -FilePath $javac -ToolArguments $javacArgs

$classFiles = Get-ChildItem -LiteralPath $classes -Recurse -Filter *.class | ForEach-Object { $_.FullName }
$d8Args = @("--min-api", "28", "--lib", $localPlatformJar, "--output", $dex) + $classFiles
Invoke-Checked -FilePath $d8 -ToolArguments $d8Args

Invoke-Checked -FilePath $jar -ToolArguments @("uf", $apkUnsignedRaw, "-C", $dex, "classes.dex")

if (Test-Path -LiteralPath $bundledModel) {
  $assetModelDir = Join-Path $apkAssets "assets\models"
  New-Item -ItemType Directory -Force -Path $assetModelDir | Out-Null
  Copy-Item -LiteralPath $bundledModel -Destination (Join-Path $assetModelDir "qwen-offline.gguf") -Force
  Invoke-Checked -FilePath $jar -ToolArguments @("uf", $apkUnsignedRaw, "-C", $apkAssets, "assets")
} else {
  Write-Warning "No bundled model found at $bundledModel. APK will use one-tap download/import instead."
}

if (Test-Path -LiteralPath $ndkBuild) {
  Invoke-Checked -FilePath $ndkBuild -ToolArguments @(
    "NDK_PROJECT_PATH=$nativeProject",
    "APP_BUILD_SCRIPT=$(Join-Path $nativeProject 'jni\Android.mk')",
    "NDK_APPLICATION_MK=$(Join-Path $nativeProject 'jni\Application.mk')",
    "NDK_LIBS_OUT=$nativeLibs",
    "NDK_OUT=$nativeObj"
  )
  New-Item -ItemType Directory -Force -Path (Join-Path $apkNativeLibs "lib") | Out-Null
  Copy-Item -LiteralPath (Join-Path $nativeLibs "arm64-v8a") -Destination (Join-Path $apkNativeLibs "lib") -Recurse -Force

  $runtimeTarget = Join-Path $apkNativeLibs "lib\arm64-v8a"
  if (Test-Path -LiteralPath $llamaRuntime) {
    foreach ($runtimeFile in @(
      "libllama-cli-impl.so",
      "libmtmd.so",
      "libllama-common.so",
      "libllama.so",
      "libggml.so",
      "libggml-base.so",
      "libggml-cpu-android_armv8.2_1.so"
    )) {
      Copy-Item -LiteralPath (Join-Path $llamaRuntime $runtimeFile) -Destination $runtimeTarget -Force
    }

    Copy-Item -LiteralPath (Join-Path $llamaRuntime "llama-cli") -Destination (Join-Path $runtimeTarget "libllama-cli.so") -Force
  } else {
    Write-Warning "llama runtime folder not found at $llamaRuntime. Offline Qwen CLI will not be packaged."
  }

  Invoke-Checked -FilePath $jar -ToolArguments @("uf", $apkUnsignedRaw, "-C", $apkNativeLibs, "lib")
} else {
  Write-Warning "Android NDK not found at $ndkBuild. APK will build without native Qwen bridge."
}

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
