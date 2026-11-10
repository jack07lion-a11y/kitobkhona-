# SQL: тартиби иҷро (Supabase → SQL Editor → ҳар файл алоҳида → Run)

**Осон йўл (14–19 ва синовҳо):** `docs/pre-launch/supabase/` дар се файл:
1. `1-tekshiruv.sql` — санҷиши пешакӣ (ҳама `ok = true`).
2. `2-ishga-tushirish.sql` — 14–19 дар як файл.
3. `3-sinov.sql` — се синов (ROLLBACK).

Аввал: **Settings → Database → Backups** (ё `pg_dump`): нусхаи захира гиред. Ҳамаи файлҳо такроран иҷро шуда метавонанд (`if not exists` / `create or replace`).
Ҳар файл бо «Run» — хато бошад, ТАВАҚҚУФ кунед ва ба ман нависед, давом надиҳед.

| № | Файл | Чӣ мекунад | Агар аллакай иҷро шуда бошад |
|---|---|---|---|
| 1 | `sql-admin.sql` | профилҳо, нақшҳо, китобҳо | иҷро шудааст (эҳтимол) |
| 2 | `sql-nomho.sql` | номҳои беҳамто | " |
| 3 | `sql-omor.sql` | омор, `app_flags` | " |
| 4 | `sql-fayl.sql` | Storage `books` | " |
| 5 | `sql-poadmin.sql` | ёрдамчӣ, `is_staff` | " |
| 6 | `sql-aloqa.sql` | хато/пешниҳод, омори хондан, хабарҳо | " |
| 7 | `sql-ogoh.sql` | огоҳиномаҳо | " |
| 8 | `sql-zakhira.sql` | эслатмаи захира | " |
| 9 | `sql-reliz.sql` | нашри APK | " |
| 10 | `sql-profil.sql` | профил, аватар | " |
| 11 | `sql-ijozat.sql` | иҷозатҳои ёрдамчӣ | " |
| 12 | `sql-ijozat2.sql` | `has_perm` | " |
| 13 | `sql-huquq.sql` | ҳуқуқҳои ёрдамчӣ | " |
| **14** | **`sql-bayroq.sql`** | байроқҳои «Ба зудӣ» (`app_flags.feat`, `set_feat`) | **НАВ** |
| **15** | **`sql-himoya.sql`** | Премиум: `premium_until`, ҳимояи Storage, `set_premium` | **НАВ** |
| **16** | **`sql-mulk.sql`** | ҳуқуқи китоб (ҳолат, манба, нашр) + қоидаи «pending = нашр нест» | **НАВ** |
| **17** | **`sql-maxfiyat.sql`** | розигӣ, синну сол, `delete_me` | **НАВ** |
| **18** | **`sql-holat.sql`** | `user_state`, `sync_state` | **НАВ** |
| **19** | **`sql-metrika.sql`** | воронка, `app_installs` | **НАВ** |

## Санҷиш (баъд аз 14–19)
Ҳар якро алоҳида Run кунед; натиҷа: `NOTICE: ҲАМА ГУЗАШТ (…)` ё хато бо «ФАЛ: …». Ҳама дар охир `ROLLBACK` мекунанд: маълумоти воқеиро тағйир намедиҳанд.
1. `sql-himoya-test.sql` (ҳимояи Премиум)
2. `sql-holat-test.sql` (синхронизатсия)
3. `sql-boshqa-test.sql` (ҳуқуқ, байроқ, розигӣ, воронка, нест кардан)

Агар `insert into auth.users(id, email)` дар синов хато диҳад (сутунҳои иловагӣ дар версияи Supabase): ба ман хаторо нависед, синовро мутобиқ мекунам.

## Баъд аз 16 (`sql-mulk.sql`)
Китобҳои аллакай нашршуда нашрӣ мемонанд, аммо `rights_status = 'pending'` мегиранд. Рӯйхат: `select id, t, a from books where published and rights_status = 'pending';` — барои ҳар кадом `docs/pre-launch/books_rights.csv`-ро пур кунед ва дар барнома (Идоракунӣ → Китобҳо → Таҳрир) ҳолатро гузоред.

## Худи ин бранч дар PostgreSQL-и маҳаллӣ санҷида шуд
`tests/run-sql.sh` (бо `tests/sql/mock-supabase.sql`: `auth`, `storage`, нақшҳои `anon`/`authenticated`) ҳамаи 19 файлро ба тартиб, такроран ва ҳар се синовро иҷро кард. Ин Supabase-и воқеӣ НЕСТ: фарқият дар версия ва `auth.users` имконпазир аст — барои ҳамин санҷиши шумо дар Supabase ҳатмист.
