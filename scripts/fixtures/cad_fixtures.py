"""Realistic AutoCAD-style PDF fixtures for the AutoCAD PDF editor.

    python scripts/fixtures/cad_fixtures.py [out_dir]     (default: <tmp>/convertify-cad)

Committed copies live in scripts/fixtures/cad/ (browser test: cad_e2e.mjs, PDF check: cad_verify.py).

Writes:
  cad-a1-mixed.pdf  A1 sheet: dense linework (walls, doors, hatch, stairs, grid), a title
                    block in embedded TrueType written one character per text operator,
                    SHX-style stroke text (notes, horizontal and vertical dimensions),
                    TrueType text at 90, 270 and 30 degrees, coloured text, and a page-wide
                    `cm` left open the way AutoCAD writes it.
  cad-rotate90.pdf  A3 sheet with /Rotate 90 and a MediaBox that doesn't start at 0,0.
  cad-set.pdf       Six sheets: the A1 sheet, the rotated sheet, an A0 sheet, an SHX-only
                    sheet, a detail sheet with coloured text, and a cover sheet.
  manifest.json     Ground truth: every label with page, text, kind (tt or shx), user-space
                    corners, angle and colour, for the browser tests.

Only reportlab (bundled Vera TrueType font) and PyMuPDF are needed.
"""
import json
import math
import os
import sys
import tempfile

import fitz
import reportlab
from reportlab.lib.colors import Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(tempfile.gettempdir(), 'convertify-cad')
os.makedirs(OUT, exist_ok=True)
FONTS = os.path.join(os.path.dirname(reportlab.__file__), 'fonts')
pdfmetrics.registerFont(TTFont('Vera', os.path.join(FONTS, 'Vera.ttf')))
pdfmetrics.registerFont(TTFont('VeraBd', os.path.join(FONTS, 'VeraBd.ttf')))

MM = 72 / 25.4
A0 = (1189 * MM, 841 * MM)
A1 = (841 * MM, 594 * MM)
A3 = (420 * MM, 297 * MM)
A4 = (297 * MM, 210 * MM)

