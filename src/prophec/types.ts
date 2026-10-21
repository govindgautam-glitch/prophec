import type { ReactNode } from 'react';
import type { IconName, ServiceGraphic } from './graphics';
/** Bind these fields to EXISTING project data. No business-copy fallbacks exist. */
export type Action = { label: ReactNode; ariaLabel?: string } & (
  { href: string; onClick?: never } | { onClick: () => void; href?: never }
);
export type SectionCopy = { eyebrow?: ReactNode; heading: ReactNode; description: ReactNode };
export type HeroAgent = {
  id: string; title: string; subtitle: string; description: string; icon: IconName;
};
export type HeroContent = SectionCopy & {
  mutedHeading?: ReactNode; primary: Action; secondary: Action;
  note: ReactNode; coreLabel: ReactNode; workflowLabel: ReactNode;
  agents: readonly HeroAgent[];
  bottomLabel: ReactNode; bottomItems: readonly string[]; scrollAction: Action;
  sceneLabel: string;
};
export type ServiceItem = {
  id: string; tag: string; title: string; description: string;
  category: string; caption?: string; graphic: ServiceGraphic; action: Action;
};
export type ServicesUI = {
  carouselLabel: string; chooseLabel: string; previous: string; next: string;
  tap: string; swapping: string; robotButton: string; robotHelp: string;
  footerSwap: string; pause: string; resume: string; reduced: string;
};
export type ServicesContent = SectionCopy & {
  items: readonly ServiceItem[]; ui: ServicesUI;
  barLabel?: ReactNode; barNote?: ReactNode;
};
export type IndustryItem = {
  id: string; name: string; title: string; description: string;
  outcomes: readonly string[]; flow: readonly string[]; action: Action;
};
export type IndustriesContent = SectionCopy & {
  items: readonly IndustryItem[]; tabListLabel: string; panelLabel: string; flowLabel: string;
};
export type SystemItem = {
  id: string; label: string; icon: IconName; title: ReactNode;
  description: string; steps: readonly string[];
};
export type ArgusContent = SectionCopy & {
  action: Action; mapLabel: string; mapHint: string; coreName: string;
  coreDescription: string; workflowLabel: string; previewLabel?: string;
  governance: string; systems: readonly SystemItem[];
  moduleLabel: string; modules: readonly {id:string;title:string;description:string}[];
  tagline?: ReactNode;
};
export const numberLabel = (n: number) => String(n).padStart(2,'0');
