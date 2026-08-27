#!/usr/bin/env python3
"""Build Android adaptive + density launcher icons from public/images/Convertify.png."""

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "images" / "Convertify.png"
RES = ROOT / "android" / "app" / "src" / "main" / "res"
BRAND = (2, 110, 255, 255)  # sampled from Convertify.png
DENSITIES = {
    "mdpi": 1.0,
    "hdpi": 1.5,
    "xhdpi": 2.0,
    "xxhdpi": 3.0,
    "xxxhdpi": 4.0,
}


def extract_mark(src: Image.Image) -> Image.Image:
    """Keep the white C; turn the blue field transparent."""
    src = src.convert("RGBA")
    pixels = src.load()
    w, h = src.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            # Blue field (and anti-aliased blue) → transparent.
            if b > 180 and b > r + 40 and b > g:
                pixels[x, y] = (255, 255, 255, 0)
            else:
                pixels[x, y] = (255, 255, 255, 255)
    bbox = src.getbbox()
    if not bbox:
        raise SystemExit("No glyph found in Convertify.png")
    return src.crop(bbox)


def fit_in_safe_zone(mark: Image.Image, canvas: int, safe_ratio: float = 0.62) -> Image.Image:
    """Place the C in the adaptive-icon safe zone (inner ~66%)."""
    out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    max_side = int(canvas * safe_ratio)
    mw, mh = mark.size
    scale = min(max_side / mw, max_side / mh)
    size = (max(1, int(mw * scale)), max(1, int(mh * scale)))
    fitted = mark.resize(size, Image.Resampling.LANCZOS)
    x = (canvas - fitted.width) // 2
    y = (canvas - fitted.height) // 2
    out.paste(fitted, (x, y), fitted)
    return out


def composite_full(fg: Image.Image) -> Image.Image:
    bg = Image.new("RGBA", fg.size, BRAND)
    return Image.alpha_composite(bg, fg)


def circle_mask(image: Image.Image) -> Image.Image:
    size = image.size[0]
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    out = image.copy()
    out.putalpha(mask)
    return out


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG")
    print(f"wrote {path.relative_to(ROOT)} ({image.size[0]}x{image.size[1]})")


def main() -> None:
    mark = extract_mark(Image.open(SRC))
    for name, density in DENSITIES.items():
        mipmap = RES / f"mipmap-{name}"
        launcher = int(round(48 * density))
        foreground = int(round(108 * density))
        fg = fit_in_safe_zone(mark, foreground)
        full = composite_full(fit_in_safe_zone(mark, launcher, safe_ratio=0.78))
        save_png(full.convert("RGB").convert("RGBA"), mipmap / "ic_launcher.png")
        save_png(circle_mask(full), mipmap / "ic_launcher_round.png")
        save_png(fg, mipmap / "ic_launcher_foreground.png")


if __name__ == "__main__":
    main()
