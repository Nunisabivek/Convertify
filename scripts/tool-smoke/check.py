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
def _(r):
    t = r.get('text') or ''
    if 'Title' not in t or 'item one' not in t: return 'print frame did not contain the rendered markdown'


@check('compare-pdf')
def _(f, r):
    body = open(f, encoding='utf-8', errors='replace').read()
    if 'Line 1' not in body and 'difference' not in body.lower(): return 'report has no differences listed'


@check('redact-pdf')
def _(f, r):
    # A page with a redaction box is rasterized, so none of its text may survive.
    if fitz.open(f)[0].get_text().strip(): return 'text still extractable on the redacted page'


# Ads (src/lib/monetag.ts): none while the visitor works, both zones once their file is saved.
for tid, r in rep.items():
    if r.get('file') and 'adsAfter' in r:
        if r.get('adsBefore'): results[tid + ' (ads)'] = f"ads loaded before the download: {r['adsBefore']}"
        elif r['adsAfter'] != '12092107,12092189': results[tid + ' (ads)'] = f"zones after the download: {r['adsAfter'] or 'none'}, expected strong push 12092107 + vignette 12092189"
        else: results[tid + ' (ads)'] = None

smoke_failed = [k for k, r in rep.items() if not r.get('ok')]
bad = {k: v for k, v in results.items() if v}
for k, v in results.items():
    print(f"{'OK  ' if not v else 'FAIL'} {k:22} {v or ''}")
print(f'\n{len(results) - len(bad)}/{len(results)} content checks passed; smoke failures: {", ".join(smoke_failed) or "none"}')
sys.exit(1 if bad or smoke_failed else 0)
