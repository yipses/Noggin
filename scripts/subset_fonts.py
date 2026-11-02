"""
subset_fonts.py: builds the app's fonts in assets/fonts/ from the
@expo-google-fonts packages (dev dependencies).

The full Klee One and M PLUS Rounded 1c files carry complete Japanese glyph
sets (about 26 MB together), which made the web preview download for minutes
on a phone and bloats the app. We keep Latin, Latin-1, Latin Extended-A,
common punctuation, and the math signs the drills print. Names typed in other
scripts fall back to the system font (design.md section 10: per script
fallback).

Usage:  pip install fonttools && python3 scripts/subset_fonts.py
        (or: npm run fonts)
"""
import os
from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PKG = os.path.join(ROOT, "node_modules", "@expo-google-fonts")
OUT = os.path.join(ROOT, "assets", "fonts")

FONTS = {
    "MPLUSRounded1c_400Regular": "m-plus-rounded-1c/400Regular",
    "MPLUSRounded1c_500Medium": "m-plus-rounded-1c/500Medium",
    "MPLUSRounded1c_700Bold": "m-plus-rounded-1c/700Bold",
    "DMMono_400Regular": "dm-mono/400Regular",
    "DMMono_500Medium": "dm-mono/500Medium",
    "KleeOne_400Regular": "klee-one/400Regular",
    "KleeOne_600SemiBold": "klee-one/600SemiBold",
}

UNICODES = (
    list(range(0x20, 0x7F))        # Basic Latin
    + list(range(0xA0, 0x180))     # Latin-1 and Latin Extended-A (includes ×)
    + list(range(0x2010, 0x2028))  # quotes, apostrophes, ellipsis
    + [0x2212, 0x2190, 0x2191, 0x2192, 0x2193]  # minus sign, arrows
)

os.makedirs(OUT, exist_ok=True)
for name, rel in FONTS.items():
    src = os.path.join(PKG, rel, f"{name}.ttf")
    dst = os.path.join(OUT, f"{name}.ttf")
    opts = subset.Options()
    opts.hinting = False  # screens are high density; hinting data is large
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    font = subset.load_font(src, opts)
    s = subset.Subsetter(opts)
    s.populate(unicodes=UNICODES)
    s.subset(font)
    subset.save_font(font, dst, opts)
    print(f"{name}: {os.path.getsize(src) // 1024} KB -> {os.path.getsize(dst) // 1024} KB")
