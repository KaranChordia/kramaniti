#!/usr/bin/env python3
"""Render the Kramaniti brand book Markdown source as a premium widescreen PDF."""

from __future__ import annotations

import argparse
import html
import math
import re
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path
from typing import Iterable

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


PAGE_W = 960
PAGE_H = 540
MARGIN_X = 58
CONTENT_W = PAGE_W - MARGIN_X * 2

OBSIDIAN = HexColor("#0A0A0F")
GRAPHITE = HexColor("#141418")
CHARCOAL = HexColor("#1E1E24")
GOLD = HexColor("#C9A84C")
MARK_GOLD = HexColor("#CCA300")
BRONZE = HexColor("#A07D3A")
AMBER = HexColor("#D4A843")
ICE = HexColor("#F0F0F5")
SILVER = HexColor("#9B9BA8")
SLATE = HexColor("#6B6B78")
SMOKE = HexColor("#2A2A32")
PAPER = HexColor("#FCFBF8")
INK = HexColor("#151515")
RULE = HexColor("#D9D1C1")
SUCCESS = HexColor("#3ECF8E")
WARNING = HexColor("#F5A623")
ERROR = HexColor("#E54D42")
INFO = HexColor("#4A90D9")

FONT_DIR = Path("/Library/Fonts")
ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "03_brand_strategy" / "kramaniti_brand_book.md"
DEFAULT_OUTPUT = ROOT / "08_brand_assets" / "exports" / "kramaniti_brand_book.pdf"
LOGO_PATH = ROOT / "08_brand_assets" / "logos" / "kramaniti_mark_gold.png"


@dataclass
class Section:
    title: str
    paragraphs: list[str] = field(default_factory=list)
    bullets: list[str] = field(default_factory=list)
    quotes: list[str] = field(default_factory=list)


@dataclass
class Page:
    layout: str
    theme: str
    section_label: str
    title: str
    kicker: str = ""
    lede: str = ""
    note: str = ""
    sections: list[Section] = field(default_factory=list)
    table: list[list[str]] = field(default_factory=list)


def register_fonts() -> None:
    fonts = {
        "Outfit": "Outfit-Regular.ttf",
        "Outfit-Medium": "Outfit-Medium.ttf",
        "Outfit-SemiBold": "Outfit-SemiBold.ttf",
        "Outfit-Bold": "Outfit-Bold.ttf",
        "Outfit-ExtraBold": "Outfit-ExtraBold.ttf",
        "JetBrainsMono": "JetBrainsMono-Regular.ttf",
        "JetBrainsMono-Bold": "JetBrainsMono-Bold.ttf",
    }
    for name, filename in fonts.items():
        path = FONT_DIR / filename
        if not path.exists():
            raise FileNotFoundError(f"Missing font: {path}")
        pdfmetrics.registerFont(TTFont(name, str(path)))


def cropped_logo(path: Path) -> ImageReader:
    image = Image.open(path).convert("RGBA")
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        raise ValueError(f"Logo has no visible pixels: {path}")
    return ImageReader(image.crop(bbox))


def parse_meta(block: str) -> tuple[dict[str, str], str]:
    match = re.search(r"<!--\s*(.*?)\s*-->", block, flags=re.DOTALL)
    if not match:
        return {}, block
    meta: dict[str, str] = {}
    for item in match.group(1).split("|"):
        if ":" in item:
            key, value = item.split(":", 1)
            meta[key.strip().lower()] = value.strip()
    return meta, block[: match.start()] + block[match.end() :]


def parse_table(lines: list[str], start: int) -> tuple[list[list[str]], int]:
    rows: list[list[str]] = []
    index = start
    while index < len(lines) and lines[index].strip().startswith("|"):
        cells = [cell.strip() for cell in lines[index].strip().strip("|").split("|")]
        if not all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            rows.append(cells)
        index += 1
    return rows, index


def parse_source(path: Path) -> list[Page]:
    raw = path.read_text(encoding="utf-8")
    blocks = re.split(r"\n---\n", raw)
    pages: list[Page] = []
    for raw_block in blocks:
        if not raw_block.strip():
            continue
        meta, block = parse_meta(raw_block)
        lines = block.strip().splitlines()
        title = ""
        kicker = ""
        lede = ""
        note = ""
        sections: list[Section] = []
        table: list[list[str]] = []
        current: Section | None = None
        index = 0
        while index < len(lines):
            line = lines[index].strip()
            if not line:
                index += 1
                continue
            if line.startswith("#"):
                level = len(line) - len(line.lstrip("#"))
                value = line[level:].strip()
                if level <= 2 and not title:
                    title = value
                elif level == 3:
                    current = Section(value)
                    sections.append(current)
                index += 1
                continue
            if line.startswith("KICKER:"):
                kicker = line.split(":", 1)[1].strip()
                index += 1
                continue
            if line.startswith("LEDE:"):
                lede = line.split(":", 1)[1].strip()
                index += 1
                continue
            if line.startswith("NOTE:"):
                note = line.split(":", 1)[1].strip()
                index += 1
                continue
            if line.startswith("|"):
                parsed, index = parse_table(lines, index)
                table.extend(parsed)
                continue
            if current is None:
                current = Section("")
                sections.append(current)
            if line.startswith(">"):
                current.quotes.append(line.lstrip(">").strip())
            elif line.startswith("- "):
                current.bullets.append(line[2:].strip())
            else:
                current.paragraphs.append(line)
            index += 1
        pages.append(
            Page(
                layout=meta.get("layout", "columns"),
                theme=meta.get("theme", "dark"),
                section_label=meta.get("section", ""),
                title=title,
                kicker=kicker,
                lede=lede,
                note=note,
                sections=sections,
                table=table,
            )
        )
    return pages


def xml_text(value: str) -> str:
    safe = html.escape(value, quote=False)
    safe = re.sub(r"`([^`]+)`", r'<font name="JetBrainsMono">\1</font>', safe)
    safe = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", safe)
    return safe


def make_style(
    *,
    font: str,
    size: float,
    leading: float,
    color: colors.Color,
    align: int = TA_LEFT,
    space_after: float = 0,
) -> ParagraphStyle:
    return ParagraphStyle(
        name=f"{font}-{size}-{leading}-{align}",
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=align,
        spaceAfter=space_after,
        splitLongWords=False,
        allowWidows=0,
        allowOrphans=0,
    )


def paragraph_height(text: str, width: float, style: ParagraphStyle) -> float:
    para = Paragraph(xml_text(text), style)
    _, height = para.wrap(width, PAGE_H)
    return height


def draw_paragraph(
    c: canvas.Canvas,
    text: str,
    x: float,
    top: float,
    width: float,
    style: ParagraphStyle,
    *,
    max_height: float | None = None,
) -> float:
    para = Paragraph(xml_text(text), style)
    _, height = para.wrap(width, PAGE_H)
    if max_height is not None and height > max_height:
        size = style.fontSize
        while height > max_height and size > 6.7:
            size -= 0.25
            scaled = make_style(
                font=style.fontName,
                size=size,
                leading=size * (style.leading / style.fontSize),
                color=style.textColor,
                align=style.alignment,
            )
            para = Paragraph(xml_text(text), scaled)
            _, height = para.wrap(width, PAGE_H)
    para.drawOn(c, x, top - height)
    return top - height


