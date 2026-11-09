# JS-кўприк (KitobAndroid) ва WebView: хатти хатар — санҷиши хаттӣ

Файл: `apk/src/src/tj/kitobkhona/app/MainActivity.java`. Санҷиш: хондани код (ба қурилма сохта нашуд; ҳамаи тағйирот дар қурилмаи воқеӣ санҷиш мехоҳанд, ба `STATUS.md` нигаред).

## Чӣ мешавад
`addJavascriptInterface(..., "KitobAndroid")` ба ҲАР саҳифаи WebView (ва ҳар iframe) кушода мешавад. Ҳар JS-и дар саҳифа иҷрошаванда ба ҳамаи методҳои `@JavascriptInterface` дастрасӣ дорад. Аз ин рӯ хатар = «чӣ саҳифа дар WebView кушода мешавад».

## Саҳифаҳои боргиришаванда
- `file:///android_asset/index.html` (ва нусхаи навшуда аз `getFilesDir()/shell`) — худамон.
- `https://jack07lion-a11y.github.io/kitobkhona-/…` (`HOST`) — худамон (GitHub Pages-и ҳамин ҳисоб). Агар ҳисоби GitHub вайрон шавад, кӯприк ба дасти ҳамлагар меафтад (хавфи боқимонда; ба «Хавфи боқимонда» нигаред).
- Дигар `https://` ва `http://` — ба браузери беруна (`ACTION_VIEW`), на дар WebView.

## Ёфтаҳо ва ислоҳҳо (дар ин бранч)
| № | Ёфта (пеш) | Хатар | Ислоҳ |
|---|---|---|---|
| 1 | `shouldOverrideUrlLoading`: `file://`-и ҳама гуна роҳ дар WebView кушода мешуд (`return false`) | `file://`-и дигар (масалан аз `content`/зеркашӣ) бо кӯприк ва дастрасии файл | Танҳо `file:///android_asset/index.html` иҷозат; дигар `file://` рад |
| 2 | Ҳар схемаи дигар (`intent:`, `content:`, `javascript:` …) ба `startActivity(ACTION_VIEW)` меравад | `intent:` URI-ҳо барномаҳои дигарро бо экстраҳо мекушояд | Танҳо `https`, `http`, `mailto`, `tel`; боқӣ рад |
| 3 | `setAllowFileAccess(true)` | WebView аз файлҳои телефон хонда метавонад | `setAllowFileAccess(false)`, `setAllowContentAccess(false)`, `setAllowFileAccessFromFileURLs(false)`, `setAllowUniversalAccessFromFileURLs(false)`. `file:///android_asset` аз ин вобаста нест (ҳуҷҷати Android) |
| 4 | `config()` ҳар `sbUrl`-ро қабул мекард, ва `NewsJob` калиди anon-ро ба ҳамон URL мефиристод | Саҳифаи вайроншуда калидро ба сервери худаш мефиристад (калит оммавӣ аст, аммо URL-и бегона метавонад хабарҳои қалбакӣ диҳад) | `sbUrl` танҳо `https://<ном>.supabase.co` |
| 5 | `audioLoad(url, …)` ҳар URL-ро мепазируфт | URL-и `file:`/`content:` ба плеери пасзамина | Танҳо `https://` |
| 6 | `allowBackup=true` | Маълумоти барнома (токен-и сессия дар localStorage) аз `adb backup`/абрӣ | `allowBackup=false` |

## Аллакай дуруст
- `openUrl(url)`: танҳо `http(s)`.
- `downloadUpdate(url)`: танҳо `https://github.com/jack07lion-a11y/kitobkhona-/releases/…`; Android худаш имзоро ҳангоми насб месанҷад.
- `asset(path)`: танҳо `books/…`, `..` рад мешавад.
- Бо `FLAVOR=play`: `downloadUpdate`/`installUpdate` ҳеҷ кор намекунанд, `shellIndex()` танҳо асосиро медиҳад, `refreshShell` хомӯш, иҷозати `REQUEST_INSTALL_PACKAGES` нест.

## Хавфи боқимонда (бунёдгузорон бояд бидонанд)
1. Кӯприк барои ҳар саҳифаи ҳамон `HOST` кушода аст: GitHub-ҳисоб ва репо бо 2FA муҳофизат шаванд.
2. Навсозии «shell» (`updateShell`) HTML/JS-ро аз сайт мегирад ва дар WebView иҷро мекунад. Барои Play ин хомӯш шудааст; барои нусхаи «direct» ҳамон тавр мемонад.
3. XSS дар `index.html`: матни китобҳо ва номи корбарон бояд ҳамеша `escH` шаванд. Дар ин санҷиш ҳамаи ҷойҳои `innerHTML` аз нав хонда нашуданд: ин санҷиши алоҳида лозим аст.
4. Қурилмаи воқеӣ: `setAllowFileAccess(false)` ва схемаҳои нав бо `file:///android_asset/index.html`, deep link `kitobkhona://book/…`, интихоби файл (`onShowFileChooser`) санҷида шаванд.
