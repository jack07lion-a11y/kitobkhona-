package tj.kitobkhona.app;

/** Нусха: false = «direct» (сайт/GitHub, худнавсозӣ бо APK); true = «play» (Google Play: бе худнавсозӣ ва бе REQUEST_INSTALL_PACKAGES).
 *  build-ci.sh бо FLAVOR=play ин қимат ва манифестро дар нусхаи муваққатӣ иваз мекунад; ин файл дар репо ҳамеша false аст. */
final class Flavor {
    static final boolean PLAY = false;
    private Flavor() { }
}
