package tj.kitobkhona.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

public class NotifyReceiver extends BroadcastReceiver {
    /** cm = {"m":[матн 1..99 дақиқа], "b":[[зина, матн],…]} */
    static String pickCongrats(String cm, int min) {
        try {
            if (cm == null || cm.length() < 2) return null;
            org.json.JSONObject o = new org.json.JSONObject(cm);
            org.json.JSONArray ma = o.optJSONArray("m"), ba = o.optJSONArray("b");
            String[] m = new String[ma == null ? 0 : ma.length()];
            for (int i = 0; i < m.length; i++) m[i] = ma.optString(i, "");
            int bn = ba == null ? 0 : ba.length();
            int[] bt = new int[bn];
            String[] bm = new String[bn];
            for (int i = 0; i < bn; i++) {
                org.json.JSONArray p = ba.optJSONArray(i);
                bt[i] = p == null ? Integer.MAX_VALUE : p.optInt(0, Integer.MAX_VALUE);
                bm[i] = p == null ? "" : p.optString(1, "");
            }
            String r = Congrats.pick(m, bt, bm, min);
            return r != null && r.length() > 0 ? r : null;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public void onReceive(Context c, Intent in) {
        String act = in.getAction();
        SharedPreferences s = Notify.sp(c);
        if (Notify.ACT_READ.equals(act)) {
            if (!s.getBoolean("congrats", true)) return;
            int min = s.getInt("read_min", 0);
            if (min < 1) return;
            String tpl = s.getString("tpl", "Табрик шумо имрӯз {n} дақиқа хондед!🎉 боз хонда боз доно шавед!");
            String text = null;
            if (!s.getBoolean("tpl_custom", false)) text = pickCongrats(s.getString("cm", ""), min); // ҳар дақиқа — матни худаш
            if (text == null) text = tpl.replace("{n}", String.valueOf(min));
            Notify.show(c, Notify.ID_READ, text);
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
            Notify.show(c, Notify.ID_REMIND, Notify.remindText(c));
        }
    }
}
