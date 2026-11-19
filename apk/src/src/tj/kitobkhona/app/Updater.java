package tj.kitobkhona.app;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInstaller;
import android.os.Build;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Навсозии паси замина (барнома кушода нест): аз NewsJob ҳар чанд соат, ҳангоми пайдо шудани интернет.
 * Бе ойна ва бе огоҳинома: APK ва нусхаи саҳифа худ фаро мешаванд.
 * Корбар барнома кушояд — JS-и дохилӣ ҳамин корро худ мекунад.
 */
final class Updater {
    private static final String SITE = "https://jack07lion-a11y.github.io/kitobkhona-/";
    private static final String REL = "https://github.com/jack07lion-a11y/kitobkhona-/releases/";

    private Updater() { }

    static void run(Context c) {
        if (Flavor.PLAY) return;   // Play: танҳо тавассути Play Market
        SharedPreferences s = Notify.sp(c);
        String url = s.getString("sb_url", ""), key = s.getString("sb_key", "");
        if (url.length() < 10 || key.length() < 10 || !url.startsWith("https://")) return;
        try { shell(c, s, url, key); } catch (Exception ignored) { }
        try { apk(c, s, url, key); } catch (Exception ignored) { }
    }

    private static String get(String u, String key, int max) throws Exception {
        HttpURLConnection h = (HttpURLConnection) new URL(u).openConnection();
        h.setConnectTimeout(15000);
        h.setReadTimeout(20000);
        if (key != null) {
            h.setRequestProperty("apikey", key);
            h.setRequestProperty("Authorization", "Bearer " + key);
        }
        try {
            if (h.getResponseCode() != 200) return null;
            InputStream in = h.getInputStream();
            ByteArrayOutputStream bo = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) {
                bo.write(buf, 0, n);
                if (bo.size() > max) return null;
            }
            return bo.toString("UTF-8");
        } finally {
            h.disconnect();
        }
    }

    /** Нусхаи нави саҳифа: танҳо агар админ «Нашр кардан»-ро пахш карда бошад (web_pub иваз шуда). */
    private static void shell(Context c, SharedPreferences s, String base, String key) throws Exception {
        String j = get(base + "/rest/v1/app_flags?select=web_pub&id=eq.1", key, 8192);
        if (j == null) return;
        JSONArray a = new JSONArray(j);
        if (a.length() == 0) return;
        String pub = a.getJSONObject(0).optString("web_pub", "");
        if (pub.length() == 0 || pub.equals(s.getString("shell_pub_done", ""))) return;
        HttpURLConnection h = (HttpURLConnection) new URL(SITE + "index.html?nc=" + System.currentTimeMillis()).openConnection();
        h.setConnectTimeout(15000);
        h.setReadTimeout(30000);
        h.setRequestProperty("Cache-Control", "no-cache");
        byte[] data;
        try {
            if (h.getResponseCode() != 200) return;
            InputStream in = h.getInputStream();
            ByteArrayOutputStream bo = new ByteArrayOutputStream();
            byte[] buf = new byte[32768];
            int n;
            while ((n = in.read(buf)) > 0) {
                bo.write(buf, 0, n);
                if (bo.size() > 6 * 1024 * 1024) return;
            }
            data = bo.toByteArray();
        } finally {
            h.disconnect();
        }
        String t = new String(data, "UTF-8");
        if (data.length < 50000 || !t.contains("kitob10") || !t.contains("</script>")) return;
        String sig = data.length + ":" + Arrays.hashCode(data);
        if (sig.equals(s.getString("shell_bad", ""))) return;
        File dir = new File(c.getFilesDir(), "shell");
        dir.mkdirs();
        File cur = new File(dir, "index.html"), prev = new File(dir, "index.prev.html");
        boolean same = false;
        if (cur.exists()) {
            InputStream in = new FileInputStream(cur);
            ByteArrayOutputStream bo = new ByteArrayOutputStream();
            byte[] buf = new byte[32768];
            int n;
            while ((n = in.read(buf)) > 0) bo.write(buf, 0, n);
            in.close();
            byte[] d = bo.toByteArray();
            same = sig.equals(d.length + ":" + Arrays.hashCode(d));
        }
        if (!same) {
            File tmp = new File(dir, "index.html.tmp");
            FileOutputStream out = new FileOutputStream(tmp);
            out.write(data);
            out.close();
            if (cur.exists() && "ok".equals(s.getString("shell_state", "ok"))) {
                prev.delete();
                cur.renameTo(prev);
            }
            tmp.renameTo(cur);
            s.edit().putString("shell_state", "trial").putInt("shell_fails", 0).apply();
        }
        s.edit().putString("shell_pub_done", pub).apply();
    }

    /** APK-и нав: танҳо баъди «Нашр кардан» (app_release); худ насб мешавад (Android 12+ бе савол). */
    private static void apk(Context c, SharedPreferences s, String base, String key) throws Exception {
        String j = get(base + "/rest/v1/app_release?select=version,url&id=eq.1", key, 8192);
        if (j == null) return;
        JSONArray a = new JSONArray(j);
        if (a.length() == 0) return;
        JSONObject o = a.getJSONObject(0);
        long ver = o.optLong("version", 0);
        String link = o.optString("url", "");
        if (ver <= 0 || !link.startsWith(REL)) return;
        long cur = 0;
        try {
            cur = c.getPackageManager().getPackageInfo(c.getPackageName(), 0).versionCode;
        } catch (Exception ignored) { }
        if (ver <= cur) return;
        if (s.getBoolean("fg", false)) return;                       // барнома кушода: JS-и дохилӣ худ мекунад
        if (Build.VERSION.SDK_INT < 31) return;                      // то Android 12: насби бе савол имконнопазир; ҳангоми кушодан
        if (!c.getPackageManager().canRequestPackageInstalls()) return;
        long last = s.getLong("bg_apk_try", 0);
        if (System.currentTimeMillis() - last < 3 * 60 * 60 * 1000L) return;
        s.edit().putLong("bg_apk_try", System.currentTimeMillis()).apply();
        File f = new File(c.getCacheDir(), "update.apk");
        HttpURLConnection h = (HttpURLConnection) new URL(link).openConnection();
        h.setConnectTimeout(15000);
        h.setReadTimeout(30000);
        try {
            if (h.getResponseCode() != 200) return;
            InputStream in = h.getInputStream();
            FileOutputStream out = new FileOutputStream(f);
            byte[] buf = new byte[32768];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            out.close();
            in.close();
        } finally {
            h.disconnect();
        }
        if (f.length() < 100000) return;
        PackageInstaller pi = c.getPackageManager().getPackageInstaller();
        PackageInstaller.SessionParams sp = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
        sp.setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_NOT_REQUIRED);
        int id = pi.createSession(sp);
        PackageInstaller.Session ss = pi.openSession(id);
        OutputStream os = ss.openWrite("kitobkhona", 0, f.length());
        InputStream is = new FileInputStream(f);
        byte[] buf = new byte[32768];
        int n;
        while ((n = is.read(buf)) > 0) os.write(buf, 0, n);
        ss.fsync(os);
        os.close();
        is.close();
        Intent it = new Intent(c, InstallReceiver.class).setAction("tj.kitobkhona.app.INSTALLED");
        PendingIntent pend = PendingIntent.getBroadcast(c, id, it, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
        ss.commit(pend.getIntentSender());
        ss.close();
    }
}
