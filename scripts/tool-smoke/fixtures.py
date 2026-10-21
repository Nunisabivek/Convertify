"""Generate the input files for smoke.cjs into $SMOKE_DIR/fx (default <os tmp>/convertify-smoke/fx).

Needs: pip install pymupdf reportlab openpyxl pillow pillow-heif   (pillow-heif only for the HEIC sample)
"""
import os, sys, zipfile, json, datetime, shutil, tempfile
from PIL import Image, ImageDraw
import fitz
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import openpyxl

FX = os.path.join(os.environ.get('SMOKE_DIR') or os.path.join(tempfile.gettempdir(), 'convertify-smoke'), 'fx')
os.makedirs(FX, exist_ok=True)
p = lambda n: os.path.join(FX, n)

# 3-page text PDF
c = canvas.Canvas(p('text.pdf'), pagesize=A4)
for i in range(3):
    c.setFont('Helvetica-Bold', 20); c.drawString(72, 770, f'Invoice page {i + 1}')
    c.setFont('Helvetica', 11)
    for j in range(30):
        c.drawString(72, 740 - j * 18, f'Line {j + 1}: Item {j}  Qty {j % 5 + 1}  Price {j * 3.5:.2f}  Confidential sample text')
    c.showPage()
c.save()

# photo-like JPG and image variants
img = Image.new('RGB', (1200, 1600), (210, 200, 185))
d = ImageDraw.Draw(img)
d.ellipse((350, 300, 850, 900), fill=(224, 172, 140))   # face
d.rectangle((300, 900, 900, 1600), fill=(40, 60, 120))  # shoulders
d.ellipse((480, 520, 540, 580), fill=(30, 30, 30)); d.ellipse((660, 520, 720, 580), fill=(30, 30, 30))
img.save(p('photo.jpg'), quality=92)
img.save(p('pic.webp'), quality=90)
img.convert('RGB').save(p('pic.bmp'))
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
    img.save(p('photo.heic'), quality=80)
except ImportError:
    print('pillow-heif not installed: skipping photo.heic (heic-to-jpg will fail)')

# A phone-style photo stored sideways with EXIF orientation 6; the red band marks the stored top.
rot = Image.new('RGB', (400, 300), (200, 220, 255))
ImageDraw.Draw(rot).rectangle((0, 0, 399, 40), fill=(255, 0, 0))
exif = Image.Exif(); exif[0x0112] = 6
rot.save(p('rotated6.jpg'), exif=exif.tobytes(), quality=90)

alpha = Image.new('RGBA', (800, 600), (0, 0, 0, 0))
da = ImageDraw.Draw(alpha)
da.rectangle((100, 100, 700, 500), fill=(30, 120, 220, 255)); da.text((300, 280), 'PNG WITH ALPHA', fill=(255, 255, 255, 255))
alpha.save(p('alpha.png'))
Image.new('RGB', (900, 1200), (250, 250, 250)).save(p('page2.png'))

frames = [Image.new('RGB', (200, 200), col) for col in [(255, 0, 0), (0, 255, 0), (0, 0, 255)]]
frames[0].save(p('anim.gif'), save_all=True, append_images=frames[1:], duration=200, loop=0)
t1 = img.resize((600, 800)); t2 = Image.new('RGB', (600, 800), (240, 240, 255))
t1.save(p('scan.tiff'), save_all=True, append_images=[t2])

open(p('logo.svg'), 'w').write('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="#2563eb"/><text x="100" y="110" font-size="32" text-anchor="middle" fill="#fff">C</text></svg>')

# image-only "scanned" PDF and a password-protected PDF
doc = fitz.open(); pg = doc.new_page(width=595, height=842); pg.insert_image(pg.rect, filename=p('photo.jpg')); doc.save(p('scan.pdf'))
doc = fitz.open(p('text.pdf')); doc.save(p('locked.pdf'), encryption=fitz.PDF_ENCRYPT_AES_256, user_pw='1234', owner_pw='owner5678')

# docx (minimal valid WordprocessingML)
paras = ''.join(f'<w:p><w:r><w:t xml:space="preserve">Paragraph {i}: The quick brown fox jumps over the lazy dog. Résumé café — “quotes”.</w:t></w:r></w:p>' for i in range(1, 25))
with zipfile.ZipFile(p('letter.docx'), 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
    z.writestr('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
    z.writestr('word/document.xml', f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Cover Letter</w:t></w:r></w:p>{paras}</w:body></w:document>')

# wide xlsx with dates and long text
wb = openpyxl.Workbook(); ws = wb.active; ws.title = 'Sales'
ws.append([f'Column {i}' for i in range(1, 13)])
for r in range(40):
    row = [datetime.date(2024, 1, 1 + r % 28), r * 1234.5, 'A fairly long product description that would have been truncated at twenty characters'] + [f'v{r}-{c}' for c in range(9)]
    ws.append(row)
ws['A2'].number_format = 'dd-mmm-yyyy'
wb.save(p('sheet.xlsx'))

open(p('data.csv'), 'w').write('name,age,city\nAsha,31,Pune\nRavi,45,"Delhi, NCR"\n')
json.dump([{'name': 'Asha', 'age': 31, 'city': 'Pune'}, {'name': 'Ravi', 'age': 45, 'city': 'Delhi'}], open(p('data.json'), 'w'))
open(p('data.xml'), 'w').write('<people><person id="1"><name>Asha</name><age>31</age></person><person id="2"><name>Ravi</name><age>45</age></person></people>')
open(p('notes.txt'), 'w').write('\n'.join(f'Line {i}: plain text for printing.' for i in range(120)))
open(p('readme.md'), 'w').write('# Title\n\nSome **bold** and *italic*.\n\n- item one\n- item two\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n```js\nconsole.log(1)\n```\n' + '\nMore text paragraph.\n' * 80)
open(p('page.html'), 'w').write('<html><head><style>p{color:red}</style></head><body><h1>Hello</h1>' + '<p>Paragraph of html text that should wrap across several lines in the PDF output.</p>' * 120 + '<script>var leaked=1</script></body></html>')
shutil.copy(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'fixtures', 'sample-cad-labels.pdf'), p('cad.pdf'))
print(f'{len(os.listdir(FX))} fixtures in {FX}')
