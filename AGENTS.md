# AGENTS.md - Hotteano Blog

## 项目概述

这是一个基于 **Astro 5.x** 构建的现代化个人博客网站，使用 TypeScript 和 Tailwind CSS 开发。网站具有极致的性能表现（Lighthouse 100分）、优雅的设计和丰富的动画效果。

**站点地址**: https://hotteano.github.io  
**作者**: Yanqiao Chen (edwardchenyq@gmail.com)

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Astro | ^5.0.5 | 静态站点生成器 |
| TypeScript | ^5.4.2 | 类型安全 |
| Tailwind CSS | ^3.4.1 | 原子化 CSS |
| @astrojs/mdx | ^4.0.2 | MDX 支持 |
| @astrojs/rss | ^4.0.10 | RSS 订阅 |
| @astrojs/sitemap | ^3.2.1 | 站点地图 |
| remark-math | ^6.0.0 | Markdown 数学公式 |
| rehype-katex | ^7.0.1 | KaTeX 渲染 |

---

## 项目结构

```
src/
├── components/           # 可复用组件
│   ├── Typewriter.astro        # 打字机效果
│   ├── ParticleBackground.astro # 粒子背景动画
│   ├── ScrambleText.astro      # 文字打乱效果
│   ├── MouseGlow.astro         # 鼠标光晕
│   ├── GlassCard.astro         # 毛玻璃卡片
│   ├── GridBackground.astro    # 网格背景
│   ├── TagCloud.astro          # 标签云
│   ├── TableOfContents.astro   # 文章目录
│   ├── ReadingProgress.astro   # 阅读进度条
│   ├── ArrowCard.astro         # 箭头卡片链接
│   ├── ProfileCard.astro       # 个人资料卡
│   ├── SeriesNav.astro         # 系列文章导航（上一期/下一期/目录）
│   ├── Comments.astro          # Giscus 评论
│   └── ...
├── content/              # 内容集合 (Astro Content Collections)
│   ├── blog/             # 博客文章
│   ├── projects/         # 项目展示
│   └── work/             # 工作经历
├── layouts/              # 页面布局
│   ├── PageLayout.astro
│   └── BlogPostLayout.astro
├── pages/                # 页面路由
│   ├── index.astro       # 首页
│   ├── about.astro       # 关于页面
│   ├── blog/             # 博客列表/详情/标签/专栏/归档
│   ├── projects/         # 项目列表/详情
│   └── work/             # 工作经历
├── styles/
│   └── global.css        # 全局样式
├── consts.ts             # 站点配置常量
├── types.ts              # TypeScript 类型定义
└── lib/
    └── utils.ts          # 工具函数
```

---

## 内容管理

### 博客文章 (`src/content/blog/`)

每篇文章是一个文件夹，内含 `index.md` 文件：

```markdown
---
title: "文章标题"
description: "文章描述"
date: "2026-02-17"
draft: false
tags:
  - 标签1
  - 标签2
column: "投资"  # 可选值: "投资", "学习笔记", "读书笔记", "期末复习", "说明"
series: "黄金投资日报"  # 可选：系列名称，用于聚合系列文章
lastUpdated: "2026-03-25"  # 可选：最后更新时间
---

> 提示：过长的笔记建议按主题拆分为多期，使用相同的 `series` 名称，BlogPostLayout 会自动在文末渲染 `SeriesNav` 系列导航。


文章内容支持 Markdown 和数学公式：

行内公式: $E = mc^2$

块级公式:
$$
\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n
$$
```

### 项目展示 (`src/content/projects/`)

```markdown
---
title: "项目名称"
description: "项目描述"
date: "2026-01-15"
draft: false
demoURL: "https://demo.example.com"  # 可选
repoURL: "https://github.com/user/repo"  # 可选
---

项目详情...
```

### 工作经历 (`src/content/work/`)

```markdown
---
company: "公司名称"
role: "职位名称"
dateStart: "2024-01-01"
dateEnd: "2026-02-01"  # 或 "Present" 表示在职
status: "Under Review"  # 可选: Submitted / Under Review / Under Preparation / In Progress
venue: "NeurIPS 2026"   # 可选: 目标会议/期刊
---

工作内容描述...
```

---

## 站点配置 (`src/consts.ts`)

修改此文件更新站点信息：

```typescript
export const SITE = {
  NAME: "Yanqiao Chen",
  EMAIL: "edwardchenyq@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const SOCIALS = [
  { NAME: "github", HREF: "https://github.com/hotteano" },
  { NAME: "twitter-x", HREF: "https://x.com/hotteano" },
  // ...
];
```

---

## 样式系统

### Tailwind 配置

- **字体**: Inter (sans), Lora (serif)
- **深色模式**: `dark` class 切换
- **插件**: @tailwindcss/typography (文章排版)

### 主题切换

网站支持三种主题模式：
- Light (亮色)
- Dark (暗色)  
- System (跟随系统)

通过 `localStorage` 存储用户偏好，键名为 `theme`。

### 颜色变量

在 `global.css` 中定义 CSS 变量，支持明暗主题：
- `--background` / `--foreground`
- `--card` / `--card-foreground`
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--muted` / `--muted-foreground`
- `--border` / `--ring`

---

## 动画效果

网站包含多种精心设计的动画：

| 动画组件 | 文件 | 描述 |
|---------|------|------|
| 打字机效果 | `Typewriter.astro` | 逐字显示文字，用于首页标题 |
| 粒子背景 | `ParticleBackground.astro` | Canvas 粒子连线，鼠标交互 |
| 文字打乱 | `ScrambleText.astro` | 悬停时文字随机变换 |
| 鼠标光晕 | `MouseGlow.astro` | 跟随鼠标的渐变光效 |
| 毛玻璃卡片 | `GlassCard.astro` | 半透明模糊背景卡片 |
| 阅读进度 | `ReadingProgress.astro` | 顶部进度条 |
| 返回顶部 | `BackToTop.astro` | 滚动显示/隐藏 |

---

## 开发工作流

### 常用命令

```bash
# 开发服务器
npm run dev

# 带网络访问的开发模式
npm run dev:network

# 生产构建
npm run build

# 预览构建结果
npm run preview
npm run preview:network
```

### 构建配置

- **输出模式**: `static` (静态站点)
- **构建格式**: `directory` (文件夹格式，如 `/about/index.html`)
- **站点 URL**: https://hotteano.github.io
- **基础路径**: `/`

---

## 新增内容的最佳实践

### 添加博客文章

1. 在 `src/content/blog/` 创建新文件夹（建议使用日期或 slug 格式命名）
2. 创建 `index.md` 文件，添加 frontmatter
3. 文章图片放在同目录下，相对引用：`![alt](./image.png)`
4. 添加合适的 `tags` 和 `column` 便于分类

### 添加项目

1. 在 `src/content/projects/` 创建项目文件夹
2. 添加 `index.md` 和项目截图
3. 填写 `demoURL` 和 `repoURL`（如有）

---

## 注意事项

1. **数学公式**: 使用 `$` 或 `$$` 包裹，需要 remark-math 和 rehype-katex 支持
2. **图片优化**: 使用 Astro 的 `<Image />` 组件或放在 `public/` 目录
3. **草稿文章**: 设置 `draft: true` 不会在构建中显示
4. **评论系统**: 使用 Giscus，配置见 `GISCUS_SETUP.md`
5. **SEO**: 自动生成 Sitemap 和 RSS，无需手动维护
