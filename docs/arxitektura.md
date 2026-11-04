# Меъмории код (веб-қисм)

Як система: `src/` → `python3 tools/build.py` → як `index.html` (барои сайт ва APK). Код аз рӯи **феатур** (бахш) ҷудо карда шудааст.

## Сохтор
```
src/
  features.json        рӯйхати феатурҳо бо тартиби боргирӣ (тартиб муҳим!)
  shell/               head.html, early.html (сплэш), tail.html
  features/
    core/              пойдевор: native, data (Supabase/китоб), ui, state (S), sheets, tabbar, app (render/go/bind)
    library/ reader/ player/ home/ category/ account/ premium/
    contest/           Озмун (ИФМ, Фурӯғ, Баҳс — ҷояш омода: contest/ilm, furugh, bahs)
    stats/ feedback/ notifications/ backup/ update/ i18n/
    maker/             Китоб ясаш (танбал)
    admin/             панели админ ва ҳуқуқҳо
    boot/              оғози барнома (render() + сплэш) — ҳамеша охирин
```
Дар ҳар папка: `NN-ном.js`, `NN-ном.css` (бо тартиби ном), `test.cjs` (санҷиши феатур).
Файли `*.lazy.js` — коди «танбал»; `*.json` — маълумот. Ҳарду дар `index.html` матни хомӯш мешаванд.

## Қоидаҳо
- Ҳамаи JS як скрипти классикӣ аст: `let/const`-и сатҳи боло байни феатурҳо умумӣ. Функсияҳо (`function`) ба боло мебароянд, аммо `const`-ро набояд пеш аз эълон дар вақти боргирӣ истифода бурд (TDZ). Тартиби феатурҳо дар `features.json` ин-ро кафолат медиҳад; `core` аввал, `boot` охир.
- Ҳар феатур худаш: `bindНом($$)` (пайвасти тугмаҳо, аз `bind()` даъват мешавад) ва `SHEETS.ном=X=>html` (варақҳои поёнӣ, аз `sheetHTML()`).
- Танбал: `lazy("maker")` коди `maker.lazy.js`-ро фақат бори аввал иҷро мекунад (хурдтар кардани оғоз). Ҷадвали тарҷума `i18n/rows.json` — фақат бо забони ғайри тоҷикӣ хонда мешавад.

## Феатури нав илова кардан
1. Папка `src/features/<ном>/` бо `10-<ном>.js` (ва `.css`, `test.cjs`).
2. Як сатр дар `src/features.json` (пеш аз `boot`).
3. Агар тугма/варақ дорад: `function bindНом($$){...}` + даъват дар `bind()` (core/70-app.js), `SHEETS.ном=...`.
4. `python3 tools/build.py` → commit (`index.html`, `version.json` ҳам).

Зерсаҳифаи Озмун: файли нав `contest/20-<ном>.js` (ва санҷиш дар `contest/test.cjs`).

## Санҷиш
`npm i playwright && npx playwright install chromium && node tests/run.js [феатур…]`
Ҳар феатур санҷиши худро дорад ва ҳамеша «хатои JS нест»-ро месанҷад. CI: `.github/workflows/test.yml`.
