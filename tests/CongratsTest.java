package tj.kitobkhona.app;

/** javac -d /tmp/cg apk/src/src/tj/kitobkhona/app/Congrats.java tests/CongratsTest.java && java -cp /tmp/cg tj.kitobkhona.app.CongratsTest */
public class CongratsTest {
    static int bad = 0;
    static void eq(Object a, Object b, String m) {
        if (!String.valueOf(a).equals(String.valueOf(b))) { bad++; System.out.println("✗ " + m + " → " + a + " ≠ " + b); } else System.out.println("✓ " + m);
    }
    public static void main(String[] x) {
        String[] m = new String[99];
        for (int i = 0; i < 99; i++) m[i] = "m" + (i + 1);
        int[] bt = {100, 150, 200, 500, 1000};
        String[] bm = {"{n} a", "{n} b", "{n} c", "{n} d", "{n} e"};
        eq(Congrats.pick(m, bt, bm, 0), "null", "0 дақиқа — матн нест");
        eq(Congrats.pick(m, bt, bm, 1), "m1", "1 дақиқа");
        eq(Congrats.pick(m, bt, bm, 37), "m37", "37 дақиқа");
        eq(Congrats.pick(m, bt, bm, 99), "m99", "99 дақиқа");
        eq(Congrats.pick(m, bt, bm, 100), "100 a", "100 — зинаи якум");
        eq(Congrats.pick(m, bt, bm, 149), "149 a", "149 — ҳанӯз зинаи якум");
        eq(Congrats.pick(m, bt, bm, 150), "150 b", "150");
        eq(Congrats.pick(m, bt, bm, 499), "499 c", "499");
        eq(Congrats.pick(m, bt, bm, 1000), "1000 e", "1000");
        eq(Congrats.pick(m, bt, bm, 5000), "5000 e", "5000 — зинаи охирин");
        eq(Congrats.pick(m, new int[0], new String[0], 120), "null", "бе зина: 120 матн нест");
        if (bad > 0) { System.out.println(bad + " нагузашт"); System.exit(1); }
        System.out.println("ҳама гузашт");
    }
}
