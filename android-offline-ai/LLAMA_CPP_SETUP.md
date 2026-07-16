# llama.cpp Integration Setup

The offline APK currently includes a native ARM64 bridge named `libetqwen.so`. That bridge proves the Android app can load native code, but it does not yet include the llama.cpp inference engine.

## What Is Needed

1. Android NDK
   - Found on this machine:
     `C:\Users\ETChua\Downloads\android-ndk-r27d-windows\android-ndk-r27d`

2. llama.cpp source
   - Expected location:
     `third_party\llama.cpp`
   - Download:
     `https://github.com/ggml-org/llama.cpp`

3. Android SDK CMake
   - Install from Android Studio:
     `Tools -> SDK Manager -> SDK Tools -> CMake`

4. Qwen GGUF model
   - Strong first target: Qwen 4B-class GGUF, Q4 quantization
   - Expected size: about 2GB to 3GB

## Why The Placeholder Exists

The app already has the Java/JNI shape:

- `QwenNativeBridge.loadModel(String modelPath)`
- `QwenNativeBridge.generate(String prompt, int maxTokens)`
- `QwenNativeBridge.unloadModel()`

The next implementation replaces `android-offline-ai/jni/qwen_bridge.cpp` with code that calls llama.cpp APIs to:

1. load the GGUF model
2. tokenize the prompt
3. run generation
4. return generated JSON text to Java

## Check Local Readiness

Run:

```powershell
powershell -ExecutionPolicy Bypass -File android-offline-ai\check-offline-runtime.ps1
```

It should show:

- Android NDK: OK
- ndk-build: OK
- llama.cpp source: OK
- CMake: OK

If llama.cpp or CMake are missing, the real offline inference build cannot be completed yet.
