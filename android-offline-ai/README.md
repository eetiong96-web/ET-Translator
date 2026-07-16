# ET Translator Offline AI

This is the native Android track for the Qwen offline AI version of ET Business Translator.

The existing `android-apk/` project is a lightweight WebView wrapper for the live Cloudflare translator. This folder is separate because offline AI needs native Android storage, a local model file, and a native inference runtime.

## Target Device

- Oppo Find N6
- 16GB real RAM
- 512GB storage
- Stronger Qwen model target: roughly 2.5GB to 3GB GGUF

The 12GB RAM expansion on the phone is virtual memory. It can help multitasking, but offline AI should be sized based on the real 16GB RAM.

## Offline AI Shape

Offline mode will use:

- Qwen GGUF model stored in app-private storage
- llama.cpp Android runtime
- Compact business translator prompt
- Simplified Chinese output only
- Hanyu Pinyin
- Short meaning
- Up to 3 business terms
- No alternatives in offline mode

## Current Build Stage

This first APK shell supports:

- Native Android translator screen
- Online/Offline Qwen mode selector
- One-tap Offline AI installer
- Qwen model import button as backup
- Model status display
- Offline llama.cpp CLI runner path

The native llama.cpp runner is the next stage. It requires Android NDK plus llama.cpp Android native library or source integration.

Run this setup check before attempting real offline inference:

```powershell
powershell -ExecutionPolicy Bypass -File android-offline-ai\check-offline-runtime.ps1
```

See `LLAMA_CPP_SETUP.md` for the required local files.

## User Flow

Normal users do not need to visit Hugging Face manually.

1. Install the APK.
2. Open `ET Translator Offline`.
3. Tap `Install Offline AI` once while on Wi-Fi.
4. Wait for the Qwen model download to finish.
5. Use `Offline Qwen` mode.

The manual `.gguf` import button remains for testing or advanced users.