# A stroke font on a 4 x 6 grid (y up), like AutoCAD's txt.shx / simplex.shx.
O = [(1, 0), (0, 1), (0, 5), (1, 6), (3, 6), (4, 5), (4, 1), (3, 0), (1, 0)]
P = [(0, 0), (0, 6), (3, 6), (4, 5), (4, 4), (3, 3), (0, 3)]
GLYPHS = {
    'A': [[(0, 0), (0, 4), (2, 6), (4, 4), (4, 0)], [(0, 3), (4, 3)]],
    'B': [[(0, 0), (0, 6), (3, 6), (4, 5), (4, 4), (3, 3), (0, 3)], [(3, 3), (4, 2), (4, 1), (3, 0), (0, 0)]],
    'C': [[(4, 5), (3, 6), (1, 6), (0, 5), (0, 1), (1, 0), (3, 0), (4, 1)]],
    'D': [[(0, 0), (0, 6), (3, 6), (4, 5), (4, 1), (3, 0), (0, 0)]],
    'E': [[(4, 6), (0, 6), (0, 0), (4, 0)], [(0, 3), (3, 3)]],
    'F': [[(4, 6), (0, 6), (0, 0)], [(0, 3), (3, 3)]],
    'G': [[(4, 5), (3, 6), (1, 6), (0, 5), (0, 1), (1, 0), (3, 0), (4, 1), (4, 3), (2, 3)]],
    'H': [[(0, 0), (0, 6)], [(4, 0), (4, 6)], [(0, 3), (4, 3)]],
    'I': [[(1, 6), (3, 6)], [(2, 6), (2, 0)], [(1, 0), (3, 0)]],
    'J': [[(4, 6), (4, 1), (3, 0), (1, 0), (0, 1)]],
    'K': [[(0, 0), (0, 6)], [(4, 6), (0, 2)], [(1, 3), (4, 0)]],
    'L': [[(0, 6), (0, 0), (4, 0)]],
    'M': [[(0, 0), (0, 6), (2, 3), (4, 6), (4, 0)]],
    'N': [[(0, 0), (0, 6), (4, 0), (4, 6)]],
    'O': [O],
    'P': [P],
    'Q': [O, [(2, 2), (4, 0)]],
    'R': [P, [(2, 3), (4, 0)]],
    'S': [[(4, 5), (3, 6), (1, 6), (0, 5), (0, 4), (1, 3), (3, 3), (4, 2), (4, 1), (3, 0), (1, 0), (0, 1)]],
    'T': [[(0, 6), (4, 6)], [(2, 6), (2, 0)]],
    'U': [[(0, 6), (0, 1), (1, 0), (3, 0), (4, 1), (4, 6)]],
    'V': [[(0, 6), (2, 0), (4, 6)]],
    'W': [[(0, 6), (1, 0), (2, 4), (3, 0), (4, 6)]],
    'X': [[(0, 0), (4, 6)], [(0, 6), (4, 0)]],
    'Y': [[(0, 6), (2, 3), (4, 6)], [(2, 3), (2, 0)]],
    'Z': [[(0, 6), (4, 6), (0, 0), (4, 0)]],
    '0': [O, [(0, 1), (4, 5)]],
    '1': [[(1, 5), (2, 6), (2, 0)], [(1, 0), (3, 0)]],
    '2': [[(0, 5), (1, 6), (3, 6), (4, 5), (4, 4), (0, 0), (4, 0)]],
    '3': [[(0, 5), (1, 6), (3, 6), (4, 5), (4, 4), (3, 3), (4, 2), (4, 1), (3, 0), (1, 0), (0, 1)], [(1, 3), (3, 3)]],
    '4': [[(3, 0), (3, 6), (0, 2), (4, 2)]],
    '5': [[(4, 6), (0, 6), (0, 3), (3, 3), (4, 2), (4, 1), (3, 0), (0, 0)]],
    '6': [[(3, 6), (1, 6), (0, 5), (0, 1), (1, 0), (3, 0), (4, 1), (4, 2), (3, 3), (0, 3)]],
    '7': [[(0, 6), (4, 6), (1, 0)]],
    '8': [[(1, 3), (0, 4), (0, 5), (1, 6), (3, 6), (4, 5), (4, 4), (3, 3), (1, 3), (0, 2), (0, 1), (1, 0), (3, 0), (4, 1), (4, 2), (3, 3)]],
    '9': [[(4, 3), (1, 3), (0, 4), (0, 5), (1, 6), (3, 6), (4, 5), (4, 1), (3, 0), (1, 0)]],
    '-': [[(1, 3), (3, 3)]],
    '.': [[(2, 0), (2, 0.5)]],
    '/': [[(0, 0), (4, 6)]],
    ':': [[(2, 1), (2, 1.5)], [(2, 4), (2, 4.5)]],
    '(': [[(3, 6), (2, 5), (2, 1), (3, 0)]],
    ')': [[(1, 6), (2, 5), (2, 1), (1, 0)]],
    '+': [[(2, 1), (2, 5)], [(0, 3), (4, 3)]],
    '=': [[(0, 2), (4, 2)], [(0, 4), (4, 4)]],
    ' ': [],
}

LABELS = []  # ground truth for manifest.json
PAGE = [0]


def rot(pt, ang):
    r = math.radians(ang)
    return (pt[0] * math.cos(r) - pt[1] * math.sin(r), pt[0] * math.sin(r) + pt[1] * math.cos(r))


def record(text, kind, x, y, angle, length, height, color=(0, 0, 0), ctm=(1, 0, 0, 1, 0, 0), descent=0.0):
    """Store the label's box in user space (after the page CTM)."""
    corners = [(0, -descent), (length, -descent), (length, height), (0, height)]
    pts = []
    for cx, cy in corners:
        rx, ry = rot((cx, cy), angle)
        ux, uy = x + rx, y + ry
        a, b, c, d, e, f = ctm
        pts.append([round(a * ux + c * uy + e, 3), round(b * ux + d * uy + f, 3)])
    LABELS.append({'page': PAGE[0], 'text': text, 'kind': kind, 'angle': angle, 'color': list(color), 'corners': pts})


