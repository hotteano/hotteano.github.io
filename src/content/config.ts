import { defineCollection, z } from "astro:content";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    column: z.enum(["投资", "学习笔记", "读书笔记", "期末复习", "说明"]).optional(),
    series: z.string().optional(),
    lastUpdated: z.coerce.date().optional(),
    track: z.enum(["cs-fundamentals"]).optional(),
    trackStage: z.enum(["programming", "algorithms", "architecture"]).optional(),
    trackOrder: z.number().int().min(0).optional(),
  }),
});

const work = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
    status: z.enum(["Submitted", "Under Review", "Under Preparation", "In Progress"]).optional(),
    venue: z.string().optional(),
    tags: z.array(z.string()).optional(),
    contribution: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    demoURL: z.string().optional(),
    repoURL: z.string().optional(),
    category: z.enum(["工程类", "学术类", "社团类"]),
    subcategory: z.enum(["系统软件", "硬件", "应用软件"]).optional(),
  }),
});

export const collections = { blog, work, projects };
