package tj.kitobkhona.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.BitmapFactory;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;

/**
 * Аудиокитоб дар паси экран: хизмати пеш (foreground), бо тугмаҳои паёмнома.
 * JS аз KitobAndroid.audioLoad/Play/Pause/Seek/Stop/State истифода мебарад.
 */
public class AudioService extends Service implements MediaPlayer.OnPreparedListener, MediaPlayer.OnCompletionListener, MediaPlayer.OnErrorListener {
    static final String CH = "audio", A_LOAD = "load", A_PLAY = "play", A_PAUSE = "pause", A_SEEK = "seek", A_STOP = "stop";
    static final int NID = 301;
    static volatile MediaPlayer mp;
    static volatile boolean prepared, wantPlay, ended, err;
    static volatile String title = "", artist = "", url = "";
    static volatile int startAt;

    private AudioManager am;
    private final AudioManager.OnAudioFocusChangeListener focus = new AudioManager.OnAudioFocusChangeListener() {
        @Override
        public void onAudioFocusChange(int f) {
            if (f == AudioManager.AUDIOFOCUS_LOSS || f == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) pause();
        }
    };

    static void cmd(Context c, String act, String u, String t, String a, int ms) {
        Intent i = new Intent(c, AudioService.class).setAction(act);
        if (u != null) i.putExtra("u", u);
        if (t != null) i.putExtra("t", t);
        if (a != null) i.putExtra("a", a);
        i.putExtra("ms", ms);
        try {
            if (Build.VERSION.SDK_INT >= 26 && (A_LOAD.equals(act) || A_PLAY.equals(act))) c.startForegroundService(i);
            else c.startService(i);
        } catch (Exception ignored) { }
    }

    static String state() {
        MediaPlayer m = mp;
        int pos = 0, dur = 0;
        boolean pl = false;
        try {
            if (m != null && prepared) {
                pos = m.getCurrentPosition();
                dur = m.getDuration();
                pl = m.isPlaying();
            }
        } catch (Exception ignored) { }
        return "{\"playing\":" + pl + ",\"pos\":" + pos + ",\"dur\":" + dur + ",\"ready\":" + prepared + ",\"ended\":" + ended + ",\"err\":" + err + ",\"title\":" + org.json.JSONObject.quote(title) + "}";
    }

    @Override
    public void onCreate() {
        super.onCreate();
        am = (AudioManager) getSystemService(AUDIO_SERVICE);
    }

    @Override
    public IBinder onBind(Intent i) {
        return null;
    }

    @Override
    public int onStartCommand(Intent in, int flags, int id) {
        String act = in == null ? null : in.getAction();
        if (act == null) return START_NOT_STICKY;
        if (A_LOAD.equals(act)) {
            load(in.getStringExtra("u"), in.getStringExtra("t"), in.getStringExtra("a"), in.getIntExtra("ms", 0));
        } else if (A_PLAY.equals(act)) {
            play();
        } else if (A_PAUSE.equals(act)) {
            pause();
        } else if (A_SEEK.equals(act)) {
            try {
                if (mp != null && prepared) mp.seekTo(Math.max(0, in.getIntExtra("ms", 0)));
            } catch (Exception ignored) { }
        } else if (A_STOP.equals(act)) {
            stopAll();
        }
        return START_NOT_STICKY;
    }

    private void load(String u, String t, String a, int ms) {
        release();
        url = u == null ? "" : u;
        title = t == null ? "" : t;
        artist = a == null ? "" : a;
        startAt = Math.max(0, ms);
        prepared = false;
        ended = false;
        err = false;
        wantPlay = true;
        goForeground(true);
        if (!(url.startsWith("https://") || url.startsWith("http://") || url.startsWith("file://"))) {
            err = true;
            return;
        }
        try {
            MediaPlayer m = new MediaPlayer();
            m.setWakeMode(getApplicationContext(), PowerManager.PARTIAL_WAKE_LOCK);
            m.setAudioStreamType(AudioManager.STREAM_MUSIC);
            m.setDataSource(url);
            m.setOnPreparedListener(this);
            m.setOnCompletionListener(this);
            m.setOnErrorListener(this);
            mp = m;
            m.prepareAsync();
        } catch (Exception e) {
            err = true;
        }
    }

    @Override
    public void onPrepared(MediaPlayer m) {
        prepared = true;
        try {
            if (startAt > 0) m.seekTo(startAt);
            if (wantPlay) play();
        } catch (Exception ignored) { }
    }

    @Override
    public void onCompletion(MediaPlayer m) {
        ended = true;
        goForeground(false);
        stopForegroundCompat();
    }

    @Override
    public boolean onError(MediaPlayer m, int w, int x) {
        err = true;
        prepared = false;
        stopAll();
        return true;
    }

    private void play() {
        wantPlay = true;
        try {
            if (mp != null && prepared) {
                if (am != null) am.requestAudioFocus(focus, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
                mp.start();
                ended = false;
                goForeground(true);
            }
        } catch (Exception ignored) { }
    }

    private void pause() {
        wantPlay = false;
        try {
            if (mp != null && prepared && mp.isPlaying()) mp.pause();
        } catch (Exception ignored) { }
        goForeground(false);
    }

    private void release() {
        try {
            if (mp != null) mp.release();
        } catch (Exception ignored) { }
        mp = null;
        prepared = false;
    }

    private void stopAll() {
        release();
        wantPlay = false;
        stopForegroundCompat();
        stopSelf();
    }

    private void stopForegroundCompat() {
        try {
            if (Build.VERSION.SDK_INT >= 24) stopForeground(STOP_FOREGROUND_REMOVE);
            else stopForeground(true);
        } catch (Exception ignored) { }
    }

    private PendingIntent act(String a, int code) {
        Intent i = new Intent(this, AudioService.class).setAction(a);
        int f = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
        return Build.VERSION.SDK_INT >= 26 ? PendingIntent.getForegroundService(this, code, i, f) : PendingIntent.getService(this, code, i, f);
    }

    private void goForeground(boolean playing) {
        try {
            if (Build.VERSION.SDK_INT >= 26) {
                NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                if (nm.getNotificationChannel(CH) == null) {
                    NotificationChannel ch = new NotificationChannel(CH, "Аудиокитоб", NotificationManager.IMPORTANCE_LOW);
                    nm.createNotificationChannel(ch);
                }
            }
            Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(this, CH) : new Notification.Builder(this);
            Intent open = new Intent(this, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            int f = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
            b.setSmallIcon(R.drawable.ic_stat)
                    .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.drawable.ic_large))
                    .setContentTitle(title.length() > 0 ? title : "Китобхона")
                    .setContentText(artist)
                    .setOngoing(playing)
                    .setContentIntent(PendingIntent.getActivity(this, 2, open, f))
                    .setColor(0xFF0B7D57)
                    .setStyle(new Notification.MediaStyle().setShowActionsInCompactView(0, 1));
            if (playing) b.addAction(android.R.drawable.ic_media_pause, "Таваққуф", act(A_PAUSE, 11));
            else b.addAction(android.R.drawable.ic_media_play, "Пахш", act(A_PLAY, 12));
            b.addAction(android.R.drawable.ic_menu_close_clear_cancel, "Пӯшидан", act(A_STOP, 13));
            Notification n = b.build();
            if (Build.VERSION.SDK_INT >= 29) startForeground(NID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
            else startForeground(NID, n);
        } catch (Exception ignored) { }
    }

    @Override
    public void onDestroy() {
        release();
        super.onDestroy();
    }
}
