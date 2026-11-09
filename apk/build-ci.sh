#!/bin/bash
# GitHub Actions: APK йиғиш (Android SDK ubuntu-latest-да тайёр). Калити санҷишӣ, Play Store учун не.
set -euo pipefail
cd "$(dirname "$0")/src"
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/usr/local/lib/android/sdk}}"
BT="$SDK/build-tools/$(ls "$SDK/build-tools" | sort -V | tail -1)"
# targetSdk 35 (Play талаб мекунад) агар платформа бошад; вагарна 34
if [ -f "$SDK/platforms/android-35/android.jar" ]; then AJ="$SDK/platforms/android-35/android.jar"; TSDK=35
else AJ="$SDK/platforms/android-34/android.jar"; TSDK=34; fi
[ -f "$AJ" ] || AJ="$SDK/platforms/$(ls "$SDK/platforms" | sort -V | tail -1)/android.jar"
echo "targetSdk=$TSDK"
FLAVOR="${FLAVOR:-direct}"; case "$FLAVOR" in direct|play) ;; *) echo "ХАТО: FLAVOR=direct ё play"; exit 1;; esac
VN="${VN:-$(cat ../VERSION)}"   # версия: apk/VERSION (масалан 1.0.0); versionCode = рақами CI (VC)
echo "flavor=$FLAVOR versionName=$VN versionCode=${VC:-1}"
# Калити асосӣ: apk/ks.enc (рамзгузоришуда) → apk/ks/kitobkhona.jks; парол: GitHub Secret KS_PASS.
# Захираи «калити санҷишӣ» ВУҶУД НАДОРАД: калит ё парол набошад, йиғиш меафтад (то APK бо имзои нодуруст набарояд).
KS="$PWD/../ks/kitobkhona.jks"; PASS="${KS_PASS:-}"
[ -n "$PASS" ] || { echo "ХАТО: KS_PASS муқаррар нашудааст (GitHub → Settings → Secrets → Actions). Йиғиш қатъ шуд."; exit 1; }
[ -f "$KS" ] || { echo "ХАТО: калит ёфт нашуд ($KS). Аввал apk/ks.enc-ро кушоед (apk.yml) ё workflow «Калит (як маротиба)»-ро иҷро кунед. Йиғиш қатъ шуд."; exit 1; }
# ҳамеша аз index.html-и асосӣ мегирем
cp ../../index.html assets/index.html
rm -rf assets/fonts && cp -r ../../fonts assets/fonts
rm -rf assets/lib && cp -r ../../lib assets/lib
mkdir -p assets/avatars && cp ../../avatars/*.webp assets/avatars/
mkdir -p assets/logos && cp ../../logos/khirad*.webp assets/logos/
if [ "$TSDK" = "35" ]; then mkdir -p res/values-v35 res/values-night-v35 && cp ../res-v35/styles.xml res/values-v35/styles.xml && cp ../res-v35/styles-night.xml res/values-night-v35/styles.xml; fi
rm -rf build && mkdir -p build/gen build/obj
SRC=src; MANIFEST=AndroidManifest.xml
if [ "$FLAVOR" = "play" ]; then
  # Play: бе худнавсозии APK ва бе REQUEST_INSTALL_PACKAGES (нусхаи муваққатӣ, репо тағйир намеёбад)
  mkdir -p build/play && cp -r src build/play/src
  sed -i 's/PLAY = false/PLAY = true/' build/play/src/tj/kitobkhona/app/Flavor.java
  grep -q 'PLAY = true' build/play/src/tj/kitobkhona/app/Flavor.java || { echo "ХАТО: Flavor.java иваз нашуд"; exit 1; }
  sed '/REQUEST_INSTALL_PACKAGES/d' AndroidManifest.xml > build/play/AndroidManifest.xml
  ! grep -q REQUEST_INSTALL_PACKAGES build/play/AndroidManifest.xml || { echo "ХАТО: иҷозат нест нашуд"; exit 1; }
  SRC=build/play/src; MANIFEST=build/play/AndroidManifest.xml
fi
"$BT/aapt2" compile --dir res -o build/res.zip
"$BT/aapt2" link -o build/base.apk -I "$AJ" --manifest "$MANIFEST" -A assets --java build/gen build/res.zip --min-sdk-version 24 --target-sdk-version $TSDK --version-code "${VC:-1}" --version-name "$VN"
javac -nowarn -Xlint:none -source 8 -target 8 -bootclasspath "$AJ" -classpath "$AJ" -d build/obj $(find "$SRC" build/gen -name '*.java')
"$BT/d8" --min-api 24 --lib "$AJ" --output build $(find build/obj -name '*.class')
cp build/base.apk build/unsigned.apk && (cd build && zip -q unsigned.apk classes.dex)
"$BT/zipalign" -f -p 4 build/unsigned.apk build/aligned.apk
"$BT/apksigner" sign --ks "$KS" --ks-pass env:KS_PASS --key-pass env:KS_PASS --min-sdk-version 24 --out build/kitobkhona.apk build/aligned.apk
"$BT/apksigner" verify build/kitobkhona.apk
ls -la build/kitobkhona.apk
# AAB (Google Play): AAB=1 BUNDLETOOL=/роҳ/bundletool.jar ./apk/build-ci.sh   (FLAVOR=play тавсия мешавад)
# Ҳоло ИН ҚАДАМ ДАР CI ҲАНӮЗ ИҶРО НАШУДААСТ (дар муҳити таҳия SDK нест): аввал workflow «AAB (Play)»-ро дастӣ иҷро кунед.
if [ "${AAB:-0}" = "1" ]; then
  : "${BUNDLETOOL:?BUNDLETOOL=роҳи bundletool.jar лозим}"
  "$BT/aapt2" link --proto-format -o build/base-proto.apk -I "$AJ" --manifest "$MANIFEST" -A assets \
    --min-sdk-version 24 --target-sdk-version $TSDK --version-code "${VC:-1}" --version-name "$VN" build/res.zip
  rm -rf build/aab && mkdir -p build/aab && (cd build/aab && unzip -q ../base-proto.apk && mkdir manifest dex \
    && mv AndroidManifest.xml manifest/ && cp ../classes.dex dex/ && zip -qr ../base.zip .)
  java -jar "$BUNDLETOOL" build-bundle --modules=build/base.zip --output=build/kitobkhona.aab
  jarsigner -sigalg SHA256withRSA -digestalg SHA-256 -keystore "$KS" -storepass:env KS_PASS -keypass:env KS_PASS build/kitobkhona.aab kitobkhona
  jarsigner -verify build/kitobkhona.aab | tail -1
  ls -la build/kitobkhona.aab
fi
