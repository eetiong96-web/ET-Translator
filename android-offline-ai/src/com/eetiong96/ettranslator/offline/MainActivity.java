package com.eetiong96.ettranslator.offline;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.database.Cursor;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.ScrollView;
import android.widget.TextView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DecimalFormat;

public class MainActivity extends Activity {
    private static final int PICK_MODEL_REQUEST = 1001;
    private static final long MIN_MODEL_BYTES = 1024L * 1024L * 1024L;
    private static final String ONLINE_URL = "https://ettranslate.eetiong96.workers.dev/";
    private static final String MODEL_DOWNLOAD_URL = "https://huggingface.co/unsloth/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf";
    private static final String BUNDLED_MODEL_ASSET = "models/qwen-offline.gguf";

    private EditText sourceText;
    private TextView modelStatus;
    private TextView resultText;
    private RadioGroup modeGroup;
    private RadioButton offlineMode;
    private Button translateButton;
    private Button installModelButton;
    private Button importModelButton;
    private File modelFile;
    private QwenNativeBridge qwenBridge;
    private volatile boolean isDownloadingModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        modelFile = new File(new File(getFilesDir(), "models"), "qwen-offline.gguf");
        qwenBridge = new QwenNativeBridge(this);

        setContentView(buildContentView());
        updateModelStatus();

