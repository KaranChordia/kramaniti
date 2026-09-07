// Local Chromium interaction checks for the connected Studio treatment.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { unzipSync, strFromU8 } from "fflate";
const { chromium } = await import(
  process.env.KOSH_PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.KOSH_STUDIO_URL || "http://127.0.0.1:3001";
const evidence = new URL("../../docs/kosh/evidence/", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome", headless: true });
const checks = [];
const errors = [];
try {
  for (const width of [390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
      isMobile: true,
      hasTouch: true,
      acceptDownloads: true,
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(`${base}/library/create`);
    if (width === 320)
      await page.evaluate(() =>
        Object.defineProperty(document, "startViewTransition", {
          value: undefined,
        }),
      );
    await page
      .getByRole("button", { name: "Start with a blank skill", exact: true })
      .tap();
    await page
      .getByLabel("Skill title", { exact: true })
      .fill(`Mobile review ${width}`);
    const fields = {
      Purpose: "Turn supplied notes into a reviewable brief.",
      "Use when": "A decision needs supplied evidence.",
      "Input 1 name": "Notes",
      "Input 1 description": "Supply notes and the decision question.",
      "Step 1": "Read the notes, identify evidence and missing information.",
      Output: "A brief with sources and unanswered questions.",
      "Quality checks": "Every fact comes from supplied notes.",
      Limitations: "Cannot independently verify sources.",
    };
    for (const [label, value] of Object.entries(fields))
      await page.getByLabel(label, { exact: true }).fill(value);
    await page.getByRole("button", { name: "+ Add step", exact: true }).tap();
    await page.waitForFunction(
      () => document.activeElement?.labels?.[0]?.textContent === "Step 2",
    );
    await page.keyboard.type("A temporary second step.");
    await page
      .getByRole("button", { name: "Remove step 2", exact: true })
      .tap();
    await page.waitForFunction(
      () => document.activeElement?.labels?.[0]?.textContent === "Step 1",
    );
    checks.push(
      `${width}px touch: add focuses new text; remove returns focus to the surviving step`,
    );
    if (width === 390) {
      await page.evaluate(() => {
        document.getElementById("tab-Boundaries").click();
        document.getElementById("tab-Test").click();
        document.getElementById("tab-Build").click();
        document.getElementById("tab-Boundaries").click();
      });
      await page.waitForFunction(
        () =>
          document
            .querySelector("[role=tab][aria-selected=true]")
            ?.getAttribute("aria-label")?.split(":")[0] === "Boundaries",
      );
      await page.waitForTimeout(350);
      assert.deepEqual(
        await page
          .locator("[role=tabpanel]")
          .evaluateAll((els) => els.filter((e) => !e.hidden).map((e) => e.id)),
        ["panel-Boundaries"],
      );
      checks.push(
        "Native transitions can be interrupted; latest rapid navigation wins with one matching visible panel",
      );
    } else
      await page.getByRole("tab", { name: /^Boundaries:/ }).tap();
    await page
      .getByLabel("Escalation owner", { exact: true })
      .fill("The human requesting this brief");
    await page.getByRole("tab", { name: /^Test:/ }).tap();
    await page
      .getByRole("button", { name: "Check structure", exact: true })
      .tap();
    await page.getByText("Structure complete", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Use synthetic input" }).tap();
    await page
      .getByRole("button", { name: "Review sample manually", exact: true })
      .tap();
    await page
      .getByLabel("Sample output", { exact: true })
      .fill(
        "Two participants completed a trial (Source A). Costs are missing (Source B). A human must decide.",
      );
    for (const label of [
      "Meets expected characteristics",
      "Uses only supplied evidence",
      "Respects disallowed behaviour",
    ])
      await page.getByLabel(label).selectOption("pass");
    await page
      .getByRole("button", { name: "Record human assessment", exact: true })
      .tap();
    await page
      .getByText("Human assessment recorded for this exact skill and sample.", {
        exact: false,
      })
      .waitFor();
    await page.getByText("Ask for a change", { exact: false }).tap();
    await page
      .getByLabel("Context for a future request")
      .selectOption("custom");
    await page
      .getByLabel("Custom context", { exact: true })
      .fill("PRIVATE_STUDIO_CONTEXT_SENTINEL");
    await page.getByRole("button", { name: "Export", exact: true }).tap();
    await page
      .getByLabel("I acknowledge these limitations for this exact snapshot.")
      .check();
    const pending = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Download reviewed version", exact: true })
      .tap();
    const download = await pending;
    const path = `${evidence}mobile-reviewed-${width}.zip`;
    await download.saveAs(path);
    const files = unzipSync(await readFile(path));
    assert.equal(Object.keys(files).length, 5);
    const content = Object.values(files).map(strFromU8).join("\n");
    assert.ok(!content.includes("PRIVATE_STUDIO_CONTEXT_SENTINEL"));
    const manifest = JSON.parse(
      strFromU8(files[`mobile-review-${width}/kosh.json`]),
    );
    assert.equal(manifest.reviewStatus, "human-reviewed");
    assert.equal(manifest.artifact.content.steps.length, 1);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.screenshot({
      path: `${evidence}studio-touch-export-${width}.png`,
      caret: "initial",
    });
    checks.push(
      `${width}px touch: blank create, all fields, boundaries, sample assessment and actual reviewed ZIP; private custom context excluded`,
    );
    if (width === 320)
      checks.push(
        "Browser without native View Transitions completes the same touch workflow",
      );
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}/library/create`);
  await page
    .getByText("Explore a complete synthetic example", { exact: true })
    .click();
  await page
    .getByRole("button", { name: "Open synthetic research skill" })
    .click();
  await page.getByLabel("Skill title").waitFor();
  await page.evaluate(() => (document.body.style.zoom = "2"));
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.getByRole("button", { name: "Export", exact: true }).click();
  await page
    .getByRole("button", { name: "Download draft", exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `${evidence}studio-css-zoom-200.png`,
    caret: "initial",
  });
  checks.push(
    "200% CSS zoom: reflow and export controls remain reachable; this is not a browser-menu zoom test",
  );
  await context.close();
  assert.deepEqual(errors, []);
  await writeFile(
    `${evidence}continuity-results.json`,
    JSON.stringify({ base, checks, errors }, null, 2) + "\n",
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
}
