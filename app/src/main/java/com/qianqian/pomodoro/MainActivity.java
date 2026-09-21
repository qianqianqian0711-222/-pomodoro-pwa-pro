package com.qianqian.pomodoro;

import android.app.Activity;
import android.os.Bundle;
import android.os.Build;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window w = getWindow();
        if (Build.VERSION.SDK_INT >= 30) {
            w.setDecorFitsSystemWindows(false);
            w.setStatusBarColor(0x00000000);
            w.setNavigationBarColor(0x00000000);
            WindowInsetsController c = w.getInsetsController();
            if (c != null) c.setSystemBarsAppearance(WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS,
                    WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
        } else {
            w.setStatusBarColor(0x00FFFFFF);
            w.setNavigationBarColor(0x00FFFFFF);
        }
        webView = new WebView(this);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setLoadWithOverviewMode(false);
        s.setUseWideViewPort(false);
        webView.setWebViewClient(new WebViewClient());
        webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        setContentView(webView);
        webView.loadUrl("file:///android_asset/pomodoro-magic8-v6/index.html");
    }
    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed();
    }
    @Override protected void onDestroy() { if (webView != null) webView.destroy(); super.onDestroy(); }
}