        if (!modelFile.exists() && hasBundledModel()) {
            installBundledModel();
        }
    }

    private View buildContentView() {
        ScrollView scrollView = new ScrollView(this);
        scrollView.setFillViewport(true);
        scrollView.setBackgroundColor(Color.rgb(246, 248, 251));

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(18), dp(20) + getSystemBarHeight("status_bar_height"), dp(18), dp(18));
        scrollView.addView(root);

        TextView eyebrow = label("ET BUSINESS TRANSLATOR", 13, Color.rgb(15, 118, 110));
        root.addView(eyebrow);

        TextView title = label("Offline Qwen AI", 30, Color.rgb(23, 32, 42));
        title.setPadding(0, dp(4), 0, dp(14));
        root.addView(title);

        modeGroup = new RadioGroup(this);
        modeGroup.setOrientation(RadioGroup.HORIZONTAL);
        modeGroup.setPadding(0, 0, 0, dp(12));

        RadioButton onlineMode = new RadioButton(this);
        onlineMode.setText("Online");
        onlineMode.setId(1);

        offlineMode = new RadioButton(this);
        offlineMode.setText("Offline Qwen");
        offlineMode.setId(2);
        offlineMode.setChecked(true);

        modeGroup.addView(onlineMode);
        modeGroup.addView(offlineMode);
        root.addView(modeGroup);

        modelStatus = label("", 15, Color.rgb(102, 112, 133));
        modelStatus.setPadding(0, 0, 0, dp(10));
        root.addView(modelStatus);

        installModelButton = button("Install Offline AI", true);
        installModelButton.setOnClickListener(view -> downloadModel());
        root.addView(installModelButton);

        importModelButton = button("Import Qwen Model (.gguf)", false);
        LinearLayout.LayoutParams importParams = fullWidthParams();
        importParams.setMargins(0, dp(8), 0, 0);
        importModelButton.setLayoutParams(importParams);
        importModelButton.setOnClickListener(view -> openModelPicker());
        root.addView(importModelButton);

        sourceText = new EditText(this);
        sourceText.setHint("Paste work chat, PRD, code review, or Chinese message");
        sourceText.setMinLines(7);
        sourceText.setGravity(Gravity.TOP);
        sourceText.setTextSize(17);
        sourceText.setPadding(dp(12), dp(12), dp(12), dp(12));
        LinearLayout.LayoutParams inputParams = fullWidthParams();
        inputParams.setMargins(0, dp(14), 0, dp(10));
        root.addView(sourceText, inputParams);

        translateButton = button("Translate", true);
        translateButton.setOnClickListener(view -> translate());
        root.addView(translateButton);

        resultText = label("Offline result will appear here.", 17, Color.rgb(23, 32, 42));
        resultText.setPadding(dp(12), dp(16), dp(12), dp(16));
        LinearLayout.LayoutParams resultParams = fullWidthParams();
        resultParams.setMargins(0, dp(14), 0, 0);
        root.addView(resultText, resultParams);

        return scrollView;
    }

    private void openModelPicker() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        startActivityForResult(intent, PICK_MODEL_REQUEST);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode != PICK_MODEL_REQUEST || resultCode != RESULT_OK || data == null || data.getData() == null) {
            return;
        }

        importModel(data.getData());
    }

    private void importModel(Uri uri) {
        if (isDownloadingModel) {
            modelStatus.setText("Offline AI is installing. Please wait for it to finish.");
            return;
        }

        String name = getDisplayName(uri);
        if (name != null && !name.toLowerCase().endsWith(".gguf")) {
            modelStatus.setText("Model copy failed: choose a .gguf file.");
            return;
        }

        File modelDir = modelFile.getParentFile();
        if (modelDir != null && !modelDir.exists() && !modelDir.mkdirs()) {
            modelStatus.setText("Model copy failed: cannot create model folder.");
            return;
        }

        try (InputStream input = getContentResolver().openInputStream(uri);
             FileOutputStream output = new FileOutputStream(modelFile)) {
            if (input == null) {
                throw new IllegalStateException("Cannot open selected file.");
            }

            byte[] buffer = new byte[1024 * 1024];
            int read;
            while ((read = input.read(buffer)) != -1) {
                output.write(buffer, 0, read);
            }
        } catch (Exception error) {
            modelStatus.setText("Model copy failed: " + error.getMessage());
            return;
        }

        if (modelFile.length() < MIN_MODEL_BYTES) {
            modelStatus.setText("Model copied, but it is smaller than 1GB. Pick the stronger Qwen GGUF model.");
            return;
        }

        updateModelStatus();
    }

    private void downloadModel() {
        if (isDownloadingModel) {
            return;
        }

        if (hasBundledModel()) {
            installBundledModel();
            return;
        }

        isDownloadingModel = true;
        setModelInstallControls(false);
        modelStatus.setText("Installing Offline AI: starting download...");

        Thread worker = new Thread(() -> {
            File partialFile = new File(modelFile.getAbsolutePath() + ".part");
            try {
                File modelDir = modelFile.getParentFile();
                if (modelDir != null && !modelDir.exists() && !modelDir.mkdirs()) {
                    throw new IllegalStateException("Cannot create model folder.");
                }

                URL url = new URL(MODEL_DOWNLOAD_URL);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setConnectTimeout(30000);
                connection.setReadTimeout(30000);
                connection.setInstanceFollowRedirects(true);

                int status = connection.getResponseCode();
                if (status < 200 || status >= 300) {
                    throw new IllegalStateException("Download failed with HTTP " + status);
                }

                long totalBytes = connection.getContentLengthLong();
                long downloadedBytes = 0;

                try (InputStream input = connection.getInputStream();
                     FileOutputStream output = new FileOutputStream(partialFile)) {
                    byte[] buffer = new byte[1024 * 1024];
                    int read;
                    long lastUiUpdate = 0;

                    while ((read = input.read(buffer)) != -1) {
                        output.write(buffer, 0, read);
                        downloadedBytes += read;

                        long now = System.currentTimeMillis();
                        if (now - lastUiUpdate > 750) {
                            lastUiUpdate = now;
                            long current = downloadedBytes;
                            runOnUiThread(() -> showDownloadProgress(current, totalBytes));
                        }
                    }
                } finally {
                    connection.disconnect();
                }

                if (partialFile.length() < MIN_MODEL_BYTES) {
                    throw new IllegalStateException("Downloaded file is too small. Please try again on Wi-Fi.");
                }

                if (modelFile.exists() && !modelFile.delete()) {
                    throw new IllegalStateException("Cannot replace old model file.");
                }

                if (!partialFile.renameTo(modelFile)) {
                    throw new IllegalStateException("Cannot save model file.");
                }

                runOnUiThread(() -> {
                    isDownloadingModel = false;
                    setModelInstallControls(true);
                    updateModelStatus();
                    resultText.setText("Offline AI installed. You can now use Offline Qwen mode.");
                });
            } catch (Exception error) {
                if (partialFile.exists()) {
                    partialFile.delete();
                }

                runOnUiThread(() -> {
                    isDownloadingModel = false;
                    setModelInstallControls(true);
                    modelStatus.setText("Offline AI install failed: " + error.getMessage());
                });
            }
        });
        worker.start();
    }

    private boolean hasBundledModel() {
        try (InputStream ignored = getAssets().open(BUNDLED_MODEL_ASSET)) {
            return true;
        } catch (IOException ignored) {
            return false;
        }
    }

    private void installBundledModel() {
        if (isDownloadingModel) {
            return;
        }

        isDownloadingModel = true;
        setModelInstallControls(false);
        modelStatus.setText("Installing Offline AI from APK...");

        Thread worker = new Thread(() -> {
            File partialFile = new File(modelFile.getAbsolutePath() + ".part");
            try {
                File modelDir = modelFile.getParentFile();
                if (modelDir != null && !modelDir.exists() && !modelDir.mkdirs()) {
                    throw new IllegalStateException("Cannot create model folder.");
                }

                long copiedBytes = 0;
                try (InputStream input = getAssets().open(BUNDLED_MODEL_ASSET);
                     FileOutputStream output = new FileOutputStream(partialFile)) {
                    byte[] buffer = new byte[1024 * 1024];
                    int read;
                    long lastUiUpdate = 0;

                    while ((read = input.read(buffer)) != -1) {
                        output.write(buffer, 0, read);
                        copiedBytes += read;

                        long now = System.currentTimeMillis();
                        if (now - lastUiUpdate > 750) {
                            lastUiUpdate = now;
                            long current = copiedBytes;
                            runOnUiThread(() -> modelStatus.setText("Installing Offline AI from APK: " + formatBytes(current) + " copied"));
                        }
                    }
                }

                if (partialFile.length() < MIN_MODEL_BYTES) {
                    throw new IllegalStateException("Bundled model is too small.");
                }

                if (modelFile.exists() && !modelFile.delete()) {
                    throw new IllegalStateException("Cannot replace old model file.");
                }

                if (!partialFile.renameTo(modelFile)) {
                    throw new IllegalStateException("Cannot save bundled model.");
                }

                runOnUiThread(() -> {
                    isDownloadingModel = false;
                    setModelInstallControls(true);
                    updateModelStatus();
                    resultText.setText("Offline AI installed from APK. You can now use Offline Qwen mode.");
                });
            } catch (Exception error) {
                if (partialFile.exists()) {
                    partialFile.delete();
                }

                runOnUiThread(() -> {
                    isDownloadingModel = false;
                    setModelInstallControls(true);
                    modelStatus.setText("Bundled Offline AI install failed: " + error.getMessage());
                });
            }
        });
        worker.start();
    }

    private void showDownloadProgress(long downloadedBytes, long totalBytes) {
        if (totalBytes > 0) {
            int percent = (int) Math.min(99, (downloadedBytes * 100) / totalBytes);
            modelStatus.setText("Installing Offline AI: " + percent + "% (" + formatBytes(downloadedBytes) + " / " + formatBytes(totalBytes) + ")");
            return;
        }

        modelStatus.setText("Installing Offline AI: " + formatBytes(downloadedBytes) + " downloaded");
    }

    private void setModelInstallControls(boolean enabled) {
        installModelButton.setEnabled(enabled);
        importModelButton.setEnabled(enabled);
        translateButton.setEnabled(enabled);
    }

    private void translate() {
        String text = sourceText.getText().toString().trim();
        if (text.isEmpty()) {
            resultText.setText("Enter something to translate.");
            return;
        }

        if (modeGroup.getCheckedRadioButtonId() == 1) {
            resultText.setText("Online mode is still available at:\n" + ONLINE_URL);
            return;
        }

        if (!modelFile.exists()) {
            resultText.setText("Tap Install Offline AI first. The app will download the Qwen model automatically.");
            return;
        }

        qwenBridge.loadModel(modelFile.getAbsolutePath());
        String prompt = OfflinePromptBuilder.build(text, "auto", "business");
        String bridgeStatus = qwenBridge.isNativeLibraryLoaded()
            ? qwenBridge.generate(prompt, 350)
            : "Native Qwen bridge is not packaged yet.";

        resultText.setText(
            bridgeStatus + "\n\n"
                + "Import model is ready; llama.cpp runtime is next.\n\n"
                + "Prompt preview:\n" + prompt
        );
    }

    private void updateModelStatus() {
        if (modelFile.exists()) {
            modelStatus.setText("Qwen model installed: " + formatBytes(modelFile.length()));
        } else if (hasBundledModel()) {
            modelStatus.setText("Offline AI is included in this APK. Installing on first launch...");
        } else {
            modelStatus.setText("Offline AI not installed. Tap Install Offline AI once while on Wi-Fi.");
        }
    }

    private String getDisplayName(Uri uri) {
        try (Cursor cursor = getContentResolver().query(uri, null, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (index >= 0) {
                    return cursor.getString(index);
                }
            }
        } catch (Exception ignored) {
            return null;
        }

        return null;
    }

    private TextView label(String text, int sp, int color) {
        TextView view = new TextView(this);
        view.setText(text);
        view.setTextSize(sp);
        view.setTextColor(color);
        view.setGravity(Gravity.START);
        return view;
    }

    private Button button(String text, boolean primary) {
        Button button = new Button(this);
        button.setText(text);
        button.setAllCaps(false);
        button.setMinHeight(dp(48));
        button.setTextSize(17);
        button.setTextColor(primary ? Color.WHITE : Color.rgb(23, 32, 42));
        button.setBackgroundColor(primary ? Color.rgb(15, 118, 110) : Color.WHITE);
        button.setPadding(dp(12), 0, dp(12), 0);
        button.setLayoutParams(fullWidthParams());
        return button;
    }

    private LinearLayout.LayoutParams fullWidthParams() {
        return new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
    }

    private String formatBytes(long bytes) {
        double gib = bytes / 1024.0 / 1024.0 / 1024.0;
        return new DecimalFormat("0.00 GB").format(gib);
    }

    private int getSystemBarHeight(String resourceName) {
        int resourceId = getResources().getIdentifier(resourceName, "dimen", "android");
        return resourceId > 0 ? getResources().getDimensionPixelSize(resourceId) : 0;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
