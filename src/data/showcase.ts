import { URLS } from "@/lib/constants";

export interface ShowcaseProject {
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly url: string;
  readonly builtWith: string;
  readonly badge?: string;
}

export const showcaseProjects: readonly ShowcaseProject[] = [
  {
    name: "Leavn.app",
    description: "A Bible study app built ~90% with Claude Code using this stack.",
    icon: "/leavn-icon.png",
    url: URLS.LEAVN,
    builtWith: "Built with this stack",
    badge: "Live",
  },
];
