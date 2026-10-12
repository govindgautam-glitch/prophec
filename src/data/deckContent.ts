export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  badge: string;
  iconType: "applications" | "agents" | "automation" | "analytics" | "systems" | "custom";
}

export const AI_ECOSYSTEM_SERVICES: ServiceItem[] = [
  {
    id: "service-1",
    title: "AI Applications",
    description: "Custom AI-powered products designed around specific business needs.",
    category: "Applications",
    badge: "01",
    iconType: "applications",
  },
  {
    id: "service-2",
    title: "AI Agents",
    description: "Intelligent agents that can interact, respond, qualify, assist and execute.",
    category: "Agents",
    badge: "02",
    iconType: "agents",
  },
  {
    id: "service-3",
    title: "AI Automation",
    description: "Automating repetitive workflows and operational processes.",
    category: "Automation",
    badge: "03",
    iconType: "automation",
  },
  {
    id: "service-4",
    title: "AI-Powered Analytics",
    description: "Turning business data into actionable intelligence.",
    category: "Analytics",
    badge: "04",
    iconType: "analytics",
  },
  {
    id: "service-5",
    title: "Intelligent Systems",
    description: "Embedding AI into existing products, platforms and workflows.",
    category: "Systems",
    badge: "05",
    iconType: "systems",
  },
  {
    id: "service-6",
    title: "Custom AI Solutions",
    description: "Purpose-built AI systems for unique business challenges.",
    category: "Solutions",
    badge: "06",
    iconType: "custom",
  },
];

export const WHAT_WE_BUILD = [
  {
    title: "Digital Products",
    description: "Web and mobile applications designed for high performance, intuitive interaction, and modern scale.",
    badge: "Product Engineering",
  },
  {
    title: "Business Systems",
    description: "Enterprise CRM, ERP, and bespoke operational platforms tailored to specific institutional workflows.",
    badge: "Operations",
  },
  {
    title: "AI Ecosystems",
    description: "Autonomous agents, intelligent decision engines, and cross-platform automated execution loops.",
    badge: "Intelligence",
  },
  {
    title: "Design",
    description: "Comprehensive UI/UX design, design systems, and digital product experiences built for clarity and engagement.",
    badge: "Experience",
  },
];

export const AUTOMATION_GAP_ISSUES = [
  {
    title: "Lost Opportunities",
    description: "Customer enquiries remain unanswered after business hours, leading to dropped conversion and lost pipeline.",
  },
  {
    title: "Fragmented Data",
    description: "Teams manually re-enter customer and deal details across WhatsApp, email, CRM, and accounting software.",
  },
  {
    title: "Scripted Limits",
    description: "Rigid traditional chatbots struggle with dynamic pricing, live stock lookup, inventory checks, and bookings.",
  },
  {
    title: "Compliance Risks",
    description: "Unauditable agents and opaque models stall enterprise AI adoption due to security and governance concerns.",
  },
];

export const ARGUS_CAPABILITIES = [
  {
    id: "whatsapp",
    title: "WhatsApp Automation",
    description: "Customer enquiries, instant responses, follow-ups and conversations through WhatsApp.",
  },
  {
    id: "agents",
    title: "Ready-Made AI Agents",
    description: "Specialised sales, customer care, email and operations agents with industry-specific solutions.",
  },
  {
    id: "factory",
    title: "Agent Factory",
    description: "Build, test, deploy and monitor custom AI agents tailored to proprietary workflows.",
  },
  {
    id: "workflow",
    title: "Workflow Automation",
    description: "Repetitive tasks across connected systems, with human approval at critical operational steps.",
  },
  {
    id: "governance",
    title: "Enterprise Governance",
    description: "Audit trails, role-based access and deployment options across cloud, VPC or on-premises environments.",
  },
];

export const PRINCIPLES = [
  {
    title: "End-to-End",
    description: "Concept through deployment and long-term support.",
  },
  {
    title: "AI Agents",
    description: "Intelligence where it creates genuine business value.",
  },
  {
    title: "Custom-Built",
    description: "Solutions shaped directly around the business.",
  },
  {
    title: "Scalable",
    description: "Systems designed from day one for sustained growth.",
  },
  {
    title: "Business-First",
    description: "Decisions driven strictly by business outcomes.",
  },
  {
    title: "Future-Ready",
    description: "Adaptive technology engineered to evolve with modern AI.",
  },
];

export const TRANSFORMATION_PAIRS = [
  { from: "Idea", to: "Product" },
  { from: "Manual", to: "Automated" },
  { from: "Data", to: "Intelligence" },
  { from: "Disconnected", to: "Integrated" },
  { from: "Digital", to: "Intelligent" },
];

export const IMPACT_THEMES = [
  "More Efficiency",
  "Faster Decisions",
  "Better Experiences",
  "Lower Complexity",
  "Greater Scale",
  "New Possibilities",
];

export const SECTORS = [
  {
    name: "Startups",
    detail: "Idea validation, MVP architecture, and rapid market scaling.",
  },
  {
    name: "Growing Businesses",
    detail: "Modernised operations, custom dashboards, and workflow infrastructure.",
  },
  {
    name: "Enterprises",
    detail: "Custom platforms, multi-system integration, and automated governance.",
  },
  {
    name: "Institutions",
    detail: "Centralised management dashboards, reporting portals, and secure portals.",
  },
  {
    name: "Jewellery",
    detail: "Personalised customer software, inventory tracking, and native integrations.",
  },
  {
    name: "Hospitality",
    detail: "Bespoke reservation architecture and unified guest service ecosystems.",
  },
  {
    name: "Real Estate",
    detail: "Purpose-built property platforms, lead routing, and transaction interoperability.",
  },
];

export const OUR_WORK_CLIENTS = [
  { name: "Hobnob Realtech", sector: "Real Estate" },
  { name: "Innovher", sector: "Ventures" },
  { name: "Alliance for Political Intelligence", sector: "Intelligence" },
  { name: "Bharat Ventures", sector: "Venture Capital" },
  { name: "Cityvibes", sector: "Consumer Retail" },
  { name: "AllSoll", sector: "Digital Enterprise" },
  { name: "IDEA IND", sector: "Consulting & Growth" },
  { name: "FAIR Stay", sector: "Hospitality" },
];

export const LEADERSHIP_TEAM = [
  {
    name: "Aditya Mittal",
    role: "Manager, Growth & Partnerships",
    affiliation: "IDEA IND",
  },
  {
    name: "Nikhil Kumar",
    role: "Chief Technical Officer",
    affiliation: "PROPHEC",
  },
  {
    name: "Kartik Choudhary",
    role: "Head of Strategy & Intelligence",
    affiliation: "IDEA IND",
  },
  {
    name: "Tanishka Patel",
    role: "Chief of Design & Experience",
    affiliation: "ALLSOLL",
  },
];
