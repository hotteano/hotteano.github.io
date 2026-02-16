import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Yanqiao Chen",
  EMAIL: "edwardchenyq@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Yanqiao Chen's Personal Blog",
};

export const BLOG: Metadata = {
  TITLE: "Blogs",
  DESCRIPTION: "What's worthy for me to write about",
};

export const WORK: Metadata = {
  TITLE: "Resume",
  DESCRIPTION: "My professional experience and career journey",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "My portfolio of projects, including code repositories and live demos",
};

export const SOCIALS: Socials = [
  { 
    NAME: "twitter-x",
    HREF: "https://twitter.com/hotteano",
  },
  { 
    NAME: "github",
    HREF: "https://github.com/hotteano"
  },
];