def shx(c, text, x, y, h, angle=0, color=(0, 0, 0), width=0.35, ctm=(1, 0, 0, 1, 0, 0), track=True):
    """Stroke text: every letter drawn as line strokes, no text object at all."""
    k = h / 6.0
    c.saveState()
    c.translate(x, y)
    c.rotate(angle)
    c.scale(k, k)
    c.setStrokeColor(Color(*color))
    c.setLineWidth(width / k)
    c.setLineCap(1)
    c.setLineJoin(1)
    pen = 0
    for ch in text:
        for stroke in GLYPHS.get(ch, GLYPHS['-'] if ch not in GLYPHS else []):
            p = c.beginPath()
            p.moveTo(pen + stroke[0][0], stroke[0][1])
            for sx, sy in stroke[1:]:
                p.lineTo(pen + sx, sy)
            c.drawPath(p, stroke=1, fill=0)
        pen += 6
    c.restoreState()
    if track:
        record(text, 'shx', x, y, angle, (len(text) * 6 - 2) * k, h, color, ctm)


def tt_chars(c, text, x, y, size, font='Vera', color=(0, 0, 0), ctm=(1, 0, 0, 1, 0, 0), one_bt=False):
    """TrueType text one character per text operator (AutoCAD title blocks often look like this)."""
    c.setFillColor(Color(*color))
    start = x
    if one_bt:
        t = c.beginText()
        t.setFont(font, size)
        t.setFillColor(Color(*color))
        for ch in text:
            t.setTextOrigin(x, y)
            t.textOut(ch)
            x += pdfmetrics.stringWidth(ch, font, size) * 1.04  # AutoCAD's own spacing, not the font's
        c.drawText(t)
    else:
        c.setFont(font, size)
        for ch in text:
            if ch != ' ':
                c.drawString(x, y, ch)
            x += pdfmetrics.stringWidth(ch, font, size)
    record(text, 'tt', start, y, 0, x - start, size * 0.75, color, ctm, descent=size * 0.2)


def tt(c, text, x, y, size, angle=0, font='Vera', color=(0, 0, 0), ctm=(1, 0, 0, 1, 0, 0)):
    c.saveState()
    c.translate(x, y)
    c.rotate(angle)
    c.setFillColor(Color(*color))
    c.setFont(font, size)
    c.drawString(0, 0, text)
    c.restoreState()
    record(text, 'tt', x, y, angle, pdfmetrics.stringWidth(text, font, size), size * 0.75, color, ctm, descent=size * 0.2)


def floor_plan(c, x0, y0, w, h, dense=True):
    """Walls, doors, windows, hatch, stairs and a column grid: lots of short strokes."""
    c.setStrokeColor(Color(0, 0, 0))
    c.setLineWidth(0.7)
    t = 8  # wall thickness
    for off in (0, t):
        c.rect(x0 + off, y0 + off, w - 2 * off, h - 2 * off)
    cols, rows = (6, 4) if dense else (3, 2)
    cw, rh = w / cols, h / rows
    c.setLineWidth(0.5)
    for i in range(1, cols):
        x = x0 + i * cw
        c.line(x, y0 + t, x, y0 + h - t)
        c.line(x + t * 0.6, y0 + t, x + t * 0.6, y0 + h - t)
    for j in range(1, rows):
        y = y0 + j * rh
        c.line(x0 + t, y, x0 + w - t, y)
        c.line(x0 + t, y + t * 0.6, x0 + w - t, y + t * 0.6)
    # Doors: a leaf and a swing arc in every room.
    c.setLineWidth(0.3)
    for i in range(cols):
        for j in range(rows):
            dx = x0 + i * cw + cw * 0.3
            dy = y0 + j * rh + t
            c.line(dx, dy, dx, dy + 30)
            c.arc(dx - 30, dy - 30, dx + 30, dy + 30, 0, 90)
            # Furniture: tables and chairs.
            if dense:
                fx, fy = x0 + i * cw + cw * 0.55, y0 + j * rh + rh * 0.5
                c.rect(fx, fy, 40, 24)
                for k in range(4):
                    c.rect(fx + 2 + k * 10, fy + 26, 7, 7)
                    c.rect(fx + 2 + k * 10, fy - 9, 7, 7)
    # Hatched rooms (ANSI31: 45 degree lines clipped to the room).
    c.setLineWidth(0.2)
    for (i, j) in ((1, 1), (4, 2)) if dense else ((1, 0),):
        rx, ry = x0 + i * cw + t, y0 + j * rh + t
        c.saveState()
        p = c.beginPath()
        p.rect(rx, ry, cw - 2 * t, rh - 2 * t)
        c.clipPath(p, stroke=0, fill=0)
        s = -rh
        while s < cw:
            c.line(rx + s, ry, rx + s + rh, ry + rh)
            s += 4
        c.restoreState()
    # Stairs: many parallel treads.
    if dense:
        sx, sy = x0 + 2 * cw + 20, y0 + 3 * rh + 15
        for k in range(18):
            c.line(sx + k * 6, sy, sx + k * 6, sy + rh - 40)
        c.line(sx, sy + (rh - 40) / 2, sx + 17 * 6, sy + (rh - 40) / 2)
    # Column grid with bubbles (single letters: not editable labels).
    c.setLineWidth(0.25)
    c.setDash(6, 3)
    for i in range(cols + 1):
        x = x0 + i * cw
        c.line(x, y0 - 40, x, y0 + h + 40)
    c.setDash()
    for i in range(cols + 1):
        x = x0 + i * cw
        c.circle(x, y0 + h + 52, 12)
        shx(c, str(i + 1), x - 2.2, y0 + h + 48.5, 7, track=False)


