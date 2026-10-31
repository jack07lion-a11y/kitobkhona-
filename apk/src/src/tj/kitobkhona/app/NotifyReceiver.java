package tj.kitobkhona.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

public class NotifyReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent in) {
        String act = in.getAction();
        SharedPreferences s = Notify.sp(c);
        if (Notify.ACT_READ.equals(act)) {
            if (!s.getBoolean("congrats", true)) return;
            int min = s.getInt("read_min", 0);
            if (min < 1) return;
            String tpl = s.getString("tpl", "Табрик шумо имрӯз {n} дақиқа хондед!🎉 боз хонда боз доно шавед!");
            Notify.show(c, Notify.ID_READ, tpl.replace("{n}", String.valueOf(min)));
        } else if (Notify.ACT_REMIND.equals(act)) {
            // фардо ҳам (20:00)
            Notify.scheduleDaily(c);
            if (!s.getBoolean("remind", true)) return;
            if (s.getBoolean("fg", false)) return;
            if (Notify.today().equals(s.getString("read_day", "")) && s.getInt("read_min", 0) >= 1) return;
            Notify.show(c, Notify.ID_REMIND, s.getString("remind_text", "Имрӯз ҳатто 1 дақиқа китоб нахондед!"));
        }
    }
}
