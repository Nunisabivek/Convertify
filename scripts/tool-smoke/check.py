"""Open each output from smoke.cjs and check its content, not just its file type.

Each check targets a bug that once shipped. Run after smoke.cjs; reads $SMOKE_DIR/smoke.json.
Needs: pip install pymupdf openpyxl pillow
"""
import json, os, re, sys, tempfile, zipfile
import fitz, openpyxl
from PIL import Image

DIR = os.environ.get('SMOKE_DIR') or os.path.join(tempfile.gettempdir(), 'convertify-smoke')
rep = json.load(open(os.path.join(DIR, 'smoke.json'), encoding='utf-8'))
results = {}


def check(tid):
    def wrap(fn):
        r = rep.get(tid)
        if r is None:
            return fn  # not part of this run
        f = os.path.join(DIR, 'out', tid.replace('#', '_') + '__' + r['file']) if r.get('file') else None
        if fn.__code__.co_argcount == 2 and (not f or not os.path.exists(f)):
            results[tid] = 'no output file'
            return fn
        try:
            msg = fn(f, r) if fn.__code__.co_argcount == 2 else fn(r)
            results[tid] = msg
        except Exception as e:
            results[tid] = f'error: {e}'
        return fn
    return wrap


def text(f):
    d = fitz.open(f)
    return d, '\n'.join(pg.get_text() for pg in d)


@check('excel-to-pdf')
def _(f, r):
    d, t = text(f)
    flat = re.sub(r'\s+', ' ', t)
    if 'Column 12' not in flat: return 'columns dropped (Column 12 missing)'
    if 'truncated at twenty characters' not in flat: return 'long cell text cut off'
    if '01-Jan-2024' not in flat: return 'formatted date missing (serial number printed?)'


@check('html-to-pdf')
def _(f, r):
    d, t = text(f)
    if d.page_count < 2: return f'all text on {d.page_count} page'
    if 'color:red' in t or 'leaked' in t: return '<style>/<script> text in the PDF'


@check('text-to-pdf')
def _(f, r):
    d, t = text(f)
    if 'Line 119' not in t: return 'last line missing'


@check('word-to-pdf')
def _(f, r):
    d, t = text(f)
    if 'Paragraph 24' not in t or 'Résumé' not in t: return 'document text missing'


def a4(f):
    w, h = fitz.open(f)[0].rect.width, fitz.open(f)[0].rect.height
    if abs(w - 595) > 2 or abs(h - 842) > 2: return f'page is {w:.0f}x{h:.0f}pt, not A4 595x842'


@check('compress-pdf#raster')
def _(f, r):
    # CMYK photo: the page-to-picture fallback runs. Pages were once re-sized to the render's pixel count (1.5x A4).
    if r.get('bytes', 0) > 200 * 1024: return f"{r['bytes'] // 1024} KB, over the 200 KB default target"
    return a4(f)


@check('compress-pdf#text')
def _(f, r):
    # Photo-heavy PDF with real text: the photo shrinks, the text stays a text layer.
    d, t = text(f)
    if r.get('bytes', 0) > 200 * 1024: return f"{r['bytes'] // 1024} KB, over the 200 KB default target"
    if 'Invoice 4471' not in t: return 'text layer lost (pages were rasterised)'
    return a4(f)


@check('watermark-pdf')
def _(f, r):
    pg = fitz.open(f)[0]
    words = [w for w in pg.get_text('words') if not re.match(r'(Invoice|Line|Item|Qty|Price|Confidential|sample|text|page|\d)', w[4])]
    if not words: return 'watermark text not found'
    cx = (min(w[0] for w in words) + max(w[2] for w in words)) / 2
    cy = (min(w[1] for w in words) + max(w[3] for w in words)) / 2
    off = ((cx - pg.rect.width / 2) ** 2 + (cy - pg.rect.height / 2) ** 2) ** 0.5
    if off > 30: return f'stamp is {off:.0f}pt off centre'


@check('image-compressor')
def _(f, r):
    px = Image.open(f).convert('RGB').getpixel((10, 10))  # a transparent corner of alpha.png
    if min(px) < 240: return f'transparent area became {px}'


@check('pdf-to-excel')
def _(f, r):
    ws = openpyxl.load_workbook(f).worksheets[0]
    cells = [c for row in ws.iter_rows(values_only=True) for c in row if isinstance(c, str)]
    if not any('Confidential sample text' in c and c.startswith('Line') for c in cells): return 'a sentence was split across cells'


@check('merge-pdf#exif')
def _(f, r):
    pg = fitz.open(f)[-1]
    if pg.rect.width >= pg.rect.height: return f'photo page {pg.rect.width:.0f}x{pg.rect.height:.0f}: still sideways'


@check('jpg-to-pdf#exif')
def _(f, r):
    pg = fitz.open(f)[0]
    if pg.rect.width >= pg.rect.height: return f'page {pg.rect.width:.0f}x{pg.rect.height:.0f}: photo still sideways'


