package tj.kitobkhona.app;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.util.Base64;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceResponse;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import org.json.JSONObject;
import android.app.PendingIntent;
import android.content.pm.PackageInstaller;
import android.provider.Settings;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.InputStream;

public class MainActivity extends Activity {
    private static final String HOST = "jack07lion-a11y.github.io";
    private static final String SITE = "https://" + HOST + "/kitobkhona-/";
    private static final String ASSET = "file:///android_asset/index.html";
    private WebView web;
    private boolean fellBack = false;
    private volatile boolean updBusy = false;
    private ValueCallback<Uri[]> fileCb;
    private static final int PICK = 7;

    private boolean online() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
            NetworkInfo ni = cm.getActiveNetworkInfo();
            return ni != null && ni.isConnected();
        } catch (Exception e) {
            return true;
        }
    }

    private void fallback(WebView v) {
        if (fellBack) return;
        fellBack = true;
        v.loadUrl(ASSET);
    }

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        boolean night = (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES;
        int bg = night ? Color.parseColor("#131211") : Color.WHITE;
        Window w = getWindow();
        w.setStatusBarColor(bg);
        w.setNavigationBarColor(bg);
        if (!night && Build.VERSION.SDK_INT >= 26) {
            w.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        }

        web = new WebView(this);
        web.setBackgroundColor(bg);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setTextZoom(100);
        s.setCacheMode(online() ? WebSettings.LOAD_DEFAULT : WebSettings.LOAD_CACHE_ELSE_NETWORK);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri u = req.getUrl();
                if ("file".equals(u.getScheme())) return false;
                if ("https".equals(u.getScheme()) && HOST.equals(u.getHost())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError err) {
                if (req.isForMainFrame() && req.getUrl().toString().startsWith(SITE)) fallback(view);
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest req, WebResourceResponse res) {
                if (req.isForMainFrame() && req.getUrl().toString().startsWith(SITE) && res.getStatusCode() >= 400) fallback(view);
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = cb;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("*/*");
                if (p.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                try {
                    startActivityForResult(Intent.createChooser(i, "Файл интихоб кунед"), PICK);
                } catch (Exception e) {
                    fileCb = null;
                    cb.onReceiveValue(null);
                    return false;
                }
                return true;
            }
        });
        web.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public void askNotify() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission("android.permission.POST_NOTIFICATIONS") != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                            requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 11);
                        }
                    }
                });
            }

            @JavascriptInterface
            public void config(String json) {
                try {
                    JSONObject o = new JSONObject(json);
                    android.content.SharedPreferences.Editor e = Notify.sp(MainActivity.this).edit();
                    e.putBoolean("remind", o.optBoolean("remind", true));
                    e.putBoolean("congrats", o.optBoolean("congrats", true));
                    e.putInt("hour", o.optInt("hour", 20));
                    e.putString("role", o.optString("role", ""));
                    e.putString("title", o.optString("title", "Китобхона"));
                    e.putString("remind_text", o.optString("remindText", "Имрӯз ҳатто 1 дақиқа китоб нахондед!"));
                    e.putString("tpl", o.optString("tpl", "Табрик шумо имрӯз {n} дақиқа хондед!🎉 боз хонда боз доно шавед!"));
                    e.apply();
                    Notify.scheduleDaily(MainActivity.this);
                } catch (Exception ignored) { }
            }

            @JavascriptInterface
            public void leave(int todayMin, int sessionSec) {
                long now = System.currentTimeMillis();
                android.content.SharedPreferences s = Notify.sp(MainActivity.this);
                if (now - s.getLong("leave_at", 0) < 3000) return;
                s.edit().putLong("leave_at", now).putString("read_day", Notify.today()).putInt("read_min", Math.max(0, todayMin)).apply();
                if (sessionSec >= 60 && todayMin >= 1 && s.getBoolean("congrats", true)) {
                    Notify.schedule(MainActivity.this, Notify.ACT_READ, 1, now + 5000);
                }
            }

            @JavascriptInterface
            public void downloadUpdate(final String url) {
                if (url == null || !url.startsWith("https://github.com/jack07lion-a11y/kitobkhona-/releases/") || updBusy) return;
                updBusy = true;
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        HttpURLConnection c = null;
                        try {
                            c = (HttpURLConnection) new URL(url).openConnection();
                            c.setConnectTimeout(15000);
                            c.setReadTimeout(30000);
                            c.connect();
                            int total = c.getContentLength();
                            File f = new File(getCacheDir(), "update.apk");
                            InputStream in = c.getInputStream();
                            FileOutputStream out = new FileOutputStream(f);
                            byte[] buf = new byte[32768];
                            int n, last = -1;
                            long got = 0;
                            while ((n = in.read(buf)) > 0) {
                                out.write(buf, 0, n);
                                got += n;
                                if (total > 0) {
                                    int p = (int) Math.min(99, got * 100 / total);
                                    if (p != last) {
                                        last = p;
                                        jsUpd(p, "down");
                                    }
                                }
                            }
                            out.close();
                            in.close();
                            jsUpd(100, "ready");
                        } catch (Exception e) {
                            jsUpd(-1, "err");
                        } finally {
                            updBusy = false;
                            if (c != null) c.disconnect();
                        }
                    }
                }).start();
            }

            @JavascriptInterface
            public String installUpdate() {
                File f = new File(getCacheDir(), "update.apk");
                if (!f.exists()) return "nofile";
                if (Build.VERSION.SDK_INT >= 26 && !getPackageManager().canRequestPackageInstalls()) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getPackageName())));
                            } catch (Exception ignored) { }
                        }
                    });
                    return "perm";
                }
                try {
                    PackageInstaller pi = getPackageManager().getPackageInstaller();
                    PackageInstaller.SessionParams sp = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
                    int id = pi.createSession(sp);
                    PackageInstaller.Session s = pi.openSession(id);
                    OutputStream os = s.openWrite("kitobkhona", 0, f.length());
                    InputStream is = new FileInputStream(f);
                    byte[] buf = new byte[32768];
                    int n;
                    while ((n = is.read(buf)) > 0) os.write(buf, 0, n);
                    s.fsync(os);
                    os.close();
                    is.close();
                    Intent it = new Intent(MainActivity.this, InstallReceiver.class).setAction("tj.kitobkhona.app.INSTALLED");
                    PendingIntent pend = PendingIntent.getBroadcast(MainActivity.this, id, it, PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0));
                    s.commit(pend.getIntentSender());
                    s.close();
                    return "ok";
                } catch (Exception e) {
                    return "err";
                }
            }

            @JavascriptInterface
            public String version() {
                try {
                    return String.valueOf(getPackageManager().getPackageInfo(getPackageName(), 0).versionCode);
                } catch (Exception e) {
                    return "0";
                }
            }

            @JavascriptInterface
            public String asset(String path) {
                try {
                    if (path == null || !path.startsWith("books/") || path.contains("..")) return "";
                    InputStream in = getAssets().open(path);
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    byte[] buf = new byte[16384];
                    int n;
                    while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
                    in.close();
                    return Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP);
                } catch (Exception e) {
                    return "";
                }
            }
        }, "KitobAndroid");
        setContentView(web);
        if (state != null) web.restoreState(state);
        else web.loadUrl(SITE);
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        super.onActivityResult(req, res, data);
        if (req != PICK || fileCb == null) return;
        Uri[] out = null;
        if (res == RESULT_OK && data != null) {
            if (data.getClipData() != null) {
                int n = data.getClipData().getItemCount();
                out = new Uri[n];
                for (int k = 0; k < n; k++) out[k] = data.getClipData().getItemAt(k).getUri();
            } else if (data.getData() != null) {
                out = new Uri[]{data.getData()};
            }
        }
        fileCb.onReceiveValue(out);
        fileCb = null;
    }

    private void jsUpd(final int p, final String st) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (web != null) web.evaluateJavascript("window.__upd&&window.__upd(" + p + ",'" + st + "')", null);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        Notify.sp(this).edit().putBoolean("fg", true).apply();
        Notify.enter(this);
    }

    @Override
    protected void onStop() {
        super.onStop();
        Notify.sp(this).edit().putBoolean("fg", false).apply();
        if (web != null) web.evaluateJavascript("window.__leave&&window.__leave()", null);
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("(window.__back&&window.__back())?'1':'0'", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String v) {
                if (v == null || !v.contains("1")) MainActivity.super.onBackPressed();
            }
        });
    }
}
