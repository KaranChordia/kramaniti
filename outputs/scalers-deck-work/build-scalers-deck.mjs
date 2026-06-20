import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "/Users/karanchordia/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const ROOT = "/Users/karanchordia/Documents/GitHub/kramaniti";
const OUT = path.join(ROOT, "outputs/kramaniti-the-scalers-5-page-deck.pptx");
const TMP = path.join(ROOT, "outputs/scalers-deck-work/tmp");
const PREVIEW = path.join(TMP, "preview");
const LAYOUT = path.join(TMP, "layout");

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

const W = 1280;
const H = 720;
const C = {
  bg: "#0B0F12",
  panel: "#111A17",
  panel2: "#17211E",
  gold: "#C9A24D",
  text: "#F4EFE6",
  muted: "#A8B0AC",
  dim: "#5F6B66",
  line: "#31423C",
};

function addText(slide, text, pos, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: pos,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontFace: style.fontFace || "Aptos",
    fontSize: style.fontSize || 20,
    color: style.color || C.text,
    bold: !!style.bold,
    italic: !!style.italic,
    ...style.extra,
  };
  return shape;
}

function addBox(slide, pos, fill = C.panel, line = C.line, radius = "rounded-lg") {
  return slide.shapes.add({
    geometry: "roundRect",
    position: pos,
    fill,
    line: { style: "solid", fill: line, width: 1 },
    borderRadius: radius,
  });
}

function addLine(slide, x1, y1, x2, y2, fill = C.line, width = 1) {
  return slide.shapes.add({
    geometry: "line",
    position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 },
    line: { style: "solid", fill, width },
  });
}

function chrome(slide, n, label = "Kramaniti x The Scalers") {
  slide.background.fill = C.bg;
  addText(slide, label.toUpperCase(), { left: 56, top: 34, width: 420, height: 22 }, {
    fontSize: 11, bold: true, color: C.gold, extra: { charSpacing: 1.2 },
  });
  addText(slide, String(n).padStart(2, "0"), { left: 1168, top: 32, width: 48, height: 24 }, {
    fontSize: 13, bold: true, color: C.muted,
  });
  addLine(slide, 56, 64, 1224, 64, "#26342F", 1);
}

function title(slide, main, sub) {
  addText(slide, main, { left: 56, top: 96, width: 780, height: 96 }, {
    fontFace: "Aptos Display", fontSize: 40, bold: true, color: C.text,
  });
  if (sub) addText(slide, sub, { left: 58, top: 190, width: 760, height: 62 }, {
    fontSize: 19, color: C.muted,
  });
}

function pill(slide, text, x, y, w) {
  addBox(slide, { left: x, top: y, width: w, height: 34 }, "#151D1A", "#3B4B43", "rounded-full");
  addText(slide, text, { left: x + 16, top: y + 8, width: w - 32, height: 16 }, {
    fontSize: 11, bold: true, color: C.gold,
  });
}

const presentation = Presentation.create({ slideSize: { width: W, height: H } });

{
  const s = presentation.slides.add();
  chrome(s, 1, "Founder referral conversation");
  addText(s, "A practical systems partner for The Scalers", { left: 56, top: 118, width: 760, height: 140 }, {
    fontFace: "Aptos Display", fontSize: 58, bold: true, color: C.text,
  });
  addText(s, "Prepared for Akshita and the hiring team after the founder conversation at WeWork Galaxy, Bengaluru.", { left: 60, top: 280, width: 660, height: 62 }, {
    fontSize: 21, color: C.muted,
  });
  pill(s, "STRATEGY BEFORE TOOLS", 60, 376, 210);
  pill(s, "SYSTEMS BEFORE SCALE", 288, 376, 210);
  pill(s, "CONTENT AFTER CLARITY", 516, 376, 210);
  addBox(s, { left: 824, top: 118, width: 344, height: 392 }, C.panel2, "#3A4A43");
  addText(s, "Why this is relevant", { left: 858, top: 154, width: 270, height: 32 }, { fontSize: 23, bold: true });
  [
    "The Scalers already sells a people-first, integrated team-building model.",
    "Hiring, onboarding, culture, and partner trust are workflow-heavy by nature.",
    "Kramaniti can turn that operating knowledge into sharper internal tools, practical AI support, and content systems.",
  ].forEach((p, i) => {
    addText(s, `0${i + 1}`, { left: 858, top: 212 + i * 82, width: 38, height: 24 }, { fontSize: 13, bold: true, color: C.gold });
    addText(s, p, { left: 902, top: 204 + i * 82, width: 220, height: 62 }, { fontSize: 17, color: C.text });
  });
  addText(s, "Text-only references. No client outcome claims added.", { left: 58, top: 652, width: 620, height: 18 }, { fontSize: 10, color: C.dim });
}