def draw_background(c: canvas.Canvas, theme: str, page_index: int) -> None:
    dark = theme == "dark"
    c.setFillColor(OBSIDIAN if dark else PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.saveState()
    c.setStrokeColor(GOLD if dark else BRONZE)
    c.setLineWidth(0.45)
    c.setStrokeAlpha(0.055 if dark else 0.045)
    offset = (page_index * 17) % 54
    for x in range(-40 + offset, int(PAGE_W) + 80, 54):
        c.line(x, 0, x, PAGE_H)
    for y in range(-30 + offset // 2, int(PAGE_H) + 60, 54):
        c.line(0, y, PAGE_W, y)
    c.setStrokeAlpha(0.14 if dark else 0.08)
    radius = 122 + (page_index % 4) * 24
    c.circle(PAGE_W - 64, 42, radius, fill=0, stroke=1)
    c.circle(PAGE_W - 64, 42, radius - 42, fill=0, stroke=1)
    c.restoreState()


def draw_header_footer(
    c: canvas.Canvas,
    page: Page,
    page_index: int,
    logo: ImageReader,
) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    c.saveState()
    c.drawImage(logo, 41, 492, width=18, height=18, mask="auto")
    c.setFont("JetBrainsMono-Bold", 6.4)
    c.setFillColor(GOLD if dark else BRONZE)
    c.drawString(68, 500, "KRAMANITI")
    c.setFillColor(secondary)
    c.setFont("JetBrainsMono", 6.2)
    c.drawString(68, 489, page.section_label.upper()[:42])
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.42)
    c.setLineWidth(0.55)
    c.line(PAGE_W - 210, 499, PAGE_W - 56, 499)
    c.setStrokeAlpha(1)
    c.setFont("JetBrainsMono", 6.3)
    c.setFillColor(secondary)
    c.drawString(58, 25, "KRAMANITI / BRAND BOOK / FOUNDATIONAL EDITION")
    c.setFillColor(primary)
    c.setFont("JetBrainsMono-Bold", 7)
    c.drawRightString(PAGE_W - 58, 25, f"{page_index:02d}")
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.28)
    c.line(58, 40, PAGE_W - 58, 40)
    c.restoreState()


def draw_title_block(c: canvas.Canvas, page: Page) -> float:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    c.setFillColor(GOLD if dark else BRONZE)
    c.setFont("JetBrainsMono-Bold", 7.3)
    c.drawString(MARGIN_X, 459, page.kicker.upper())
    title_size = 30 if len(page.title) < 28 else 27
    title_style = make_style(font="Outfit-ExtraBold", size=title_size, leading=title_size * 1.04, color=primary)
    title_bottom = draw_paragraph(c, page.title, MARGIN_X, 441, 675, title_style, max_height=68)
    if page.lede:
        lede_style = make_style(font="Outfit", size=11.7, leading=16.8, color=secondary)
        lede_bottom = draw_paragraph(c, page.lede, MARGIN_X, title_bottom - 12, 700, lede_style, max_height=42)
    else:
        lede_bottom = title_bottom
    c.saveState()
    c.setFillColor(GOLD)
    c.circle(PAGE_W - 75, 431, 4, fill=1, stroke=0)
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.38)
    c.line(PAGE_W - 220, 431, PAGE_W - 75, 431)
    c.restoreState()
    return min(lede_bottom - 22, 365)


def section_content_height(section: Section, width: float, dark: bool, size: float = 8.5) -> float:
    height = 19
    body = make_style(
        font="Outfit",
        size=size,
        leading=size * 1.43,
        color=SILVER if dark else SLATE,
    )
    for paragraph in section.paragraphs:
        height += paragraph_height(paragraph, width, body) + 5
    height += len(section.bullets) * (size * 1.65)
    height += len(section.quotes) * (size * 2.4)
    return height


def draw_section(
    c: canvas.Canvas,
    section: Section,
    x: float,
    top: float,
    width: float,
    *,
    dark: bool,
    number: int | None = None,
    compact: bool = False,
) -> float:
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    if number is not None:
        c.setFont("JetBrainsMono-Bold", 6.8)
        c.setFillColor(GOLD if dark else BRONZE)
        c.drawString(x, top, f"{number:02d}")
        title_x = x + 26
    else:
        title_x = x
    title_style = make_style(
        font="Outfit-SemiBold",
        size=10.7 if compact else 12,
        leading=13 if compact else 15,
        color=primary,
    )
    y = draw_paragraph(c, section.title, title_x, top + 2, width - (title_x - x), title_style)
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.45)
    c.setLineWidth(0.55)
    c.line(x, y - 7, x + min(width, 68), y - 7)
    c.setStrokeAlpha(1)
    y -= 18
    body_size = 7.7 if compact else 8.8
    body = make_style(
        font="Outfit",
        size=body_size,
        leading=body_size * 1.45,
        color=secondary,
    )
    for paragraph in section.paragraphs:
        y = draw_paragraph(c, paragraph, x, y, width, body)
        y -= 6
    for bullet in section.bullets:
        c.setFillColor(GOLD)
        c.circle(x + 3, y - 4.5, 1.5, fill=1, stroke=0)
        y = draw_paragraph(c, bullet, x + 12, y, width - 12, body)
        y -= 4
    for quote in section.quotes:
        quote_style = make_style(
            font="Outfit-Medium",
            size=body_size + 0.4,
            leading=(body_size + 0.4) * 1.38,
            color=primary,
        )
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.5)
        c.line(x, y + 2, x, y - 26)
        y = draw_paragraph(c, quote, x + 12, y, width - 12, quote_style)
        y -= 8
    return y


def draw_columns(c: canvas.Canvas, page: Page, top: float, columns: int | None = None) -> None:
    sections = [section for section in page.sections if section.title or section.paragraphs or section.bullets]
    if not sections:
        return
    if columns is None:
        columns = 3 if len(sections) in {3, 5, 6} else 2
        if len(sections) == 1:
            columns = 1
    gap = 25
    width = (CONTENT_W - gap * (columns - 1)) / columns
    dark = page.theme == "dark"
    rows = math.ceil(len(sections) / columns)
    available = top - 60
    row_height = available / rows
    for index, section in enumerate(sections):
        col = index % columns
        row = index // columns
        x = MARGIN_X + col * (width + gap)
        section_top = top - row * row_height
        draw_section(
            c,
            section,
            x,
            section_top,
            width,
            dark=dark,
            number=index + 1,
            compact=rows > 1,
        )


