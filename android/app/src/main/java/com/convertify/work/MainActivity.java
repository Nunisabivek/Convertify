package com.convertify.work;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.splashscreen.SplashScreenViewProvider;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    /** Never hold the system splash longer than this, even if the page stalls. */
    private static final long MAX_SPLASH_MS = 2500;

    private volatile boolean webReady = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Keep the system splash up until the web splash, whose first frame is
        // identical, has painted and is about to animate (ConvertifyFiles.splashReady).
        // Then cut rather than fade: the default fade dipped to a blank WebView.
        SplashScreen splash = SplashScreen.installSplashScreen(this);
        splash.setKeepOnScreenCondition(() -> !webReady);
        splash.setOnExitAnimationListener(SplashScreenViewProvider::remove);
        registerPlugin(ConvertifyFilesPlugin.class);
        super.onCreate(savedInstanceState);
        new Handler(Looper.getMainLooper()).postDelayed(this::releaseSplash, MAX_SPLASH_MS);
    }

    void releaseSplash() {
        webReady = true;
    }
}