{
  const s = presentation.slides.add();
  chrome(s, 2, "Kramaniti method");
  title(s, "What Kramaniti does", "We connect business clarity, internal infrastructure, and brand communication so growth does not depend on disconnected AI experiments.");
  [
    ["01", "Strategy", "Diagnose workflow reality, bottlenecks, decision loops, and the first system worth building."],
    ["02", "Systems", "Design practical AI-assisted tools, operating workflows, documentation, and human review checkpoints."],
    ["03", "Content", "Translate internal clarity into sharper founder narrative, hiring communication, and reusable content."],
  ].forEach((l, i) => {
    const x = 74 + i * 384;
    addBox(s, { left: x, top: 320, width: 330, height: 210 }, i === 1 ? "#16231F" : C.panel, i === 1 ? C.gold : "#33443D");
    addText(s, l[0], { left: x + 28, top: 346, width: 48, height: 28 }, { fontSize: 15, bold: true, color: C.gold });
    addText(s, l[1], { left: x + 28, top: 384, width: 250, height: 36 }, { fontFace: "Aptos Display", fontSize: 31, bold: true });
    addText(s, l[2], { left: x + 28, top: 438, width: 266, height: 70 }, { fontSize: 17, color: C.muted });
    if (i < 2) addLine(s, x + 330, 425, x + 384, 425, C.gold, 2);
  });
  addText(s, "Operating principle: automate where useful, assist where judgment needs support, keep human-led where trust, taste, or context matters.", { left: 92, top: 582, width: 1060, height: 34 }, {
    fontSize: 20, bold: true, color: C.text,
  });
}

{
  const s = presentation.slides.add();
  chrome(s, 3, "The Scalers fit");
  title(s, "Where this maps to The Scalers", "The Scalers' public model is already system-shaped: recruitment, managed operations, cultural alignment, and long-term people care.");
  [
    ["Recruitment engine", "7-step process, role materials, screening, interviews, and candidate fit."],
    ["Operating support", "HR, payroll, compliance, security, office setup, partner success, and local execution."],
    ["Culture and retention", "People-first integration, transparency, empowerment, inclusivity, and team belonging."],
  ].forEach((item, i) => {
    const rowTop = 292 + i * 112;
    const titleHeight = i === 2 ? 48 : 24;
    const bodyTop = i === 2 ? rowTop + 58 : rowTop + 48;
    addBox(s, { left: 70, top: rowTop, width: 472, height: i === 2 ? 104 : 80 }, "#121B18", "#30423B");
    addText(s, item[0], { left: 96, top: rowTop + 18, width: 250, height: titleHeight }, { fontSize: 21, bold: true });
    addText(s, item[1], { left: 96, top: bodyTop, width: 390, height: i === 2 ? 42 : 28 }, { fontSize: i === 2 ? 14 : 15, color: C.muted });
  });
  addBox(s, { left: 682, top: 292, width: 448, height: 278 }, "#16231F", C.gold);
  addText(s, "Kramaniti can strengthen the internal layer behind that promise.", { left: 722, top: 328, width: 356, height: 118 }, {
    fontFace: "Aptos Display", fontSize: 27, bold: true,
  });
  addText(s, "Not by replacing people. By giving hiring and people teams clearer workflows, better knowledge systems, practical AI support, and content that makes the model easier to understand.", { left: 724, top: 464, width: 350, height: 86 }, {
    fontSize: 15, color: C.muted,
  });
  addLine(s, 562, 412, 662, 412, C.gold, 2);
  addText(s, "Sources: The Scalers homepage and About page, accessed 19 Jun 2026.", { left: 58, top: 652, width: 620, height: 18 }, { fontSize: 10, color: C.dim });
}

