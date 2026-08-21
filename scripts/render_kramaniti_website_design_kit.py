#!/usr/bin/env python3
"""Render the Kramaniti Current Website Design Kit as a 16:9 PDF.

The live website is the authority for observed interface tokens. Founder-directed
square-first rules are labelled separately from observed implementation details.
"""

from __future__ import annotations

import math
import os
from pathlib import Path

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "08_brand_assets/exports/kramaniti_website_design_kit.pdf"
LOGO = ROOT / "08_brand_assets/logos/kramaniti_mark_gold.png"
COMFORTAA = ROOT / "website/src/fonts/Comfortaa-VariableFont_wght.ttf"
MONO = Path("/Library/Fonts/JetBrainsMono-Regular.ttf")

W, H = 960, 540

OBSIDIAN = HexColor("#0A0A0F")
GRAPHITE = HexColor("#141418")
CHARCOAL = HexColor("#1E1E24")
SMOKE = HexColor("#2A2A32")
GOLD = HexColor("#C9A84C")
PALE_GOLD = HexColor("#F0D891")
ICE = HexColor("#F0F0F5")
SILVER = HexColor("#9B9BA8")
SLATE = HexColor("#6B6B78")
SUCCESS = HexColor("#3ECF8E")
WARNING = HexColor("#F5A623")
ERROR = HexColor("#E54D42")
INFO = HexColor("#4A90D9")


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Comfortaa", str(COMFORTAA)))
    pdfmetrics.registerFont(TTFont("JetBrainsMono", str(MONO)))


def alpha(color, opacity: float) -> Color:
    return Color(color.red, color.green, color.blue, alpha=opacity)


def ptext(c, text, x, y, width, size=13, leading=None, color=ICE,
          font="Comfortaa", align=TA_LEFT, space_after=0):
    style = ParagraphStyle(
        "kit",
        fontName=font,
        fontSize=size,
        leading=leading or size * 1.42,
        textColor=color,
        alignment=align,
        spaceAfter=space_after,
    )
    p = Paragraph(text, style)
    _, ph = p.wrap(width, H)
    p.drawOn(c, x, y - ph)
    return ph


def label(c, text, x, y, color=GOLD, size=8.5):
    c.setFont("JetBrainsMono", size)
    c.setFillColor(color)
    c.drawString(x, y, text.upper())


def square(c, x, y, s=7, stroke=GOLD, fill=None, width=1):
    c.setLineWidth(width)
    c.setStrokeColor(stroke)
    if fill is None:
        c.rect(x, y, s, s, stroke=1, fill=0)
    else:
        c.setFillColor(fill)
        c.rect(x, y, s, s, stroke=1, fill=1)


def line(c, x1, y1, x2, y2, color=GOLD, width=1, dash=None):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.setLineCap(0)
    c.setDash(dash or [])
    c.line(x1, y1, x2, y2)
    c.setDash([])


def corner_frame(c, x, y, w, h, color=alpha(GOLD, .55), arm=22, width=1):
    line(c, x, y + h, x + arm, y + h, color, width)
    line(c, x, y + h, x, y + h - arm, color, width)
    line(c, x + w, y + h, x + w - arm, y + h, color, width)
    line(c, x + w, y + h, x + w, y + h - arm, color, width)
    line(c, x, y, x + arm, y, color, width)
    line(c, x, y, x, y + arm, color, width)
    line(c, x + w, y, x + w - arm, y, color, width)
    line(c, x + w, y, x + w, y + arm, color, width)


def rail_field(c, strength=.12, nodes=True):
    rails = [
        (0, 126, 290, 126), (72, 0, 72, 204), (72, 204, 420, 204),
        (420, 204, 420, 540), (598, 0, 598, 338), (598, 338, 960, 338),
        (806, 158, 960, 158), (806, 158, 806, 540), (245, 392, 676, 392),
        (245, 392, 245, 540), (0, 470, 132, 470), (132, 470, 132, 540),
    ]
    for a, b, d, e in rails:
        line(c, a, b, d, e, alpha(GOLD, strength), .65)
    if nodes:
        for x, y in [(68.5, 200.5), (416.5, 388.5), (594.5, 334.5),
                     (802.5, 154.5), (241.5, 388.5), (128.5, 466.5)]:
            square(c, x, y, 7, alpha(PALE_GOLD, strength * 2.3),
                   alpha(GOLD, strength * .55), .7)


def page_base(c, section, page_num, dark=OBSIDIAN, rails=True):
    c.setFillColor(dark)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    if rails:
        rail_field(c)
    label(c, section, 52, 503, alpha(PALE_GOLD, .9))
    c.setFont("JetBrainsMono", 8)
    c.setFillColor(alpha(SILVER, .65))
    c.drawRightString(908, 503, f"KRAMANITI / CURRENT WEBSITE EDITION / {page_num:02d}")


def title(c, text, sub=None, x=52, y=454, width=600, size=34):
    title_h = ptext(c, text, x, y, width, size=size, leading=size * 1.08, color=ICE)
    if sub:
        ptext(c, sub, x, y - title_h - 12, width, size=13, leading=20, color=SILVER)


def status_chip(c, text, x, y, kind="observed"):
    colors = {"observed": PALE_GOLD, "direction": GOLD, "unknown": SILVER,
              "retired": ERROR}
    col = colors[kind]
    w = 15 + pdfmetrics.stringWidth(text.upper(), "JetBrainsMono", 7.5)
    c.setStrokeColor(alpha(col, .65))
    c.setFillColor(alpha(col, .07))
    c.roundRect(x, y - 13, w, 20, 6, stroke=1, fill=1)
    label(c, text, x + 7.5, y - 6, col, 7.5)
    return w


