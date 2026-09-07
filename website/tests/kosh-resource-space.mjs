// Public resources and synthetic local edits only; no account or provider actions.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
const { chromium } = await import(
  process.env.KOSH_PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.KOSH_STUDIO_URL || "http://127.0.0.1:3001";
const evidence = new URL("../../docs/kosh/evidence/", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome", headless: true });
const checks = [],
  errors = [];
const ids = [
  "source-checking-skill",
  "research-synthesis-agent",
  "workflow-diagnostic-skill",
  "plugin-evaluation-guide",
  "agent-brief-template",
  "human-review-gate",
];
try {
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      isMobile: width < 768,
      hasTouch: width < 768,
      acceptDownloads: true,
      reducedMotion: width === 320 ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(`${base}/library/resources/source-checking-skill`);
    const map = page.getByRole("navigation", { name: "Resource spaces" });
    await map.getByRole("link", { name: /Intent/ }).waitFor();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `${evidence}resource-intent-${width}.png`,
      caret: "initial",
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    for (const link of await map.getByRole("link").all())
      assert.ok((await link.boundingBox()).height >= 44);
    await map.getByRole("link", { name: /Method/ }).click();
    await page
      .getByRole("heading", { name: "How to use", exact: true })
      .waitFor();
    await page
      .getByRole("navigation", { name: "Method parts" })
      .getByRole("link", { name: /Labels/ })
      .click();
    await page.getByRole("heading", { name: "Labels", exact: true }).waitFor();
    assert.equal(new URL(page.url()).hash, "#labels");
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `${evidence}resource-method-${width}.png`,
      caret: "initial",
    });
    await map.getByRole("link", { name: /Example/ }).click();
    await page
      .getByRole("heading", { name: "See the method at work." })
      .waitFor();
    await page
      .getByText(/This is an illustrative scenario/)
      .first()
      .waitFor();
    await map.getByRole("link", { name: /Method/ }).click();
    await page.getByRole("heading", { name: "Labels", exact: true }).waitFor();
    await page.goBack();
    await page
      .getByRole("heading", { name: "See the method at work." })
      .waitFor();
    await page.goForward();
    await page.getByRole("heading", { name: "Labels", exact: true }).waitFor();
    await map.getByRole("link", { name: /Your copy/ }).click();
    const editor = page.getByRole("textbox", {
      name: "Edit your working copy",
      exact: true,
    });
    await editor.fill(
      "# Synthetic local copy\n\nA deliberately edited method for browser verification.",
    );
    await map.getByRole("link", { name: /Review/ }).click();
    await page
      .getByRole("heading", { name: "Where a person takes over" })
      .waitFor();
    await map.getByRole("link", { name: /Your copy/ }).click();
    assert.match(await editor.inputValue(), /deliberately edited method/);
    await page.screenshot({
      path: `${evidence}resource-copy-${width}.png`,
      caret: "initial",
    });
    const pending = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Download working copy", exact: true })
      .click();
    const dl = await pending;
    await dl.saveAs(`${evidence}resource-copy-${width}.md`);
    assert.match(
      await readFile(`${evidence}resource-copy-${width}.md`, "utf8"),
      /deliberately edited method/,
    );
    // A route leave blocked while inspecting another place must reveal the draft warning.
    await map.getByRole("link", { name: /Example/ }).click();
    await page.getByRole("link", { name: /Create a skill from this/ }).click();
    await page
      .getByRole("button", { name: "Keep editing", exact: true })
      .waitFor();
    assert.equal(new URL(page.url()).hash, "#make-it-yours");
    await page
      .getByRole("button", { name: "Keep editing", exact: true })
      .click();
    assert.match(await editor.inputValue(), /deliberately edited method/);
    await page.getByRole("button", { name: /Read complete original/ }).click();
    const original = page.getByRole("dialog", { name: "Complete original" });
    await original.waitFor();
    await original
      .getByRole("heading", { name: "Edition notes", exact: true })
      .scrollIntoViewIfNeeded();
    await page.keyboard.press("Escape");
    assert.equal(await original.isVisible(), false);
    assert.equal(
      await page
        .getByRole("button", { name: /Read complete original/ })
        .evaluate((el) => el === document.activeElement),
      true,
    );
    const full = page.waitForEvent("download");
    await page
      .getByRole("link", { name: /Download complete Markdown/ })
      .click();
    const source = await full;
    await source.saveAs(`${evidence}resource-original-${width}.md`);
    assert.equal(
      await readFile(`${evidence}resource-original-${width}.md`, "utf8"),
      await readFile(
        new URL("../public/library/source-checking-skill.md", import.meta.url),
        "utf8",
      ),
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    if (width === 320) {
      await map.getByRole("link", { name: /Method/ }).click();
      assert.equal(
        await page
          .locator('[class*="focus"]')
          .evaluate((el) => getComputedStyle(el).animationName),
        "none",
      );
    }
    checks.push(
      `${width}px: spatial map, method part recall, hash history, unchanged original, copy edits survive reference/review, real download, hidden-copy leave guard and original reader Escape/focus`,
    );
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  for (const id of ids) {
    await page.goto(`${base}/library/resources/${id}#working-template`);
    const parts = page.getByRole("navigation", { name: "Method parts" });
    await parts.waitFor();
    for (const link of await parts.getByRole("link").all()) {
      await link.click();
      assert.ok(
        (
          await page.locator("[data-focus-heading]").first().textContent()
        ).trim(),
      );
    }
    await page
      .getByRole("navigation", { name: "Resource spaces" })
      .getByRole("link", { name: /Example/ })
      .click();
    await page
      .getByRole("heading", { name: "See the method at work." })
      .waitFor();
  }
  checks.push(
    "All six resources: deep-linked method, every method part and preserved demonstration render",
  );
  await page.goto(`${base}/library/resources/source-checking-skill#labels`);
  await page.getByRole("heading", { name: "Labels", exact: true }).waitFor();
  await page.evaluate(() => {
    document.documentElement.dataset.theme = "light";
    document.body.style.zoom = "2";
  });
  await page.waitForTimeout(500);
  await page.locator("[data-focus-heading]").first().scrollIntoViewIfNeeded();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.screenshot({
    path: `${evidence}resource-light-zoom.png`,
    caret: "initial",
  });
  checks.push(
    "Direct subsection URL and light theme with 200% CSS zoom reflow; actual browser-menu zoom untested",
  );
  await context.close();
  assert.deepEqual(errors, []);
  await writeFile(
    `${evidence}resource-space-results.json`,
    JSON.stringify({ base, checks, errors }, null, 2) + "\n",
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
}
