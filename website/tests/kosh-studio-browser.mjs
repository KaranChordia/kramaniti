/** Synthetic local acceptance checks. KOSH_PLAYWRIGHT_MODULE points to an installed Playwright package. */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { unzipSync, strFromU8 } from "fflate";
const { chromium } = await import(
  process.env.KOSH_PLAYWRIGHT_MODULE || "playwright"
);
const evidence = new URL("../../docs/kosh/evidence/", import.meta.url).pathname;
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  acceptDownloads: true,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const checks = [];
const base = process.env.KOSH_STUDIO_URL || "http://127.0.0.1:3001";
async function overflow(label) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    label,
  );
}
try {
  await page.goto(`${base}/library/create`);
  await page
    .getByRole("heading", { name: "What would you like to make repeatable?" })
    .waitFor();
  await page.screenshot({
    caret: "initial",
    path: `${evidence}studio-arrival-desktop.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "A research brief", exact: true })
    .click();
  assert.match(
    await page.getByLabel("The work and the result").inputValue(),
    /supplied research/,
  );
  assert.equal(await page.getByRole("tab", { name: /^Build:/ }).count(), 0);
  await page.getByRole("button", { name: "Shape my skill" }).click();
  await page.getByLabel("Skill title").waitFor();
  assert.equal(
    await page
      .getByLabel("Skill title")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.getByLabel("Skill title").fill("A manual research method");
  await page
    .getByLabel("Use when", { exact: true })
    .fill("A decision needs supplied evidence.");
  await page.getByLabel("Input 1 name", { exact: true }).fill("Sources");
  await page
    .getByLabel("Input 1 description")
    .fill("Provide labelled source excerpts.");
  await page
    .getByLabel("Step 1", { exact: true })
    .fill("Read the sources and identify the decision.");
  await page.getByRole("button", { name: "+ Add step", exact: true }).click();
  await page
    .getByLabel("Step 2", { exact: true })
    .fill("Draft the brief with evidence and unresolved questions.");
  await page
    .getByLabel("Output", { exact: true })
    .fill("A concise decision brief.");
  await page
    .getByLabel("Quality checks", { exact: true })
    .fill("Every claim has a source.");
  await page
    .getByLabel("Limitations", { exact: true })
    .fill("Cannot independently verify facts.");
  await page.getByRole("tab", { name: /^Boundaries:/ }).click();
  await page
    .getByLabel("Escalation owner", { exact: true })
    .fill("The commissioning reviewer");
  await page.getByRole("tab", { name: /^Build:/ }).click();
  assert.match(
    await page.getByLabel("Step 2", { exact: true }).inputValue(),
    /unresolved questions/,
  );
  await page.getByLabel("Purpose", { exact: true }).focus();
  await page
    .getByLabel("Purpose", { exact: true })
    .evaluate((el) => el.setSelectionRange(5, 12));
  await page.getByRole("tab", { name: /^Boundaries:/ }).click();
  await page.getByLabel("Escalation owner", { exact: true }).waitFor();
  await page.getByRole("tab", { name: /^Build:/ }).click();
  await page.getByLabel("Purpose", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Resume at Purpose" }).click();
  assert.deepEqual(
    await page
      .getByLabel("Purpose", { exact: true })
      .evaluate((el) => [el.selectionStart, el.selectionEnd]),
    [5, 12],
  );
  checks.push(
    "Connected editing: Resume restores exact field selection after a chapter change",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => scrollTo(0, 900));
  const scrollBefore = await page.evaluate(() => scrollY);
  await page.getByRole("tab", { name: /^Boundaries:/ }).click();
  await page.getByRole("tab", { name: /^Build:/ }).click();
  await page.waitForTimeout(150);
  assert.ok(
    Math.abs((await page.evaluate(() => scrollY)) - scrollBefore) < 3,
    "Build scroll position restored",
  );
  checks.push(
    "A1: manual artifact editing, add step, explicit title focus and view scroll restoration",
  );
  await page.getByRole("tab", { name: /^Build:/ }).focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(
    () => !document.getElementById("panel-Boundaries").hidden,
  );
  assert.equal(
    await page
      .getByRole("tab", { name: /^Boundaries:/ })
      .getAttribute("aria-selected"),
    "true",
  );
  await page.keyboard.press("ArrowRight");
  await page
    .getByRole("button", { name: "Check structure", exact: true })
    .click();
  await page.getByText("Structure complete", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Use synthetic input" }).click();
  await page
    .getByRole("button", { name: "Review sample manually", exact: true })
    .click();
  await page
    .getByLabel("Sample output", { exact: true })
    .fill(
      "Two participants completed a trial (Source A). Costs were not supplied (Source B). The team must decide whether to extend.",
    );
  for (const name of [
    "Meets expected characteristics",
    "Uses only supplied evidence",
    "Respects disallowed behaviour",
  ])
    await page.getByLabel(name).selectOption("pass");
  await page
    .getByRole("button", { name: "Record human assessment", exact: true })
    .click();
  await page
    .getByText("Human assessment recorded for this exact skill and sample.", {
      exact: false,
    })
    .waitFor();
  await page.getByRole("button", { name: "Export", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Download reviewed version", exact: true })
      .isDisabled(),
    true,
  );
  await page
    .getByLabel("I acknowledge these limitations for this exact snapshot.")
    .check();
  await page.screenshot({
    caret: "initial",
    path: `${evidence}studio-export-desktop.png`,
  });
  const downloading = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download reviewed version", exact: true })
    .click();
  const download = await downloading;
  await download.saveAs(`${evidence}manual-research-reviewed.zip`);
  const zip = unzipSync(
    await readFile(`${evidence}manual-research-reviewed.zip`),
  );
  assert.equal(Object.keys(zip).length, 5);
  const manifest = JSON.parse(
    strFromU8(zip["a-manual-research-method/kosh.json"]),
  );
  assert.equal(manifest.reviewStatus, "human-reviewed");
  assert.equal(manifest.artifact.content.steps.length, 2);
  assert.ok(
    !Object.values(zip)
      .map(strFromU8)
      .join("\n")
      .includes("Two participants completed a trial"),
  );
  const report = JSON.parse(
    strFromU8(zip["a-manual-research-method/checks.json"]),
  );
  assert.equal(report.contentDigest, manifest.contentDigest);
  assert.equal(report.humanReview.contentDigest, manifest.contentDigest);
  checks.push(
    "A12/A13: real downloaded ZIP opened; exact content and review digest; samples excluded; reviewed acknowledgment enforced",
  );
  await page
    .getByText("Review sample data before including it", { exact: true })
    .click();
  await page.getByLabel("Include sample data", { exact: true }).check();
  const withSamples = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download draft", exact: true })
    .click();
  const sampleDownload = await withSamples;
  await sampleDownload.saveAs(`${evidence}manual-research-with-samples.zip`);
  const zipWithSamples = unzipSync(
    await readFile(`${evidence}manual-research-with-samples.zip`),
  );
  assert.equal(Object.keys(zipWithSamples).length, 6);
  assert.match(
    strFromU8(zipWithSamples["a-manual-research-method/tests/examples.json"]),
    /Two participants/,
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Export", exact: true })
      .evaluate((el) => document.activeElement === el),
    true,
  );
  await page.getByRole("tab", { name: /^Build:/ }).click();
  await page
    .getByLabel("Purpose", { exact: true })
    .fill("An updated purpose for the skill.");
  await page.getByRole("button", { name: "Export", exact: true }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Download reviewed version", exact: true })
      .isDisabled(),
    true,
  );
  await page.keyboard.press("Escape");
  checks.push(
    "A8: content edit invalidates review; dialog Escape returns focus to Export",
  );
  await page.getByText("Ask for a change", { exact: false }).click();
  await page
    .getByLabel("What would you like to refine?")
    .fill("Preserve this note while changing views.");
  await page
    .getByText("Design review: candidate comparison", { exact: true })
    .click();
  await page
    .getByRole("button", { name: "Prepare synthetic candidate", exact: true })
    .click();
  await page
    .getByLabel("Quality checks", { exact: true })
    .fill("A newer manual edit that must survive.");
  await page.getByRole("button", { name: "Review changes" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Apply change", exact: true })
      .isDisabled(),
    true,
  );
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Discard", exact: true })
    .click();
  assert.equal(
    await page.getByLabel("Quality checks", { exact: true }).inputValue(),
    "A newer manual edit that must survive.",
  );
  checks.push(
    "A4 fixture: stale synthetic candidate cannot overwrite later edits",
  );
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.reload().catch(() => {});
  assert.equal(new URL(page.url()).pathname, "/library/create");
  await page.getByRole("button", { name: "Save version", exact: true }).click();
  await page
    .getByText("Private saving is unavailable", { exact: false })
    .waitFor();
  await page.keyboard.press("Escape");
  checks.push(
    "A1: refreshing an unsaved draft can be cancelled; unavailable saving retains content",
  );
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.getByRole("tab", { name: /^Build:/ }).click();
    await page.waitForFunction(
      () => !document.getElementById("panel-Build").hidden,
    );
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForFunction(
      () =>
        document
          .querySelector("[role=tab][aria-selected=true]")
          ?.getAttribute("aria-label")
          ?.split(":")[0] === "Build" &&
        !document.getElementById("panel-Build")?.hidden,
    );
    await page.waitForTimeout(220);
    await overflow(`Build ${width}`);
    await page.screenshot({
      caret: "initial",
      path: `${evidence}studio-build-${width}.png`,
    });
    await page.getByRole("tab", { name: /^Boundaries:/ }).click();
    await overflow(`Boundaries ${width}`);
    await page.getByRole("tab", { name: /^Test:/ }).click();
    await overflow(`Test ${width}`);
    await page.getByRole("button", { name: "Export", exact: true }).click();
    await overflow(`Export ${width}`);
    await page.screenshot({
      caret: "initial",
      path: `${evidence}studio-export-${width}.png`,
    });
    await page.keyboard.press("Escape");
  }
  for (const reducedMotion of ["no-preference", "reduce"]) {
    await page.emulateMedia({ reducedMotion });
    for (const view of [
      "Build",
      "Test",
      "Boundaries",
      "Build",
      "Test",
      "Build",
    ]) {
      await page.getByRole("tab", { name: new RegExp(`^${view}:`) }).click();
      await page.waitForFunction(
        (view) =>
          document
            .querySelector("[role=tab][aria-selected=true]")
            ?.getAttribute("aria-label")
            ?.split(":")[0] === view,
        view,
      );
      const status = await page.evaluate(() => {
        const active = document.querySelector("[role=tab][aria-selected=true]");
        return {
          label: active.getAttribute("aria-label").split(":")[0],
          color: getComputedStyle(active.firstElementChild).backgroundColor,
          panels: [...document.querySelectorAll("[role=tabpanel]")]
            .filter((p) => !p.hidden)
            .map((p) => p.id),
        };
      });
      assert.equal(status.label, view);
      assert.deepEqual(status.panels, [`panel-${view}`]);
      assert.equal(status.color, "rgb(211, 182, 93)");
    }
  }
  checks.push(
    "A15: rapid tabs and reduced motion keep active gold marker, aria-selected and visible panel synchronized",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Export", exact: true }).click();
  assert.equal(
    await page
      .getByRole("dialog")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await page.keyboard.press("Escape");
  await page.evaluate(() => (document.documentElement.dataset.theme = "light"));
  await page.getByRole("tab", { name: /^Build:/ }).click();
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    caret: "initial",
    path: `${evidence}studio-light-320.png`,
  });
  await overflow("Light 320");
  checks.push(
    "A15: 1440/768/390/320 layouts without overflow, keyboard tabs, reduced motion, light theme",
  );
  page.once("dialog", (dialog) => dialog.accept());
  await page.goto(`${base}/library/create?source=source-checking-skill`);
  assert.equal(
    await page.getByLabel("Skill title").inputValue(),
    "Source-checking skill",
  );
  assert.ok(
    !(await page.getByLabel("Step 1", { exact: true }).inputValue()).includes(
      "Demonstration inputs",
    ),
  );
  await page.getByText("v1.1", { exact: false }).waitFor();
  checks.push(
    "A2: public source version 1.1 retained in separate draft; demonstration excluded",
  );
  page.once("dialog", (dialog) => dialog.accept());
  await page.goto(`${base}/library/create?source=unknown-private-id`);
  await page
    .getByText("That public resource could not be found.", { exact: false })
    .waitFor();
  checks.push("A14: unknown source has useful non-leaking state");
  assert.deepEqual(errors, []);
  checks.push("No browser console errors or page errors");
  await writeFile(
    `${evidence}browser-results.json`,
    JSON.stringify({ base, checks, errors }, null, 2) + "\n",
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
}
