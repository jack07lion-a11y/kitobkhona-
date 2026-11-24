#!/bin/bash
# Skill «super-kitob-sozanda»-ро ба ҳисоби Claude Code-и шумо (ҳамаи лоиҳаҳо) мегузорад: баъд дар ҳар чат «/super-kitob-sozanda» пайдо мешавад.
# Истифода: bash tools/install_skill.sh   ё   curl -fsSL https://raw.githubusercontent.com/jack07lion-a11y/kitobkhona-/main/tools/install_skill.sh | bash
set -e
DST="$HOME/.claude/skills/super-kitob-sozanda"
if [ -d "$(dirname "$0")/../.claude/skills/super-kitob-sozanda" ] 2>/dev/null; then
  SRC="$(cd "$(dirname "$0")/.." && pwd)/.claude/skills/super-kitob-sozanda"
  mkdir -p "$DST"; cp -R "$SRC/." "$DST/"
else
  T=$(mktemp -d); git clone --depth 1 https://github.com/jack07lion-a11y/kitobkhona-.git "$T/r" >/dev/null 2>&1
  mkdir -p "$DST"; cp -R "$T/r/.claude/skills/super-kitob-sozanda/." "$DST/"; rm -rf "$T"
fi
echo "Тайёр: $DST"; echo "Claude Code-ро аз нав кушоед ва «/super-kitob-sozanda» нависед."
