package tj.kitobkhona.app;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;

import java.io.File;
import java.io.FileNotFoundException;

/**
 * Тасвири иқтибос (ва монанди он) барои «Мубодила»: файл дар cache/share/ нигоҳ дошта мешавад ва аз ин ҷо
 * ба барномаи дигар (Телеграм, Instagram…) дода мешавад. androidx лозим нест.
 * Ба ҷуз файли ҳамон папка ҳеҷ чиз дода намешавад (роҳ тоза карда мешавад).
 */
public class ShareProvider extends ContentProvider {
    public static String authority(android.content.Context c) { return c.getPackageName() + ".share"; }

    public static File dir(android.content.Context c) {
        File d = new File(c.getCacheDir(), "share");
        if (!d.exists()) d.mkdirs();
        return d;
    }

    private File fileFor(Uri uri) throws FileNotFoundException {
        String n = uri.getLastPathSegment();
        if (n == null || n.contains("/") || n.contains("..") || n.startsWith(".")) throw new FileNotFoundException();
        File f = new File(dir(getContext()), n);
        if (!f.isFile()) throw new FileNotFoundException();
        return f;
    }

    @Override public boolean onCreate() { return true; }

    @Override public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        if (mode != null && !mode.equals("r")) throw new FileNotFoundException();
        return ParcelFileDescriptor.open(fileFor(uri), ParcelFileDescriptor.MODE_READ_ONLY);
    }

    @Override public String getType(Uri uri) { return "image/png"; }

    @Override public Cursor query(Uri uri, String[] proj, String sel, String[] args, String sort) {
        try {
            File f = fileFor(uri);
            MatrixCursor c = new MatrixCursor(new String[]{OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE});
            c.addRow(new Object[]{f.getName(), f.length()});
            return c;
        } catch (FileNotFoundException e) { return null; }
    }

    @Override public Uri insert(Uri uri, ContentValues v) { return null; }
    @Override public int delete(Uri uri, String s, String[] a) { return 0; }
    @Override public int update(Uri uri, ContentValues v, String s, String[] a) { return 0; }
}