{
  const s = presentation.slides.add();
  chrome(s, 4, "Value proposition");
  title(s, "What Kramaniti can offer Scalers", "A focused support layer for hiring operations, recruiter enablement, and content that explains The Scalers' people-first model with more clarity.");
  [
    ["Hiring workflow clarity", "Map the journey from role intake to onboarding, identify repeated friction, and define the best first system to improve."],
    ["Recruiter AI workbench", "Prototype focused assistants for JD intake, candidate notes, outreach drafts, interview prep, and knowledge retrieval."],
    ["Candidate + partner communication", "Turn process knowledge into sharper hiring pages, recruiter scripts, explainers, and founder/leadership content."],
    ["Enablement and adoption", "Create usage rules, override points, review checkpoints, and team guidance so tools support recruiters without taking judgment away."],
  ].forEach((c, i) => {
    const x = i % 2 === 0 ? 72 : 668;
    const y = i < 2 ? 304 : 486;
    addBox(s, { left: x, top: y, width: 520, height: 132 }, i === 1 ? "#16231F" : C.panel, i === 1 ? C.gold : "#33443D");
    addText(s, `0${i + 1}`, { left: x + 26, top: y + 22, width: 40, height: 22 }, { fontSize: 13, bold: true, color: C.gold });
    addText(s, c[0], { left: x + 88, top: y + 22, width: 360, height: 34 }, { fontSize: i === 2 ? 21 : 23, bold: true });
    addText(s, c[1], { left: x + 88, top: y + 66, width: 390, height: 52 }, { fontSize: 15, color: C.muted });
  });
  addText(s, "Selected experience reference: Nexocean internal recruiter workflow tools + brand content during a five-month contract engagement.", { left: 58, top: 652, width: 860, height: 18 }, { fontSize: 10, color: C.dim });
}

{
  const s = presentation.slides.add();
  chrome(s, 5, "Suggested next step");
  addText(s, "A low-risk first engagement", { left: 56, top: 104, width: 640, height: 58 }, {
    fontFace: "Aptos Display", fontSize: 44, bold: true,
  });
  addText(s, "10-day hiring workflow audit + prototype direction", { left: 58, top: 170, width: 700, height: 34 }, {
    fontSize: 23, bold: true, color: C.gold,
  });
  addText(s, "The goal is not to sell a large AI transformation. It is to find one hiring or people workflow where a practical system can save attention, improve consistency, and support the team's existing way of working.", { left: 58, top: 224, width: 620, height: 92 }, {
    fontSize: 20, color: C.muted,
  });
  [
    ["Day 1-2", "Interview Akshita/team, review current hiring flow, collect sample role and candidate artifacts."],
    ["Day 3-5", "Map bottlenecks, handoffs, repeated writing, decision points, and tool gaps."],
    ["Day 6-8", "Design a practical AI-assisted workflow or internal tool concept around one priority use case."],
    ["Day 9-10", "Deliver the blueprint: workflow map, prototype spec, adoption rules, and content opportunities."],
  ].forEach((st, i) => {
    const y = 344 + i * 68;
    addText(s, st[0], { left: 84, top: y, width: 86, height: 24 }, { fontSize: 14, bold: true, color: C.gold });
    addLine(s, 182, y + 12, 220, y + 12, i === 3 ? C.dim : C.gold, 2);
    addText(s, st[1], { left: 244, top: y - 4, width: 460, height: 38 }, { fontSize: 16, color: C.text });
  });
  addBox(s, { left: 820, top: 166, width: 326, height: 382 }, "#16231F", C.gold);
  addText(s, "Output Akshita can evaluate", { left: 856, top: 206, width: 254, height: 34 }, { fontSize: 24, bold: true });
  ["One priority workflow", "One prototype direction", "Clear human/AI handoffs", "Recruiter-facing usage notes", "Content angles for hiring and partner trust"].forEach((o, i) => {
    addText(s, `+ ${o}`, { left: 858, top: 270 + i * 44, width: 244, height: 24 }, { fontSize: 17, color: C.text });
  });
  addText(s, "Kramaniti | Strategy before tools. Systems before scale. Content after clarity.", { left: 58, top: 652, width: 860, height: 18 }, { fontSize: 10, color: C.dim });
}

await fs.mkdir(PREVIEW, { recursive: true });
await fs.mkdir(LAYOUT, { recursive: true });
for (const [index, slide] of presentation.slides.items.entries()) {
  const stem = `slide-${String(index + 1).padStart(2, "0")}`;
  await writeBlob(path.join(PREVIEW, `${stem}.png`), await presentation.export({ slide, format: "png", scale: 1 }));
  await fs.writeFile(path.join(LAYOUT, `${stem}.layout.json`), await (await slide.export({ format: "layout" })).text());
}
await writeBlob(path.join(PREVIEW, "deck-montage.webp"), await presentation.export({ format: "webp", montage: true, scale: 1 }));
const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(OUT);
console.log(OUT);
