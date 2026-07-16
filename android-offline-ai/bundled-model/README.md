# Bundled Offline Model

Put the Qwen GGUF model here with this exact filename:

`qwen-offline.gguf`

Recommended file:

`Qwen3-4B-Q4_K_M.gguf`

Rename it to:

`qwen-offline.gguf`

When this file exists, `build-apk.ps1` packages it into the APK at:

`assets/models/qwen-offline.gguf`

Then normal users can install one large APK and the app will copy the model from the APK into app-private storage on first launch.

Expected APK size with Qwen3-4B-Q4_K_M:

about 2.5GB plus the 42MB runtime.