def draw_table_page(c: canvas.Canvas, page: Page, top: float) -> None:
    if not page.table:
        draw_columns(c, page, top)
        return
    dark = page.theme == "dark"
    header_bg = GOLD if dark else INK
    header_text = OBSIDIAN if dark else PAPER
    body_bg = GRAPHITE if dark else colors.white
    alt_bg = CHARCOAL if dark else HexColor("#F3F0E9")
    body_text = ICE if dark else INK
    rows = [[xml_text(cell) for cell in row] for row in page.table]
    col_count = max(len(row) for row in rows)
    if col_count == 3:
        widths = [CONTENT_W * 0.25, CONTENT_W * 0.18, CONTENT_W * 0.57]
    elif col_count == 4:
        widths = [CONTENT_W * 0.2, CONTENT_W * 0.16, CONTENT_W * 0.2, CONTENT_W * 0.44]
    elif col_count == 5:
        widths = [CONTENT_W * 0.18, CONTENT_W * 0.16, CONTENT_W * 0.2, CONTENT_W * 0.22, CONTENT_W * 0.24]
    else:
        widths = [CONTENT_W / col_count] * col_count
    table_data: list[list[Paragraph]] = []
    for row_index, row in enumerate(rows):
        table_row = []
        for cell in row:
            style = make_style(
                font="Outfit-SemiBold" if row_index == 0 else "Outfit",
                size=7.4 if row_index == 0 else 7.25,
                leading=9.4,
                color=header_text if row_index == 0 else body_text,
            )
            table_row.append(Paragraph(cell, style))
        table_data.append(table_row)
    table = Table(table_data, colWidths=widths, repeatRows=1)
    table_style = [
        ("BACKGROUND", (0, 0), (-1, 0), header_bg),
        ("TEXTCOLOR", (0, 0), (-1, 0), header_text),
        ("BACKGROUND", (0, 1), (-1, -1), body_bg),
        ("GRID", (0, 0), (-1, -1), 0.45, SMOKE if dark else RULE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]
    for row_index in range(2, len(table_data), 2):
        table_style.append(("BACKGROUND", (0, row_index), (-1, row_index), alt_bg))
    table.setStyle(TableStyle(table_style))
    _, height = table.wrap(CONTENT_W, top - 54)
    table.drawOn(c, MARGIN_X, top - height)
    if page.sections:
        note_top = top - height - 18
        for section in page.sections[:2]:
            if section.title or section.paragraphs:
                note_top = draw_section(
                    c,
                    section,
                    MARGIN_X,
                    note_top,
                    CONTENT_W,
                    dark=dark,
                    compact=True,
                )


def draw_cover(c: canvas.Canvas, page: Page, logo: ImageReader) -> None:
    c.setFillColor(OBSIDIAN)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.saveState()
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.7)
    for offset, alpha in [(0, 0.48), (36, 0.26), (72, 0.12)]:
        c.setStrokeAlpha(alpha)
        c.roundRect(540 + offset, -170 + offset, 430 - offset * 0.8, 620 - offset * 0.9, 60, fill=0, stroke=1)
    c.setStrokeAlpha(0.35)
    c.line(56, 442, 433, 442)
    c.line(433, 442, 433, 205)
    c.setFillColor(GOLD)
    c.circle(433, 442, 4.2, fill=1, stroke=0)
    c.circle(433, 205, 3.2, fill=1, stroke=0)
    c.restoreState()
    c.drawImage(logo, 58, 454, width=28, height=28, mask="auto")
    c.setFont("JetBrainsMono-Bold", 7.2)
    c.setFillColor(GOLD)
    c.drawString(98, 469, page.kicker)
    title_style = make_style(font="Outfit-ExtraBold", size=54, leading=55, color=ICE)
    draw_paragraph(c, page.title, 58, 372, 550, title_style)
    lede_style = make_style(font="Outfit", size=14, leading=20, color=SILVER)
    draw_paragraph(c, page.lede, 61, 241, 480, lede_style)
    c.setStrokeColor(GOLD)
    c.setLineWidth(2)
    c.line(61, 186, 162, 186)
    c.setFillColor(ICE)
    c.setFont("Outfit-SemiBold", 8.8)
    c.drawString(61, 159, page.note)
    c.setFillColor(SLATE)
    c.setFont("JetBrainsMono", 6.7)
    c.drawString(61, 50, "STRATEGY / SYSTEMS / COMMUNICATION")
    c.drawRightString(PAGE_W - 58, 50, "KRAMANITI.COM")


def draw_divider(c: canvas.Canvas, page: Page, page_index: int, logo: ImageReader) -> None:
    draw_background(c, "dark", page_index)
    c.saveState()
    c.setFillColor(GOLD)
    c.setFillAlpha(0.08)
    c.setFont("Outfit-ExtraBold", 174)
    c.drawRightString(PAGE_W - 30, 112, page.section_label)
    c.setFillAlpha(1)
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.28)
    c.setLineWidth(0.8)
    for index in range(5):
        c.circle(PAGE_W - 172, PAGE_H / 2, 52 + index * 36, fill=0, stroke=1)
    c.setStrokeAlpha(1)
    c.restoreState()
    c.drawImage(logo, 58, 452, width=23, height=23, mask="auto")
    c.setFont("JetBrainsMono-Bold", 7.2)
    c.setFillColor(GOLD)
    c.drawString(96, 465, page.kicker)
    title_style = make_style(font="Outfit-ExtraBold", size=57, leading=60, color=ICE)
    draw_paragraph(c, page.title, 58, 364, 570, title_style)
    lede_style = make_style(font="Outfit-Medium", size=14.5, leading=21, color=SILVER)
    draw_paragraph(c, page.lede, 61, 247, 550, lede_style)
    c.setFillColor(SLATE)
    c.setFont("Outfit", 8.6)
    c.drawString(61, 104, page.note)
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.4)
    c.line(61, 82, 344, 82)
    c.setStrokeAlpha(1)
    c.setFont("JetBrainsMono", 6.4)
    c.setFillColor(SILVER)
    c.drawString(61, 55, f"{page_index:02d} / KRAMANITI BRAND SYSTEM")


def draw_statement(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    sections = page.sections
    gap = 22
    width = (CONTENT_W - gap * 2) / 3
    for index, section in enumerate(sections[:3]):
        x = MARGIN_X + index * (width + gap)
        c.setFillColor(GOLD if dark else BRONZE)
        c.setFont("JetBrainsMono-Bold", 7)
        c.drawString(x, top, f"0{index + 1}")
        c.setStrokeColor(GOLD)
        c.setStrokeAlpha(0.35)
        c.line(x, top - 12, x + width, top - 12)
        c.setStrokeAlpha(1)
        draw_section(c, section, x, top - 36, width, dark=dark)
    if len(sections) > 3:
        draw_section(c, sections[3], MARGIN_X, 118, CONTENT_W, dark=dark, compact=True)


def draw_name_page(c: canvas.Canvas, page: Page, top: float) -> None:
    c.saveState()
    c.setFont("Outfit-ExtraBold", 74)
    c.setFillColor(GOLD)
    c.setFillAlpha(0.17)
    c.drawString(MARGIN_X, 237, "KRAMA")
    c.drawRightString(PAGE_W - MARGIN_X, 127, "NITI")
    c.setFillAlpha(1)
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.28)
    c.line(256, 215, 704, 215)
    c.circle(480, 215, 5, fill=0, stroke=1)
    c.setStrokeAlpha(1)
    c.restoreState()
    draw_columns(c, page, top, columns=2)


def draw_manifesto(c: canvas.Canvas, page: Page, top: float) -> None:
    quotes: list[str] = []
    for section in page.sections:
        quotes.extend(section.quotes)
    primary = INK
    width = (CONTENT_W - 30) / 2
    for index, quote in enumerate(quotes):
        col = index % 2
        row = index // 2
        x = MARGIN_X + col * (width + 30)
        y = top - row * 83
        c.setFillColor(GOLD)
        c.circle(x + 3, y - 5, 3, fill=1, stroke=0)
        style = make_style(font="Outfit-SemiBold", size=11, leading=15.2, color=primary)
        draw_paragraph(c, quote, x + 18, y, width - 18, style, max_height=62)


def draw_process(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    sections = page.sections
    count = len(sections)
    rail_y = 212
    start_x = 74
    end_x = PAGE_W - 74
    c.saveState()
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.38)
    c.setLineWidth(1)
    c.line(start_x, rail_y, end_x, rail_y)
    for index, section in enumerate(sections):
        x = start_x + (end_x - start_x) * index / max(1, count - 1)
        active = index in {0, count - 1}
        c.setFillColor(GOLD if active else (GRAPHITE if dark else PAPER))
        c.setStrokeColor(GOLD)
        c.setStrokeAlpha(0.85)
        c.circle(x, rail_y, 7 if active else 5.5, fill=1, stroke=1)
        c.setFillColor(primary)
        c.setFont("JetBrainsMono-Bold", 6.5)
        c.drawCentredString(x, rail_y - 28, f"{index + 1:02d}")
        title_style = make_style(font="Outfit-SemiBold", size=8.8, leading=10.5, color=primary, align=TA_CENTER)
        draw_paragraph(c, section.title.split("/", 1)[-1].strip(), x - 52, rail_y + 70, 104, title_style)
        description = " ".join(section.paragraphs)
        body = make_style(font="Outfit", size=6.7, leading=9.4, color=secondary, align=TA_CENTER)
        draw_paragraph(c, description, x - 53, rail_y - 44, 106, body, max_height=54)
    c.restoreState()


