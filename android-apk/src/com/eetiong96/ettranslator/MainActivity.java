package com.eetiong96.ettranslator;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private static final String TRANSLATOR_URL = "https://ettranslate.eetiong96.workers.dev/";
    private static final String TRANSLATOR_HOST = "ettranslate.eetiong96.workers.dev";
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(246, 248, 251));
        webView.setWebViewClient(new TranslatorWebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }
        settings.setUserAgentString(settings.getUserAgentString()
                + " ETTranslator/1.0 ETPhoneModel/" + Uri.encode(Build.MODEL));

        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        webView.setPadding(0, getSystemBarHeight("status_bar_height"), 0, getSystemBarHeight("navigation_bar_height"));
        webView.setClipToPadding(false);
        setContentView(webView);

        if (savedInstanceState == null) {
            webView.loadUrl(TRANSLATOR_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }

        super.onBackPressed();
    }

    private int getSystemBarHeight(String resourceName) {
        int resourceId = getResources().getIdentifier(resourceName, "dimen", "android");
        if (resourceId <= 0) {
            return 0;
        }

        return getResources().getDimensionPixelSize(resourceId);
    }

    private static class TranslatorWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return handleUrl(view, request.getUrl());
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return handleUrl(view, Uri.parse(url));
        }

        private boolean handleUrl(WebView view, Uri uri) {
            if (isTranslatorUrl(uri)) {
                return false;
            }

            openExternalBrowser(view, uri);
            return true;
        }

        private boolean isTranslatorUrl(Uri uri) {
            return uri != null
                    && "https".equalsIgnoreCase(uri.getScheme())
                    && TRANSLATOR_HOST.equalsIgnoreCase(uri.getHost());
        }

        private void openExternalBrowser(WebView view, Uri uri) {
            if (uri == null || uri.getScheme() == null) {
                return;
            }

            String scheme = uri.getScheme().toLowerCase();
            if (!"https".equals(scheme) && !"http".equals(scheme)) {
                return;
            }

            try {
                view.getContext().startActivity(new Intent(Intent.ACTION_VIEW, uri));
            } catch (Exception ignored) {
                // If no browser can handle it, keep the WebView on the translator.
            }
        }
    }
}
