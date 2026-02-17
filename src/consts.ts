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
  TITLE: "Work",
  DESCRIPTION: "My professional experience and career journey",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "My portfolio of projects, including code repositories and live demos",
};

export const ABOUT: Metadata = {
  TITLE: "About",
  DESCRIPTION: "Learn more about me, my background, and my interests",
};

export const SOCIALS: Socials = [
  { 
    NAME: "github",
    HREF: "https://github.com/hotteano"
  },
  { 
    NAME: "twitter-x",
    HREF: "https://x.com/hotteano",
  },
  { 
    NAME: "zhihu",
    HREF: "https://zhihu.com/people/hotteano",
  },
  { 
    NAME: "bilibili",
    HREF: "https://space.bilibili.com/hotteano",
  },
  { 
    NAME: "Xiaohongshu",
    HREF: "https://www.xiaohongshu.com/user/profile/66e702c2000000001d033908",
  },
];
