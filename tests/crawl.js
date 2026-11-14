// Тафтиши фарогир: нақшҳо × забонҳо × мавзӯъҳо × андозаҳои экран × саҳифаҳо ва варақҳо
// Тафтиши фарогир: node tests/crawl.js — ҳамаи саҳифаҳо/варақҳо × нақшҳо × забонҳо × андоза: хатои JS ва саҳифаи васеъ
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const R = path.join(__dirname, '..');
const MIME = { '.html': 'text/html;charset=utf-8', '.json': 'application/json', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html'; const f = path.join(R, p); if (!f.startsWith(R) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s); });
let URL = '';
const SHEETS = ['app', 'founders', 'khirad', 'pay', 'lang', 'report', 'toc', 'set', 'rds', 'pedit', 'lib', 'atoc', 'adm', 'admhub', 'admstat', 'admbk', 'admfeat', 'admbooks', 'admmake', 'admrep', 'admnews', 'admnotif', 'admrel', 'admstaff', 'admrights', 'admdel'];
const VIEWS = ['home', 'lib', 'goal', 'comm', 'me'];
const SIZES = [[320, 568], [390, 844]];
const LANGS = ['tg', 'ru'];
const THEMES = ['light', 'paper', 'dark'];
const ROLES = ['user', 'admin', 'subadmin'];
const TAJ = /[ӣӯқғҳҷӢӮҚҒҲҶ]/;
(async () => {
  await new Promise(r => srv.listen(0, r)); URL = 'http://localhost:' + srv.address().port + '/index.html';
  const b = await chromium.launch();
  const errs = new Map(), over = new Map(), untr = new Map();
  let runs = 0;
  for (const [w, h] of SIZES) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
    await ctx.route(/jsdelivr|cdnjs|supabase\.co|api\.github/, r => r.abort());
    for (const lang of LANGS) {
      const theme = THEMES[(LANGS.indexOf(lang) + SIZES.findIndex(s => s[0] === w)) % 3];
      const page = await ctx.newPage();
      page.on('pageerror', e => { const k = e.message.slice(0, 140); errs.set(k, (errs.get(k) || 0) + 1); });
      await page.addInitScript(([lg, th]) => localStorage.setItem('kitob10', JSON.stringify({ view: 'home', gender: 'boy', uname: 'Ҷасурбек', theme: th, lang: lg })), [lang, theme]);
      await page.goto(URL); await page.waitForFunction(() => window.__splDone, null, { timeout: 15000 }); await page.waitForTimeout(300);
      await page.evaluate(() => {
        const chs = []; for (let c = 0; c < 6; c++) { const bl = [['h', 'Боби ' + (c + 1)]]; for (let i = 0; i < 12; i++) bl.push(['p', 'Матни санҷишӣ барои китоб. '.repeat(10)]); chs.push({ title: 'Боби ' + (c + 1), blocks: bl }); }
        BOOKS.length = 0; BOOKS.push({ id: 1, t: 'Ёддоштҳо', a: 'Садриддин Айнӣ', c: 'fiction', col: ['#2d6a8f', '#143a57'], tp: 'x', db: true, pub: true, rs: 'public_domain' },
          { id: 2, t: 'Гулистон <b>x</b>', a: 'Саъдии Шерозӣ', c: 'classic', col: ['#0b7d57', '#063'], audio: true, db: true, pub: false, cover: 'https://example.invalid/c.jpg' },
          { id: 3, t: 'Девон', a: 'Рӯдакӣ', c: 'poetry', col: ['#a5612a', '#5a300f'], db: true, pub: true });
        TX[1] = { parts: [{ title: 'Қ', chapters: chs }] };
        S.recent = [1, 2, 3]; S.prog = { 1: 40 }; S.lib = { q: [2], d: [3], c: [{ id: 1, n: 'Шеър', ids: [1, 3] }] };
        S.staff = [{ email: 'a@b.c', name: 'Али', role: 'subadmin', perms: {} }]; S.rb = { v: 130, date: Date.now(), url: 'https://github.com/jack07lion-a11y/kitobkhona-/releases/x' };
        S.stats = { total: 5, admins: 1, subadmins: 1, users: 3 }; S.rs = { dau: 2, wau: 3, sec_today: 600, sec_7d: 3000 }; S.fn = { installs: 4 };
      });
      for (const role of ROLES) {
        await page.evaluate(r => { S.role = r === 'user' ? '' : r; S.perms = r === 'subadmin' ? { maker: true, books: true, news: true, reports: true, stats: true, release: true, notif: true } : {}; }, role);
        const targets = VIEWS.map(v => ['view', v]).concat(SHEETS.filter(s => role !== 'user' || !s.startsWith('adm')).map(s => ['sheet', s]));
        targets.push(['search', 'q']); targets.push(['detail', '1']); targets.push(['reader', '1']);
        for (const [kind, name] of targets) {
          await page.evaluate(([k, n]) => {
            S.sheet = null; S.search = false; S.q = ''; S.hubBack = null; S.au = null;
            if (S.view === 'read') S.view = 'home';
            if (k === 'view') { S.view = n; }
            else if (k === 'sheet') {
              S.view = 'me';
              if (n === 'pedit') S.pe = { name: 'Ҷасурбек', bio: '', av: '', bn: '' };
              if (n === 'adm') S.adm = { id: 2, t: 'Гулистон', a: 'Саъдӣ', c: 'classic', col: ['#0b7d57', '#063'], pub: false, rs: 'pending' };
              if (n === 'lib') { S.view = 'lib'; S.libK = 'read'; }
              if (n === 'atoc') { S.au = { id: 2, ch: 0, pos: 0, speed: 1, playing: false }; }
              if (n === 'toc') { S.view = 'read'; }
              S.sheet = n;
            } else if (k === 'search') { S.view = 'home'; S.search = true; S.chip = 'all'; }
            else if (k === 'detail') { S.view = 'home'; openDetail(+n); return; }
            else if (k === 'reader') { S.view = 'home'; openBook0(+n); return; }
            render();
          }, [kind, name]).catch(e => { const k = 'evalfail ' + kind + ':' + name + ' ' + String(e.message).slice(0, 80); errs.set(k, (errs.get(k) || 0) + 1); });
          await page.waitForTimeout(kind === 'reader' ? 500 : 90);
          runs++;
          const r = await page.evaluate(() => {
            const de = document.documentElement;
            const wide = de.scrollWidth > innerWidth + 1;
            // элементҳои аз экран берун (дар дохили варақ ё саҳифа)
            const bad = [];
            document.querySelectorAll('#app *').forEach(el => {
              const cs = getComputedStyle(el);
              if (cs.position === 'fixed' || cs.display === 'none') return;
              const rc = el.getBoundingClientRect();
              if (rc.width > 0 && rc.right > innerWidth + 2 && !el.closest('.hscroll,.chips,.shelf,.wheel,.wh,.rd-view,.rd-flow,.tb,.tabs,.sheet-x,[class*=scroll]') && bad.length < 3) bad.push(el.tagName + '.' + (el.className || '').toString().slice(0, 30));
            });
            // матни тоҷикӣ дар забони дигар
            const lang = I18N.lang, un = [];
            if (lang !== 'tg') {
              const w = document.createTreeWalker(document.getElementById('app'), NodeFilter.SHOW_TEXT);
              let n; while ((n = w.nextNode())) {
                const t = n.nodeValue.trim(); if (t.length < 2) continue;
                const p = n.parentElement; if (!p || p.closest('[translate=no],.book,.cover,.rd-flow,.rd-tsheet,script,style,textarea,input,.sh-cv,.sh-form input')) continue;
                if (/[ӣӯқғҳҷӢӮҚҒҲҶ]/.test(t) && un.length < 6) un.push(t.slice(0, 50));
              }
            }
            return { wide, bad, un, view: S.view, sheet: S.sheet };
          });
          const key = `${w}|${lang}|${role}|${kind}:${name}`;
          if (r.wide || r.bad.length) over.set(key, (r.wide ? 'PAGE-WIDE ' : '') + r.bad.join(','));
          r.un.forEach(t => { const k = lang + ' | ' + t; untr.set(k, (untr.get(k) || 0) + 1); });
        }
      }
      await page.close();
    }
    await ctx.close();
  }
  await b.close();
  srv.close();
  console.log('Санҷишҳо:', runs);
  // «witem» (чархи китобҳо) — ба таври дидаю дониста боргиранда; toc — танҳо дар хонанда
  const bad = [...over].filter(([k, v]) => !/witem|sheet:toc/.test(v + k));
  [...errs].filter(([k]) => !/sheet:toc/.test(k)).forEach(([k, v]) => console.log('ХАТОИ JS', v + '×', k));
  bad.forEach(([k, v]) => console.log('ВАСЕЪ', k, v));
  const nerr = [...errs].filter(([k]) => !/sheet:toc/.test(k)).length;
  console.log(nerr || bad.length ? `\n${nerr} хатои JS, ${bad.length} саҳифаи васеъ` : '\nҲама гузашт');
  process.exit(nerr || bad.length ? 1 : 0);
})();
