// Explore → resource → Create → return, entirely local and synthetic.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { unzipSync, strFromU8 } from "fflate";
const { chromium } = await import(
  process.env.KOSH_PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const base = process.env.KOSH_STUDIO_URL || "http://127.0.0.1:3001";
const evidence = new URL("../../docs/kosh/evidence/", import.meta.url).pathname;
const checks = [];
const errors = [];
try {
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: width < 768 ? 844 : 1000 },
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
    await page.goto(`${base}/library`);
    await page
      .getByRole("heading", { name: "A place for your next way of working." })
      .waitFor();
    await page.screenshot({
      path: `${evidence}world-arrival-${width}.png`,
      caret: "initial",
      fullPage: false,
    });
    const nav = page.getByRole("navigation", { name: "Kosh spaces" });
    await nav.getByRole("link", { name: "Explore", exact: true }).click();
    await page
      .getByRole("searchbox", { name: "Find a resource" })
      .fill("source");
    await page
      .getByRole("group", { name: "Resource format" })
      .getByRole("button", { name: /^Skill/ })
      .click();
    await page
      .getByRole("button", { name: "Compact view", exact: true })
      .click();
    const source = page
      .getByRole("region", { name: "Follow the work that interests you." })
      .getByRole("link", { name: /Source-checking skill/ });
    await source.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    const position = await page.evaluate(() => scrollY);
    const discoveryUrl = page.url();
    assert.equal(new URL(discoveryUrl).searchParams.get("q"), "source");
    await page.screenshot({
      path: `${evidence}world-discovery-${width}.png`,
      caret: "initial",
    });
    await source.click();
    await page.waitForURL("**/library/resources/source-checking-skill");
    await page
      .getByRole("heading", {
        name: "Source-checking skill",
        exact: true,
        level: 1,
      })
      .waitFor();
    assert.equal(
      new URL(page.url()).pathname,
      "/library/resources/source-checking-skill",
    );
    await page.screenshot({
      path: `${evidence}world-resource-${width}.png`,
      caret: "initial",
    });
    const originalDownload = page.waitForEvent("download");
    await page
      .getByRole("link", { name: "Download complete Markdown", exact: true })
      .click();
    const original = await originalDownload;
    await original.saveAs(`${evidence}original-source-${width}.md`);
    assert.equal(
      await readFile(`${evidence}original-source-${width}.md`, "utf8"),
      await readFile(
        new URL("../public/library/source-checking-skill.md", import.meta.url),
        "utf8",
      ),
    );
    await page
      .getByRole("link", { name: "Create a skill from this", exact: false })
      .click();
    await page.getByLabel("Skill title", { exact: true }).waitFor();
    assert.equal(
      new URL(page.url()).searchParams.get("source"),
      "source-checking-skill",
    );
    const method = await page
      .getByLabel("Step 1", { exact: true })
      .inputValue();
    assert.ok(!method.includes("Demonstration inputs"));
    const text = `My local skill at ${width}px must survive travelling through Kosh.`;
    await page.getByLabel("Purpose", { exact: true }).fill(text);
    await page.getByRole("button", { name: "Export", exact: true }).click();
    const packageDownload = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Download draft", exact: true })
      .click();
    const pkg = await packageDownload;
    const path = `${evidence}world-created-${width}.zip`;
    await pkg.saveAs(path);
    const files = unzipSync(await readFile(path));
    const manifest = JSON.parse(
      strFromU8(files["source-checking-skill/kosh.json"]),
    );
    assert.equal(manifest.artifact.content.purpose, text);
    assert.deepEqual(manifest.source, {
      resourceId: "source-checking-skill",
      version: "1.1",
    });
    await page
      .getByRole("button", { name: "Close dialog", exact: true })
      .click();
    await page.screenshot({
      path: `${evidence}world-created-${width}.png`,
      caret: "initial",
    });
    await nav.getByRole("link", { name: "Explore", exact: true }).click();
    await page.getByRole("searchbox", { name: "Find a resource" }).waitFor();
    assert.equal(
      await page
        .getByRole("searchbox", { name: "Find a resource" })
        .inputValue(),
      "source",
    );
    assert.equal(
      await page
        .getByRole("group", { name: "Resource format" })
        .getByRole("button", { name: /^Skill/ })
        .getAttribute("aria-pressed"),
      "true",
    );
    assert.equal(
      await page
        .getByRole("button", { name: "Compact view", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.waitForTimeout(350);
    assert.ok(
      Math.abs((await page.evaluate(() => scrollY)) - position) < 8,
      `Discovery scroll restored at ${width}`,
    );
    // Leaving from Explore must protect the draft held by the shared world.
    const leave = page.waitForEvent("dialog");
    const leaveClick = page.getByRole("link", { name: "Kramaniti ↗", exact: true }).click();
    const warning = await leave;
    assert.match(warning.message(), /drafts live only in this tab/);
    await warning.dismiss();
    await leaveClick;
    assert.equal(new URL(page.url()).pathname, "/library");
    // Native back/forward reopens the original draft in tab memory, not server storage.
    await page.goBack();
    await page.getByLabel("Purpose", { exact: true }).waitFor();
    assert.equal(
      await page.getByLabel("Purpose", { exact: true }).inputValue(),
      text,
    );
    await page.goBack();
    await page
      .getByRole("heading", {
        name: "Source-checking skill",
        exact: true,
        level: 1,
      })
      .waitFor();
    await page.goForward();
    await page.getByLabel("Purpose", { exact: true }).waitFor();
    assert.equal(
      await page.getByLabel("Purpose", { exact: true }).inputValue(),
      text,
    );
    await nav.getByRole("link", { name: "My work", exact: true }).click();
    await page
      .getByRole("heading", { name: "A library of your own.", exact: true })
      .waitFor();
    await nav.getByRole("link", { name: "Create", exact: true }).click();
    await page.getByLabel("Purpose", { exact: true }).waitFor();
    assert.equal(
      await page.getByLabel("Purpose", { exact: true }).inputValue(),
      text,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    checks.push(
      `${width}px: filtered/compact Explore → original resource download → source-backed manual skill → actual ZIP → restored discovery scroll/filter → native back/forward and My work/Create retain the local draft`,
    );
    if (width === 320) {
      assert.equal(
        await page
          .locator('[class*="scene"]')
          .evaluate((el) => getComputedStyle(el).animationName),
        "none",
      );
      checks.push(
        "320px reduced motion keeps all spaces understandable and functional without spatial animation",
      );
    }
    await context.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(
    `${evidence}world-results.json`,
    JSON.stringify({ base, checks, errors }, null, 2) + "\n",
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
}
