package tj.kitobkhona.app;

import java.util.Calendar;
import java.util.TimeZone;

/** Нақшаи эслатмаҳои ҳаррӯза (мантиқи тоза, бе Android — санҷиш: tests/RemindPlanTest.java). */
final class RemindPlan {
    /** Вақтҳои муайян (дақиқа аз нимашаб): 09:30, 12:30, 15:30, 18:30, 20:30. */
    static final int[] SLOTS = {9 * 60 + 30, 12 * 60 + 30, 15 * 60 + 30, 18 * 60 + 30, 20 * 60 + 30};
    /** Агар имрӯз ба барнома надаромада бошад — 5 маротиба; агар даромада бошад — ҳамагӣ 3 маротиба. */
    static final int MAX_IDLE = 5, MAX_OPENED = 3;

    static boolean allow(boolean openedToday, int sentToday) {
        return sentToday < (openedToday ? MAX_OPENED : MAX_IDLE);
    }

    /** Вақти (мс) наздиктарин слот, ки аз now+60с дертар бошад. */
    static long next(long now, TimeZone tz) {
        Calendar cal = Calendar.getInstance(tz);
        for (int day = 0; day < 3; day++) {
            for (int s : SLOTS) {
                cal.setTimeInMillis(now);
                cal.add(Calendar.DAY_OF_MONTH, day);
                cal.set(Calendar.HOUR_OF_DAY, s / 60);
                cal.set(Calendar.MINUTE, s % 60);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);
                if (cal.getTimeInMillis() > now + 60000) return cal.getTimeInMillis();
            }
        }
        return now + 3600000;
    }
}
