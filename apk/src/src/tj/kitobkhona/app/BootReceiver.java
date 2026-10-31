package tj.kitobkhona.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent in) {
        Notify.sp(c).edit().putBoolean("fg", false).apply();
        Notify.scheduleDaily(c);
    }
}
