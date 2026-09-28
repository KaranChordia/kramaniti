// Public, local discovery and navigation checks. No accounts or provider calls.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const { chromium } = await import(
  process.env.KOSH_PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.KOSH_STUDIO_URL || "http://127.0.0.1:3003";
const evidence = process.env.KOSH_EVIDENCE_DIR || "/tmp/kosh-ui-qa/";
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const checks = [],
  errors = [];
const localPreviewNotices = new Set();
try {
  for (const width of [1440, 768, 521, 390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      isMobile: width < 768,
      hasTouch: width < 768,
      reducedMotion: width === 320 ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const url = message.location().url;
      const expectedLocalScripts = [
        "/_vercel/insights/script.js",
        "/_vercel/speed-insights/script.js",
      ];
      if (
        ["127.0.0.1", "localhost"].includes(new URL(base).hostname) &&
        expectedLocalScripts.some((path) => url === `${base}${path}`) &&
        message.text().includes("404")
      ) {
        localPreviewNotices.add(url);
      } else errors.push(`${message.text()} (${url})`);
    });
    await page.goto(`${base}/library`);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.waitForTimeout(450);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `${width}: page overflow`,
    );
    await page.screenshot({
      path: `${evidence}discovery-arrival-${width}.png`,
      caret: "initial",
    });
    const search = page.getByRole("searchbox", { name: "Find a resource" });
    const catalogue = page.getByRole("region", {
      name: "Follow the work that interests you.",
    });
    const nav = page.getByRole("navigation", { name: "Kosh spaces" });
    if (width >= 768) {
      await page.keyboard.press("/");
      assert.equal(
        await search.evaluate((el) => el === document.activeElement),
        true,
      );
      await search.fill("source");
      await search.press("/");
      assert.equal(await search.inputValue(), "source/");
    }
    await nav.getByRole("link", { name: "Explore", exact: true }).click();
    await search.fill("source evidence");
    await page.waitForTimeout(450);
    assert.ok(
      await catalogue
        .getByRole("link", { name: /Check the facts before you publish/ })
        .isVisible(),
    );
    assert.match(await catalogue.getByRole("status").innerText(), /resources?/);
    await page
      .getByRole("button", { name: "Clear search", exact: true })
      .click();
    assert.equal(await search.inputValue(), "");
    assert.equal(
      await search.evaluate((el) => el === document.activeElement),
      true,
    );
    await page
      .getByRole("button", { name: "Improve a workflow", exact: true })
      .click();
    assert.equal(await search.inputValue(), "process");
    assert.ok(
      await catalogue
        .getByRole("link", { name: /Find where a process gets stuck/ })
        .isVisible(),
    );
    await page
      .getByRole("group", { name: "Resource format" })
      .getByRole("button", { name: /^Governance/ })
      .click();
    await page
      .getByRole("heading", { name: "A different starting point?" })
      .waitFor();
    await page.getByRole("button", { name: "Show all resources" }).click();
    assert.equal(await catalogue.locator("h3").count(), 6);
    await search.fill("no-such-method");
    await page
      .getByRole("heading", { name: "A different starting point?" })
      .waitFor();
    assert.ok(await page.getByRole("button", { name: /^Reset/ }).isVisible());
    await page.getByRole("button", { name: /^Reset/ }).click();
    await page
      .getByRole("button", { name: "Compact view", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "Compact view", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page
      .getByRole("button", { name: "Compact view", exact: true })
      .click();
    await page.waitForTimeout(500);
    await catalogue.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `${evidence}discovery-catalogue-${width}.png`,
      caret: "initial",
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    const header = page.locator("header").first();
    const headerBounds = await header.boundingBox();
    const headerTop = await header.evaluate((el) =>
      parseFloat(getComputedStyle(el).top),
    );
    assert.equal(
      Math.round(headerBounds.y),
      headerTop,
      `${width}: navigation stays at its floating offset`,
    );
    assert.ok(
      headerBounds.x >= 12 && headerBounds.width <= width - 24,
      `${width}: navigation is inset from the viewport`,
    );
    assert.equal(
      await catalogue.locator('[class*="itemIdentity"] svg').count(),
      0,
      "Category labels contain no decorative icons",
    );
    const shimmer = await header.evaluate((el) => ({
      animation: getComputedStyle(el, "::before").animationName,
      pointerEvents: getComputedStyle(el, "::before").pointerEvents,
    }));
    assert.equal(shimmer.pointerEvents, "none");
    assert.equal(
      shimmer.animation === "none",
      width === 320,
      "Border shimmer respects reduced motion",
    );
    if (width === 320) {
      assert.equal(
        await catalogue
          .locator('a[href*="/resources/"]')
          .first()
          .evaluate((el) => getComputedStyle(el).animationName),
        "none",
      );
    }
    await catalogue
      .getByRole("link", { name: /Check the facts before you publish/ })
      .click();
    await page
      .getByRole("heading", { name: "Check the facts before you publish", level: 1 })
      .waitFor();
    const map = page.getByRole("navigation", { name: "Resource spaces" });
    await map.getByRole("link", { name: /Method/ }).click();
    const heading = page.getByRole("heading", {
      name: "How to use",
      exact: true,
    });
    await heading.waitFor();
    const methodUrl = page.url();
    await page
      .getByRole("link", { name: "Skip to content", exact: true })
      .focus();
    await page.keyboard.press("Enter");
    assert.equal(
      page.url(),
      methodUrl,
      "Skip link preserves resource section hash",
    );
    await map.getByRole("link", { name: /Method/ }).click();
    await page.waitForTimeout(400);
    const bounds = await heading.boundingBox();
    const navBounds = await header.boundingBox();
    assert.ok(
      bounds.y >= navBounds.y + navBounds.height,
      `${width}: resource heading clear of sticky header`,
    );
    if (width < 768) {
      const mapBounds = await map.boundingBox();
      assert.ok(
        mapBounds.y >= navBounds.y + navBounds.height - 1,
        `${width}: resource map clear of header`,
      );
      assert.ok(
        bounds.y >= mapBounds.y + mapBounds.height,
        `${width}: resource heading clear of map`,
      );
    }
    await page.screenshot({
      path: `${evidence}discovery-resource-${width}.png`,
      caret: "initial",
    });
    await nav.getByRole("link", { name: "Explore", exact: true }).click();
    await search.waitFor();
    await page.evaluate(() => {
      document.documentElement.dataset.theme = "light";
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `${evidence}discovery-light-${width}.png`,
      caret: "initial",
    });
    checks.push(
      `${width}px: multi-word search, clear/refocus, task shortcuts, empty recovery, filters, compact view, floating navigation and border shimmer, text-only category labels, resource focus visibility, light theme and overflow passed`,
    );
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(`${base}/library?q=claims&kind=Skill&view=compact#catalogue`);
  const search = page.getByRole("searchbox", { name: "Find a resource" });
  await search.waitFor();
  assert.equal(await search.inputValue(), "claims");
  assert.equal(
    await page
      .getByRole("button", { name: "Compact view", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.reload();
  assert.equal(await search.inputValue(), "claims");
  await page.keyboard.press("Tab");
  await page.goto(`${base}/library`);
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement?.textContent),
    "Skip to content",
  );
  await page.keyboard.press("Enter");
  assert.equal(
    await page.evaluate(() => document.activeElement?.id),
    "kosh-content",
  );
  checks.push(
    "Direct filtered links and refresh preserve discovery; keyboard skip link transfers focus into content",
  );
  await context.close();
  assert.deepEqual(errors, []);
  await writeFile(
    `${evidence}discovery-results.json`,
    JSON.stringify(
      { base, checks, errors, localPreviewNotices: [...localPreviewNotices] },
      null,
      2,
    ) + "\n",
  );
  console.log(
    JSON.stringify(
      { checks, errors, localPreviewNotices: [...localPreviewNotices] },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
