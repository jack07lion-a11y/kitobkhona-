#!/bin/bash
# GitHub Actions: APK йиғиш (Android SDK ubuntu-latest-да тайёр). Калити санҷишӣ, Play Store учун не.
set -euo pipefail
cd "$(dirname "$0")/src"
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/usr/local/lib/android/sdk}}"
BT="$SDK/build-tools/$(ls "$SDK/build-tools" | sort -V | tail -1)"
AJ="$SDK/platforms/android-34/android.jar"
[ -f "$AJ" ] || AJ="$SDK/platforms/$(ls "$SDK/platforms" | sort -V | tail -1)/android.jar"
KS="${KS:-$PWD/../ks/kitobkhona-test.jks}"; PASS=kitob2026
mkdir -p "$(dirname "$KS")"
[ -f "$KS" ] || keytool -genkeypair -keystore "$KS" -storepass $PASS -keypass $PASS -alias kitobkhona -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Kitobkhona Test, C=TJ"
# ҳамеша аз index.html-и асосӣ мегирем
cp ../../index.html assets/index.html
rm -rf assets/fonts && cp -r ../../fonts assets/fonts
rm -rf build && mkdir -p build/gen build/obj
"$BT/aapt2" compile --dir res -o build/res.zip
"$BT/aapt2" link -o build/base.apk -I "$AJ" --manifest AndroidManifest.xml -A assets --java build/gen build/res.zip --min-sdk-version 24 --target-sdk-version 34 --version-code "${VC:-1}" --version-name "${VN:-0.1-test}"
javac -nowarn -Xlint:none -source 8 -target 8 -bootclasspath "$AJ" -classpath "$AJ" -d build/obj $(find src build/gen -name '*.java')
"$BT/d8" --min-api 24 --lib "$AJ" --output build $(find build/obj -name '*.class')
cp build/base.apk build/unsigned.apk && (cd build && zip -q unsigned.apk classes.dex)
"$BT/zipalign" -f -p 4 build/unsigned.apk build/aligned.apk
"$BT/apksigner" sign --ks "$KS" --ks-pass pass:$PASS --key-pass pass:$PASS --min-sdk-version 24 --out build/kitobkhona.apk build/aligned.apk
"$BT/apksigner" verify build/kitobkhona.apk
ls -la build/kitobkhona.apk
