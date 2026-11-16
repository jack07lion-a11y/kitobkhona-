package tj.kitobkhona.app;

import java.util.Calendar;
import java.util.TimeZone;

/** Нақшаи эслатмаҳои ҳаррӯза (мантиқи тоза, бе Android — санҷиш: tests/RemindPlanTest.java). */
final class RemindPlan {
    /** Ҳар 2 соат аз 08:00 то 22:00 (дақиқа аз нимашаб): 08, 10, 12, 14, 16, 18, 20, 22. Шабона (22:00–08:00) хабар нест. */
    static final int[] SLOTS = {8 * 60, 10 * 60, 12 * 60, 14 * 60, 16 * 60, 18 * 60, 20 * 60, 22 * 60};
    /** Ба ҳама: ҳам ба хонанда, ҳам ба касе, ки намехонад. Ҳадди рӯзона = шумораи слот. */
    static final int MAX_IDLE = 8, MAX_OPENED = 8;

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
