package tj.kitobkhona.app;

import java.util.Calendar;
import java.util.TimeZone;

/** Санҷиши мантиқи эслатмаҳо: javac -d /tmp/rp apk/src/src/tj/kitobkhona/app/RemindPlan.java tests/RemindPlanTest.java && java -cp /tmp/rp tj.kitobkhona.app.RemindPlanTest */
public class RemindPlanTest {
    static int bad = 0;
    static void eq(Object a, Object b, String m) {
        if (!a.equals(b)) { bad++; System.out.println("✗ " + m + " → " + a + " ≠ " + b); } else System.out.println("✓ " + m);
    }
    static long at(TimeZone tz, int d, int h, int m) {
        Calendar c = Calendar.getInstance(tz);
        c.clear(); c.set(2026, Calendar.NOVEMBER, d, h, m, 0);
        return c.getTimeInMillis();
    }
    static String hm(long t, TimeZone tz) {
        Calendar c = Calendar.getInstance(tz); c.setTimeInMillis(t);
        return c.get(Calendar.DAY_OF_MONTH) + " " + c.get(Calendar.HOUR_OF_DAY) + ":" + String.format("%02d", c.get(Calendar.MINUTE));
    }
    public static void main(String[] x) {
        for (String id : new String[]{"Asia/Dushanbe", "Europe/Moscow", "UTC"}) {
            TimeZone tz = TimeZone.getTimeZone(id);
            eq(hm(RemindPlan.next(at(tz, 10, 7, 0), tz), tz), "10 8:00", id + ": 07:00 → 08:00");
            eq(hm(RemindPlan.next(at(tz, 10, 8, 0), tz), tz), "10 10:00", id + ": дар 08:00 → 10:00 (худи ҳамон дақиқа не)");
            eq(hm(RemindPlan.next(at(tz, 10, 13, 0), tz), tz), "10 14:00", id + ": 13:00 → 14:00");
            eq(hm(RemindPlan.next(at(tz, 10, 22, 0), tz), tz), "11 8:00", id + ": баъди охирин (22:00) → пагоҳ 08:00");
            eq(hm(RemindPlan.next(at(tz, 10, 23, 30), tz), tz), "11 8:00", id + ": шабона → пагоҳ 08:00");
            eq(hm(RemindPlan.next(at(tz, 30, 22, 0), tz), tz), "1 8:00", id + ": охири моҳ → моҳи оянда");
        }
        eq(RemindPlan.SLOTS.length, 8, "8 слот дар як рӯз (ҳар 2 соат, 08:00–22:00)");
        for (int i = 1; i < RemindPlan.SLOTS.length; i++) eq(RemindPlan.SLOTS[i] - RemindPlan.SLOTS[i - 1], 120, "фосила 2 соат (слот " + i + ")");
        int n = 0; for (int i = 0; i < 20; i++) if (RemindPlan.allow(false, i)) n++;
        eq(n, 8, "нахонда: 8 дар рӯз");
        n = 0; for (int i = 0; i < 20; i++) if (RemindPlan.allow(true, i)) n++;
        eq(n, 8, "хонда: ҳам 8 (ба ҳама)");
        TimeZone tz = TimeZone.getTimeZone("Asia/Dushanbe");
        long t = at(tz, 10, 0, 5); int cnt = 0;
        while (true) { t = RemindPlan.next(t, tz); if (!hm(t, tz).startsWith("10 ")) break; cnt++; }
        eq(cnt, 8, "дар як рӯз 8 слот");
        System.exit(bad == 0 ? 0 : 1);
    }
}
