#!/bin/bash
# Скани PDF -> расм -> матн бо ҷойгиршавӣ (tsv). Истифода: ocr.sh КИТОБ.pdf ПАПКА [dpi=200] [забон=tgk]
# Натиҷа: ПАПКА/img/p-NN.png ва ПАПКА/tsv/p-NN.tsv (ҳар саҳифа). Талаб: poppler-utils, tesseract-ocr, tesseract-ocr-tgk
set -e
PDF="$1"; OUT="$2"; DPI="${3:-200}"; LANGS="${4:-tgk}"
mkdir -p "$OUT/img" "$OUT/tsv"
pdftoppm -r "$DPI" -gray -png "$PDF" "$OUT/img/p"
export OMP_THREAD_LIMIT=1
ls "$OUT"/img/*.png | xargs -P "$(nproc)" -I{} sh -c 'b=$(basename {} .png); tesseract {} '"$OUT"'/tsv/$b -l '"$LANGS"' --psm 6 tsv >/dev/null 2>&1'
echo "саҳифа: $(ls "$OUT"/tsv | wc -l)"
