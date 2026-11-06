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
            eq(hm(RemindPlan.next(at(tz, 10, 8, 0), tz), tz), "10 9:30", id + ": 08:00 → 09:30");
            eq(hm(RemindPlan.next(at(tz, 10, 9, 30), tz), tz), "10 12:30", id + ": дар 09:30 → 12:30 (худи ҳамон дақиқа не)");
            eq(hm(RemindPlan.next(at(tz, 10, 13, 0), tz), tz), "10 15:30", id + ": 13:00 → 15:30");
            eq(hm(RemindPlan.next(at(tz, 10, 20, 30), tz), tz), "11 9:30", id + ": баъди охирин → пагоҳ 09:30");
            eq(hm(RemindPlan.next(at(tz, 30, 22, 0), tz), tz), "1 9:30", id + ": охири моҳ → моҳи оянда");
        }
        eq(RemindPlan.SLOTS.length, 5, "5 слот дар як рӯз");
        // ҳеҷ гоҳ даромада нашуд: 5 маротиба
        int n = 0; for (int i = 0; i < 10; i++) if (RemindPlan.allow(false, i)) n++;
        eq(n, 5, "надаромада: ҳамагӣ 5");
        // даромада: 3
        n = 0; for (int i = 0; i < 10; i++) if (RemindPlan.allow(true, i)) n++;
        eq(n, 3, "даромада: ҳамагӣ 3");
        // як маротиба фиристода шуда, баъд даромад → боз 2 то
        int left = 0; for (int sent = 1; sent < 10; sent++) if (RemindPlan.allow(true, sent)) left++;
        eq(left, 2, "1 фиристода + даромад → боз 2 то мемонад");
        // ҳамаи 5 слот дар як рӯз ба 5 хабар мерасонад
        TimeZone tz = TimeZone.getTimeZone("Asia/Dushanbe");
        long t = at(tz, 10, 0, 5); int cnt = 0;
        while (true) { t = RemindPlan.next(t, tz); if (!hm(t, tz).startsWith("10 ")) break; cnt++; }
        eq(cnt, 5, "дар як рӯз 5 слот");
        System.exit(bad == 0 ? 0 : 1);
    }
}
