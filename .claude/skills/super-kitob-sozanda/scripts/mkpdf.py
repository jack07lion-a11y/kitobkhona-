#!/usr/bin/env python3
"""spec.json -> PDF (A5): муқова, мундариҷа, матн, расмҳо, саҳифаи ҳуқуқ дар охир.
Истифода: mkpdf.py spec.json натиҷа.pdf
spec: {title, subtitle, cover, toc(true/false), sections:[{title, blocks:[["p",матн] | ["v",[сатрҳо]] | ["fn",[шарҳҳо]] | ["img",роҳ]]}],
       legal:{rows:[[калид,қимат]], notes:[...]}}"""
import sys,json
from PIL import Image
from reportlab.lib.pagesizes import A5
from reportlab.platypus import BaseDocTemplate,PageTemplate,Frame,Paragraph,Spacer,PageBreak,Image as RLI
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY,TA_CENTER,TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm
from xml.sax.saxutils import escape
import os
D='/usr/share/fonts/truetype/dejavu/'
pdfmetrics.registerFont(TTFont('S',D+'DejaVuSerif.ttf'));pdfmetrics.registerFont(TTFont('SB',D+'DejaVuSerif-Bold.ttf'))
st=lambda **k:ParagraphStyle('x',**k)
body=st(fontName='S',fontSize=10.5,leading=15,alignment=TA_JUSTIFY,firstLineIndent=14,spaceAfter=3)
verse=st(fontName='S',fontSize=10.3,leading=15,alignment=TA_LEFT,leftIndent=28)
h1=st(fontName='SB',fontSize=16,leading=21,alignment=TA_CENTER,spaceAfter=12)
h2=st(fontName='SB',fontSize=13.5,leading=18,alignment=TA_CENTER,spaceBefore=10,spaceAfter=7)
big=st(fontName='SB',fontSize=24,leading=30,alignment=TA_CENTER)
sm=st(fontName='S',fontSize=10,leading=14,alignment=TA_CENTER,textColor='#555555')
fnst=st(fontName='S',fontSize=8.2,leading=11,textColor='#444444')
lg=st(fontName='S',fontSize=9.6,leading=13.4,spaceAfter=4)
lh=st(fontName='SB',fontSize=11.5,leading=15,spaceBefore=8,spaceAfter=4)
cap=lambda t:t[0]+t[1:].lower() if t.isupper() else t
def pic(path,maxw=A5[0]-32*mm,maxh=118*mm):
    w,h=Image.open(path).size;s=min(maxw/w,maxh/h);return RLI(path,w*s,h*s)
spec=json.load(open(sys.argv[1]));out=sys.argv[2]
doc=BaseDocTemplate(out,pagesize=A5,leftMargin=16*mm,rightMargin=16*mm,topMargin=15*mm,bottomMargin=17*mm,title=spec['title'])
def foot(c,d):
    if d.page>1:c.setFont('S',8);c.setFillGray(.5);c.drawCentredString(A5[0]/2,9*mm,str(d.page))
doc.addPageTemplates([PageTemplate(id='p',frames=[Frame(doc.leftMargin,doc.bottomMargin,doc.width,doc.height)],onPage=foot)])
E=[]
if spec.get('cover') and os.path.exists(spec['cover']): E+=[Spacer(1,4*mm),pic(spec['cover']),Spacer(1,6*mm)]
else: E+=[Spacer(1,40*mm)]
E+=[Paragraph(escape(spec['title']),big),Spacer(1,4*mm),Paragraph(escape(spec.get('subtitle','')),sm),PageBreak()]
titles=[s['title'] for s in spec['sections'] if s.get('title')]
if spec.get('toc') and len(titles)>1:
    E.append(Paragraph('Мундариҷа',h1));E+=[Paragraph(f'{i}. {escape(cap(t))}',st(fontName='S',fontSize=10.5,leading=15.5)) for i,t in enumerate(titles,1)];E.append(PageBreak())
if len(spec['sections'])==1 and not spec['sections'][0].get('title'): E.append(Paragraph(escape(spec['title']),h1))
for s in spec['sections']:
    if s.get('title'):E.append(Paragraph(escape(cap(s['title'])),h2))
    for k,v in s['blocks']:
        if k=='p':E.append(Paragraph(escape(v),body))
        elif k=='v':E+=[Spacer(1,3)]+[Paragraph(escape(x),verse) for x in v]+[Spacer(1,4)]
        elif k=='fn':E+=[Spacer(1,3)]+[Paragraph('<i>'+escape(x)+'</i>',fnst) for x in v]
        elif k=='sub':E.append(Paragraph('<b>'+escape(v)+'</b>',st(fontName='SB',fontSize=10.5,leading=14,alignment=TA_CENTER,spaceBefore=6,spaceAfter=3)))
        elif k=='img':E+=[Spacer(1,3),pic(v,maxh=95*mm),Spacer(1,5)]
L=spec.get('legal')
if L:
    E+=[PageBreak(),Paragraph('Маълумоти китоб ва ҳуқуқ (барои идоракунӣ)',h1)]
    E+=[Paragraph(f'<b>{escape(k)}:</b> {escape(v)}',lg) for k,v in L['rows']]
    E.append(Paragraph('Ба эътибор',lh));E+=[Paragraph('• '+escape(n),lg) for n in L['notes']]
doc.build(E);print('PDF тайёр:',out)
