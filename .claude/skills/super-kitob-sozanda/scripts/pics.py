#!/usr/bin/env python3
"""Расмҳои дохили саҳифаҳои скан (на матн)-ро меёбад ва мебурад.
Истифода: pics.py ПАПКА(OCR) ПАПКА_НАТИҶА [саҳифа-аз саҳифа-то]
Роҳ: сиёҳии матни боварибахш (conf>=75) пӯшонида мешавад, боқӣ (расм) ҷамъ карда мешавад, қуттиҳои калон бурида мешаванд.
БАРОИ ҲАР КИТОБ: ҳатман хулосаро бо чашм санҷед (чанд қуттӣ нодуруст шуда метавонад)."""
import sys,csv,os,glob
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
src,out=sys.argv[1],sys.argv[2]
a0=int(sys.argv[3]) if len(sys.argv)>3 else 1; a1=int(sys.argv[4]) if len(sys.argv)>4 else 9999
os.makedirs(out,exist_ok=True)
for f in sorted(glob.glob(src+'/img/p-*.png')):
    p=int(f[-6:-4]) if f[-7]=='-' else int(os.path.basename(f)[2:-4])
    if p<a0 or p>a1: continue
    im=Image.open(f).convert('L'); a=np.array(im); H,W=a.shape
    ink=a<140; ink[:int(H*.03)]=False; ink[int(H*.95):]=False
    m=np.zeros_like(ink); tsv=f.replace('/img/','/tsv/')[:-4]+'.tsv'
    for r in list(csv.reader(open(tsv),delimiter='\t',quoting=csv.QUOTE_NONE))[1:]:
        if len(r)>=12 and r[0]=='5' and r[11].strip() and float(r[10])>=75 and int(r[9])<90 and int(r[8])<700:
            x,y,w,h=map(int,r[6:10]); m[max(0,y-3):y+h+3,max(0,x-3):x+w+3]=True
    d=ndi.binary_dilation(ink&~m,structure=np.ones((31,31))); lab,n=ndi.label(d)
    k=0
    for i,sl in enumerate(ndi.find_objects(lab)):
        h=sl[0].stop-sl[0].start; w=sl[1].stop-sl[1].start
        if h>300 and w>300 and (ink&~m)[sl].sum()>9000:
            im.crop((sl[1].start,sl[0].start,sl[1].stop,sl[0].stop)).save(f'{out}/p{p:02d}_{k}.png'); k+=1
    if k: print('саҳифа',p,'расм',k)