def draw_ai_boundary(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    sections = page.sections
    circle_y = 226
    centers = [220, 480, 740]
    for index, section in enumerate(sections[:3]):
        x = centers[index]
        c.setStrokeColor(GOLD)
        c.setStrokeAlpha(0.55)
        c.setFillColor(PAPER if not dark else GRAPHITE)
        c.circle(x, circle_y, 77, fill=1, stroke=1)
        c.setStrokeAlpha(1)
        c.setFillColor(GOLD)
        c.setFont("JetBrainsMono-Bold", 7)
        c.drawCentredString(x, circle_y + 28, f"0{index + 1}")
        title = make_style(font="Outfit-Bold", size=14, leading=16, color=primary, align=TA_CENTER)
        draw_paragraph(c, section.title, x - 62, circle_y + 12, 124, title)
        body = make_style(font="Outfit", size=7.3, leading=10.2, color=secondary, align=TA_CENTER)
        draw_paragraph(c, " ".join(section.paragraphs), x - 61, circle_y - 22, 122, body, max_height=58)
    if len(sections) > 3:
        draw_section(c, sections[3], MARGIN_X, 105, CONTENT_W, dark=dark, compact=True)


def draw_personality(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    center_x, center_y = 480, 214
    c.setFillColor(GOLD)
    c.circle(center_x, center_y, 18, fill=1, stroke=0)
    c.setFillColor(OBSIDIAN)
    c.setFont("JetBrainsMono-Bold", 6.2)
    c.drawCentredString(center_x, center_y - 2, "VOICE")
    radius = 154
    for index, section in enumerate(page.sections):
        angle = math.radians(90 - index * 360 / len(page.sections))
        x = center_x + math.cos(angle) * radius
        y = center_y + math.sin(angle) * radius
        c.setStrokeColor(GOLD)
        c.setStrokeAlpha(0.35)
        c.line(center_x, center_y, x, y)
        c.setStrokeAlpha(1)
        c.setFillColor(GOLD)
        c.circle(x, y, 4, fill=1, stroke=0)
        style = make_style(font="Outfit-SemiBold", size=10, leading=12, color=primary, align=TA_CENTER)
        draw_paragraph(c, section.title, x - 62, y + 35, 124, style)
        body = make_style(font="Outfit", size=6.6, leading=8.9, color=secondary, align=TA_CENTER)
        draw_paragraph(c, " ".join(section.paragraphs), x - 58, y - 12, 116, body, max_height=38)


def draw_tone(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    y = 198
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.5)
    c.setLineWidth(1)
    c.line(94, y, PAGE_W - 94, y)
    count = len(page.sections)
    for index, section in enumerate(page.sections):
        x = 94 + (PAGE_W - 188) * index / max(1, count - 1)
        c.setFillColor(GOLD)
        c.circle(x, y, 5, fill=1, stroke=0)
        title = make_style(font="Outfit-SemiBold", size=9.5, leading=11, color=primary, align=TA_CENTER)
        draw_paragraph(c, section.title, x - 66, y + 54, 132, title)
        body = make_style(font="Outfit", size=6.7, leading=9.2, color=secondary, align=TA_CENTER)
        draw_paragraph(c, " ".join(section.paragraphs), x - 60, y - 24, 120, body, max_height=55)


def draw_hierarchy(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    sections = page.sections
    start_x = 86
    for index, section in enumerate(sections):
        width = 590 - index * 60
        x = start_x + index * 30
        y = top - index * 58
        c.setFillColor(GRAPHITE if dark else colors.white)
        c.setStrokeColor(GOLD)
        c.setStrokeAlpha(0.24 + index * 0.05)
        c.roundRect(x, y - 43, width, 43, 8, fill=1, stroke=1)
        c.setStrokeAlpha(1)
        c.setFillColor(GOLD)
        c.setFont("JetBrainsMono-Bold", 6.5)
        c.drawString(x + 14, y - 16, f"0{index + 1}")
        title = make_style(font="Outfit-SemiBold", size=9.4, leading=11, color=primary)
        draw_paragraph(c, section.title, x + 50, y - 9, 160, title)
        body = make_style(font="Outfit", size=6.8, leading=9, color=secondary)
        draw_paragraph(c, " ".join(section.paragraphs), x + 226, y - 9, width - 242, body, max_height=30)


def draw_cta(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    widths = [260, 310, 290, 240]
    y = top
    for index, section in enumerate(page.sections):
        x = MARGIN_X if index % 2 == 0 else 495
        if index % 2 == 0 and index > 0:
            y -= 115
        box_w = widths[index % len(widths)]
        fill = GOLD if index == 0 else (GRAPHITE if dark else colors.white)
        text_color = OBSIDIAN if index == 0 else primary
        c.setFillColor(fill)
        c.setStrokeColor(GOLD if index > 0 else fill)
        c.setStrokeAlpha(0.55)
        c.roundRect(x, y - 42, box_w, 42, 8, fill=1, stroke=1)
        c.setStrokeAlpha(1)
        label = " ".join(section.paragraphs) if section.paragraphs else section.title
        c.setFillColor(text_color)
        c.setFont("Outfit-SemiBold", 9.5)
        c.drawString(x + 18, y - 26, label)
        c.setFillColor(secondary)
        c.setFont("JetBrainsMono-Bold", 6.2)
        c.drawString(x, y + 15, section.title.upper())
    if len(page.sections) > 4:
        draw_section(c, page.sections[-1], MARGIN_X, 100, CONTENT_W, dark=dark, compact=True)


def draw_logo(c: canvas.Canvas, page: Page, top: float, logo: ImageReader) -> None:
    c.saveState()
    c.setFillColor(GRAPHITE)
    c.roundRect(MARGIN_X, 92, 356, 276, 24, fill=1, stroke=0)
    c.drawImage(logo, 154, 151, width=164, height=164, mask="auto")
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.2)
    c.circle(236, 233, 112, fill=0, stroke=1)
    c.circle(236, 233, 90, fill=0, stroke=1)
    c.restoreState()
    x = 456
    y = top
    for index, section in enumerate(page.sections):
        y = draw_section(c, section, x, y, PAGE_W - MARGIN_X - x, dark=True, number=index + 1, compact=True)
        y -= 12


def draw_logo_rules(c: canvas.Canvas, page: Page, top: float, logo: ImageReader) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    c.saveState()
    box_x, box_y, box_w, box_h = 76, 108, 346, 250
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.45)
    c.setDash(4, 3)
    c.rect(box_x, box_y, box_w, box_h, fill=0, stroke=1)
    c.setDash()
    c.drawImage(logo, box_x + 87, box_y + 39, width=172, height=172, mask="auto")
    c.setFillColor(GOLD)
    c.setFont("JetBrainsMono-Bold", 6.5)
    c.drawCentredString(box_x + box_w / 2, box_y + 12, "0.25X CLEAR SPACE")
    c.setFillColor(primary)
    c.setFont("Outfit-SemiBold", 8.5)
    c.drawString(box_x, box_y - 22, "Conservative working specification")
    c.restoreState()
    x = 470
    y = top
    for index, section in enumerate(page.sections):
        y = draw_section(c, section, x, y, PAGE_W - MARGIN_X - x, dark=dark, number=index + 1, compact=True)
        y -= 8


def draw_lockup(c: canvas.Canvas, page: Page, top: float, logo: ImageReader) -> None:
    c.drawImage(logo, 86, 194, width=92, height=92, mask="auto")
    c.setFont("Outfit-ExtraBold", 39)
    c.setFillColor(ICE)
    c.drawString(227, 221, "Kramaniti")
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.35)
    c.line(185, 190, 185, 308)
    c.line(195, 250, 216, 250)
    c.setStrokeAlpha(1)
    c.setFont("JetBrainsMono-Bold", 6.4)
    c.setFillColor(GOLD)
    c.drawString(227, 204, "FUNCTIONAL TEXT PAIRING")
    draw_columns(c, page, 155, columns=2)


def draw_misuse(c: canvas.Canvas, page: Page, top: float, logo: ImageReader) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    items = page.sections[:6]
    cell_w = (CONTENT_W - 30) / 3
    cell_h = 132
    for index, section in enumerate(items):
        col = index % 3
        row = index // 3
        x = MARGIN_X + col * (cell_w + 15)
        y = top - row * (cell_h + 16)
        c.setFillColor(colors.white if not dark else GRAPHITE)
        c.setStrokeColor(RULE if not dark else SMOKE)
        c.roundRect(x, y - cell_h, cell_w, cell_h, 10, fill=1, stroke=1)
        c.saveState()
        if index == 0:
            c.scale(1.35, 0.72)
            c.drawImage(logo, (x + 18) / 1.35, (y - 74) / 0.72, width=54, height=54, mask="auto")
        elif index == 1:
            c.translate(x + 54, y - 49)
            c.rotate(25)
            c.drawImage(logo, -27, -27, width=54, height=54, mask="auto")
        elif index == 2:
            c.setFillColor(INFO)
            c.circle(x + 54, y - 48, 30, fill=1, stroke=0)
            c.drawImage(logo, x + 29, y - 73, width=50, height=50, mask="auto")
        elif index == 3:
            c.setStrokeColor(ERROR)
            c.setLineWidth(3)
            c.circle(x + 54, y - 48, 32, fill=0, stroke=1)
            c.drawImage(logo, x + 28, y - 74, width=52, height=52, mask="auto")
        elif index == 4:
            c.drawImage(logo, x + 5, y - 78, width=62, height=62, mask="auto")
        else:
            c.setFillColor(GRAPHITE)
            c.rect(x + 22, y - 82, 66, 66, fill=1, stroke=0)
            c.drawImage(logo, x + 30, y - 74, width=50, height=50, mask="auto")
        c.restoreState()
        title = make_style(font="Outfit-SemiBold", size=8, leading=10, color=primary)
        draw_paragraph(c, section.title, x + 98, y - 28, cell_w - 110, title)
        body = make_style(font="Outfit", size=6.5, leading=8.5, color=secondary)
        draw_paragraph(c, " ".join(section.paragraphs), x + 98, y - 50, cell_w - 110, body, max_height=54)
        c.setStrokeColor(ERROR)
        c.setLineWidth(1.2)
        c.line(x + 15, y - 15, x + 31, y - 31)
        c.line(x + 31, y - 15, x + 15, y - 31)


def palette_rows(page: Page) -> list[tuple[str, str, str]]:
    rows: list[tuple[str, str, str]] = []
    for row in page.table[1:]:
        if len(row) >= 3:
            rows.append((row[0], row[1], row[2]))
    return rows


def draw_palette(c: canvas.Canvas, page: Page, top: float) -> None:
    rows = palette_rows(page)
    cols = 4 if len(rows) > 8 else 3
    gap = 13
    width = (CONTENT_W - gap * (cols - 1)) / cols
    height = 91 if len(rows) > 8 else 112
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    for index, (name, hex_value, role) in enumerate(rows):
        col = index % cols
        row = index // cols
        x = MARGIN_X + col * (width + gap)
        y = top - row * (height + 11)
        try:
            swatch = HexColor(hex_value)
        except Exception:
            swatch = GOLD
        c.setFillColor(swatch)
        c.roundRect(x, y - 46, width, 46, 7, fill=1, stroke=0)
        c.setFillColor(primary)
        c.setFont("Outfit-SemiBold", 8.5)
        c.drawString(x, y - 62, name)
        c.setFillColor(GOLD if dark else BRONZE)
        c.setFont("JetBrainsMono-Bold", 6.4)
        c.drawString(x, y - 76, hex_value)
        role_style = make_style(font="Outfit", size=6.4, leading=8.2, color=secondary)
        draw_paragraph(c, role, x, y - 84, width, role_style, max_height=20)


def draw_color_ratio(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    bars = [
        ("DARK DIGITAL", [(OBSIDIAN, 0.76), (ICE, 0.18), (GOLD, 0.06)]),
        ("LIGHT EDITORIAL", [(PAPER, 0.80), (INK, 0.15), (GOLD, 0.05)]),
    ]
    y = 300
    for label, segments in bars:
        c.setFillColor(primary)
        c.setFont("JetBrainsMono-Bold", 7)
        c.drawString(MARGIN_X, y + 26, label)
        x = MARGIN_X
        for color, ratio in segments:
            width = CONTENT_W * ratio
            c.setFillColor(color)
            c.rect(x, y - 22, width, 38, fill=1, stroke=0)
            x += width
        y -= 86
    sections = page.sections
    cell_gap = 30
    cell_width = (CONTENT_W - cell_gap) / 2
    body = make_style(font="Outfit", size=7.1, leading=9.6, color=secondary)
    for index, section in enumerate(sections[:2]):
        x = MARGIN_X + index * (cell_width + cell_gap)
        c.setFillColor(GOLD)
        c.setFont("JetBrainsMono-Bold", 6.5)
        c.drawString(x, 151, f"0{index + 1}")
        title = make_style(font="Outfit-SemiBold", size=10, leading=12, color=primary)
        draw_paragraph(c, section.title, x + 26, 153, cell_width - 26, title)
        y_text = 122
        for bullet in section.bullets:
            c.setFillColor(GOLD)
            c.circle(x + 3, y_text - 4, 1.5, fill=1, stroke=0)
            y_text = draw_paragraph(c, bullet, x + 12, y_text, cell_width - 12, body)
            y_text -= 3
    if len(sections) > 2:
        section = sections[2]
        c.setFillColor(GOLD)
        c.setFont("JetBrainsMono-Bold", 6.5)
        c.drawString(MARGIN_X, 65, "03")
        title = make_style(font="Outfit-SemiBold", size=8.5, leading=10, color=primary)
        draw_paragraph(c, section.title, MARGIN_X + 26, 67, 150, title)
        draw_paragraph(c, " ".join(section.paragraphs), MARGIN_X + 184, 67, CONTENT_W - 184, body, max_height=21)


def draw_typography(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    c.setFillColor(primary)
    c.setFont("Outfit-ExtraBold", 47)
    c.drawString(MARGIN_X, 282, "Clarity before complexity.")
    c.setFillColor(GOLD)
    c.setFont("JetBrainsMono-Bold", 12)
    c.drawString(MARGIN_X, 236, "[01/UNDERSTAND]  ->  [02/BUILD]  ->  [03/COMMUNICATE]")
    c.setFillColor(secondary)
    c.setFont("Outfit", 11)
    c.drawString(MARGIN_X, 199, "ABCDEFGHIJKLMNOPQRSTUVWXYZ  abcdefghijklmnopqrstuvwxyz  0123456789")
    sections = page.sections
    gap = 20
    width = (CONTENT_W - gap * 3) / 4
    for index, section in enumerate(sections[:4]):
        x = MARGIN_X + index * (width + gap)
        c.setFillColor(GOLD)
        c.setFont("JetBrainsMono-Bold", 6.3)
        c.drawString(x, 145, f"0{index + 1}")
        title = make_style(font="Outfit-SemiBold", size=9.2, leading=11, color=primary)
        draw_paragraph(c, section.title, x + 24, 147, width - 24, title)
        body = make_style(font="Outfit", size=6.8, leading=9.1, color=secondary)
        draw_paragraph(c, " ".join(section.paragraphs), x, 116, width, body, max_height=56)


def draw_grid_page(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    grid_x, grid_y, grid_w, grid_h = 58, 88, 526, 250
    c.saveState()
    c.setFillColor(GRAPHITE if dark else colors.white)
    c.roundRect(grid_x, grid_y, grid_w, grid_h, 12, fill=1, stroke=0)
    gap = 10
    col_w = (grid_w - gap * 11) / 12
    c.setFillColor(GOLD)
    c.setFillAlpha(0.13)
    for index in range(12):
        c.rect(grid_x + index * (col_w + gap), grid_y, col_w, grid_h, fill=1, stroke=0)
    c.setFillAlpha(1)
    c.setFillColor(primary)
    c.setFont("Outfit-Bold", 25)
    c.drawString(grid_x + 18, grid_y + grid_h - 52, "One dominant axis.")
    c.setFillColor(GOLD)
    c.setFont("JetBrainsMono-Bold", 7)
    c.drawString(grid_x + 18, grid_y + 24, "12 COLUMNS / 24-32 PX GUTTER / 1200 PX MAX")
    c.restoreState()
    x = 628
    y = top
    for index, section in enumerate(page.sections):
        y = draw_section(c, section, x, y, PAGE_W - MARGIN_X - x, dark=dark, number=index + 1, compact=True)
        y -= 8


def draw_flow(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    rails = [
        (80, 320, 365, 320),
        (365, 320, 365, 185),
        (365, 185, 710, 185),
        (710, 185, 710, 282),
        (710, 282, 880, 282),
    ]
    c.saveState()
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.32)
    c.setLineWidth(1)
    for x1, y1, x2, y2 in rails:
        c.line(x1, y1, x2, y2)
    for x, y in [(80, 320), (365, 320), (365, 185), (710, 185), (710, 282), (880, 282)]:
        c.setFillColor(GOLD)
        c.circle(x, y, 4, fill=1, stroke=0)
    c.setStrokeAlpha(1)
    c.setFillColor(ICE)
    c.setFont("Outfit-Bold", 18)
    c.drawString(80, 344, "Input")
    c.drawString(331, 158, "Review")
    c.drawString(681, 310, "Output")
    c.setFillColor(GOLD)
    c.circle(538, 185, 7, fill=1, stroke=0)
    c.setFillColor(primary)
    c.setFont("JetBrainsMono-Bold", 7)
    c.drawCentredString(538, 158, "ACTIVE SIGNAL")
    c.restoreState()
    body = make_style(font="Outfit", size=7.4, leading=10.2, color=secondary)
    for index, section in enumerate(page.sections):
        x = 80 + (index % 3) * 274
        y = 112 - (index // 3) * 44
        draw_paragraph(c, f"{section.title}: {' '.join(section.paragraphs)}", x, y, 238, body, max_height=36)


def draw_motifs(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    centers = [(180, 222), (405, 222), (630, 222), (840, 222)]
    for index, section in enumerate(page.sections[:4]):
        x, y = centers[index]
        c.saveState()
        c.setStrokeColor(GOLD)
        c.setStrokeAlpha(0.42)
        if index == 0:
            c.line(x - 55, y, x + 55, y)
            for dx in [-45, 0, 45]:
                c.setFillColor(GOLD)
                c.circle(x + dx, y, 4, fill=1, stroke=0)
        elif index == 1:
            for radius in [22, 42, 62]:
                c.circle(x, y, radius, fill=0, stroke=1)
            c.setFillColor(GOLD)
            c.circle(x + 42, y, 4, fill=1, stroke=0)
        elif index == 2:
            for dx in range(-54, 55, 18):
                c.line(x + dx, y - 54, x + dx, y + 54)
            for dy in range(-54, 55, 18):
                c.line(x - 54, y + dy, x + 54, y + dy)
        else:
            c.line(x - 58, y + 38, x - 12, y + 38)
            c.line(x - 12, y + 38, x - 12, y - 34)
            c.line(x - 12, y - 34, x + 58, y - 34)
            c.setFillColor(GOLD)
            c.circle(x - 12, y - 34, 4, fill=1, stroke=0)
        c.setStrokeAlpha(1)
        c.restoreState()
        title = make_style(font="Outfit-SemiBold", size=10.5, leading=12, color=primary, align=TA_CENTER)
        draw_paragraph(c, section.title, x - 78, 132, 156, title)
        body = make_style(font="Outfit", size=6.7, leading=9.1, color=secondary, align=TA_CENTER)
        draw_paragraph(c, " ".join(section.paragraphs), x - 76, 110, 152, body, max_height=44)
    if len(page.sections) > 4:
        draw_section(c, page.sections[4], MARGIN_X, 75, CONTENT_W, dark=dark, compact=True)


def draw_atmosphere(c: canvas.Canvas, page: Page, top: float) -> None:
    words = ["Clarity", "Flow", "Build", "Trust"]
    c.saveState()
    c.setFont("Outfit-ExtraBold", 85)
    c.setFillColor(GOLD)
    for index, word in enumerate(words):
        c.setFillAlpha(0.055 + index * 0.015)
        x = -30 + index * 238
        y = 260 - (index % 2) * 92
        c.drawString(x, y, word)
    c.setFillAlpha(1)
    c.restoreState()
    draw_columns(c, page, 154, columns=2)


def draw_iconography(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    positions = [(140, 256), (330, 256), (520, 256), (710, 256), (858, 256)]
    for index, (x, y) in enumerate(positions):
        c.saveState()
        c.setStrokeColor(GOLD if index == 1 else secondary)
        c.setLineWidth(1.5)
        if index == 0:
            c.roundRect(x - 24, y - 24, 48, 48, 8, fill=0, stroke=1)
            c.line(x - 12, y, x + 13, y)
            c.line(x + 5, y + 8, x + 13, y)
            c.line(x + 5, y - 8, x + 13, y)
        elif index == 1:
            c.circle(x, y, 22, fill=0, stroke=1)
            c.circle(x, y, 4, fill=0, stroke=1)
            c.line(x, y + 4, x, y + 22)
        elif index == 2:
            c.line(x - 24, y - 18, x, y + 20)
            c.line(x, y + 20, x + 24, y - 18)
            c.line(x - 15, y - 5, x + 15, y - 5)
        elif index == 3:
            c.circle(x - 17, y, 7, fill=0, stroke=1)
            c.circle(x + 17, y, 7, fill=0, stroke=1)
            c.line(x - 10, y, x + 10, y)
        else:
            c.line(x - 23, y - 18, x + 23, y - 18)
            c.line(x - 23, y, x + 8, y)
            c.line(x - 23, y + 18, x + 23, y + 18)
        c.restoreState()
    for index, section in enumerate(page.sections[:5]):
        x = positions[index][0]
        title = make_style(font="Outfit-SemiBold", size=9.2, leading=11, color=primary, align=TA_CENTER)
        draw_paragraph(c, section.title, x - 70, 186, 140, title)
        body = make_style(font="Outfit", size=6.4, leading=8.6, color=secondary, align=TA_CENTER)
        draw_paragraph(c, " ".join(section.paragraphs), x - 66, 164, 132, body, max_height=54)


def draw_photography(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    frames = [(58, 176, 397, 174), (478, 176, 424, 174)]
    for index, (x, y, w, h) in enumerate(frames):
        c.setFillColor(GRAPHITE)
        c.roundRect(x, y, w, h, 12, fill=1, stroke=0)
        c.saveState()
        c.setStrokeColor(GOLD)
        for line_index in range(12):
            alpha = max(0.02, 0.2 - line_index * 0.014)
            c.setStrokeAlpha(alpha)
            if index == 0:
                c.line(x + w * 0.72, y + h * 0.14, x + w * (0.35 + line_index * 0.03), y + h)
            else:
                c.circle(x + w * 0.72, y + h * 0.46, 16 + line_index * 13, fill=0, stroke=1)
        c.setStrokeAlpha(1)
        c.setFillColor(GOLD)
        c.circle(x + w * 0.72, y + h * 0.46, 5, fill=1, stroke=0)
        c.restoreState()
        c.setFillColor(primary)
        c.setFont("Outfit-Bold", 16)
        c.drawString(x + 22, y + h - 37, "Directional light" if index == 0 else "Depth and space")
        c.setFillColor(secondary)
        c.setFont("Outfit", 8)
        c.drawString(x + 22, y + 22, "CONCEPT FRAME / NOT A STOCK IMAGE")
    sections = page.sections
    gap = 14
    width = (CONTENT_W - gap * 4) / 5
    for index, section in enumerate(sections[:5]):
        x = MARGIN_X + index * (width + gap)
        c.setFillColor(GOLD)
        c.setFont("JetBrainsMono-Bold", 6.2)
        c.drawString(x, 151, f"0{index + 1}")
        title = make_style(font="Outfit-SemiBold", size=8.5, leading=10, color=primary)
        draw_paragraph(c, section.title, x + 22, 153, width - 22, title)
        body = make_style(font="Outfit", size=6.25, leading=8.2, color=secondary)
        draw_paragraph(c, " ".join(section.paragraphs), x, 122, width, body, max_height=62)


def draw_data_viz(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    chart_x, chart_y, chart_w, chart_h = 78, 126, 470, 224
    c.setStrokeColor(SMOKE if dark else RULE)
    c.setLineWidth(0.7)
    c.line(chart_x, chart_y, chart_x, chart_y + chart_h)
    c.line(chart_x, chart_y, chart_x + chart_w, chart_y)
    points = [(0, 0.18), (0.18, 0.25), (0.38, 0.43), (0.58, 0.48), (0.78, 0.68), (1, 0.86)]
    c.setStrokeColor(GOLD)
    c.setLineWidth(2.2)
    path = c.beginPath()
    for index, (px, py) in enumerate(points):
        x = chart_x + px * chart_w
        y = chart_y + py * chart_h
        if index == 0:
            path.moveTo(x, y)
        else:
            path.lineTo(x, y)
    c.drawPath(path, fill=0, stroke=1)
    for px, py in points:
        x = chart_x + px * chart_w
        y = chart_y + py * chart_h
        c.setFillColor(GOLD)
        c.circle(x, y, 3.5, fill=1, stroke=0)
    c.setFillColor(primary)
    c.setFont("Outfit-Bold", 13)
    c.drawString(chart_x + 18, chart_y + chart_h - 26, "One highlighted relationship")
    c.setFillColor(secondary)
    c.setFont("JetBrainsMono", 6.2)
    c.drawRightString(chart_x + chart_w, chart_y - 18, "SOURCE / DATE / UNIT / SCOPE")
    x = 610
    y = top
    for index, section in enumerate(page.sections):
        y = draw_section(c, section, x, y, PAGE_W - MARGIN_X - x, dark=dark, number=index + 1, compact=True)
        y -= 5


def draw_applications(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    c.setFillColor(GRAPHITE if dark else colors.white)
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.3)
    c.roundRect(58, 108, 520, 250, 16, fill=1, stroke=1)
    c.setStrokeAlpha(1)
    c.setFillColor(GOLD)
    c.circle(94, 322, 8, fill=1, stroke=0)
    c.setFillColor(primary)
    c.setFont("Outfit-ExtraBold", 24)
    c.drawString(88, 266, "One useful step")
    c.setFillColor(secondary)
    c.setFont("Outfit", 9)
    c.drawString(88, 239, "Clear state. Visible action. Human control.")
    c.setFillColor(GOLD)
    c.roundRect(88, 166, 148, 34, 7, fill=1, stroke=0)
    c.setFillColor(OBSIDIAN)
    c.setFont("Outfit-SemiBold", 8.5)
    c.drawCentredString(162, 178, "Continue")
    x = 626
    y = top
    for index, section in enumerate(page.sections):
        y = draw_section(c, section, x, y, PAGE_W - MARGIN_X - x, dark=dark, number=index + 1, compact=True)
        y -= 7


def draw_social(c: canvas.Canvas, page: Page, top: float) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    cards = [(58, 112, 225, 238), (304, 112, 225, 238), (550, 112, 352, 238)]
    for index, (x, y, w, h) in enumerate(cards):
        c.setFillColor(GRAPHITE)
        c.setStrokeColor(SMOKE)
        c.roundRect(x, y, w, h, 12, fill=1, stroke=1)
        c.setFillColor(GOLD)
        c.setFont("JetBrainsMono-Bold", 6.3)
        c.drawString(x + 18, y + h - 25, f"FRAME 0{index + 1}")
        c.setFillColor(primary)
        c.setFont("Outfit-Bold", 16 if index < 2 else 19)
        lines = ["One tension.", "Build the logic.", "Offer the next useful step."]
        text = lines[index]
        title = make_style(font="Outfit-Bold", size=16 if index < 2 else 19, leading=19, color=primary)
        draw_paragraph(c, text, x + 18, y + h - 54, w - 36, title)
        c.setStrokeColor(GOLD)
        c.setStrokeAlpha(0.4)
        c.line(x + 18, y + 48, x + w - 18, y + 48)
        c.setStrokeAlpha(1)
        c.setFillColor(secondary)
        c.setFont("Outfit", 7)
        c.drawString(x + 18, y + 26, "STRATEGY / SYSTEM / CLARITY")
    sections = page.sections
    gap = 18
    width = (CONTENT_W - gap * 3) / 4
    for index, section in enumerate(sections[:4]):
        x = MARGIN_X + index * (width + gap)
        c.setFillColor(GOLD)
        c.setFont("JetBrainsMono-Bold", 6.2)
        c.drawString(x, 98, f"0{index + 1}")
        title = make_style(font="Outfit-SemiBold", size=8.6, leading=10, color=primary)
        draw_paragraph(c, section.title, x + 22, 100, width - 22, title)
        body = make_style(font="Outfit", size=6.35, leading=8.4, color=secondary)
        draw_paragraph(c, " ".join(section.paragraphs), x, 72, width, body, max_height=29)


def draw_documents(c: canvas.Canvas, page: Page, top: float, logo: ImageReader) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    x_positions = [70, 298, 526, 754]
    for index, x in enumerate(x_positions):
        w, h = 150, 212
        c.setFillColor(colors.white if index < 3 else GRAPHITE)
        c.setStrokeColor(RULE if index < 3 else SMOKE)
        c.roundRect(x, 135, w, h, 8, fill=1, stroke=1)
        c.drawImage(logo, x + 13, 313, width=18, height=18, mask="auto")
        c.setFillColor(INK if index < 3 else ICE)
        c.setFont("Outfit-Bold", 10)
        labels = ["Deck", "Report", "Proposal", "Video"]
        c.drawString(x + 13, 287, labels[index])
        c.setStrokeColor(GOLD)
        c.line(x + 13, 270, x + w - 13, 270)
        c.setFillColor(SLATE if index < 3 else SILVER)
        if index < len(page.sections):
            body = make_style(
                font="Outfit",
                size=7,
                leading=9.5,
                color=SLATE if index < 3 else SILVER,
            )
            draw_paragraph(
                c,
                " ".join(page.sections[index].paragraphs),
                x + 13,
                247,
                w - 26,
                body,
                max_height=92,
            )


def draw_governance(c: canvas.Canvas, page: Page, top: float) -> None:
    draw_process(c, page, top)


def draw_quick_reference(c: canvas.Canvas, page: Page, top: float, logo: ImageReader) -> None:
    dark = page.theme == "dark"
    primary = ICE if dark else INK
    secondary = SILVER if dark else SLATE
    c.setFillColor(GRAPHITE if dark else colors.white)
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.28)
    c.roundRect(58, 78, 210, 290, 18, fill=1, stroke=1)
    c.setStrokeAlpha(1)
    c.drawImage(logo, 105, 182, width=116, height=116, mask="auto")
    c.setFillColor(GOLD)
    c.setFont("JetBrainsMono-Bold", 6.4)
    c.drawCentredString(163, 113, "STRATEGY / SYSTEMS / COMMUNICATION")
    x = 310
    width = PAGE_W - MARGIN_X - x
    sections = page.sections
    for index, section in enumerate(sections):
        col = index % 2
        row = index // 2
        cell_w = (width - 22) / 2
        cell_x = x + col * (cell_w + 22)
        cell_top = top - row * 87
        c.setFillColor(GOLD)
        c.setFont("JetBrainsMono-Bold", 6.3)
        c.drawString(cell_x, cell_top, f"0{index + 1}")
        title = make_style(font="Outfit-SemiBold", size=9.5, leading=11, color=primary)
        draw_paragraph(c, section.title, cell_x + 24, cell_top + 2, cell_w - 24, title)
        body = make_style(font="Outfit", size=7, leading=9.5, color=secondary)
        draw_paragraph(c, " ".join(section.paragraphs), cell_x, cell_top - 23, cell_w, body, max_height=43)


def draw_back(c: canvas.Canvas, page: Page, logo: ImageReader) -> None:
    c.setFillColor(OBSIDIAN)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.saveState()
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.26)
    for radius in [100, 150, 200, 250]:
        c.circle(780, 120, radius, fill=0, stroke=1)
    c.setStrokeAlpha(1)
    c.restoreState()
    c.drawImage(logo, 58, 444, width=28, height=28, mask="auto")
    c.setFillColor(GOLD)
    c.setFont("JetBrainsMono-Bold", 7.2)
    c.drawString(98, 459, page.kicker)
    title = make_style(font="Outfit-ExtraBold", size=46, leading=48, color=ICE)
    draw_paragraph(c, page.title, 58, 353, 650, title)
    lede = make_style(font="Outfit-Medium", size=16, leading=22, color=SILVER)
    draw_paragraph(c, page.lede, 61, 226, 620, lede)
    c.setFillColor(GOLD)
    c.setFont("Outfit-SemiBold", 10)
    c.drawString(61, 104, page.note)
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.45)
    c.line(61, 82, 248, 82)
    c.setStrokeAlpha(1)
    c.setFillColor(SLATE)
    c.setFont("JetBrainsMono", 6.5)
    c.drawString(61, 55, "FOUNDATIONAL EDITION / 29 JULY 2026")
    c.linkURL("https://kramaniti.com", (61, 94, 168, 112), relative=0)


def render_page(
    c: canvas.Canvas,
    page: Page,
    page_index: int,
    logo: ImageReader,
) -> None:
    c.bookmarkPage(f"page-{page_index:02d}")
    if page.layout == "cover":
        draw_cover(c, page, logo)
        return
    if page.layout == "divider":
        draw_divider(c, page, page_index, logo)
        return
    if page.layout == "back":
        draw_back(c, page, logo)
        return
    draw_background(c, page.theme, page_index)
    draw_header_footer(c, page, page_index, logo)
    top = draw_title_block(c, page)
    layout = page.layout
    if layout in {"control", "contents", "columns", "audience", "positioning", "differentiation", "services", "credibility", "architecture", "voice", "headlines", "vocabulary", "avoid", "mechanics", "proof", "adaptation", "visual_concept", "surfaces", "asset_governance", "proof_governance", "quality", "production", "open_questions", "sources"}:
        draw_columns(c, page, top)
    elif layout in {"channel_matrix", "contrast", "type_scale"}:
        draw_table_page(c, page, top)
    elif layout == "statement":
        draw_statement(c, page, top)
    elif layout == "name":
        draw_name_page(c, page, top)
    elif layout == "manifesto":
        draw_manifesto(c, page, top)
    elif layout in {"sequence", "process"}:
        draw_process(c, page, top)
    elif layout == "promise":
        draw_statement(c, page, top)
    elif layout == "problem_map":
        draw_statement(c, page, top)
    elif layout == "ai_boundary":
        draw_ai_boundary(c, page, top)
    elif layout == "personality":
        draw_personality(c, page, top)
    elif layout == "tone":
        draw_tone(c, page, top)
    elif layout == "message_hierarchy":
        draw_hierarchy(c, page, top)
    elif layout == "message_bank":
        draw_statement(c, page, top)
    elif layout == "cta":
        draw_cta(c, page, top)
    elif layout == "logo":
        draw_logo(c, page, top, logo)
    elif layout == "logo_rules":
        draw_logo_rules(c, page, top, logo)
    elif layout == "lockup":
        draw_lockup(c, page, top, logo)
    elif layout == "misuse":
        draw_misuse(c, page, top, logo)
    elif layout in {"palette", "utility_palette"}:
        draw_palette(c, page, top)
    elif layout == "color_architecture":
        draw_statement(c, page, top)
    elif layout == "color_ratio":
        draw_color_ratio(c, page, top)
    elif layout == "typography":
        draw_typography(c, page, top)
    elif layout == "type_composition":
        draw_columns(c, page, top, columns=3)
    elif layout == "grid":
        draw_grid_page(c, page, top)
    elif layout == "flow":
        draw_flow(c, page, top)
    elif layout == "motifs":
        draw_motifs(c, page, top)
    elif layout == "atmosphere":
        draw_atmosphere(c, page, top)
    elif layout == "iconography":
        draw_iconography(c, page, top)
    elif layout == "photography":
        draw_photography(c, page, top)
    elif layout == "data_viz":
        draw_data_viz(c, page, top)
    elif layout == "motion":
        draw_columns(c, page, top, columns=3)
    elif layout == "applications":
        draw_applications(c, page, top)
    elif layout == "social":
        draw_social(c, page, top)
    elif layout == "documents":
        draw_documents(c, page, top, logo)
    elif layout == "governance":
        draw_governance(c, page, top)
    elif layout == "quick_reference":
        draw_quick_reference(c, page, top, logo)
    else:
        draw_columns(c, page, top)


def validate_source(pages: Iterable[Page]) -> None:
    supported = {
        "cover",
        "control",
        "contents",
        "divider",
        "statement",
        "name",
        "columns",
        "promise",
        "manifesto",
        "sequence",
        "positioning",
        "audience",
        "problem_map",
        "differentiation",
        "services",
        "process",
        "ai_boundary",
        "credibility",
        "architecture",
        "personality",
        "voice",
        "tone",
        "message_hierarchy",
        "message_bank",
        "headlines",
        "vocabulary",
        "avoid",
        "mechanics",
        "cta",
        "proof",
        "adaptation",
        "channel_matrix",
        "visual_concept",
        "logo",
        "logo_rules",
        "lockup",
        "misuse",
        "color_architecture",
        "palette",
        "utility_palette",
        "color_ratio",
        "contrast",
        "typography",
        "type_scale",
        "type_composition",
        "grid",
        "surfaces",
        "flow",
        "motifs",
        "atmosphere",
        "iconography",
        "photography",
        "data_viz",
        "motion",
        "applications",
        "social",
        "documents",
        "governance",
        "asset_governance",
        "proof_governance",
        "quality",
        "production",
        "quick_reference",
        "open_questions",
        "sources",
        "back",
    }
    for index, page in enumerate(pages, 1):
        if not page.title:
            raise ValueError(f"Page {index} has no title")
        if page.layout not in supported:
            raise ValueError(f"Page {index} uses unsupported layout: {page.layout}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", nargs="?", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("output", nargs="?", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    register_fonts()
    if not LOGO_PATH.exists():
        raise FileNotFoundError(f"Missing brand mark: {LOGO_PATH}")
    pages = parse_source(args.source)
    validate_source(pages)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    logo = cropped_logo(LOGO_PATH)
    document = canvas.Canvas(
        str(args.output),
        pagesize=(PAGE_W, PAGE_H),
        pageCompression=1,
        invariant=False,
    )
    document.setTitle("Kramaniti Brand Book")
    document.setAuthor("Kramaniti")
    document.setSubject("Identity, voice, visual system, applications, and governance")
    document.setCreator("Kramaniti brand system renderer")
    document.setKeywords("Kramaniti, brand book, identity, visual system, voice, governance")
    for page_index, page in enumerate(pages, 1):
        render_page(document, page, page_index, logo)
        document.showPage()
    document.save()
    print(f"Rendered {len(pages)} pages to {args.output}")


if __name__ == "__main__":
    main()
