import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Hotteano",
  EMAIL: "your.email@example.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Hotteano 的个人博客 - 分享技术、生活与创意",
};

export const BLOG: Metadata = {
  TITLE: "博客",
  DESCRIPTION: "关于技术、设计和生活思考的文章合集",
};

export const WORK: Metadata = {
  TITLE: "工作经历",
  DESCRIPTION: "我的职业历程和工作经验",
};

export const PROJECTS: Metadata = {
  TITLE: "项目",
  DESCRIPTION: "我的项目作品集，包含代码仓库和演示链接",
};

export const SOCIALS: Socials = [
  { 
    NAME: "twitter-x",
    HREF: "https://twitter.com/yourusername",
  },
  { 
    NAME: "github",
    HREF: "https://github.com/hotteano"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/yourusername",
  }
];