def card(c, x, y, w, h, heading, body, accent=GOLD, tag=None):
    c.setFillColor(alpha(ICE, .025))
    c.setStrokeColor(alpha(ICE, .11))
    c.roundRect(x, y, w, h, 8, stroke=1, fill=1)
    square(c, x + 18, y + h - 28, 7, alpha(accent, .8), alpha(accent, .18), .8)
    ptext(c, heading, x + 38, y + h - 17, w - 56, 13, 16, ICE)
    ptext(c, body, x + 18, y + h - 54, w - 36, 9.2, 14.5, SILVER)
    if tag:
        label(c, tag, x + 18, y + 17, alpha(accent, .78), 7)


_LOGO_READER = None


def draw_logo(c, x, y, size):
    global _LOGO_READER
    if _LOGO_READER is None:
        image = Image.open(LOGO).convert("RGBA")
        alpha_box = image.getchannel("A").getbbox()
        _LOGO_READER = ImageReader(image.crop(alpha_box))
    c.saveState()
    c.setFillAlpha(1)
    c.setStrokeAlpha(1)
    c.drawImage(_LOGO_READER, x, y, size, size, mask="auto",
                preserveAspectRatio=True, anchor="c")
    c.restoreState()


def page_cover(c):
    c.setFillColor(OBSIDIAN)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    rail_field(c, .2)
    corner_frame(c, 40, 34, 880, 472, alpha(GOLD, .38), 34)
    draw_logo(c, 64, 330, 120)
    label(c, "BRAND DESIGN KIT", 64, 324, PALE_GOLD, 9)
    ptext(c, "Kramaniti", 64, 286, 620, 58, 61, ICE)
    ptext(c, "Current Website Edition", 66, 222, 550, 24, 29, PALE_GOLD)
    ptext(c, "A square-first visual system for clarity, connection, and practical AI.",
          66, 165, 500, 13.5, 20, SILVER)
    square(c, 754, 88, 20, GOLD, alpha(GOLD, .16), 1.2)
    line(c, 774, 98, 874, 98, alpha(PALE_GOLD, .8), 1.4)
    line(c, 764, 108, 764, 184, alpha(PALE_GOLD, .45), 1)
    square(c, 870.5, 94.5, 7, PALE_GOLD, PALE_GOLD, 1)
    label(c, "SQUARE SIGNAL EDITION / AUGUST 2026", 64, 66, alpha(SILVER, .75), 8)


def page_thesis(c):
    page_base(c, "01 / DESIGN THESIS", 2)
    title(c, "Logic made visible.", "The identity does not decorate the system. It reveals how the system connects.")
    ptext(c, "Kramaniti joins <font color='#F0D891'>strategy</font>, <font color='#F0D891'>systems</font>, and <font color='#F0D891'>communication</font> into one coherent operating pipeline. The visual language should behave the same way: deliberate paths, clear handoffs, and a restrained signal at the point of connection.", 52, 300, 500, 15, 24, ICE)
    for i, (n, tx) in enumerate([("01", "STRATEGY"), ("02", "SYSTEMS"), ("03", "COMMUNICATION")]):
        x = 618 + i * 92
        square(c, x, 260, 52, alpha(GOLD, .85), alpha(GOLD, .08), 1)
        label(c, n, x + 9, 295, PALE_GOLD, 7)
        ptext(c, tx, x + 9, 278, 70, 8.3, 10, ICE)
        if i < 2:
            line(c, x + 52, 286, x + 92, 286, alpha(GOLD, .55), 1)
            square(c, x + 68, 282.5, 7, PALE_GOLD, alpha(GOLD, .2), .8)
    ptext(c, "Quietly technical. Business-first. Premium through restraint.", 52, 104, 520, 20, 26, PALE_GOLD)


def page_authority(c):
    page_base(c, "02 / AUTHORITY", 3)
    title(c, "What this edition governs", "A practical bridge between the foundational Brand Book and the evolved public interface.")
    items = [
        ("Observed", "Exact colours, typefaces, button geometry, hero signals, floating navigation, and reveal behaviour currently implemented in the website.", "observed"),
        ("Founder direction", "Square connectors replace circular and orbital supporting motifs in all new work. The official mark remains unchanged.", "direction"),
        ("Migration", "Hero and navigation are the reference implementation. Remaining circular motifs elsewhere are legacy patterns to revise when those surfaces are next touched.", "retired"),
        ("Unknown", "Formal print production values, alternate wordmark construction, and final approval cadence require founder approval.", "unknown"),
    ]
    y = 335
    for head, body, kind in items:
        status_chip(c, head, 52, y + 8, kind)
        ptext(c, body, 216, y + 13, 640, 11.5, 18, ICE)
        line(c, 52, y - 33, 908, y - 33, alpha(ICE, .08), .6)
        y -= 76


def page_logo(c):
    page_base(c, "03 / LOGO", 4)
    title(c, "The mark is the signature", "Preserve the supplied gold mark. The square-first rule applies to the supporting system—not to a redraw of the identity.")
    c.setFillColor(GRAPHITE)
    c.roundRect(52, 116, 416, 244, 8, fill=1, stroke=0)
    corner_frame(c, 70, 134, 380, 208, alpha(GOLD, .26), 20)
    draw_logo(c, 196, 160, 128)
    label(c, "PRIMARY / GOLD ON OBSIDIAN", 72, 142, alpha(SILVER, .75), 7)
    card(c, 500, 246, 408, 114, "Use with confidence", "Gold mark on Obsidian or Graphite. Maintain generous negative space. Let the mark appear once per surface.", PALE_GOLD, "OBSERVED + DIRECTION")
    card(c, 500, 116, 408, 114, "Protect the asset", "Do not stretch, recolour, outline, rotate, crop, add effects, or rebuild the mark from geometric primitives.", ERROR, "DO NOT")


