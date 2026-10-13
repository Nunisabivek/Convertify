package com.convertify.work;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.webkit.WebView;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;

public class MainActivity extends BridgeActivity {
    /** Never hold the system splash longer than this, even if the page stalls. */
    private static final long MAX_SPLASH_MS = 2500;

    private volatile boolean webVisible = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Keep the system splash up until the WebView has painted the web splash,
        // whose first frame is identical. Without this a blank white WebView shows
        // between the two.
        SplashScreen.installSplashScreen(this).setKeepOnScreenCondition(() -> !webVisible);
        registerPlugin(ConvertifyFilesPlugin.class);
        super.onCreate(savedInstanceState);
        bridge.addWebViewListener(new WebViewListener() {
            @Override
            public void onPageCommitVisible(WebView view, String url) {
                webVisible = true;
            }
        });
        new Handler(Looper.getMainLooper()).postDelayed(() -> webVisible = true, MAX_SPLASH_MS);
    }
}
