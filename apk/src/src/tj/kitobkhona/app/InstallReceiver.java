package tj.kitobkhona.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInstaller;
import android.widget.Toast;

/** Ҷавоби насбкунаки Android: тасдиқи корбар ё хато. */
public class InstallReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent in) {
        int st = in.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE);
        if (st == PackageInstaller.STATUS_PENDING_USER_ACTION) {
            Intent confirm = in.getParcelableExtra(Intent.EXTRA_INTENT);
            if (confirm != null && Notify.sp(c).getBoolean("fg", false)) {   // дар паси замина ойна намекушем
                confirm.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                try { c.startActivity(confirm); } catch (Exception ignored) { }
            }
        } else if (st != PackageInstaller.STATUS_SUCCESS && Notify.sp(c).getBoolean("fg", false)) {
            Toast.makeText(c, "Насб нашуд", Toast.LENGTH_LONG).show();
        }
    }
}
