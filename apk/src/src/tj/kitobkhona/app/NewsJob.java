package tj.kitobkhona.app;

import android.app.job.JobInfo;
import android.app.job.JobParameters;
import android.app.job.JobScheduler;
import android.app.job.JobService;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

/** Хабарҳои сервер (бе Firebase): ҳар чанд соат ҷадвали `news`-ро месанҷад ва агар хабари нав бошад, огоҳинома медиҳад. */
public class NewsJob extends JobService {
    static final int JOB_ID = 4201;

    /** Аз config() даъват мешавад: ҷадвалро ҳар ~6 соат месанҷем (ҳатто баъди аз нав фурӯзон шудани телефон). */
    static void schedule(Context c) {
        try {
            JobScheduler js = (JobScheduler) c.getSystemService(Context.JOB_SCHEDULER_SERVICE);
            if (js == null) return;
            for (JobInfo j : js.getAllPendingJobs()) if (j.getId() == JOB_ID) return;
            JobInfo.Builder b = new JobInfo.Builder(JOB_ID, new ComponentName(c, NewsJob.class))
                    .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
                    .setPeriodic(6 * 60 * 60 * 1000L)
                    .setPersisted(true);
            js.schedule(b.build());
        } catch (Exception ignored) { }
    }

    @Override
    public boolean onStartJob(final JobParameters p) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    check(NewsJob.this);
                } catch (Exception ignored) {
                } finally {
                    jobFinished(p, false);
                }
            }
        }).start();
        return true;
    }

    @Override
    public boolean onStopJob(JobParameters p) {
        return true;
    }

    static void check(Context c) throws Exception {
        SharedPreferences s = Notify.sp(c);
        String url = s.getString("sb_url", ""), key = s.getString("sb_key", "");
        if (url.length() < 10 || key.length() < 10 || !url.startsWith("https://")) return;
        HttpURLConnection h = (HttpURLConnection) new URL(url + "/rest/v1/news?select=id,title,body&order=id.desc&limit=1").openConnection();
        h.setConnectTimeout(15000);
        h.setReadTimeout(20000);
        h.setRequestProperty("apikey", key);
        h.setRequestProperty("Authorization", "Bearer " + key);
        try {
            if (h.getResponseCode() != 200) return;
            InputStream in = h.getInputStream();
            java.io.ByteArrayOutputStream bo = new java.io.ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int n;
            while ((n = in.read(buf)) > 0) {
                bo.write(buf, 0, n);
                if (bo.size() > 65536) return;
            }
            JSONArray a = new JSONArray(bo.toString("UTF-8"));
            if (a.length() == 0) return;
            JSONObject o = a.getJSONObject(0);
            long id = o.optLong("id", 0), last = s.getLong("last_news", -1);
            if (id <= 0) return;
            s.edit().putLong("last_news", id).apply();
            if (last < 0) return; // бори аввал: хабарҳои кӯҳнаро намефиристем
            if (id > last && s.getBoolean("news_on", true)) Notify.showNews(c, o.optString("title", "Китобхона"), o.optString("body", ""));
        } finally {
            h.disconnect();
        }
    }
}
