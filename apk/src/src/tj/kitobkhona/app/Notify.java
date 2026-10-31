package tj.kitobkhona.app;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.BitmapFactory;
import android.os.Build;
import java.util.Calendar;

/** Огоҳиномаҳои хондан: эслатмаи ҳаррӯза (соати 20:00) ва табрик 5 сония баъди баромадан. */
public class Notify {
    static final String CH = "reading";
    static final int ID_READ = 101, ID_REMIND = 102;
    static final String ACT_READ = "tj.kitobkhona.app.READ", ACT_REMIND = "tj.kitobkhona.app.REMIND";
    static final int REMIND_HOUR = 20;

    static SharedPreferences sp(Context c) {
        return c.getSharedPreferences("kk", Context.MODE_PRIVATE);
    }

    static void channel(Context c) {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm.getNotificationChannel(CH) == null) {
                NotificationChannel ch = new NotificationChannel(CH, "Китобхона", NotificationManager.IMPORTANCE_DEFAULT);
                ch.setDescription("Эслатма ва табрик барои хондан");
                nm.createNotificationChannel(ch);
            }
        }
    }

    static PendingIntent pi(Context c, String act, int code) {
        Intent i = new Intent(c, NotifyReceiver.class).setAction(act);
        int f = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
        return PendingIntent.getBroadcast(c, code, i, f);
    }

    static void schedule(Context c, String act, int code, long at) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        PendingIntent p = pi(c, act, code);
        if (Build.VERSION.SDK_INT >= 23) am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, p);
        else am.set(AlarmManager.RTC_WAKEUP, at, p);
    }

    static void cancel(Context c, String act, int code) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am != null) am.cancel(pi(c, act, code));
    }

    /** Соати 20:00-и навбатӣ (имрӯз агар нагузашта бошад, вагарна пагоҳ). */
    static long nextRemind(long now) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(now);
        cal.set(Calendar.HOUR_OF_DAY, REMIND_HOUR);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        if (cal.getTimeInMillis() <= now + 60000) cal.add(Calendar.DAY_OF_MONTH, 1);
        return cal.getTimeInMillis();
    }

    static void scheduleDaily(Context c) {
        if (!sp(c).getBoolean("remind", true)) {
            cancel(c, ACT_REMIND, 2);
            return;
        }
        schedule(c, ACT_REMIND, 2, nextRemind(System.currentTimeMillis()));
    }

    static String today() {
        Calendar k = Calendar.getInstance();
        return k.get(Calendar.YEAR) + "-" + (k.get(Calendar.MONTH) + 1) + "-" + k.get(Calendar.DAY_OF_MONTH);
    }

    static void show(Context c, int id, String text) {
        if (Build.VERSION.SDK_INT >= 33 && c.checkSelfPermission("android.permission.POST_NOTIFICATIONS") != android.content.pm.PackageManager.PERMISSION_GRANTED) return;
        channel(c);
        SharedPreferences s = sp(c);
        String role = s.getString("role", "");
        if (role.length() > 0) text = text + " — " + role;
        String title = s.getString("title", "Китобхона");
        Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(c, CH) : new Notification.Builder(c);
        Intent open = new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int f = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
        b.setSmallIcon(R.drawable.ic_stat)
                .setLargeIcon(BitmapFactory.decodeResource(c.getResources(), R.drawable.ic_large))
                .setColor(0xFF0B7D57)
                .setContentTitle(title)
                .setContentText(text)
                .setStyle(new Notification.BigTextStyle().bigText(text))
                .setAutoCancel(true)
                .setContentIntent(PendingIntent.getActivity(c, 1, open, f));
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        nm.notify(id, b.build());
    }

    /** Корбар ба барнома баргашт: ҳамаи интизорӣ ва хабарҳоро бекор мекунем. */
    static void enter(Context c) {
        cancel(c, ACT_READ, 1);
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.cancel(ID_READ);
            nm.cancel(ID_REMIND);
        }
    }
}
