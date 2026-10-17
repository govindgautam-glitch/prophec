import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-landscape-1024", width: 1024, height: 768 },
  { name: "tablet-portrait-768", width: 768, height: 1024 },
  { name: "large-mobile-430", width: 430, height: 932 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "small-mobile-320", width: 320, height: 700 },
];

test.describe("Google Labs Animated Background + Floating Prophec AI Robot", () => {
  test.beforeEach(async ({ page }) => {
    // Listen for console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`Page console error: ${msg.text()}`);
      }
    });
  });

  test("Renders section, organic background shapes, and floating robot with valid assets", async ({ page }) => {
    const failedRequests: string[] = [];
    page.on("requestfailed", (req) => {
      failedRequests.push(`${req.method()} ${req.url()}`);
    });

    await page.goto("/#services");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#services");
    await expect(section).toBeVisible();

    // Check heading and description
    const heading = section.locator("h2", { hasText: "AI, built around your business." });
    await expect(heading).toBeVisible();

    const desc = section.locator("p", { hasText: "We identify where intelligence can create actual business value." });
    await expect(desc).toBeVisible();

    // Check Google Labs animated background shapes
    const blueShape = section.locator(".animate-labs-blue");
    await expect(blueShape).toBeAttached();

    const greenShape = section.locator(".animate-labs-green");
    await expect(greenShape).toBeAttached();

    // Check Prophec AI Robot asset and visibility
    const robotImg = section.locator('img[alt*="PropheC AI Autonomous Intelligence Robot"]');
    await expect(robotImg).toBeVisible();

    // Verify natural image dimensions
    const isLoaded = await robotImg.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(isLoaded).toBe(true);

    // Check robot floating container
    const robotFloat = section.locator(".animate-robot-float");
    await expect(robotFloat).toBeVisible();

    // Check ground shadow
    const robotShadow = section.locator(".animate-robot-shadow");
    await expect(robotShadow).toBeAttached();

    // Ensure no image or script failed to load
    expect(failedRequests).toEqual([]);
  });

  test("Animation styles and properties are active and hardware-accelerated", async ({ page }) => {
    await page.goto("/#services");
    await page.waitForLoadState("domcontentloaded");

    const section = page.locator("#services");
    const blueShape = section.locator(".animate-labs-blue");
    const greenShape = section.locator(".animate-labs-green");
    const robotFloat = section.locator(".animate-robot-float");

    // Evaluate computed animations
    const blueAnim = await blueShape.evaluate((el) => window.getComputedStyle(el).animationName);
    expect(blueAnim).toContain("labsMorphBlue");

    const greenAnim = await greenShape.evaluate((el) => window.getComputedStyle(el).animationName);
    expect(greenAnim).toContain("labsMorphGreen");

    const robotAnim = await robotFloat.evaluate((el) => window.getComputedStyle(el).animationName);
    expect(robotAnim).toContain("robotFloatCycle");
  });

  test("Carousel controls and interactive cards remain fully functional with animations present", async ({ page }) => {
    await page.goto("/#services");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#services");
    const nextBtn = section.locator('button[aria-label="Next service"]');
    const prevBtn = section.locator('button[aria-label="Previous service"]');

    // Initial card title
    await expect(section.getByRole("heading", { name: "AI Applications" })).toBeVisible();

    // Click Next
    await nextBtn.click();
    await page.waitForTimeout(300);
    await expect(section.getByRole("heading", { name: "AI Agents" })).toBeVisible();

    // Click Next again
    await nextBtn.click();
    await page.waitForTimeout(300);
    await expect(section.getByRole("heading", { name: "AI Automation" })).toBeVisible();

    // Click Prev
    await prevBtn.click();
    await page.waitForTimeout(300);
    await expect(section.getByRole("heading", { name: "AI Agents" })).toBeVisible();
  });

  test("Respects prefers-reduced-motion media query", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#services");
    await page.waitForLoadState("domcontentloaded");

    const section = page.locator("#services");
    const blueShape = section.locator(".animate-labs-blue");
    const robotFloat = section.locator(".animate-robot-float");

    const blueAnim = await blueShape.evaluate((el) => window.getComputedStyle(el).animationName);
    expect(blueAnim).toBe("none");

    const robotAnim = await robotFloat.evaluate((el) => window.getComputedStyle(el).animationName);
    expect(robotAnim).toBe("none");
  });

  // Responsive layout tests across all required viewports
  for (const vp of VIEWPORTS) {
    test(`Responsive check at ${vp.name} (${vp.width}x${vp.height}): Zero overflow, visible robot & intact layout`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/#services");
      await page.waitForLoadState("networkidle");

      const section = page.locator("#services");
      await expect(section).toBeVisible();

      // Heading and robot visible
      const heading = section.locator("h2");
      await expect(heading).toBeVisible();

      const robotImg = section.locator('img[alt*="PropheC AI Autonomous Intelligence Robot"]');
      await expect(robotImg).toBeVisible();

      // Check document horizontal overflow
      const layout = await page.evaluate(() => ({
        viewportWidth: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
      }));

      expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    });
  }

  // Visual screenshot capture for refinement and verification
  const SCREENSHOT_VIEWPORTS = [
    { name: "desktop-1440", width: 1440, height: 900 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "mobile-390", width: 390, height: 844 },
    { name: "mobile-320", width: 320, height: 700 },
  ];

  for (const vp of SCREENSHOT_VIEWPORTS) {
    test(`Capture section visual screenshot at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/#services");
      await page.waitForLoadState("networkidle");

      const section = page.locator("#services");
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await section.screenshot({
        path: `test-screenshots/robot-section-${vp.name}.png`,
      });
    });
  }
});