def dimensions(c, x0, y0, w, h, cols, rows, unit_mm=100.0):
    """Dimension chains: lines, extension lines, ticks, and SHX values (top: horizontal, left: vertical)."""
    c.setLineWidth(0.25)
    cw, rh = w / cols, h / rows
    yd = y0 + h + 20
    c.line(x0, yd, x0 + w, yd)
    for i in range(cols + 1):
        x = x0 + i * cw
        c.line(x, yd - 4, x, yd + 4)
        c.line(x - 3, yd - 3, x + 3, yd + 3)
    for i in range(cols):
        value = str(int(round(cw / MM * unit_mm / 100) * 10))
        k = 7 / 6
        shx(c, value, x0 + i * cw + cw / 2 - (len(value) * 6 - 2) * k / 2, yd + 4, 7)
    xd = x0 - 22
    c.line(xd, y0, xd, y0 + h)
    for j in range(rows + 1):
        y = y0 + j * rh
        c.line(xd - 4, y, xd + 4, y)
        c.line(xd - 3, y - 3, xd + 3, y + 3)
    for j in range(rows):
        value = str(int(round(rh / MM * unit_mm / 100) * 10))
        k = 7 / 6
        shx(c, value, xd - 4, y0 + j * rh + rh / 2 - (len(value) * 6 - 2) * k / 2, 7, angle=90)


def title_block(c, x, y, sheet, title, ctm=(1, 0, 0, 1, 0, 0), font='Vera'):
    c.setLineWidth(0.8)
    c.rect(x, y, 300, 110)
    c.setLineWidth(0.3)
    for k in (28, 56, 84):
        c.line(x, y + k, x + 300, y + k)
    c.line(x + 150, y, x + 150, y + 56)
    tt_chars(c, 'CONVERTIFY ARCHITECTS', x + 8, y + 92, 11, font='VeraBd', ctm=ctm)
    tt_chars(c, title, x + 8, y + 64, 10, ctm=ctm, one_bt=True)
    tt_chars(c, 'DRAWN BY: J. SMITH', x + 8, y + 37, 7, ctm=ctm)
    tt_chars(c, 'DATE: 2026-03-14', x + 158, y + 37, 7, ctm=ctm)
    tt_chars(c, 'SCALE 1:100', x + 8, y + 9, 7, ctm=ctm, one_bt=True)
    tt_chars(c, 'SHEET ' + sheet, x + 158, y + 9, 9, font='VeraBd', ctm=ctm)


def border(c, w, h):
    c.setLineWidth(1.2)
    c.rect(20, 20, w - 40, h - 40)
    c.setLineWidth(0.3)
    c.rect(26, 26, w - 52, h - 52)


