#!/usr/bin/env python3
"""Тоза кардани скани хокистарранг/пастконтраст пеш аз OCR (адаптивӣ бинаризатсия). Истифода: prep.py ПАПКА/img — ҳамон файлҳоро иваз мекунад."""
import sys,glob
import numpy as np
from PIL import Image,ImageOps
from scipy.ndimage import uniform_filter
for f in sorted(glob.glob(sys.argv[1]+'/p-*.png')):
    im=ImageOps.autocontrast(Image.open(f).convert('L'),cutoff=1);a=np.asarray(im,dtype=np.float32)
    m=uniform_filter(a,size=41);b=np.where(a<m-18,0,255).astype(np.uint8)
    Image.fromarray(b).save(f)
