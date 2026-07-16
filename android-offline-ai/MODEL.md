# Offline Qwen Model Target

## Primary Target

Start with a stronger Qwen 4B-class GGUF model, quantized around Q4/Q5.

Expected model size:

- Q4-class: about 2GB to 3GB
- Q5-class: about 3GB to 4GB

For the Oppo Find N6 with 16GB real RAM, Q4-class is the first practical target. Q5 can be tested after Q4 works.

## Why Qwen

Qwen is strong for Chinese and English, and the Qwen3 family includes small dense models such as 1.7B and 4B. Qwen3 models also support non-thinking mode, which is better for lower-latency translation than long reasoning mode.

## Offline Prompt Defaults

- Output: JSON only
- Translation: required
- Hanyu Pinyin: required when Chinese is involved
- Meaning: one short sentence
- Business terms: at most 3
- Alternatives: disabled
- Max generated tokens: 350
- Temperature: 0.1

## File Handling

The APK should not bundle a multi-GB model. The user imports or downloads a `.gguf` file after install. The app copies it into app-private storage:

`files/models/qwen-offline.gguf`

The app's normal-user flow downloads:

`https://huggingface.co/unsloth/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf`

This avoids asking nontechnical users to find Hugging Face files manually.

## One Huge APK Option

If the audience is comfortable receiving a multi-GB APK, place the model here before building:

`android-offline-ai/bundled-model/qwen-offline.gguf`

The app will package it inside the APK and copy it to app-private storage on first launch. Users will not need to download or import a model manually.

Tradeoff: first launch can take a while because Android must install a very large APK, then the app copies the model into its private storage.

## Next Runtime Step

The native runner must use Android NDK plus llama.cpp Android integration. The current APK shell already supports model import/status and prompt generation, but does not yet run inference.
