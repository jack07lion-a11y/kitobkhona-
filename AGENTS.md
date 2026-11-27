# AGENTS.md — барои ҳар агенти AI (Codex, Gemini, Copilot, Cursor ва ғайра)

Ин лоиҳа аслан бо Claude Code тартиб дода шудааст. Ҳамаи қоидаҳо дар `CLAUDE.md`. Пеш аз кор бихонед:

1. `CLAUDE.md` — қоидаҳо (тоҷикии софи матн, `index.html` натиҷаи сохта аст, ҳуқуқи китоб, пароллар).
2. `docs/peredacha.md` — чӣ тавр лоиҳа кор мекунад, ҳисобҳо, нашр, рецептҳо.
3. `docs/davom.md` — ҳолати ҷорӣ ва кори навбатӣ.
4. `docs/arxitektura.md` — меъмории код.

Пеш аз Pull Request ҳатман:
```
python3 tools/build.py
node tests/run.js
python3 tools/tojik_check.py
```
`index.html` ва `version.json` низ commit шаванд. Калид, парол, `service_role` ва ҳар чизи махфиро ба репо ё чат нависед НА.
