"use client";

import React, { useState } from "react";
import { ArgusWorkflow } from "@/prophec/ArgusWorkflow";
import type { ArgusContent } from "@/prophec/types";
import { ARGUS_CAPABILITIES } from "@/data/deckContent";
import { AuditModal } from "./ActionModals";

export const ArgusSection: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const argusContent: ArgusContent = {
    eyebrow: "INTRODUCING ARGUS BY PROPHEC LABS",
    heading: (
      <>
        AI that runs the work
        <br />
        behind your business.
      </>
    ),
    description: (
      <>
        Businesses run across WhatsApp, email, CRM, accounting tools, and internal workflows but when these systems don&apos;t work together, enquiries get missed, information gets repeated, and everyday processes slow down.
        <br />
        <br />
        Argus is an intelligent AI workflow automation platform designed to connect these touchpoints, manage customer interactions and follow-ups, and help execute workflows with human oversight and auditability.
      </>
    ),
    tagline: "Every inquiry was answered. Every process was watched.",
    action: {
      label: "Request Argus Access",
      onClick: () => setIsContactOpen(true),
    },
    mapLabel: "EXPLORE A CONNECTED WORKFLOW",
    mapHint: "Select anywhere to follow the flow.",
    coreName: "ARGUS",
    coreDescription: "Core Intelligence",
    workflowLabel: "WORKFLOW PREVIEW",
    previewLabel: "INTEGRATION: %s",
    governance: "Human oversight and audit approvals where it matters.",
    systems: [
      {
        id: "whatsapp",
        label: "WhatsApp",
        icon: "chat",
        title: "Direct Messaging Integration",
        description:
          "A conversation. A connected next step. Lead sends inquiry on WhatsApp → Argus parses intent, checks product availability, answers queries in real time, and logs conversation into CRM.",
        steps: [
          "Receive & interpret incoming customer inquiry",
          "Understand intent & qualify sales readiness",
          "Query live product catalog & pricing guidelines",
          "Auto-update CRM record & trigger team notifications",
        ],
      },
      {
        id: "email",
        label: "Email",
        icon: "mail",
        title: "Inbox Dispatch Integration",
        description:
          "Contextual triage. Instant responses. Inbound client RFQ arrives → Argus triages priority, drafts contextual proposal grounded in pricing guidelines, and prompts human approval before dispatch.",
        steps: [
          "Semantic Triage & VIP client prioritization",
          "Draft contextual responses & quote proposals",
          "Extract & parse RFQ attachment documents",
          "Escalate complex requests with executive alerts",
        ],
      },
      {
        id: "crm",
        label: "CRM",
        icon: "database",
        title: "Pipeline Sync Integration",
        description:
          "Zero manual re-entry across sales cycles. Deal state changes or meeting concludes → Argus automatically updates stage, enriches contact profile, and creates assigned action items across the team.",
        steps: [
          "Enrich company profiles & stakeholder records",
          "Automate lifecycle pipeline stage transitions",
          "Deduplicate records across multi-channel touches",
          "Log customer call transcripts & meeting action items",
        ],
      },
      {
        id: "accounting",
        label: "Accounting / ERP",
        icon: "devices",
        title: "Financial & Tally Integration",
        description:
          "Reconciliation & inventory verified instantly. Purchase order approved → Argus verifies transaction ledger, validates inventory balance, and generates invoice draft ready for financial sign-off.",
        steps: [
          "Invoice triage & automated ledger matching",
          "Real-time inventory reconciliation & alerts",
          "Seamless Tally & enterprise ERP interoperability",
          "Expense categorization & compliance audit logs",
        ],
      },
    ],
    moduleLabel: "MODULE",
    modules: ARGUS_CAPABILITIES.map((cap) => ({
      id: cap.id,
      title: cap.title,
      description: cap.description,
    })),
  };

  return (
    <>
      <ArgusWorkflow id="argus" content={argusContent} />
      <AuditModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};
