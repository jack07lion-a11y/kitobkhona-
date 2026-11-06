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
            // слоти навбатӣ ҳамеша аввал ба нақша гирифта мешавад
            Notify.scheduleDaily(c);
            if (!s.getBoolean("remind", true)) return;
            if (!s.getBoolean("reg", false)) return;        // танҳо барои касоне, ки сабти ном кардаанд
            if (s.getBoolean("fg", false)) return;          // барнома кушода аст
            String day = Notify.today();
            if (!day.equals(s.getString("rem_day", ""))) s.edit().putString("rem_day", day).putInt("rem_n", 0).apply();
            int sent = s.getInt("rem_n", 0);
            boolean opened = day.equals(s.getString("open_day", ""));
            if (!RemindPlan.allow(opened, sent)) return;
            s.edit().putInt("rem_n", sent + 1).apply();
            Notify.show(c, Notify.ID_REMIND, s.getString("remind_text", "Вақти китоб хондан расид. Ба Китобхона ворид шавед"));
        }
    }
}