def page_logo_space(c):
    page_base(c, "03 / LOGO", 5)
    title(c, "Clear space, anchored by x", "The foundational book establishes 0.25x clear space. Use a square field to make the rule operational.")
    x, y, s = 225, 130, 260
    c.setFillColor(alpha(ICE, .025))
    c.rect(x, y, s, s, fill=1, stroke=0)
    corner_frame(c, x, y, s, s, alpha(GOLD, .55), 30)
    draw_logo(c, x + 65, y + 65, 130)
    line(c, x, y - 18, x + 65, y - 18, alpha(PALE_GOLD, .8), .8)
    line(c, x, y - 24, x, y - 12, alpha(PALE_GOLD, .8), .8)
    line(c, x + 65, y - 24, x + 65, y - 12, alpha(PALE_GOLD, .8), .8)
    label(c, "0.25x", x + 17, y - 36, PALE_GOLD, 8)
    ptext(c, "x", x + 116, y + 144, 30, 30, 30, alpha(GOLD, .18))
    ptext(c, "Keep the mark optically centred inside its field. Do not force the surrounding composition to mimic the mark's internal form.", 570, 305, 280, 14, 22, ICE)
    status_chip(c, "Observed", 570, 202, "observed")
    ptext(c, "0.25x minimum clear space", 570, 175, 280, 10.5, 16, SILVER)
    status_chip(c, "Unknown", 570, 128, "unknown")
    ptext(c, "Formal wordmark construction and print-master specifications", 570, 101, 280, 10.5, 16, SILVER)


def page_type(c):
    page_base(c, "04 / TYPOGRAPHY", 6)
    title(c, "Comfortaa carries the voice", "Rounded humanism, disciplined by sharp geometry and mono annotations.")
    ptext(c, "Aa", 52, 348, 180, 100, 100, PALE_GOLD)
    ptext(c, "Comfortaa", 270, 346, 420, 42, 48, ICE)
    ptext(c, "Display · headings · body · buttons", 274, 287, 430, 12, 18, SILVER)
    line(c, 52, 242, 908, 242, alpha(ICE, .1), .7)
    label(c, "JETBRAINS MONO / MICRO LABELS / DATA / STATES", 54, 210, PALE_GOLD, 10)
    ptext(c, "SYSTEM  /  SIGNAL  /  HUMAN REVIEW  /  03:24", 54, 167, 690, 15, 22, ICE, "JetBrainsMono")
    card(c, 702, 112, 206, 98, "One useful contrast", "Use mono sparingly. It labels the system; it does not narrate it.", GOLD)


def page_type_scale(c):
    page_base(c, "04 / TYPOGRAPHY", 7)
    title(c, "A decisive digital hierarchy", "Scale with the viewport. Keep line lengths calm and weights restrained.")
    rows = [
        ("HERO", "56–78", ".99", "−.052em", 34, "Clarity before acceleration."),
        ("H1", "42–64", "1.02", "−.04em", 27, "Build the system that earns scale."),
        ("H2", "32–48", "1.08", "−.03em", 21, "From question to workflow."),
        ("BODY", "15–17", "1.70", "normal", 13, "Readable, deliberate, and business-first."),
        ("MICRO", "8–11", "1.35", ".08em", 9, "OBSERVED / SYSTEM STATE"),
    ]
    y = 350
    for tag, sz, lh, ls, draw_sz, sample in rows:
        label(c, tag, 52, y + 18, PALE_GOLD, 7.5)
        ptext(c, sample, 160, y + 32, 520, draw_sz, draw_sz * 1.15, ICE, "JetBrainsMono" if tag == "MICRO" else "Comfortaa")
        label(c, f"{sz} PX  /  {lh} LH  /  {ls}", 700, y + 14, alpha(SILVER, .72), 7)
        line(c, 52, y - 17, 908, y - 17, alpha(ICE, .07), .6)
        y -= 67


def swatch(c, x, y, w, h, color, name, value, dark_text=False):
    c.setFillColor(color)
    c.rect(x, y, w, h, fill=1, stroke=0)
    tc = OBSIDIAN if dark_text else ICE
    ptext(c, name, x + 13, y + h - 14, w - 26, 10.5, 13, tc)
    label(c, value, x + 13, y + 12, alpha(tc, .75), 7)


def page_palette(c):
    page_base(c, "05 / COLOUR", 8, rails=False)
    title(c, "Dark-first. Gold-led.", "The palette creates authority through contrast, not volume.")
    swatch(c, 52, 218, 214, 150, OBSIDIAN, "Obsidian", "#0A0A0F")
    swatch(c, 266, 218, 214, 150, GRAPHITE, "Graphite", "#141418")
    swatch(c, 480, 218, 214, 150, CHARCOAL, "Charcoal", "#1E1E24")
    swatch(c, 694, 218, 214, 150, GOLD, "Burnished Gold", "#C9A84C", True)
    swatch(c, 52, 112, 214, 106, ICE, "Ice White", "#F0F0F5", True)
    swatch(c, 266, 112, 214, 106, SILVER, "Silver Mist", "#9B9BA8", True)
    swatch(c, 480, 112, 214, 106, SLATE, "Slate Grey", "#6B6B78")
    swatch(c, 694, 112, 214, 106, SMOKE, "Smoke", "#2A2A32")
    label(c, "CORE WEBSITE TOKENS / OBSERVED", 52, 82, PALE_GOLD, 8)


