#!/bin/bash
# Санҷиши SQL-и docs/ дар PostgreSQL-и ВАҚТИНЧАГӣ (на Supabase-и асосӣ!).
# Истифода:  PGHOST=... PGPORT=... PGUSER=postgres tests/run-sql.sh   (ё DATABASE_URL=postgres://...)
# Тартиб ва синовҳо: docs/pre-launch/SQL-TARTIB.md. Ҳар синов дар охир ROLLBACK мекунад.
set -euo pipefail
cd "$(dirname "$0")/.."
DB="${DATABASE_URL:-}"; P=(psql -v ON_ERROR_STOP=1 -q ${DB:+"$DB"})
case "${DB:-$PGHOST}" in *supabase.co*|*supabase.com*) echo "ХАТО: ин скрипт ба Supabase-и воқеӣ намеравад"; exit 2;; esac
TMP="kt_$$"; "${P[@]}" -d postgres -c "drop database if exists $TMP" -c "create database $TMP" 2>/dev/null || true
Q=(psql -v ON_ERROR_STOP=1 -q -d "$TMP"); [ -n "$DB" ] && Q=(psql -v ON_ERROR_STOP=1 -q "${DB%/*}/$TMP")
"${Q[@]}" -f tests/sql/mock-supabase.sql
ORDER="admin nomho omor fayl poadmin aloqa ogoh zakhira reliz profil ijozat ijozat2 huquq bayroq himoya mulk maxfiyat holat metrika reyting tarbiya premium quiz"
for f in $ORDER; do [ -f docs/sql-$f.sql ] || continue; echo "== sql-$f.sql"; "${Q[@]}" -f docs/sql-$f.sql 2>&1 | grep -v NOTICE || true; done
# қайта иҷро кардан бехатар (идемпотент) аст — санҷиш:
for f in bayroq himoya mulk maxfiyat holat metrika reyting; do "${Q[@]}" -f docs/sql-$f.sql 2>&1 | grep -v NOTICE || true; done
FAIL=0
for t in docs/sql-*-test.sql; do echo "== $t"; OUT=$("${Q[@]}" -f "$t" 2>&1) || { echo "$OUT"; FAIL=1; continue; }; echo "$OUT" | grep -E 'ҲАМА ГУЗАШТ|ФАЛ' || { echo "$OUT"; FAIL=1; }; done
"${P[@]}" -d postgres -c "drop database if exists $TMP" 2>/dev/null || true
[ $FAIL -eq 0 ] && echo "SQL: ҳама синов гузашт" || { echo "SQL: синов нагузашт"; exit 1; }
