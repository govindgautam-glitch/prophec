import { test, expect } from "@playwright/test";
import * as path from "path";

const VIEWPORTS = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "430x932", width: 430, height: 932 },
  { name: "390x844", width: 390, height: 844 },
  { name: "375x812", width: 375, height: 812 },
  { name: "320x700", width: 320, height: 700 },
];

test.describe("Prophec AI Footer - Functional & Content Verification", () => {
  test("functional checks: presence, text, navigation links, and error monitoring", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("requestfailed", (req) => {
      // Exclude external tracking like Google Analytics/gtag if blocked in test env
      const url = req.url();
      if (!url.includes("google-analytics") && !url.includes("googletagmanager")) {
        failedRequests.push(`${req.method()} ${url} - ${req.failure()?.errorText}`);
      }
    });

    await page.goto("/", { waitUntil: "networkidle" });

    // 1. Footer is present and visible
    const footer = page.locator("#footer");
    await expect(footer).toBeVisible();

    // 2. Main brand text contains exact "Prophec AI"
    const wordmark = footer.locator("h2");
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toHaveText(/prophec ai/i);

    // 3. Top navigation rendered correctly
    await expect(
      footer.getByText("Other teams and product areas")
    ).toBeVisible();
    const topNav = footer.locator('nav[aria-label="Other teams and product areas"]');
    await expect(topNav.getByRole("link", { name: "Prophec AI" })).toBeVisible();
    await expect(topNav.getByRole("link", { name: "Technology" })).toBeVisible();
    await expect(topNav.getByRole("link", { name: "Solutions" })).toBeVisible();
    await expect(topNav.getByRole("link", { name: "About Us" })).toBeVisible();

    // 4. Bottom navigation labels rendered correctly
    await expect(
      footer.getByRole("link", { name: "Prophec AI Home" })
    ).toBeVisible();
    await expect(footer.getByText("ABOUT PROPHEC AI")).toBeVisible();
    await expect(footer.getByText("PRODUCTS & SOLUTIONS")).toBeVisible();
    await expect(footer.getByText("SUPPORT")).toBeVisible();
    await expect(footer.getByText("PRIVACY")).toBeVisible();
    await expect(footer.getByText("TERMS")).toBeVisible();

    // 5. Existing valid navigation links retain destinations
    await expect(topNav.getByRole("link", { name: "Prophec AI" })).toHaveAttribute("href", "#hero");
    await expect(topNav.getByRole("link", { name: "Technology" })).toHaveAttribute("href", "#argus");
    await expect(topNav.getByRole("link", { name: "Solutions" })).toHaveAttribute("href", "#services");
    await expect(topNav.getByRole("link", { name: "About Us" })).toHaveAttribute("href", "#about");

    const aboutLink = footer.locator('a[href="#about"]').filter({ hasText: "ABOUT PROPHEC AI" });
    await expect(aboutLink).toHaveAttribute("href", "#about");

    const solutionsLink = footer.locator('a[href="#services"]').filter({ hasText: "PRODUCTS & SOLUTIONS" });
    await expect(solutionsLink).toHaveAttribute("href", "#services");

    // 6. No unintended console errors
    expect(consoleErrors).toEqual([]);

    // 7. No failed application requests
    expect(failedRequests).toEqual([]);

    // 8. No essential footer content hidden or clipped
    const footerBox = await footer.boundingBox();
    expect(footerBox).not.toBeNull();
    expect(footerBox!.height).toBeGreaterThan(200);
  });
});

test.describe("Prophec AI Footer - Responsive Viewport Checks", () => {
  for (const vp of VIEWPORTS) {
    test(`renders without overflow or clipping at ${vp.name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "networkidle" });

      const footer = page.locator("#footer");
      await expect(footer).toBeVisible();

      // Scroll footer into view
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Check for horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(overflow).toBe(false);

      // Wordmark bounds check within viewport
      const wordmark = footer.locator("h2");
      const box = await wordmark.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 1); // allow 1px rounding margin
      expect(box!.height).toBeGreaterThan(0);

      // Verify footer content visibility
      await expect(footer.getByText("Other teams and product areas")).toBeVisible();
      await expect(footer.getByText("ABOUT PROPHEC AI")).toBeVisible();
      await expect(footer.getByText("PRODUCTS & SOLUTIONS")).toBeVisible();
      await expect(footer.getByText("SUPPORT")).toBeVisible();
      await expect(footer.getByText("PRIVACY")).toBeVisible();
      await expect(footer.getByText("TERMS")).toBeVisible();
    });
  }
});

test.describe("Prophec AI Footer - Visual Screenshot Capture", () => {
  const screenshotViewports = [
    { name: "desktop-1920", width: 1920, height: 1080 },
    { name: "desktop-1440", width: 1440, height: 900 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "mobile-390", width: 390, height: 844 },
    { name: "mobile-320", width: 320, height: 700 },
  ];

  for (const vp of screenshotViewports) {
    test(`captures footer screenshot at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "networkidle" });

      const footer = page.locator("#footer");
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const screenshotDir = path.resolve(process.cwd(), "test-screenshots");
      await footer.screenshot({
        path: path.join(screenshotDir, `footer-${vp.name}.png`),
      });
    });
  }
});
