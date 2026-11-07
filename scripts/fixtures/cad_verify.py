"""Checks the PDFs exported by cad_e2e.mjs with PyMuPDF.

    python scripts/fixtures/cad_verify.py <fixtures_dir> <out_dir>

For every edit: the new text exists near the original label, at its angle and
colour; the old text is gone from the PDF or hidden under a paper-coloured box
(SHX strokes can only be covered). For every markup: a vector drawing (not an
image) of the right kind and colour at the place it was drawn, through /Rotate and
offset boxes. Prints one line per check and a summary; exit code 1 on failure.
"""
import json
import math
import os
import sys

import fitz

sys.stdout.reconfigure(encoding='utf-8')
FX, OUT = sys.argv[1], sys.argv[2]
res = json.load(open(os.path.join(OUT, 'expect.json')))
fails = 0
total = 0


def check(name, ok, detail=''):
    global fails, total
    total += 1
    if not ok:
        fails += 1
    print(('PASS  ' if ok else 'FAIL  ') + name + (f'  — {detail}' if detail else ''))


def rgb(c):
    return ((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255


def spans(page):
    for b in page.get_text('dict')['blocks']:
        for ln in b.get('lines', []):
            for s in ln['spans']:
                yield s, ln['dir']


def user_to_fitz(page):
    # PyMuPDF's transformation_matrix ignores a MediaBox that doesn't start at 0,0;
    # build user space -> unrotated page coordinates from the raw boxes instead.
    doc = page.parent
    raw = lambda k: doc.xref_get_key(page.xref, k)
    box = raw('CropBox') if raw('CropBox')[0] != 'null' else raw('MediaBox')
    x0, y0, x1, y1 = [float(v) for v in box[1].strip('[]').split()]
    return fitz.Matrix(1, 0, 0, -1, -x0, y1)


def label_rect(page, corners):
    T = user_to_fitz(page)
    pts = [fitz.Point(x, y) * T for x, y in corners]
    return fitz.Rect(min(p.x for p in pts), min(p.y for p in pts), max(p.x for p in pts), max(p.y for p in pts))


def covered(page, rect, frac=0.9):
    for dr in page.get_drawings():
        f = dr.get('fill')
        if f and min(f) > 0.9 and (dr.get('fill_opacity') or 1) > 0.99:
            inter = fitz.Rect(dr['rect']) & rect
            if not inter.is_empty and inter.get_area() >= frac * rect.get_area():
                return True
    return False


for f in res['files']:
    doc = fitz.open(f['out'])
    name = os.path.basename(f['out'])
    imgs = sum(len(p.get_images()) for p in doc)
    check(f'{name}: no images added', imgs == 0, f'{imgs} images')
    for e in f['edits']:
        page = doc[e['page'] - 1]
        lr = label_rect(page, e['corners'])
        size = max(4.0, min(lr.width, lr.height))
        tag = f"{name} p{e['page']} {e['old']!r} ({e['kind']} {e['angle']}°)"
        new_rects = []
        if e['new']:
            best = None
            for s, d in spans(page):
                if e['new'] in s['text']:
                    r = fitz.Rect(s['bbox'])
                    dist = math.hypot((r.x0 + r.x1) / 2 - (lr.x0 + lr.x1) / 2, (r.y0 + r.y1) / 2 - (lr.y0 + lr.y1) / 2)
                    if best is None or dist < best[0]:
                        best = (dist, s, d, r)
            if not best:
                check(f'{tag} → {e["new"]!r} present', False, 'not found')
                continue
            dist, s, d, r = best
            new_rects.append(r)
            ang = math.degrees(math.atan2(-d[1], d[0])) % 360
            (ax, ay), (bx, by) = e['corners'][0], e['corners'][1]
            want = round(math.degrees(math.atan2(by - ay, bx - ax))) % 360  # user-space reading direction
            dang = min(abs(ang - want), 360 - abs(ang - want))
            near = (r & fitz.Rect(lr.x0 - size, lr.y0 - size, lr.x1 + size, lr.y1 + size)).get_area() > 0.3 * r.get_area()
            col = rgb(s['color'])
            want_col = e.get('color') or [0, 0, 0]
            dcol = max(abs(a - b) for a, b in zip(col, want_col))
            check(f'{tag} → {e["new"]!r} placed', near and dang < 3 and dcol < 0.2,
                  f'offset {dist:.1f}pt, angle {ang:.0f}° (want {want}), colour {tuple(round(c, 2) for c in col)} (want {tuple(want_col)}), size {s["size"]:.1f}')
        # Old text: gone or covered.
        if e['kind'] == 'tt':
            hits = [h for h in page.search_for(e['old']) if not any((h & nr).get_area() > 0.3 * h.get_area() for nr in new_rects)]
            left = [h for h in hits if not covered(page, h, 0.98)]
            check(f'{tag} original removed or covered', not left, f'{len(hits)} remaining hit(s), {len(left)} uncovered')
        else:
            check(f'{tag} SHX strokes covered', covered(page, lr, 0.9), f'label rect {tuple(round(v) for v in lr)}')

    # Markups: vector drawings in the markup colour at the drawn place.
    want = (224 / 255, 0, 0)
    is_red = lambda c: c is not None and max(abs(a - b) for a, b in zip(c, want)) < 0.05
    for pno in sorted({1}):
        page = doc[pno - 1]
        R = page.rotation_matrix
        dr = page.get_drawings()
        red = [d for d in dr if is_red(d.get('color')) or is_red(d.get('fill'))]
        text = page.get_text()
        for m in f['markups']:
            k = m['kind']
            if 'a' in m:
                ex = fitz.Rect(min(m['a']['x'], m['b']['x']), min(m['a']['y'], m['b']['y']), max(m['a']['x'], m['b']['x']), max(m['a']['y'], m['b']['y']))
                def disp(d):
                    return fitz.Rect(d['rect']) * R
                cands = [d for d in red if (disp(d) & fitz.Rect(ex.x0 - 12, ex.y0 - 12, ex.x1 + 12, ex.y1 + 12)).get_area() > 0]
                if k == 'rect':
                    ok = any(abs(disp(d).x0 - ex.x0) < 2 and abs(disp(d).y1 - ex.y1) < 2 and abs(disp(d).width - ex.width) < 4 and not d.get('fill') for d in cands)
                elif k == 'highlight':
                    ok = any(d.get('fill') and abs((d.get('fill_opacity') or 1) - 0.35) < 0.02 and abs(disp(d).x0 - ex.x0) < 1 and abs(disp(d).y0 - ex.y0) < 1 for d in cands)
                elif k == 'cloud':
                    ok = any(any(it[0] == 'c' for it in d['items']) and abs(disp(d).width - ex.width) < 0.25 * ex.width + 20 for d in cands)
                else:  # arrow: shaft and head together span tail to tip
                    u = fitz.Rect()
                    for d in cands:
                        u |= disp(d)
                    ok = bool(cands) and abs(u.x0 - ex.x0) < 3 and abs(u.y0 - ex.y0) < 3 and abs(u.x1 - ex.x1) < 3 and abs(u.y1 - ex.y1) < 3
                got = [tuple(round(v) for v in disp(d)) for d in cands][:3]
                check(f'{name} {k} markup is a vector drawing at the drawn place', ok, f'want {tuple(round(v) for v in ex)}, near: {got}')
            else:
                ok = m['text'] in text.replace('\n', ' ') or m['text'] in text
                check(f'{name} {k} markup text {m["text"]!r}', ok)

print(f'{total - fails}/{total} PDF checks passed')
sys.exit(1 if fails else 0)