def sheet_a1(c):
    """A1 sheet with an AutoCAD-style page-wide scale that is never restored."""
    w, h = A1
    # AutoCAD writes plot units and one global `cm`; we use half-points and 0.5 scale.
    c._code.append('0.5 0 0 0.5 0 0 cm')
    ctm = (0.5, 0, 0, 0.5, 0, 0)
    S = 2.0
    c.saveState()
    c.scale(S, S)  # draw in points but on top of the 0.5 cm: net scale 1
    border(c, w, h)
    floor_plan(c, 140, 160, 1700, 1250)
    dimensions(c, 140, 160, 1700, 1250, 6, 4)
    c.restoreState()
    # Text written in the half-point system (net position = value / 2).
    title_block_scaled(c, w, h, ctm)
    # SHX notes in the free area at the right.
    nx = 1900
    c.saveState()
    c.scale(S, S)
    note_ctm = (1, 0, 0, 1, 0, 0)
    shx(c, 'GENERAL NOTES', nx, 1500, 10, ctm=note_ctm)
    shx(c, '1. ALL DIMENSIONS IN MM', nx, 1470, 7, ctm=note_ctm)
    shx(c, '2. VERIFY ON SITE', nx, 1452, 7, ctm=note_ctm)
    shx(c, '3. FIRE RATED DOORS: FD30', nx, 1434, 7, ctm=note_ctm)
    shx(c, 'REVISION C', nx, 1380, 9, color=(0.85, 0.05, 0.05), ctm=note_ctm)
    shx(c, 'LEVEL 2 PLAN', 700, 120, 14, ctm=note_ctm)
    # Room names: SHX inside rooms.
    shx(c, 'OFFICE 201', 200, 1300, 8)
    shx(c, 'MEETING', 500, 1300, 8)
    shx(c, 'STORE', 1500, 600, 8)
    # TrueType labels at angles and in colour.
    tt(c, 'RAMP 1:12', 1250, 450, 9, angle=30)
    tt(c, 'SERVICE DUCT', 1880, 600, 9, angle=90)
    tt(c, 'RISER R2', 1960, 900, 9, angle=270)
    tt(c, 'FIRE EXIT', 300, 700, 10, color=(0.8, 0, 0))
    tt(c, 'WATER MAIN', 900, 260, 9, color=(0, 0.25, 0.85))
    tt(c, 'ROOM A-101', 1100, 1300, 9)
    c.restoreState()


def title_block_scaled(c, w, h, ctm):
    # The page-wide 0.5 `cm` is active: write at doubled coordinates, doubled sizes.
    x, y = (w - 330) * 2, 40 * 2
    c.saveState()
    c.setLineWidth(1.6)
    c.rect(x, y, 600, 220)
    c.setLineWidth(0.6)
    for k in (56, 112, 168):
        c.line(x, y + k, x + 600, y + k)
    c.line(x + 300, y, x + 300, y + 112)
    tt_chars(c, 'CONVERTIFY ARCHITECTS', x + 16, y + 184, 22, font='VeraBd', ctm=ctm)
    tt_chars(c, 'LEVEL 2 FLOOR PLAN', x + 16, y + 128, 20, ctm=ctm, one_bt=True)
    tt_chars(c, 'DRAWN BY: J. SMITH', x + 16, y + 74, 14, ctm=ctm)
    tt_chars(c, 'DATE: 2026-03-14', x + 316, y + 74, 14, ctm=ctm)
    tt_chars(c, 'SCALE 1:100', x + 16, y + 18, 14, ctm=ctm, one_bt=True)
    tt_chars(c, 'SHEET A-201', x + 316, y + 18, 18, font='VeraBd', ctm=ctm)
    c.restoreState()


def sheet_rotated(c, offset):
    """An A3 sheet stored portrait and shown landscape through /Rotate 90."""
    w, h = A3[1], A3[0]  # portrait storage
    ox, oy = offset
    c.saveState()
    c.translate(ox, oy)
    ctm = (1, 0, 0, 1, ox, oy)
    border(c, w, h)
    # Content is drawn turned so it reads upright once the viewer rotates the page.
    c.saveState()
    c.translate(w, 0)
    c.rotate(90)
    inner = (0, 1, -1, 0, w + ox, oy)  # (x, y) -> (w - y, x) plus offset
    floor_plan(c, 120, 90, 800, 520, dense=False)
    shx(c, 'SECTION A-A', 400, 50, 12, ctm=inner)
    shx(c, 'NOTE: SEE DETAIL 4', 900, 600, 7, ctm=inner)
    tt(c, 'DETAIL SHEET D-02', 900, 60, 12, ctm=inner)
    tt(c, 'CHECKED: K. LEE', 900, 40, 8, ctm=inner)
    tt(c, 'VERTICAL TAG', 1000, 300, 8, angle=90, ctm=inner)
    c.restoreState()
    c.restoreState()


