"""Prepare licensed local Glober/Elena sources; never commit generated binaries.

Requires Python 3.11+ and fonttools[woff]==4.66.1. See docs/operations/font-hosting.md.
"""
import argparse
import hashlib
import json
from pathlib import Path

from fontTools import subset
from fontTools.pens.recordingPen import RecordingPen
from fontTools.ttLib import TTFont

LATIN_BLOCKS = ((0, 0x24F), (0x300, 0x36F), (0x1E00, 0x1EFF),
                (0x2000, 0x206F), (0x20A0, 0x20CF), (0xFB00, 0xFB06))
WEIGHTS = {"Thin": 100, "Light": 300, "Book": 350, "Regular": 400,
           "Medium": 500, "SemiBold": 600, "Bold": 700, "xBold": 800,
           "Heavy": 850, "Black": 900}
BASE_URL = "https://assets.sebastian-software.com/fonts"


def unicode_ranges(points):
    runs = []
    for point in sorted(points):
        if runs and point == runs[-1][1] + 1:
            runs[-1][1] = point
        else:
            runs.append([point, point])
    return ", ".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}"
                     for a, b in runs)


def prepare(source, output, directory):
    original = TTFont(source, recalcTimestamp=False)
    cmap = original.getBestCmap()
    unicode_union = {cp for table in original["cmap"].tables if table.isUnicode()
                     for cp in table.cmap}
    assert set(cmap) == unicode_union, "Source cmap tables disagree; review before subsetting"
    source_glyphs = original.getGlyphSet()
    latin = {cp for cp in cmap if any(a <= cp <= b for a, b in LATIN_BLOCKS)}
    stem = source.stem.removeprefix("Fontfabric - ")
    family = "Elena Basic" if stem.startswith("ElenaBasic") else directory
    variant = stem.removeprefix("Glober").removeprefix("ElenaBasic-").removeprefix("Elena-")
    italic = variant.endswith("Italic")
    weight = WEIGHTS[variant.removesuffix("Italic")]
    record = {"name": stem, "family": family, "weight": weight,
              "style": "italic" if italic else "normal", "source_characters": len(cmap),
              "files": [], "core": (directory == "Glober" and weight in (400, 700)) or
              (family == "Elena" and weight in (500, 700))}
    # Full WOFF2 gives a comparable baseline, including OTF input conversion.
    original.flavor = "woff2"
    from io import BytesIO
    buffer = BytesIO()
    original.save(buffer)
    record["full_woff2_bytes"] = len(buffer.getvalue())
    covered = set()
    for label, points in (("latin", latin), ("extended", set(cmap) - latin)):
        if not points:
            continue
        font = TTFont(source, recalcTimestamp=False)
        options = subset.Options()
        options.layout_features = ["*"]
        options.name_IDs = ["*"]
        options.name_languages = ["*"]
        options.name_legacy = True
        options.glyph_names = True
        options.notdef_outline = True
        sub = subset.Subsetter(options=options)
        sub.populate(unicodes=points)
        sub.subset(font)
        font.flavor = "woff2"
        buffer = BytesIO()
        font.save(buffer)
        data = buffer.getvalue()
        digest = hashlib.sha256(data).hexdigest()
        destination = output / directory / f"{stem}-{label}-{digest[:12]}.woff2"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(data)
        checked = TTFont(destination)
        actual = checked.getBestCmap()
        assert set(actual) == points, f"Character coverage changed: {destination}"
        subset_glyphs = checked.getGlyphSet()
        for cp, glyph in actual.items():
            assert checked["hmtx"][glyph] == original["hmtx"][cmap[cp]]
            source_pen, subset_pen = RecordingPen(), RecordingPen()
            source_glyphs[cmap[cp]].draw(source_pen)
            subset_glyphs[glyph].draw(subset_pen)
            assert source_pen.value == subset_pen.value, f"Glyph outline changed: U+{cp:04X}"
        for table, fields in (("head", ("unitsPerEm",)),
                              ("hhea", ("ascent", "descent", "lineGap")),
                              ("OS/2", ("sTypoAscender", "sTypoDescender", "sTypoLineGap"))):
            assert all(getattr(checked[table], f) == getattr(original[table], f) for f in fields)
        assert not covered.intersection(points)
        covered.update(points)
        data = destination.read_bytes()
        record["files"].append({"path": f"{directory}/{destination.name}",
                                "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(),
                                "characters": len(actual), "unicode_range": unicode_ranges(points)})
    assert covered == set(cmap), f"Incomplete combined coverage: {source}"
    return record


def stylesheet(records):
    rules = ['@import url("./typography.css");',
             "/* Generated from licensed local sources with scripts/prepare-fonts.py. */"]
    for record in records:
        for file in record["files"]:
            rules.append(f'''@font-face {{
  font-family: "{record['family']}";
  font-style: {record['style']};
  font-weight: {record['weight']};
  font-display: swap;
  src: url("{BASE_URL}/{file['path']}") format("woff2");
  unicode-range: {file['unicode_range']};
}}''')
    return "\n\n".join(rules) + "\n"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--glober", type=Path, required=True)
    parser.add_argument("--elena", type=Path, required=True, help="Vendor webfont folder")
    parser.add_argument("--output", type=Path, required=True, help="Private output folder")
    parser.add_argument("--css", type=Path, required=True, help="Brand public CSS folder")
    args = parser.parse_args()
    public_repository = Path(__file__).resolve().parent.parent
    if args.output.resolve().is_relative_to(public_repository):
        parser.error("Keep licensed font binaries outside this public repository")
    sources = [(p, "Glober") for p in sorted(args.glober.glob("*.otf"))]
    sources += [(p, "Elena") for p in sorted(args.elena.glob("*.woff2"))]
    assert sum(d == "Glober" for _, d in sources) == 18
    assert sum(d == "Elena" for _, d in sources) == 11
    records = [prepare(p, args.output, d) for p, d in sources]
    args.css.joinpath("fonts.css").write_text(stylesheet([r for r in records if r["core"]]))
    args.css.joinpath("fonts-all.css").write_text(stylesheet(records))
    args.output.joinpath("manifest.json").write_text(json.dumps(records, indent=2) + "\n")
    core = [r for r in records if r["core"]]
    print(json.dumps({"faces": len(records), "files": sum(len(r["files"]) for r in records),
                      "core_full_bytes": sum(r["full_woff2_bytes"] for r in core),
                      "core_latin_bytes": sum(r["files"][0]["bytes"] for r in core),
                      "all_original_characters_preserved": True}))
