"use client";

import React, { useState } from "react";
import { HeroOrbit } from "@/prophec/HeroOrbit";
import type { HeroContent } from "@/prophec/types";
import { AuditModal } from "./ActionModals";

export const Hero: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const heroContent: HeroContent = {
    eyebrow: "AI-DRIVEN TECHNOLOGY & DIGITAL SOLUTIONS",
    heading: "Beyond Digital.",
    mutedHeading: "Into Intelligent.",
    description: (
      <>
        PropheC builds intelligent digital products, AI-powered systems, AI business automation, and scalable custom software solutions that help businesses work smarter, solve complex challenges, and move forward with clarity.
      </>
    ),
    primary: {
      label: "Build with PropheC",
      onClick: () => setIsContactOpen(true),
    },
    secondary: {
      label: "Explore Argus",
      href: "#argus",
    },
    note: (
      <>
        From strategy and design
        <br />
        to systems that work together.
      </>
    ),
    coreLabel: (
      <>
        INTELLIGENCE
        <br />
        IN MOTION
      </>
    ),
    workflowLabel: "EXPLORE THE WORKFLOW",
    sceneLabel: "Explore an intelligent business workflow",
    bottomLabel: "BUILT FOR REAL OPERATIONS",
    bottomItems: ["Products", "Systems", "Intelligence"],
    scrollAction: {
      label: "Scroll to explore",
      href: "#about",
    },
    agents: [
      {
        id: "sales",
        title: "Sales Agent",
        subtitle: "Pipeline qualification",
        description: "Qualify an inquiry, capture context and route the next conversation.",
        icon: "spark",
      },
      {
        id: "care",
        title: "Customer Care",
        subtitle: "Support & routing",
        description: "Understand a customer request and bring the right team into the conversation.",
        icon: "headset",
      },
      {
        id: "flow",
        title: "Workflow Automation",
        subtitle: "Cross-system execution",
        description: "Coordinate the next action across the business tools you already use.",
        icon: "flow",
      },
      {
        id: "human",
        title: "Human Oversight",
        subtitle: "Audit & approvals",
        description: "Keep decisions, approvals and exceptions visible to the people responsible.",
        icon: "shield",
      },
    ],
  };

  return (
    <>
      <HeroOrbit id="hero" content={heroContent} />
      <AuditModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};
