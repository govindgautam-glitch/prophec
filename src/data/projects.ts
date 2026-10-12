export type ProjectSlot = {
  id: string;
  status: "empty" | "draft" | "published";
  title: string | null;
  description: string | null;
  category: string | null;
  image: { src: string; alt: string } | null;
  href: string | null;
  featured: boolean;
};

// Stable empty project templates per Section 5 of Prophec AI White Theme Prompt:
// "Use one editable project configuration with stable IDs and empty title, description,
// image and URL fields. Render deliberate blank templates with neutral media wells and reserved spacing."
export const initialProjectSlots: ProjectSlot[] = [
  {
    id: "slot-1",
    status: "empty",
    title: null,
    description: null,
    category: null,
    image: null,
    href: null,
    featured: false,
  },
  {
    id: "slot-2",
    status: "empty",
    title: null,
    description: null,
    category: null,
    image: null,
    href: null,
    featured: false,
  },
  {
    id: "slot-3",
    status: "empty",
    title: null,
    description: null,
    category: null,
    image: null,
    href: null,
    featured: false,
  },
  {
    id: "slot-4",
    status: "empty",
    title: null,
    description: null,
    category: null,
    image: null,
    href: null,
    featured: false,
  },
  {
    id: "slot-5",
    status: "empty",
    title: null,
    description: null,
    category: null,
    image: null,
    href: null,
    featured: false,
  },
  {
    id: "slot-6",
    status: "empty",
    title: null,
    description: null,
    category: null,
    image: null,
    href: null,
    featured: false,
  },
];

export const CATEGORIES = ["All", "Create", "Develop", "Explore", "Learn"] as const;
export type ProjectCategory = (typeof CATEGORIES)[number];