@check('merge-pdf#locked')
def _(f, r):
    d = fitz.open(f)
    if not r.get('prompted'): return 'no password prompt'
    if d.needs_pass or d.page_count != 6: return f'pages={d.page_count} encrypted={d.needs_pass}'


for tid in ('split-pdf#locked', 'rotate-pdf#locked'):
    @check(tid)
    def _(f, r):
        if not r.get('prompted'): return 'no password prompt'


@check('rotate-pdf')
def _(f, r):
    rot = [pg.rotation for pg in fitz.open(f)]
    if any(x != 90 for x in rot): return f'rotations {rot}'


@check('pdf-to-powerpoint')
def _(f, r):
    xml = zipfile.ZipFile(f).read('ppt/slides/slide1.xml').decode()
    frames = [tuple(map(int, m)) for m in re.findall(r'<a:off x="(\d+)" y="(\d+)"/>\s*<a:ext cx="(\d+)" cy="(\d+)"', xml)]
    x, y, cx, cy = max(frames, key=lambda fr: fr[2] * fr[3])
    if abs(cx / cy - 595 / 842) > 0.02: return f'page aspect {cx / cy:.2f}, A4 is 0.71 (stretched)'


@check('png-to-pdf#a4')
def _(f, r):
    sizes = {(round(pg.rect.width), round(pg.rect.height)) for pg in fitz.open(f)}
    if not sizes <= {(595, 842), (842, 595)}: return f'page sizes {sizes}, expected A4'


@check('pdf-to-jpg#max')
def _(f, r):
    z = zipfile.ZipFile(f)
    w, h = Image.open(z.open(sorted(z.namelist())[0])).size
    if abs(w - 2480) > 10: return f'page 1 is {w}x{h}px, expected ~2480 wide (A4 at 300 DPI)'


@check('resize-image')
def _(f, r):
    if r.get('kind') != 'jpg': return f'JPEG input came out as {r.get("kind")}'


@check('protect-pdf')
def _(f, r):
    if not fitz.open(f).needs_pass: return 'output is not encrypted'


@check('unlock-pdf')
def _(f, r):
    if fitz.open(f).needs_pass: return 'output still encrypted'


@check('autocad-pdf-editor')
def _(f, r):
    d, t = text(f)
    if 'ROOM B-202' not in t: return 'edited label missing'
    # By design the editor hides the old label under a white box (the copy says so); check it's covered.
    pg = d[0]
    for old in pg.search_for('ROOM A-101'):
        covered = any(dr.get('fill') and min(dr['fill']) > 0.95 and dr['rect'].contains(old) for dr in pg.get_drawings())
        if not covered: return 'old label still visible (not covered)'


@check('markdown-to-pdf')
def _(f, r):
    # Was a print dialog; now a real PDF. Markup must be rendered, not printed literally.
    d, t = text(f)
    for want in ('Title', 'item one', 'console.log(1)', 'More text paragraph.'):
        if want not in t: return f'{want!r} missing from the PDF'
    if '**' in t or '```' in t or '|---' in t: return 'markdown syntax printed literally'
    if not any('Bold' in fnt[3] for fnt in d[0].get_fonts()): return 'no bold font: headings/bold not styled'


@check('compare-pdf')
def _(f, r):
    body = open(f, encoding='utf-8', errors='replace').read()
    if 'Line 1' not in body and 'difference' not in body.lower(): return 'report has no differences listed'


@check('redact-pdf')
def _(f, r):
    # A page with a redaction box is rasterized, so none of its text may survive.
    if fitz.open(f)[0].get_text().strip(): return 'text still extractable on the redacted page'


# Ads (src/lib/monetag.ts): once the file is saved, the vignette plus exactly one In-Page Push.
# The regular push (12092108) loads after 8 s on every page, so on a tool that takes longer it is
# already there and the strong one (12092107) is skipped rather than stacked.
for tid, r in rep.items():
    if r.get('file') and 'adsAfter' in r:
        if r.get('adsBefore'): results[tid + ' (ads)'] = f"ads loaded before the download: {r['adsBefore']}"
        elif r['adsAfter'] not in ('12092107,12092189', '12092108,12092189'): results[tid + ' (ads)'] = f"zones after the download: {r['adsAfter'] or 'none'}, expected one push (12092107 or 12092108) + vignette 12092189"
        else: results[tid + ' (ads)'] = None

smoke_failed = [k for k, r in rep.items() if not r.get('ok')]
bad = {k: v for k, v in results.items() if v}
for k, v in results.items():
    print(f"{'OK  ' if not v else 'FAIL'} {k:22} {v or ''}")
print(f'\n{len(results) - len(bad)}/{len(results)} content checks passed; smoke failures: {", ".join(smoke_failed) or "none"}')
sys.exit(1 if bad or smoke_failed else 0)
