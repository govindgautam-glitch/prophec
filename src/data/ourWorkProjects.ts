export interface WorkProject {
  slug: string;
  name: string;
  clientMatchName: string;
  sector: string;
  logo: string;
  tagline: string;
  description: string[];
  capabilities?: string[];
}

export const WORK_PROJECTS: WorkProject[] = [
  // {
  //   slug: "hobnob",
  //   name: "HOBNOB",
  //   clientMatchName: "HobNob Realtech",
  //   sector: "Real Estate",
  //   logo: "/logos/hobnob.png",
  //   tagline: "Bringing Real Estate Into One Connected Platform.",
  //   description: [
  //     "PropheC developed a website and mobile application for HobNob Realtech, creating a platform where users can discover properties, list and sell them, manage property information, and keep listings updated. Inspired by platforms such as Square Yards and Magicbricks, the experience brings property discovery and management into one connected digital space.",
  //   ],
  //   capabilities: [
  //     "Website Development",
  //     "Mobile App Development",
  //     "Property Listings",
  //     "Property Management",
  //   ],
  // },
  // {
  //   slug: "cityvibes",
  //   name: "CITY VIBES",
  //   clientMatchName: "CityVibes",
  //   sector: "Consumer Retail",
  //   logo: "/logos/cityvibes.png",
  //   tagline: "A Digital Showcase for Style and Gifting.",
  //   description: [
  //     "PropheC is developing a digital shopping experience for CityVibes, a clothing and gifting brand. The website is designed to showcase its collections through visually rich product displays and fluid, animated interactions inspired by leading fashion e-commerce experiences.",
  //     "The focus is on making the products the centre of attention, with a browsing experience that feels modern, engaging, and effortless.",
  //   ],
  // },
  {
    slug: "api",
    name: "API",
    clientMatchName: "Alliance for Political Intelligence (API)",
    sector: "Intelligence",
    logo: "/logos/api.png",
    tagline: "A Space for Political Perspectives to Meet.",
    description: [
      "PropheC's work with Alliance for Political Intelligence centres on creating a digital presence for a platform that approaches political conversations from a neutral standpoint.",
      "Rather than aligning with a single political party or ideological side, API aims to bring different perspectives into the same conversation, encouraging people to examine issues, understand contrasting viewpoints, and engage with political discourse more thoughtfully.",
    ],
  },
  // {
  //   slug: "bv",
  //   name: "BV",
  //   clientMatchName: "Bharat Ventures",
  //   sector: "Venture Capital",
  //   logo: "/logos/bharat.png",
  //   tagline: "Building Digital Infrastructure for Ambitious Ventures.",
  //   description: [
  //     "Bharat Ventures is building an inclusive innovation and entrepreneurship ecosystem that connects policy access, venture-building support, and operational infrastructure.PropheC's work contributes to the digital experience supporting this broader ecosystem, helping communicate its vision and connect its different dimensions through technology.",
  //   ],
  // },
  {
    slug: "allsoll",
    name: "ALLSOLL",
    clientMatchName: "Allsoll",
    sector: "Digital Enterprise",
    logo: "/logos/allsoll.png",
    tagline: "Connecting Strategy, Creativity and Technology.",
    description: [
      "Allsoll works at the intersection of brand strategy, creativity, technology, and experiences to help businesses build a more connected market presence.",
      "PropheC's work with Allsoll brings the technology dimension into this approach, supporting digital experiences designed around how brands communicate, operate, and grow.",
    ],
  },
  {
    slug: "ideaindia",
    name: "Idea IND",
    clientMatchName: "IdeaIndia",
    sector: "Consulting & Growth",
    logo: "/logos/idea.png",
    tagline: "Turning Ideas Into Digital Possibilities.",
    description: [
      "PropheC's work with IdeaIndia forms part of its broader focus on using technology to support business needs, develop digital experiences, and bring ideas closer to implementation.",
      "The project highlights PropheC's approach to connecting creative thinking with practical technology solutions.",
    ],
  },
  // {
  //   slug: "innovher",
  //   name: "InnovHer",
  //   clientMatchName: "InnovHer",
  //   sector: "Ventures",
  //   logo: "/logos/innovher.png",
  //   tagline: "Building Digital Experiences for What's Next.",
  //   description: [
  //     "InnovHer is focused on creating opportunities for innovation through technology. PropheC’s work with InnovHer contributes to its digital ecosystem, supporting the development of technology-led experiences and infrastructure that align with its broader vision.",
  //   ],
  // },
  {
    slug: "fairstay",
    name: "FairStay",
    clientMatchName: "FairStay",
    sector: "Hospitality",
    logo: "/logos/fair.png",
    tagline: "Making Property Discovery More Accessible.",
    description: [
      "FairStay is part of PropheC’s work across digital platforms and business-focused technology. The project can be presented around creating a digital experience that helps users explore accommodation-related offerings and access relevant information more easily.",
    ],
  },
];

export const WORK_PROJECTS_BY_SLUG: Record<string, WorkProject> = Object.fromEntries(
  WORK_PROJECTS.map((p) => [p.slug, p])
);
