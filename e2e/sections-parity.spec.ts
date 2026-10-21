import { test, expect } from "@playwright/test";

test.describe("Hero, Industry Tabs & Argus Workflow Parity", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`Page console error: ${msg.text()}`);
      }
    });
  });

  test("1. Hero Orbit: renders all elements, animates, and supports agent selection", async ({
    page,
  }) => {
    await page.goto("/#hero");
    await page.waitForLoadState("networkidle");

    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();

    // Check headings and copy
    await expect(hero.locator("h1")).toContainText("Beyond Digital.");
    await expect(hero.locator("h1 span")).toHaveText("Into Intelligent.");
    await expect(hero.locator(".hero-kicker")).toHaveText("AI-DRIVEN TECHNOLOGY & DIGITAL SOLUTIONS");

    // Check primary CTA opens AuditModal
    const discussBtn = hero.locator(".button-row button", { hasText: "Build with PropheC" });
    await expect(discussBtn).toBeVisible();
    await discussBtn.click();
    const modal = page.locator('[role="dialog"][aria-labelledby="audit-title"]');
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Close dialog" }).click();
    await expect(modal).not.toBeVisible();

    // Check secondary CTA
    const exploreLink = hero.locator('.button-row a[href="#argus"]');
    await expect(exploreLink).toHaveText("Explore Argus");

    // Orbit scene elements
    const orbit = hero.locator(".orbit-scene");
    await expect(orbit).toBeVisible();
    await expect(hero.locator(".orbit-core")).toContainText("INTELLIGENCE");
    await expect(hero.locator(".orbit-core")).toContainText("IN MOTION");

    // 4 Agent nodes
    const agents = hero.locator(".agent-node");
    await expect(agents).toHaveCount(4);

    const agentTitles = [
      "Sales Agent",
      "Customer Care",
      "Workflow Automation",
      "Human Oversight",
    ];

    for (let i = 0; i < agentTitles.length; i++) {
      await expect(agents.nth(i).locator("strong")).toHaveText(agentTitles[i]);
      await agents.nth(i).click({ force: true });
      await expect(agents.nth(i)).toHaveAttribute("aria-pressed", "true");
      await expect(hero.locator(".readout-index")).toHaveText(`0${i + 1} / 04`);
    }

    // Hero bottom bar
    await expect(hero.locator(".hero-bottom .kicker")).toHaveText("BUILT FOR REAL OPERATIONS");
    await expect(hero.locator('.hero-bottom a[href="#about"]')).toContainText("Scroll to explore");
  });

  test("2. Industry Tabs: renders 7 sectors, accessible tabs, and interactive panel", async ({
    page,
  }) => {
    await page.goto("/#industries");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#industries");
    await expect(section).toBeVisible();

    await expect(section.locator(".display-heading")).toHaveText(
      "Technology shapedaround your world."
    );

    const tabs = section.locator('.industry-tabs button[role="tab"]');
    await expect(tabs).toHaveCount(7);

    const expectedSectors = [
      "Startups",
      "Growing Businesses",
      "Enterprises",
      "Institutions",
      "Jewellery",
      "Hospitality",
      "Real Estate",
    ];

    for (let i = 0; i < expectedSectors.length; i++) {
      await expect(tabs.nth(i).locator("strong")).toHaveText(expectedSectors[i]);
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveAttribute("aria-selected", "true");

      const panel = section.locator('.industry-panel[role="tabpanel"]');
      await expect(panel.locator(".industry-panel-top .kicker")).toHaveText(
        `Industry / 0${i + 1}`
      );
      await expect(panel.locator(".outcome-list li")).toHaveCount(3);
      await expect(panel.locator(".industry-flow span")).toHaveCount(3);
    }

    // Keyboard navigation on tabs
    await tabs.first().focus();
    await page.keyboard.press("ArrowDown");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("End");
    await expect(tabs.nth(6)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Home");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

    // CTA button opens modal
    const actionBtn = section.locator(".industry-panel .text-link");
    await actionBtn.click();
    const modal = page.locator('[role="dialog"][aria-labelledby="audit-title"]');
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Close dialog" }).click();
    await expect(modal).not.toBeVisible();
  });

  test("3. Argus Workflow: renders map, 4 system nodes, animated paths, and 5 modules", async ({
    page,
  }) => {
    await page.goto("/#argus");
    await page.waitForLoadState("networkidle");

    const section = page.locator("#argus");
    await expect(section).toBeVisible();

    await expect(section.locator(".display-heading")).toContainText("AI that runs the work");
    await expect(section.locator(".argus-core strong")).toHaveText("ARGUS");
    await expect(section.locator(".argus-core span")).toHaveText("Core Intelligence");

    const systemNodes = section.locator(".system-node");
    await expect(systemNodes).toHaveCount(4);

    const channels = ["WhatsApp", "Email", "CRM", "Accounting / ERP"];

    for (let i = 0; i < channels.length; i++) {
      await systemNodes.nth(i).click();
      await expect(systemNodes.nth(i)).toHaveAttribute("aria-pressed", "true");
      await expect(section.locator(".integration-path.is-active")).toHaveCount(1);
      await expect(section.locator(".preview-tag")).toContainText(
        `INTEGRATION: ${channels[i].toUpperCase()}`
      );
      await expect(section.locator(".workflow-steps li")).toHaveCount(4);
    }

    // 5 modules
    const modules = section.locator(".argus-modules article");
    await expect(modules).toHaveCount(5);
    await expect(modules.nth(0).locator("h3")).toHaveText("WhatsApp Automation");
    await expect(modules.nth(1).locator("h3")).toHaveText("Ready-Made AI Agents");
    await expect(modules.nth(2).locator("h3")).toHaveText("Agent Factory");
    await expect(modules.nth(3).locator("h3")).toHaveText("Workflow Automation");
    await expect(modules.nth(4).locator("h3")).toHaveText("Enterprise Governance");

    // CTA opens AuditModal
    const ctaBtn = section.locator(".argus-intro button", { hasText: "Request Argus Access" });
    await ctaBtn.click();
    const modal = page.locator('[role="dialog"][aria-labelledby="audit-title"]');
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Close dialog" }).click();
    await expect(modal).not.toBeVisible();
  });
});
