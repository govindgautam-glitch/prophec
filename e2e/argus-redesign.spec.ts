import { test, expect } from "@playwright/test";

test.describe("Argus Intelligence Layer Redesign Verification", () => {
  const viewports = [
    { name: "desktop-1920", width: 1920, height: 1080 },
    { name: "desktop-1440", width: 1440, height: 900 },
    { name: "laptop-1280", width: 1280, height: 800 },
    { name: "tablet-1024", width: 1024, height: 768 },
    { name: "tablet-portrait-768", width: 768, height: 1024 },
    { name: "mobile-430", width: 430, height: 932 },
    { name: "mobile-390", width: 390, height: 844 },
    { name: "mobile-375", width: 375, height: 812 },
    { name: "mobile-320", width: 320, height: 568 },
  ];

  for (const vp of viewports) {
    test(`Argus section renders without horizontal overflow at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/#argus");
      await page.waitForLoadState("networkidle");

      const section = page.locator("#argus");
      await expect(section).toBeVisible();

      // Verify no horizontal document overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow).toBe(false);

      // Verify headline & CTA are present
      await expect(section.getByRole("heading", { name: /From repetitive work/i })).toBeVisible();
      await expect(section.getByRole("button", { name: "Request Argus Access" })).toBeVisible();

      // Verify central Argus hub is visible
      await expect(section.getByText("ARGUS", { exact: true })).toBeVisible();

      // Verify all 5 modules are present
      await expect(section.getByText("WhatsApp Automation", { exact: true })).toBeVisible();
      await expect(section.getByText("Ready-Made AI Agents", { exact: true })).toBeVisible();
      await expect(section.getByText("Agent Factory", { exact: true })).toBeVisible();
      await expect(section.getByText("Workflow Automation", { exact: true })).toBeVisible();
      await expect(section.getByText("Enterprise Governance", { exact: true })).toBeVisible();
    });
  }

  test("Interactive integration tabs switch correctly across all 4 nodes", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#argus");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#argus");

    // 1. WhatsApp (default)
    await expect(section.getByText("INTEGRATION: WHATSAPP")).toBeVisible();
    await expect(section.getByText("Direct Messaging Integration")).toBeVisible();

    // 2. Click Email
    const emailBtn = section.getByRole("button", { name: "Email Integration" });
    await emailBtn.click();
    await expect(section.getByText("INTEGRATION: EMAIL")).toBeVisible();
    await expect(section.getByText("Inbox Dispatch Integration")).toBeVisible();
    await expect(section.getByText("Semantic Triage & VIP client prioritization")).toBeVisible();

    // 3. Click CRM
    const crmBtn = section.getByRole("button", { name: "CRM Integration" });
    await crmBtn.click();
    await expect(section.getByText("INTEGRATION: CRM")).toBeVisible();
    await expect(section.getByText("Pipeline Sync Integration")).toBeVisible();

    // 4. Click Accounting / ERP
    const accBtn = section.getByRole("button", { name: "Accounting / ERP Integration" });
    await accBtn.click();
    await expect(section.getByText("INTEGRATION: ACCOUNTING / ERP")).toBeVisible();
    await expect(section.getByText("Financial & Tally Integration")).toBeVisible();

    // Re-click WhatsApp
    const waBtn = section.getByRole("button", { name: "WhatsApp Integration" });
    await waBtn.click();
    await expect(section.getByText("INTEGRATION: WHATSAPP")).toBeVisible();
  });

  test("CTA opens AuditModal correctly from dark Argus section", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#argus");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#argus");
    const cta = section.getByRole("button", { name: "Request Argus Access" });
    await cta.click();

    const modal = page.locator('[role="dialog"][aria-labelledby="audit-title"]');
    await expect(modal).toBeVisible();

    const closeBtn = modal.getByRole("button", { name: "Close dialog" });
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test("Visual screenshot captures at key viewports", async ({ page }) => {
    const screenshotViewports = [
      { name: "desktop-1440", width: 1440, height: 900 },
      { name: "tablet-1024", width: 1024, height: 768 },
      { name: "mobile-390", width: 390, height: 844 },
      { name: "mobile-320", width: 320, height: 568 },
    ];

    for (const vp of screenshotViewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/#argus");
      await page.waitForLoadState("networkidle");

      const section = page.locator("#argus");
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      await section.screenshot({
        path: `test-screenshots/argus-redesign-${vp.name}.png`,
      });
    }
  });
});
