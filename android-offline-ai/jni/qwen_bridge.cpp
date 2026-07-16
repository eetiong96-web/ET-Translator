#include <jni.h>

extern "C" JNIEXPORT jboolean JNICALL
Java_com_eetiong96_ettranslator_offline_QwenNativeBridge_nativeLoadModel(
    JNIEnv *env,
    jobject,
    jstring modelPath
) {
    const char *path = env->GetStringUTFChars(modelPath, nullptr);
    const bool hasPath = path != nullptr && path[0] != '\0';
    if (path != nullptr) {
        env->ReleaseStringUTFChars(modelPath, path);
    }

    return hasPath ? JNI_FALSE : JNI_FALSE;
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_eetiong96_ettranslator_offline_QwenNativeBridge_nativeGenerate(
    JNIEnv *env,
    jobject,
    jstring,
    jint
) {
    return env->NewStringUTF("Native Qwen bridge loaded. llama.cpp runtime is the next integration step.");
}

extern "C" JNIEXPORT void JNICALL
Java_com_eetiong96_ettranslator_offline_QwenNativeBridge_nativeUnloadModel(
    JNIEnv *,
    jobject
) {
}
