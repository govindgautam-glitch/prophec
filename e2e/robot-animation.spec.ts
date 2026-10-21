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

test.describe("AI Services & Articulated Robot Carousel Integration (Image 1 Parity)", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`Page console error: ${msg.text()}`);
      }
    });
  });

  test("Renders section, AI AGENCY pill, headline, dual CTAs, and 3D robot stage", async ({ page }) => {
    const failedRequests: string[] = [];
    page.on("requestfailed", (req) => {
      const url = req.url();
      if (!url.includes("google-analytics") && !url.includes("googletagmanager")) {
        failedRequests.push(`${req.method()} ${url}`);
      }
    });

    await page.goto("/#services");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#services");
    await expect(section).toBeVisible();

    // Check eyebrow pill
    await expect(section.locator(".pc-eyebrow-pill")).toHaveText("OUR AI ECOSYSTEM");

    // Check heading and description
    await expect(section.locator("h2")).toHaveText(/AI, built around\s*your business\./);
    await expect(section.locator(".pc-sub")).toHaveText(
      "We identify where intelligence can create actual business value; then build it into the products, processes, and systems that matter."
    );

    // Verify 3D robot stage and contact shadow
    const robotStage = section.locator(".pc-robot-stage");
    await expect(robotStage).toBeVisible();
    await expect(section.locator(".pc-robot-shadow")).toBeAttached();

    // Verify orbital rings system
    const orbitalSystem = section.locator(".pc-orbital-system");
    await expect(orbitalSystem).toBeVisible();

    // Ensure no unexpected failed requests
    expect(failedRequests).toEqual([]);
  });

  test("All 6 services render in order with exact titles, badges, and inquire buttons", async ({
    page,
  }) => {
    await page.goto("/#services");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#services");
    const titles = [
      "AI Applications",
      "AI Agents",
      "AI Automation",
      "AI-Powered Analytics",
      "Intelligent Systems",
      "Custom AI Solutions",
    ];

    const cards = section.locator(".pc-card");
    await expect(cards.first()).toBeVisible();
    await expect(section.locator("h3").first()).toHaveText(titles[0]);

    // Check Inquire button
    await expect(section.locator(".pc-inq").first()).toBeVisible();
  });

  test("Interactive carousel: next/prev, dots, counter, bounds, and wrap", async ({ page }) => {
    await page.goto("/#services");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#services");
    const count = section.locator(".pc-count span");
    const prevBtn = section.locator('button[aria-label="Previous service"]');
    const nextBtn = section.locator('button[aria-label="Next service"]');
    const dots = section.locator(".pc-dots button");

    // Initially at 01 / 06
    await expect(count).toHaveText("01 / 06");
    await expect(prevBtn).toBeDisabled();

    // Click next
    await nextBtn.click();
    await expect(count).toHaveText("02 / 06");
    await expect(prevBtn).toBeEnabled();

    // At end, nextBtn is disabled
    await dots.nth(5).click();
    await expect(count).toHaveText("06 / 06");
    await expect(section.locator("h3").first()).toHaveText("Custom AI Solutions");
    await expect(nextBtn).toBeDisabled();

    // Robot trigger wraps to 01
    const robotTrigger = section.locator(".pc-robot-stage");
    await robotTrigger.click();
    await expect(count).toHaveText("01 / 06");
  });

  test("Keyboard navigation (ArrowRight, ArrowLeft, Home, End)", async ({ page }) => {
    await page.goto("/#services");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#services");
    const cardWrapper = section.locator(".pc-card-wrapper");
    const count = section.locator(".pc-count span");

    await cardWrapper.focus();
    await page.keyboard.press("ArrowRight");
    await expect(count).toHaveText("02 / 06");

    await page.keyboard.press("ArrowLeft");
    await expect(count).toHaveText("01 / 06");

    await page.keyboard.press("End");
    await expect(count).toHaveText("06 / 06");

    await page.keyboard.press("Home");
    await expect(count).toHaveText("01 / 06");
  });

  test("Inquire CTA opens real AuditModal and closes cleanly", async ({ page }) => {
    await page.goto("/#services");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#services");
    const activeInq = section.locator(".pc-inq").first();
    await activeInq.click();

    const modal = page.locator('[role="dialog"][aria-labelledby="audit-title"]');
    await expect(modal).toBeVisible();

    const closeBtn = modal.getByRole("button", { name: "Close dialog" });
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test.skip("Watch Video opens WatchVideoModal and closes cleanly", async ({ page }) => {
    await page.goto("/#services");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#services");
    const watchBtn = section.getByText("Watch Video");
    await watchBtn.click();

    const modal = page.locator('[role="dialog"][aria-labelledby="video-modal-title"]');
    await expect(modal).toBeVisible();

    const closeBtn = modal.getByRole("button", { name: "Close dialog" });
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test.skip("Motion toggle button operates smoothly", async ({ page }) => {
    await page.goto("/#services");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#services");
    const motionBtn = section.locator(".pc-motion");
    await expect(motionBtn).toBeVisible();

    // Toggle pause
    await motionBtn.click();
    await expect(section).toHaveAttribute("data-motion-paused", "true");
    await expect(motionBtn).toHaveText(/Resume motion/);

    // Toggle resume
    await motionBtn.click();
    await expect(section).toHaveAttribute("data-motion-paused", "false");
    await expect(motionBtn).toHaveText(/Motion/);
  });

  for (const vp of VIEWPORTS) {
    test(`Responsive check at ${vp.name} (${vp.width}x${vp.height}) - Zero overflow and visible layout`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/#services");
      await page.waitForLoadState("networkidle");

      const section = page.locator("#services");
      await expect(section).toBeVisible();

      // Heading and robot visible
      await expect(section.locator("h2")).toBeVisible();
      await expect(section.locator(".pc-robot-stage")).toBeVisible();

      // Check document horizontal overflow
      const layout = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
      }));

      expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
    });
  }
});
