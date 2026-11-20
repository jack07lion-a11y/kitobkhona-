package tj.kitobkhona.app;

/** Табрики хондан: барои ҳар дақиқа (1–99) матни ҷудо; аз 100 боло — зинаҳои калон. Мантиқи холис (бе Android), санҷиш: tests/CongratsTest.java */
final class Congrats {
    private Congrats() { }

    /**
     * @param m   матнҳо барои 1..m.length дақиқа (m[0] — 1 дақиқа)
     * @param bt  зинаҳои калон (афзуда), масалан 100, 150, 200…
     * @param bm  матни ҳар зина; {n} бо шумораи воқеӣ иваз мешавад
     * @return матн ё null, агар матн набошад
     */
    static String pick(String[] m, int[] bt, String[] bm, int n) {
        if (n < 1) return null;
        String big = null;
        for (int i = 0; i < bt.length && i < bm.length; i++) if (n >= bt[i]) big = bm[i];
        if (big != null) return big.replace("{n}", String.valueOf(n));
        if (n <= m.length) return m[n - 1].replace("{n}", String.valueOf(n));
        return null;
    }
}