def sheet_a0(c):
    w, h = A0
    border(c, w, h)
    floor_plan(c, 200, 300, 2600, 1800, dense=False)
    tt(c, 'SITE PLAN', 1400, 2250, 24)
    shx(c, 'NORTH BOUNDARY', 1300, 2160, 12)
    tt(c, 'A0 MASTER SHEET', 2900, 120, 14)


def sheet_shx_only(c):
    w, h = A3
    border(c, w, h)
    floor_plan(c, 80, 80, 900, 600, dense=False)
    shx(c, 'SHX ONLY SHEET', 300, 740, 12)
    shx(c, 'BEDROOM 2', 150, 600, 8)
    shx(c, 'KITCHEN', 600, 300, 8)
    dimensions(c, 80, 80, 900, 600, 3, 2)


def sheet_detail(c):
    w, h = A4
    border(c, w, h)
    c.setLineWidth(0.5)
    for k in range(12):
        c.line(80, 120 + k * 22, 500, 120 + k * 22)
    tt(c, 'DETAIL 4 - WALL BASE', 80, 450, 14)
    tt(c, 'DPC 150 ABOVE FGL', 520, 300, 8, color=(0, 0.5, 0))
    tt(c, 'FIRE STOP', 520, 250, 8, color=(0.85, 0, 0))
    shx(c, 'INSULATION 100', 520, 200, 7, color=(0, 0, 0.8))


def sheet_cover(c):
    w, h = A4
    border(c, w, h)
    tt(c, 'DRAWING SET - ISSUE 3', 120, 480, 24)
    tt(c, 'PROJECT 2026-114', 120, 440, 14)
    shx(c, 'FOR TENDER', 120, 380, 14)


def build(path, sheets):
    c = canvas.Canvas(path, pageCompression=1)
    c.setAuthor('Convertify test fixture')
    c.setCreator('cad_fixtures.py (AutoCAD-style)')
    offsets = {}
    for i, (name, size, fn) in enumerate(sheets, start=1):
        PAGE[0] = i
        c.setPageSize(size)
        if name == 'rotated':
            c.setPageRotation(90)
            offsets[i] = (100, 50)
            fn(c, offsets[i])
        else:
            c.setPageRotation(0)
            fn(c)
        c.showPage()
    c.save()
    # Give the rotated sheet a MediaBox that starts at (100, 50).
    if offsets:
        doc = fitz.open(path)
        for i, (ox, oy) in offsets.items():
            pg = doc[i - 1]
            w, h = A3[1], A3[0]
            doc.xref_set_key(pg.xref, 'MediaBox', f'[{ox} {oy} {ox + w:.3f} {oy + h:.3f}]')
        doc.save(path + '.tmp', deflate=True)
        doc.close()
        os.replace(path + '.tmp', path)


def main():
    out = {}
    plans = {
        'cad-a1-mixed.pdf': [('a1', A1, sheet_a1)],
        'cad-rotate90.pdf': [('rotated', (A3[1], A3[0]), sheet_rotated)],
        'cad-set.pdf': [
            ('a1', A1, sheet_a1),
            ('rotated', (A3[1], A3[0]), sheet_rotated),
            ('a0', A0, sheet_a0),
            ('shx', A3, sheet_shx_only),
            ('detail', A4, sheet_detail),
            ('cover', A4, sheet_cover),
        ],
    }
    for name, sheets in plans.items():
        LABELS.clear()
        path = os.path.join(OUT, name)
        build(path, sheets)
        out[name] = list(LABELS)
        print(f'{name}: {os.path.getsize(path) // 1024} KB, {len(sheets)} page(s), {len(LABELS)} labels')
    with open(os.path.join(OUT, 'manifest.json'), 'w') as f:
        json.dump(out, f, indent=1)
    print('fixtures in', OUT)


if __name__ == '__main__':
    main()
