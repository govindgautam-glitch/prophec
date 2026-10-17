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
    description: "Custom AI-powered products designed around specific business needs and user experiences.",
    category: "Applications",
    badge: "01",
    iconType: "applications",
  },
  {
    id: "service-2",
    title: "AI Agents",
    description: "Intelligent agents that can interact, respond, qualify, assist, and execute tasks.",
    category: "Agents",
    badge: "02",
    iconType: "agents",
  },
  {
    id: "service-3",
    title: "AI Automation",
    description: "AI automation services that automate repetitive workflows and operational processes, reducing manual effort through intelligent process automation.",
    category: "Automation",
    badge: "03",
    iconType: "automation",
  },
  {
    id: "service-4",
    title: "AI-Powered Analytics",
    description: "Turning business data into actionable intelligence that supports better decisions.",
    category: "Analytics",
    badge: "04",
    iconType: "analytics",
  },
  {
    id: "service-5",
    title: "Intelligent Systems",
    description: "Embedding AI into existing products, platforms, and workflows to make them more capable.",
    category: "Systems",
    badge: "05",
    iconType: "systems",
  },
  {
    id: "service-6",
    title: "Custom AI Solutions",
    description: "Purpose-built custom AI systems designed to address unique business challenges.",
    category: "Solutions",
    badge: "06",
    iconType: "custom",
  },
];

export const WHAT_WE_BUILD = [
  {
    title: "Digital Products",
    description: "We design and develop web applications, mobile apps, and digital products built around user needs and business goals.Every product is designed to be functional today and ready to evolve tomorrow.",
    badge: "Product Engineering",
  },
  {
    title: "Business Systems",
    description: "We build custom software solutions such as a customer management system, CRM with workflow automation, ERP, dashboards, and enterprise platforms that connect data, teams, and operations. The goal is to reduce fragmentation and help businesses operate with greater clarity.",
    badge: "Operations",
  },
  {
    title: "AI Ecosystems",
    description: "We bring together AI agents, business automation tools, integrations, and intelligent workflows to make systems more capable. Our approach focuses on practical use cases, with human oversight and accountability where needed.",
    badge: "Intelligence",
  },
  {
    title: "Product Design",
    description: "We create intuitive UI/UX and digital experiences that make complex technology easier to use.From user journeys to interface design, every decision is guided by usability, clarity, and the product's purpose.",
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
    description: "Respond to customer enquiries, manage follow-ups, and streamline conversations through WhatsApp with less manual intervention.",
  },
  {
    id: "agents",
    title: "Ready-Made AI Agents",
    description: "Deploy specialised AI agents for tasks such as sales, customer care, email handling, and operations, based on your business requirements.",
  },
  {
    id: "factory",
    title: "Agent Factory",
    description: "Build, test, manage, and deploy AI agents tailored to specific workflows and use cases.",
  },
  {
    id: "workflow",
    title: "Workflow Automation",
    description: "Connect routine processes across tools and systems, with defined steps, approvals, and human intervention where required.",
  },
  {
    id: "governance",
    title: "Enterprise Governance",
    description: "Support greater visibility and control through audit trails, role-based access, and appropriate human oversight.",
  },
];

export const PRINCIPLES = [
  {
    title: "End-to-End",
    description: "From concept and planning to deployment and ongoing support, we help carry the work across the full product journey.",
  },
  {
    title: "AI Driven",
    description: "We build intelligence into products and processes wherever it creates meaningful value.",
  },
  {
    title: "Custom-Built",
    description: "Every solution is shaped around your business needs, users, and challenges that are not forced into a generic template.",
  },
  {
    title: "Scalable",
    description: "We design systems that can evolve with growing users, operations, data, and complexity.",
  },
  {
    title: "Business-First",
    description: "Technology decisions begin with the problem to solve and the outcome the business needs.",
  },
  {
    title: "Future-Ready",
    description: "We build with flexibility in mind, so products and systems can adapt as requirements and technology evolve.",
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