def page_color_use(c):
    page_base(c, "05 / COLOUR", 9)
    title(c, "Let gold behave like a signal", "Most of the surface stays quiet. Gold appears at decisions, handoffs, emphasis, and focus.")
    segments = [(OBSIDIAN, 62, "60%", "FIELD"), (GRAPHITE, 18, "18%", "DEPTH"), (ICE, 12, "12%", "TYPE"), (GOLD, 7, "7%", "SIGNAL"), (PALE_GOLD, 1, "1%", "PEAK")]
    x, total_w = 52, 856
    for col, pct, val, name in segments:
        w = total_w * pct / 100
        c.setFillColor(col)
        c.rect(x, 286, w, 84, fill=1, stroke=0)
        label(c, val, x + 8, 304, OBSIDIAN if col in (ICE, GOLD, PALE_GOLD) else ICE, 8)
        label(c, name, x + 8, 350, OBSIDIAN if col in (ICE, GOLD, PALE_GOLD) else alpha(ICE, .7), 6.5)
        x += w
    ptext(c, "The 60/18/12/7/1 split is a compositional recommendation—not an automated token requirement. Use it as a restraint check, especially on presentation and campaign surfaces.", 52, 222, 520, 12, 19, SILVER)
    for i, (name, col) in enumerate([("SUCCESS", SUCCESS), ("WARNING", WARNING), ("ERROR", ERROR), ("INFO", INFO)]):
        x = 628 + (i % 2) * 144
        y = 196 - (i // 2) * 64
        square(c, x, y, 16, col, alpha(col, .12), 1)
        label(c, name, x + 28, y + 5, col, 7)


def page_geometry(c):
    page_base(c, "06 / GEOMETRY", 10)
    title(c, "Square is the point of connection", "A modular field replaces the orbit. Relationship is expressed through adjacency, path, and handoff.")
    forms = [
        ("NODE", lambda x, y: square(c, x, y, 28, PALE_GOLD, alpha(GOLD, .1), 1.3)),
        ("CONNECTOR", lambda x, y: (line(c, x - 24, y + 14, x, y + 14, alpha(GOLD, .7), 1), square(c, x, y, 28, PALE_GOLD, alpha(GOLD, .1), 1.3), line(c, x + 28, y + 14, x + 52, y + 14, alpha(GOLD, .7), 1))),
        ("GATE", lambda x, y: (corner_frame(c, x - 8, y - 8, 44, 44, PALE_GOLD, 12, 1.2), square(c, x + 10, y + 10, 8, GOLD, GOLD, 1))),
        ("CLUSTER", lambda x, y: [square(c, x + dx, y + dy, 11, alpha(PALE_GOLD, .85), alpha(GOLD, .08), .8) for dx, dy in [(0,0),(17,0),(34,0),(0,17),(34,17),(0,34),(17,34),(34,34)]]),
    ]
    for i, (name, fn) in enumerate(forms):
        x = 104 + i * 215
        fn(x, 270)
        label(c, name, x - 8, 230, PALE_GOLD, 8)
    line(c, 52, 184, 908, 184, alpha(ICE, .1), .7)
    status_chip(c, "Founder direction", 52, 142, "direction")
    ptext(c, "No circles, orbital rings, radial node maps, circular masks, or decorative dot fields in new visual-system work. Rounded 8 px interface corners remain valid for ergonomic controls and containers.", 232, 151, 650, 11.5, 18, ICE)


def page_asset_family(c):
    page_base(c, "07 / ASSET FAMILY", 11)
    title(c, "A vocabulary, not a pattern pack", "Each asset communicates a system state. Use only when it clarifies structure.")
    names = ["Origin", "Handoff", "Decision", "Human review", "Parallel work", "Resolved"]
    for i, name in enumerate(names):
        x = 74 + (i % 3) * 294
        y = 286 - (i // 3) * 150
        c.setFillColor(alpha(ICE, .02))
        c.setStrokeColor(alpha(ICE, .08))
        c.roundRect(x, y, 248, 112, 8, fill=1, stroke=1)
        label(c, f"0{i+1} / {name}", x + 18, y + 88, PALE_GOLD, 7.3)
        if i == 0:
            square(c, x+22, y+27, 18, GOLD, alpha(GOLD,.13), 1); line(c,x+40,y+36,x+206,y+36,alpha(GOLD,.55),1)
        elif i == 1:
            line(c,x+22,y+36,x+206,y+36,alpha(GOLD,.48),1); square(c,x+109,y+29,14,PALE_GOLD,alpha(GOLD,.15),1)
        elif i == 2:
            line(c,x+22,y+36,x+96,y+36,alpha(GOLD,.5),1); square(c,x+96,y+29,14,PALE_GOLD,alpha(GOLD,.12),1); line(c,x+110,y+36,x+158,y+36,alpha(GOLD,.5),1); line(c,x+117,y+36,x+117,y+58,alpha(GOLD,.5),1); line(c,x+117,y+58,x+206,y+58,alpha(GOLD,.5),1)
        elif i == 3:
            corner_frame(c,x+89,y+18,70,46,alpha(PALE_GOLD,.8),14,1); square(c,x+120,y+36,8,GOLD,GOLD,1)
        elif i == 4:
            for dy in [25,42,59]: line(c,x+22,y+dy,x+206,y+dy,alpha(GOLD,.42),.9)
            for dy in [25,42,59]: square(c,x+112,y+dy-3.5,7,alpha(PALE_GOLD,.7),alpha(GOLD,.15),.7)
        else:
            line(c,x+22,y+36,x+206,y+36,alpha(GOLD,.38),1); square(c,x+188,y+27,18,PALE_GOLD,PALE_GOLD,1)


def page_flow(c):
    page_base(c, "08 / FLOW LINES", 12, rails=False)
    title(c, "Routes persist. Signals travel.", "The line is infrastructure. The bright segment is activity. The square is the moment of handoff.")
    routes = [
        [(52,300),(280,300),(280,380),(562,380),(562,252),(908,252)],
        [(52,215),(196,215),(196,132),(448,132),(448,286),(742,286),(742,116)],
        [(386,430),(386,340),(680,340),(680,184),(908,184)],
    ]
    for pts in routes:
        for a,b in zip(pts,pts[1:]): line(c,*a,*b,alpha(GOLD,.28),1)
    for x,y in [(276.5,296.5),(558.5,248.5),(192.5,211.5),(444.5,282.5),(676.5,336.5),(738.5,112.5)]:
        square(c,x,y,7,alpha(PALE_GOLD,.85),alpha(GOLD,.18),.8)
    line(c, 52,300,280,300,PALE_GOLD,1.7,[7,9])
    line(c, 448,132,448,286,alpha(PALE_GOLD,.78),1.5,[6,11])
    label(c, "BASE RAIL / 30% GOLD", 54, 94, alpha(SILVER,.8),7)
    label(c, "ACTIVE SIGNAL / 1.6 PX / VARIED 5.5–7.4 S", 264, 94, PALE_GOLD,7)
    label(c, "CONNECTOR / 7 × 7 PX / BRIGHTEN ON PASS", 620, 94, PALE_GOLD,7)


def page_motion(c):
    page_base(c, "09 / MOTION", 13)
    title(c, "Motion confirms relationship", "No ambient spectacle. Animation exists to reveal hierarchy, direction, or state.")
    card(c, 52, 245, 260, 132, "Word reveal", "Opacity 0 → 1\nTranslate Y 18 px → 0\nBlur 16 px → 0\n720 ms / 55 ms stagger", PALE_GOLD, "OBSERVED")
    card(c, 326, 245, 260, 132, "Signal route", "Continuous base rail\n1.6 px active segment\n5.5–7.4 s varied cycles\nNegative delays prevent lockstep", GOLD, "OBSERVED")
    card(c, 600, 245, 308, 132, "Square handoff", "Scale 1 → 1.72 at arrival\nBrighten to pale gold\nSynchronise to passing signal\nNever pulse without a cause", PALE_GOLD, "OBSERVED + DIRECTION")
    line(c, 52, 186, 908, 186, alpha(ICE,.1),.7)
    status_chip(c, "Reduced motion", 52, 142, "observed")
    ptext(c, "Show all copy immediately. Hide moving routes and connector illumination. Preserve layout, contrast, and meaning without animation.", 226, 151, 648, 11.5, 18, ICE)


def page_atmosphere(c):
    page_base(c, "10 / ATMOSPHERIC TYPE", 14, rails=False)
    c.setFillColor(OBSIDIAN); c.rect(0,0,W,H,fill=1,stroke=0)
    rail_field(c,.16)
    label(c,"10 / ATMOSPHERIC TYPE",52,503,PALE_GOLD,8.5)
    ptext(c,"CLARITY",78,376,760,82,84,alpha(ICE,.045))
    ptext(c,"SYSTEMS",330,242,590,76,78,alpha(GOLD,.075))
    corner_frame(c,52,74,856,370,alpha(GOLD,.22),30)
    ptext(c,"Atmospheric words are spatial anchors, not headlines.",74,140,720,20,27,ICE)
    ptext(c,"Use one word, low contrast, clipped by a square edge or orthogonal rail. Never compromise reading order.",74,101,570,11.5,18,SILVER)


def draw_button(c,x,y,w,text,variant="primary",h=50):
    if variant == "primary":
        fill, stroke, tc = alpha(ICE,.045), alpha(ICE,.17), ICE
    elif variant == "gold":
        fill, stroke, tc = GOLD, GOLD, OBSIDIAN
    else:
        fill, stroke, tc = alpha(ICE,0), alpha(ICE,.13), SILVER
    c.setFillColor(fill); c.setStrokeColor(stroke); c.setLineWidth(1)
    c.roundRect(x,y,w,h,8,fill=1,stroke=1)
    tw=pdfmetrics.stringWidth(text,"Comfortaa",11)
    c.setFont("Comfortaa",11); c.setFillColor(tc); c.drawString(x+(w-tw)/2,y+h/2-4,text)
    square(c,x+w-22,y+h/2-3,6,alpha(PALE_GOLD,.7),alpha(GOLD,.12),.7)


def page_buttons(c):
    page_base(c, "11 / BUTTONS", 15)
    title(c, "One geometry. Clear priority.", "All public actions share an 8 px radius, visible focus, and a composed 50 px height.")
    draw_button(c,52,285,228,"Book a workflow audit")
    draw_button(c,300,285,200,"Explore the method","gold")
    draw_button(c,520,285,188,"Read the insight","quiet")
    c.setStrokeColor(PALE_GOLD); c.setLineWidth(2); c.roundRect(740,280,168,60,12,stroke=1,fill=0)
    draw_button(c,745,285,158,"Keyboard focus")
    labels=[("HEIGHT","50 PX"),("RADIUS","8 PX"),("PADDING","20 PX"),("TYPE","14 PX"),("FOCUS","2 PX / 4–5 PX OFFSET")]
    for i,(a,b) in enumerate(labels):
        x=52+(i%3)*286; y=190-(i//3)*65
        label(c,a,x,y,alpha(SILVER,.75),7); ptext(c,b,x,y-12,245,13,16,ICE,"JetBrainsMono")


def page_navigation(c):
    page_base(c, "12 / NAVIGATION", 16)
    title(c, "A floating instrument, not a toolbar", "The shell frames orientation and one decisive action. Its shine follows the same 8 px geometry.", width=760, size=30)
    x,y,w,h=86,274,788,56
    c.setFillColor(alpha(GRAPHITE,.92)); c.setStrokeColor(alpha(ICE,.13)); c.setLineWidth(1)
    c.roundRect(x,y,w,h,8,fill=1,stroke=1)
    c.setStrokeColor(alpha(PALE_GOLD,.35)); c.setLineWidth(1.2); c.roundRect(x-4,y-4,w+8,h+8,12,fill=0,stroke=1)
    draw_logo(c,x+14,y+8,40)
    ptext(c,"KRAMANITI",x+64,y+36,120,10,12,PALE_GOLD)
    for i,t in enumerate(["Method","Work","Insights"]): ptext(c,t,x+285+i*82,y+34,70,9.5,12,SILVER)
    draw_button(c,x+w-175,y+9,158,"Book an audit",h=38)
    card(c,86,128,250,106,"Desktop shell","Max width 1120 px\nHeight 52 px\nRadius 8 px\nShine radius 12 px",GOLD)
    card(c,355,128,250,106,"Mobile trigger","44 × 44 px tap target\nNo box around icon\nThree menu links stay text-led",PALE_GOLD)
    card(c,624,128,250,106,"Mobile action","Only the audit CTA adopts the standard button system inside the menu.",GOLD)


def page_surfaces(c):
    page_base(c, "13 / SURFACES", 17)
    title(c, "Contain only what needs containing", "The site should feel open and editorial. Glass is reserved for functional instruments.", width=760, size=30)
    corner_frame(c,52,126,512,252,alpha(GOLD,.45),28)
    ptext(c,"Open composition",80,338,360,22,27,ICE)
    ptext(c,"Narrative sections use typography, whitespace, rails, and alignment—without automatic card borders.",80,288,370,12,19,SILVER)
    label(c,"DEFAULT FOR STORYTELLING",80,160,PALE_GOLD,7)
    c.setFillColor(alpha(ICE,.035)); c.setStrokeColor(alpha(ICE,.12)); c.roundRect(614,126,294,252,8,fill=1,stroke=1)
    corner_frame(c,634,146,254,212,alpha(PALE_GOLD,.24),20)
    ptext(c,"Functional glass",642,328,220,22,27,ICE)
    ptext(c,"Use for navigation, controls, workflow states, and bounded interactive tools.",642,278,220,12,19,SILVER)
    label(c,"EARN THE CONTAINER",642,160,PALE_GOLD,7)


def icon_sample(c,x,y,kind):
    col=PALE_GOLD
    if kind==0:
        square(c,x+10,y+10,22,col,None,1.2); line(c,x+32,y+21,x+52,y+21,col,1.2); square(c,x+49,y+18,6,col,col,.8)
    elif kind==1:
        corner_frame(c,x+6,y+6,48,48,col,14,1.2); line(c,x+18,y+30,x+42,y+30,col,1.2); line(c,x+30,y+18,x+30,y+42,col,1.2)
    elif kind==2:
        square(c,x+8,y+8,12,col,None,1); square(c,x+40,y+40,12,col,None,1); line(c,x+20,y+14,x+46,y+46,col,1.2)
    else:
        line(c,x+8,y+46,x+52,y+46,col,1.2); line(c,x+8,y+46,x+8,y+10,col,1.2); line(c,x+8,y+10,x+52,y+10,col,1.2); square(c,x+45,y+7,7,col,col,1)


def page_icons(c):
    page_base(c, "14 / ICONOGRAPHY", 18)
    title(c, "Open line. Square logic.", "Icons should clarify navigation and state without becoming a second illustration system.")
    for i,name in enumerate(["CONNECT","FRAME","TRANSFER","PROGRESS"]):
        x=74+i*216
        icon_sample(c,x,270,i)
        label(c,name,x+2,248,PALE_GOLD,7.5)
    line(c,52,204,908,204,alpha(ICE,.1),.7)
    rules=["1.35–1.5 px stroke","Butt or square terminals","24 px and 32 px base sizes","No emoji in public UI","No mixed icon families","No circular icon containers"]
    for i,r in enumerate(rules):
        x=52+(i%3)*286; y=160-(i//3)*46
        square(c,x,y,7,alpha(PALE_GOLD,.8),alpha(GOLD,.12),.8); ptext(c,r,x+18,y+10,250,10.5,15,ICE)


def page_grid(c):
    page_base(c, "15 / LAYOUT", 19, rails=False)
    title(c, "A grid you can feel", "Use a 12-column desktop field, a 4-column mobile field, and an 8 px spacing rhythm.")
    x,y,w,h=52,134,608,246
    gap=8; cols=12; cw=(w-gap*(cols-1))/cols
    for i in range(cols):
        c.setFillColor(alpha(GOLD,.075 if i%2==0 else .045)); c.rect(x+i*(cw+gap),y,cw,h,fill=1,stroke=0)
    corner_frame(c,x,y,w,h,alpha(PALE_GOLD,.35),24)
    label(c,"DESKTOP / 12 COLUMNS / 8 PX RHYTHM",x,y-22,PALE_GOLD,7)
    mx,my,mw,mh=718,134,190,246; mg=8; mcw=(mw-mg*3)/4
    for i in range(4):
        c.setFillColor(alpha(PALE_GOLD,.07 if i%2==0 else .04)); c.rect(mx+i*(mcw+mg),my,mcw,mh,fill=1,stroke=0)
    corner_frame(c,mx,my,mw,mh,alpha(PALE_GOLD,.35),20)
    label(c,"MOBILE / 4",mx,my-22,PALE_GOLD,7)
    ptext(c,"Align important words, nodes, and image edges to the field. Break the grid only to reveal a relationship—not to manufacture novelty.",52,89,700,11.5,18,SILVER)


def page_photography(c):
    page_base(c, "16 / PHOTOGRAPHY", 20)
    title(c, "Human reality, structured with intent", "Photography should show decisions, work, and consequence—not generic technological awe.", width=760, size=30)
    boxes=[(52,138,260,230,"PEOPLE IN PRACTICE"),(326,138,260,230,"OPERATIONAL DETAIL"),(600,138,308,230,"ENVIRONMENT + CONTEXT")]
    for i,(x,y,w,h,name) in enumerate(boxes):
        c.setFillColor([GRAPHITE,CHARCOAL,SMOKE][i]); c.rect(x,y,w,h,fill=1,stroke=0)
        for j in range(6):
            line(c,x+20+j*34,y+22,x+96+j*27,y+h-20,alpha(GOLD,.08+j*.015),1)
        corner_frame(c,x+12,y+12,w-24,h-24,alpha(PALE_GOLD,.35),18)
        label(c,name,x+20,y+22,PALE_GOLD,7)
    ptext(c,"Prefer square or editorial crops, restrained colour, real environments, and directional light. Avoid circular masks, synthetic holograms, robot clichés, and anonymous handshake imagery.",52,96,820,11.5,18,SILVER)


def page_diagrams(c):
    page_base(c, "17 / DATA + DIAGRAMS", 21)
    title(c, "Make the operating logic legible", "Every diagram should answer: what moves, where it changes, and where a person decides.")
    stages=[("QUESTION",90,292),("STRATEGY",268,292),("SYSTEM",446,292),("HUMAN REVIEW",624,292),("OUTPUT",802,292)]
    for i,(name,x,y) in enumerate(stages):
        square(c,x,y,36,PALE_GOLD if i==3 else GOLD,alpha(GOLD,.1),1.1)
        label(c,name,x-10,y-24,PALE_GOLD if i==3 else SILVER,7)
        if i<len(stages)-1:
            line(c,x+36,y+18,stages[i+1][1],y+18,alpha(GOLD,.45),1)
            square(c,x+103,y+14.5,7,alpha(PALE_GOLD,.75),alpha(GOLD,.15),.7)
    corner_frame(c,606,268,72,84,alpha(PALE_GOLD,.65),16,1)
    cards=[("DIRECT LABELS","Name states and decisions on the diagram."),("NO DECORATIVE METRICS","Use numbers only when the source and meaning are clear."),("SHOW REVIEW","Consequential actions visibly pause for human judgment.")]
    for i,(a,b) in enumerate(cards): card(c,52+i*286,120,270,104,a,b,PALE_GOLD)


def page_hero(c):
    page_base(c, "18 / REFERENCE APPLICATION", 22, rails=False)
    c.setFillColor(OBSIDIAN);c.rect(0,0,W,H,fill=1,stroke=0);rail_field(c,.24)
    label(c,"18 / REFERENCE APPLICATION",52,503,PALE_GOLD,8.5)
    ptext(c,"KRAMANITI",0,411,W,17,20,PALE_GOLD,align=1)
    ptext(c,"Clarity before acceleration.",100,342,760,42,45,ICE,align=1)
    ptext(c,"We design practical AI systems that connect strategy, workflows, and communication—without losing human judgment.",226,262,508,12.5,20,SILVER,align=1)
    draw_button(c,375,154,210,"Book a workflow audit")
    annotations=[("01",126,414,"BRAND SIGNATURE"),("02",118,327,"WORD-BY-WORD REVEAL"),("03",120,170,"UNIFIED CTA"),("04",746,304,"CONTINUOUS RAIL"),("05",746,187,"SQUARE HANDOFF")]
    for n,x,y,t in annotations:
        label(c,n,x,y,PALE_GOLD,7); line(c,x+20,y+3,x+62,y+3,alpha(GOLD,.55),.8); label(c,t,x+68,y,alpha(SILVER,.78),6.5)


def page_components(c):
    page_base(c, "19 / COMPONENT SYSTEM", 23)
    title(c, "Compose from a small set of parts", "Consistency comes from relationships between tokens—not from multiplying components.", width=760, size=30)
    comps=[
        ("01","SIGNATURE","Logo + Kramaniti word"),
        ("02","RAIL","Persistent structural path"),
        ("03","SIGNAL","Momentary activity state"),
        ("04","SQUARE","Handoff or decision"),
        ("05","ACTION","8 px control geometry"),
        ("06","FRAME","Functional containment only"),
        ("07","TYPE","Comfortaa-led hierarchy"),
        ("08","LABEL","Mono system annotation"),
    ]
    for i,(n,name,desc) in enumerate(comps):
        x=52+(i%4)*214; y=282-(i//4)*112
        square(c,x,y+34,22,PALE_GOLD,alpha(GOLD,.1),1)
        label(c,n,x+34,y+48,PALE_GOLD,7)
        ptext(c,name,x+34,y+36,158,11.5,14,ICE)
        ptext(c,desc,x+34,y+10,158,8.5,12,SILVER)
    ptext(c,"If a new asset cannot be explained using this grammar, it probably belongs to a campaign—not the core system.",52,88,760,13,20,PALE_GOLD)


def page_do_dont(c):
    page_base(c, "20 / DO + DON'T", 24)
    title(c, "Premium is a discipline of subtraction", "Use the system to expose logic. Remove anything that performs sophistication without adding meaning.", width=760, size=30)
    dos=["Centre the core message when the page needs a decisive first impression.","Use several quiet rails with varied signal timings.","Brighten a square only when a route reaches it.","Keep prose human, specific, and business-first.","Use open space as an active design element."]
    donts=["Do not reintroduce orbits, circular nodes, or radial diagrams.","Do not animate every surface or bind motion directly to scroll.","Do not put every sentence inside a card.","Do not use gold as a background default.","Do not invent proof, metrics, clients, or outcomes."]
    c.setFillColor(alpha(SUCCESS,.025)); c.setStrokeColor(alpha(SUCCESS,.22)); c.roundRect(52,108,406,268,8,fill=1,stroke=1)
    c.setFillColor(alpha(ERROR,.025)); c.setStrokeColor(alpha(ERROR,.22)); c.roundRect(502,108,406,268,8,fill=1,stroke=1)
    label(c,"DO",76,346,SUCCESS,8); label(c,"DON'T",526,346,ERROR,8)
    for i,t in enumerate(dos): square(c,76,302-i*44,7,SUCCESS,alpha(SUCCESS,.12),.7);ptext(c,t,94,312-i*44,330,9.5,14,ICE)
    for i,t in enumerate(donts): square(c,526,302-i*44,7,ERROR,alpha(ERROR,.12),.7);ptext(c,t,544,312-i*44,330,9.5,14,ICE)


def page_migration(c):
    page_base(c, "21 / MIGRATION", 25)
    title(c, "Evolve without redesign theatre", "Adopt the square-first system in order of visibility and reuse.")
    steps=[
        ("NOW","Hero, navigation, CTA geometry, type system, and colour tokens are the reference baseline.",PALE_GOLD),
        ("NEXT","Replace legacy circular and orbital motifs when affected sections are naturally revised.",GOLD),
        ("LATER","Extend the asset family to case studies, documents, social formats, and product surfaces.",SILVER),
        ("GATE","Do not alter the official mark or formal print specifications without founder approval.",ERROR),
    ]
    y=340
    for i,(head,body,col) in enumerate(steps):
        square(c,70,y-4,22,col,alpha(col,.09),1)
        if i<len(steps)-1: line(c,81,y-42,81,y-78,alpha(GOLD,.35),1)
        label(c,head,120,y+5,col,8)
        ptext(c,body,210,y+13,650,11.5,18,ICE)
        y-=78


def page_governance(c):
    page_base(c, "22 / GOVERNANCE", 26)
    title(c, "Source-aware by design", "This kit separates implementation facts from direction and open decisions.")
    cards=[
        ("OBSERVED","Directly present in the current website source or established foundational book.",PALE_GOLD),
        ("FOUNDER DIRECTION","Explicitly requested for the next visual-system phase: square-first, no circular supporting motifs.",GOLD),
        ("RECOMMENDATION","A considered rule introduced here to make the current language repeatable.",SILVER),
        ("UNKNOWN","Requires founder approval before being treated as a formal production standard.",ERROR),
    ]
    for i,(a,b,col) in enumerate(cards): card(c,52+(i%2)*438,250-(i//2)*134,418,114,a,b,col)
    ptext(c,"Authority order: founder direction → current website implementation → foundational Brand Book → this operational interpretation.",52,86,820,12,18,PALE_GOLD)


def page_close(c):
    c.setFillColor(OBSIDIAN);c.rect(0,0,W,H,fill=1,stroke=0);rail_field(c,.2)
    corner_frame(c,40,34,880,472,alpha(GOLD,.38),34)
    draw_logo(c,425,346,110)
    ptext(c,"Kramaniti",0,329,W,34,38,ICE,align=1)
    ptext(c,"Strategy before tools.\nSystems before scale.\nCommunication after clarity.",230,254,500,22,31,PALE_GOLD,align=1)
    ptext(c,"CURRENT WEBSITE DESIGN KIT / SQUARE SIGNAL EDITION / 2026",0,72,W,8,11,alpha(SILVER,.72),"JetBrainsMono",1)


PAGES = [
    page_cover, page_thesis, page_authority, page_logo, page_logo_space,
    page_type, page_type_scale, page_palette, page_color_use, page_geometry,
    page_asset_family, page_flow, page_motion, page_atmosphere, page_buttons,
    page_navigation, page_surfaces, page_icons, page_grid, page_photography,
    page_diagrams, page_hero, page_components, page_do_dont, page_migration,
    page_governance, page_close,
]


def main() -> None:
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("Kramaniti Current Website Design Kit")
    c.setAuthor("Kramaniti")
    c.setSubject("Square-first brand and interface system aligned to the current website")
    for fn in PAGES:
        fn(c)
        c.showPage()
    c.save()
    print(OUTPUT)


if __name__ == "__main__":
    main()
