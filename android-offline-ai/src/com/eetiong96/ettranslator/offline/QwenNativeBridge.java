package com.eetiong96.ettranslator.offline;

import android.content.Context;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

public final class QwenNativeBridge {
    private static final boolean NATIVE_LIBRARY_LOADED = loadNativeLibrary();
    private final Context context;
    private String modelPath = "";
    private boolean modelLoaded;

    public QwenNativeBridge(Context context) {
        this.context = context.getApplicationContext();
    }

    public boolean loadModel(String modelPath) {
        File model = new File(modelPath);
        this.modelPath = modelPath;
        modelLoaded = model.exists() && model.length() > 0 && getCliExecutable().exists();
        return modelLoaded;
    }

    public String generate(String prompt, int maxTokens) {
        if (!modelLoaded && !loadModel(modelPath)) {
            throw new IllegalStateException("Offline Qwen model or runner is not ready.");
        }

        try {
            File promptFile = new File(context.getCacheDir(), "qwen-prompt.txt");
            try (FileWriter writer = new FileWriter(promptFile, false)) {
                writer.write(prompt);
            }

            List<String> command = new ArrayList<>();
            command.add(getCliExecutable().getAbsolutePath());
            command.add("-m");
            command.add(modelPath);
            command.add("-f");
            command.add(promptFile.getAbsolutePath());
            command.add("-n");
            command.add(String.valueOf(Math.max(64, Math.min(maxTokens, 512))));
            command.add("-t");
            command.add("6");
            command.add("--temp");
            command.add("0.1");
            command.add("--no-display-prompt");

            ProcessBuilder builder = new ProcessBuilder(command);
            builder.environment().put("LD_LIBRARY_PATH", context.getApplicationInfo().nativeLibraryDir);
            builder.redirectErrorStream(true);

            Process process = builder.start();
            StringBuilder output = new StringBuilder();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append('\n');
                }
            }

            boolean finished = process.waitFor(180, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                throw new IllegalStateException("Offline Qwen timed out after 180 seconds.");
            }

            if (process.exitValue() != 0) {
                throw new IllegalStateException("Offline Qwen failed: " + output.toString().trim());
            }

            return output.toString().trim();
        } catch (Exception error) {
            throw new IllegalStateException(error.getMessage(), error);
        }
    }

    public void unloadModel() {
        modelLoaded = false;
    }

    public boolean isModelLoaded() {
        return modelLoaded;
    }

    public boolean isNativeLibraryLoaded() {
        return NATIVE_LIBRARY_LOADED && getCliExecutable().exists();
    }

    private static boolean loadNativeLibrary() {
        try {
            System.loadLibrary("etqwen");
            return true;
        } catch (UnsatisfiedLinkError error) {
            return false;
        }
    }

    private File getCliExecutable() {
        return new File(context.getApplicationInfo().nativeLibraryDir, "libllama-cli.so");
    }

    private native boolean nativeLoadModel(String modelPath);

    private native String nativeGenerate(String prompt, int maxTokens);

    private native void nativeUnloadModel();
}
