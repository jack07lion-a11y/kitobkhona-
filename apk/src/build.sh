#!/bin/sh
# Builds the prototype APK without the Google SDK site (blocked here):
# apt-get install aapt apksigner zipalign dalvik-exchange; android.jar (API 34) from github.com/Sable/android-platforms
set -e
BT=/usr/lib/android-sdk/build-tools/debian; AJ=${AJ:-android.jar}; KS=${KS:-../keystore/kitobkhona-test.jks}
rm -rf build && mkdir -p build/gen build/obj
$BT/aapt2 compile --dir res -o build/res.zip
$BT/aapt2 link -o build/base.apk -I $AJ --manifest AndroidManifest.xml -A assets --java build/gen build/res.zip --min-sdk-version 24 --target-sdk-version 34 --version-code ${VC:-1} --version-name ${VN:-0.1-prototype}
javac -source 8 -target 8 -bootclasspath $AJ -classpath $AJ -d build/obj $(find src build/gen -name '*.java')
dalvik-exchange --dex --min-sdk-version=24 --output=build/classes.dex build/obj
cp build/base.apk build/unsigned.apk && zip -q -j build/unsigned.apk build/classes.dex
zipalign -f -p 4 build/unsigned.apk build/aligned.apk
apksigner sign --ks $KS --ks-pass pass:kitob2026 --key-pass pass:kitob2026 --ks-key-alias kitobkhona --min-sdk-version 24 --out build/kitobkhona.apk build/aligned.apk
