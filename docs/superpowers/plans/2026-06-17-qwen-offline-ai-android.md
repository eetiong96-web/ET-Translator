# Qwen Offline AI Android Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a stronger Qwen-powered offline AI mode for ET Business Translator on Android, targeting the user's Oppo Find N6 with 16GB RAM and 512GB storage.

**Architecture:** Keep the current WebView APK as the stable online app, and create a new native Android track under `android-offline-ai/` for local model support. The offline app uses a native Android UI, stores a GGUF Qwen model in app-private storage, calls a llama.cpp-based native inference bridge, and formats results into translation, pinyin, meaning, and up to 3 business terms. The first complete offline release targets a stronger Qwen GGUF model in the 2.5GB-3GB class, with online DeepSeek/Gemini kept as a fallback.

**Tech Stack:** Java/Kotlin Android, Android SDK/NDK, llama.cpp Android binding, GGUF Qwen model, app-private file storage, manual APK build scripts first, Gradle/CMake if native llama.cpp integration requires it.

---

### Task 1: Add Offline Android Project Skeleton

**Files:**
- Create: `android-offline-ai/README.md`
- Create: `android-offline-ai/AndroidManifest.xml`
- Create: `android-offline-ai/res/values/strings.xml`
- Create: `android-offline-ai/res/values/styles.xml`
- Create: `android-offline-ai/res/drawable/ic_launcher.xml`
- Create: `android-offline-ai/src/com/eetiong96/ettranslator/offline/MainActivity.java`
- Create: `android-offline-ai/build-apk.ps1`

- [ ] **Step 1: Create the project README**

  Add a README explaining that this is the new native offline-AI track, separate from `android-apk/`, and that v1 targets a stronger Qwen GGUF model imported/downloaded after install rather than bundled into the APK.

- [ ] **Step 2: Create a manifest with internet and storage-safe model import**

  Use package `com.eetiong96.ettranslator.offline`, label `ET Translator Offline`, min SDK 28, target SDK 36, and permissions `INTERNET` plus no broad external storage permissions. Model files are selected through Android's file picker and copied into app-private storage.

- [ ] **Step 3: Create the first native Activity**

  Build a simple native screen with:
  - Title: `ET Business Translator`
  - Mode selector: `Online` and `Offline Qwen`
  - Model status: `No offline model installed`
  - Buttons: `Import Qwen Model`, `Translate`
  - Input text box
  - Result text area

- [ ] **Step 4: Add an APK build script**

  Reuse the existing no-Gradle build style from `android-apk/build-apk.ps1` so the shell can compile before native llama.cpp is added.

- [ ] **Step 5: Build and verify**

  Run:
  ```powershell
  powershell -ExecutionPolicy Bypass -File android-offline-ai\build-apk.ps1
  ```
  Expected: outputs unsigned and debug-signed APK files under `android-offline-ai/build/`.

### Task 2: Add Model Import And Status Storage

**Files:**
- Modify: `android-offline-ai/src/com/eetiong96/ettranslator/offline/MainActivity.java`

- [ ] **Step 1: Add Android file picker**

  Add an `ACTION_OPEN_DOCUMENT` launcher for `.gguf` files. When the user selects a model, copy it into `getFilesDir()/models/qwen-offline.gguf`.

- [ ] **Step 2: Add model file validation**

  Validate:
  - filename ends with `.gguf`
  - file size is at least 1GB
  - copied file exists in app-private storage

- [ ] **Step 3: Show model status**

  Display:
  - `No offline model installed`
  - `Qwen model installed: X.XX GB`
  - `Model copy failed: <message>`

- [ ] **Step 4: Build and verify**

  Build the APK and install manually. Select any small `.gguf` test file first to verify file picking and copy behavior before using a 2.5GB-3GB model.

### Task 3: Add Offline Translation Contract

**Files:**
- Create: `android-offline-ai/src/com/eetiong96/ettranslator/offline/OfflineTranslationResult.java`
- Create: `android-offline-ai/src/com/eetiong96/ettranslator/offline/OfflinePromptBuilder.java`
- Modify: `android-offline-ai/src/com/eetiong96/ettranslator/offline/MainActivity.java`

- [ ] **Step 1: Define result object**

  Add a Java object with fields:
  - `translation`
  - `pinyin`
  - `meaning`
  - `terms`
  - `error`

- [ ] **Step 2: Define prompt builder**

  Build a Qwen prompt that asks for compact JSON:
  ```json
  {
    "translation": "...",
    "pinyin": "...",
    "meaning": "...",
    "terms": [
      {"source":"...", "translation":"...", "pinyin":"...", "meaning":"..."}
    ]
  }
  ```
  The prompt must say Simplified Chinese only, max 3 terms, no alternatives.

- [ ] **Step 3: Add placeholder offline translate path**

  Until native llama.cpp is wired, `Offline Qwen` mode should return a clear message:
  `Offline Qwen engine is not installed yet. Import model is ready; native runner is next.`

- [ ] **Step 4: Build and verify**

  Build the APK and confirm online/offline controls do not crash.

### Task 4: Integrate llama.cpp Android Native Runtime

**Files:**
- Create: `android-offline-ai/jni/`
- Create: `android-offline-ai/src/com/eetiong96/ettranslator/offline/QwenNativeBridge.java`
- Modify: `android-offline-ai/src/com/eetiong96/ettranslator/offline/MainActivity.java`
- Modify: `android-offline-ai/build-apk.ps1` or replace with Gradle/CMake project files if required

- [ ] **Step 1: Install Android NDK**

  Use Android Studio SDK Manager to install the Android NDK. Required because the current SDK folder has build tools and platforms but no NDK folder.

- [ ] **Step 2: Add llama.cpp source or prebuilt native library**

  Use llama.cpp Android binding as the runtime. Build for `arm64-v8a`, because the Oppo Find N6 is ARM64.

- [ ] **Step 3: Add JNI bridge**

  Expose Java methods:
  - `boolean loadModel(String modelPath)`
  - `String generate(String prompt, int maxTokens)`
  - `void unloadModel()`

- [ ] **Step 4: Wire native output into the UI**

  On `Offline Qwen` translate, load the imported model if needed, send the compact prompt, parse returned JSON, and display translation/pinyin/meaning/terms.

- [ ] **Step 5: Build and verify**

  Build a debug-signed APK and test on the Oppo Find N6 with a real Qwen GGUF file.

### Task 5: Select And Test Stronger Qwen Model

**Files:**
- Create: `android-offline-ai/MODEL.md`

- [ ] **Step 1: Document chosen model**

  Target a stronger Qwen GGUF model in the 2.5GB-3GB class, such as a quantized Qwen 4B-class model if its license allows redistribution/use.

- [ ] **Step 2: Measure on-device performance**

  Test:
  - model load time
  - short sentence translation time
  - 500-character work message translation time
  - phone heat after 5 translations

- [ ] **Step 3: Set offline defaults**

  Use compact output:
  - max generated tokens: 350
  - temperature: 0.1
  - max 3 terms
  - no alternatives

### Task 6: Package Handoff

**Files:**
- Modify: `android-offline-ai/README.md`

- [ ] **Step 1: Document install flow**

  Explain:
  - install APK
  - import/download Qwen `.gguf`
  - switch to `Offline Qwen`
  - translate

- [ ] **Step 2: Document expected limitations**

  Explain:
  - offline mode will be slower than DeepSeek/Gemini
  - first model load can take time
  - model file uses 2.5GB-3GB storage
  - quality may differ from online AI

- [ ] **Step 3: Verify final APK**

  Run APK signature verification with `apksigner verify --verbose --print-certs`.
