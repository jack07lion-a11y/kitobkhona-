# Skill «Super kitob sozanda»: дар ҳисоби дигар

Мақсад: дар ҳар Claude Code (ҳисоби дигар, компютери дигар) бо «/» skill пайдо шавад.

## Роҳи 1 (беҳтарин): худи репозиторий
`.claude/skills/super-kitob-sozanda/` дар `main` бошад, ҳар касе репозиторийро clone кунад ва Claude Code-ро дар он папка кушояд, `/super-kitob-sozanda` худкор пайдо мешавад.

## Роҳи 2: барои ҳамаи чатҳо дар ҳисоби худ (бе репозиторий)
```
curl -fsSL https://raw.githubusercontent.com/jack07lion-a11y/kitobkhona-/main/tools/install_skill.sh | bash
```
ё дар папкаи репозиторий: `bash tools/install_skill.sh`. Skill ба `~/.claude/skills/` нусха мешавад. Claude Code-ро аз нав кушоед.

## Талабот
- Supabase MCP-и лоиҳаи «Kitobkhona» (барои гузоштани китоб).
- `tesseract-ocr`, `tesseract-ocr-tgk`, `poppler-utils`, `python3` бо `Pillow`, `numpy`, `scipy`, `reportlab`.

Дар чати Claude.ai (на Claude Code) skill кор намекунад: фақат дар Claude Code.
