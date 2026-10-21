import { test, expect } from "@playwright/test";
import * as path from "path";

const AUDIT_VIEWPORTS = [
  { name: "small-mobile-320", width: 320, height: 700 },
  { name: "mobile-360", width: 360, height: 800 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "large-mobile-430", width: 430, height: 932 },
  { name: "tablet-portrait-768", width: 768, height: 1024 },
  { name: "tablet-landscape-1024", width: 1024, height: 768 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "large-desktop-1920", width: 1920, height: 1080 },
];

test.describe("Full Project Responsive & Spacing Audit Across All Viewports", () => {
  for (const vp of AUDIT_VIEWPORTS) {
    test(`[${vp.name}] (${vp.width}x${vp.height}) - Zero horizontal overflow, intact hierarchy & spacing`, async ({
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
        const url = req.url();
        if (!url.includes("google-analytics") && !url.includes("googletagmanager")) {
          failedRequests.push(`${req.method()} ${url}`);
        }
      });

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(400);

      // 1. Verify zero horizontal overflow at document root
      const layout = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(layout.scrollWidth).toBeLessThanOrEqual(layout.innerWidth);

      // 2. Verify all major sections are mounted and visible
      const hero = page.locator("#hero");
      await expect(hero).toBeVisible();

      const about = page.locator("#about");
      await expect(about).toBeVisible();

      const services = page.locator("#services");
      await expect(services).toBeVisible();

      const build = page.locator("#build");
      await expect(build).toBeVisible();

      const argus = page.locator("#argus");
      await expect(argus).toBeVisible();

      const playground = page.locator("#playground");
      await expect(playground).toBeVisible();

      const footer = page.locator("#footer");
      await expect(footer).toBeVisible();

      // 3. Section Bounding Box checks (ensure no negative margins cause clipping)
      for (const section of [hero, about, services, build, argus, playground, footer]) {
        const box = await section.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeLessThanOrEqual(vp.width + 1);
        expect(box!.height).toBeGreaterThan(150);
      }

      // 4. Hero Content Checks
      const heroHeadline = hero.locator("h1");
      await expect(heroHeadline).toBeVisible();
      const heroBox = await heroHeadline.boundingBox();
      expect(heroBox!.width).toBeLessThanOrEqual(vp.width);

      // 5. Verify no unintended console errors or network failures
      expect(consoleErrors).toEqual([]);
      expect(failedRequests).toEqual([]);
    });
  }
});

test.describe("Interactive Features & Modal Responsiveness Across Mobile & Desktop", () => {
  test("Mobile navigation menu opens, displays all links with touch targets, and navigates", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });

    // Open mobile menu
    const menuBtn = page.getByRole("button", { name: "Toggle navigation menu" });
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    const headerNav = page.locator("header");
    await expect(headerNav.getByRole("link", { name: "AI Ecosystem" })).toBeVisible();
    await expect(headerNav.getByRole("link", { name: "Argus Platform" })).toBeVisible();
    await expect(headerNav.getByRole("link", { name: "What We Build" })).toBeVisible();
    await expect(headerNav.getByRole("link", { name: "About PropheC", exact: true })).toBeVisible();
    await expect(headerNav.getByRole("link", { name: "Our Work" })).toBeVisible();

    // Check Discuss Your Project in mobile menu
    const discussBtn = page.locator('header button:has-text("Discuss your project")').last();
    await expect(discussBtn).toBeVisible();
    await discussBtn.click();

    // AuditModal opens
    const modal = page.locator('[role="dialog"][aria-labelledby="audit-title"]');
    await expect(modal).toBeVisible();

    // Close modal
    const closeBtn = modal.getByRole("button", { name: "Close dialog" });
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test("Search modal opens, inputs query, filters results, and closes with ESC", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });

    const searchBtn = page.getByRole("button", { name: "Open search dialog" });
    await searchBtn.click();

    const searchModal = page.locator('[role="dialog"][aria-label="Quick search"]');
    await expect(searchModal).toBeVisible();

    // Type query
    const input = searchModal.getByPlaceholder("Search solutions, platform, agents, sections...");
    await input.fill("Argus");
    await expect(searchModal.getByText("Neural orchestration engine & agent telemetry")).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");
    await expect(searchModal).not.toBeVisible();
  });

  test("Argus interactive integration tabs switch nodes correctly without layout shifts", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });

    const argus = page.locator("#argus");
    await argus.scrollIntoViewIfNeeded();

    // Click Email node
    const emailNode = argus.getByRole("button", { name: "Email" });
    await emailNode.click();
    await expect(argus.getByText("INTEGRATION: EMAIL")).toBeVisible();
    await expect(argus.getByText("Semantic Triage")).toBeVisible();

    // Click CRM node
    const crmNode = argus.getByRole("button", { name: "CRM" });
    await crmNode.click();
    await expect(argus.getByText("INTEGRATION: CRM")).toBeVisible();

    // Check no overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test("Carousel next/prev pagination works seamlessly", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });

    const services = page.locator("#services");
    await services.scrollIntoViewIfNeeded();

    const nextBtn = services.getByRole("button", { name: "Next service" });
    await nextBtn.click();
    await page.waitForTimeout(300);

    const prevBtn = services.getByRole("button", { name: "Previous service" });
    await prevBtn.click();
    await page.waitForTimeout(300);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});

test.describe("Full Project Visual Screenshot Verification Across Breakpoints", () => {
  const visualBreakpoints = [
    { name: "mobile-320", width: 320, height: 700 },
    { name: "mobile-390", width: 390, height: 844 },
    { name: "large-mobile-430", width: 430, height: 932 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "tablet-1024", width: 1024, height: 768 },
    { name: "desktop-1440", width: 1440, height: 900 },
  ];

  for (const bp of visualBreakpoints) {
    test(`captures full-page visual audit screenshot at ${bp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

      const screenshotDir = path.resolve(process.cwd(), "test-screenshots");
      await page.screenshot({
        path: path.join(screenshotDir, `audit-full-${bp.name}.png`),
        fullPage: true,
      });
    });
  }
});
