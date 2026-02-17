# Giscus 评论区配置指南

Giscus 是一个基于 GitHub Discussions 的评论系统，支持 GitHub 登录。

## 配置步骤

### 1. 安装 Giscus App

访问 https://github.com/apps/giscus 并安装到你的博客仓库。

### 2. 启用 Discussions

在你的博客仓库设置中启用 Discussions 功能：
- 打开仓库 → Settings → General → Features
- 勾选 "Discussions"

### 3. 创建 Discussion 分类

在 Discussions 中创建一个分类（如 "Announcements"）用于存储评论。

### 4. 获取配置信息

访问 https://giscus.app/zh-CN 填写以下信息获取配置：

- **仓库**: `hotteano/hotteano.github.io`
- **Discussion 分类**: 选择一个（如 "Announcements"）
- **特性**:
  - 页面 ↔️ Discussion 映射: `pathname`（推荐）
  -  Discussion 标题包含页面路径: 可选
  - 懒加载: 建议开启
  - 主题: `preferred_color_scheme`（跟随系统）

### 5. 更新配置

将获取到的配置更新到 `src/components/Comments.astro`：

```html
<script 
  src="https://giscus.app/client.js"
  data-repo="hotteano/hotteano.github.io"
  data-repo-id="R_kgDOOLq3DQ"  <!-- 你的仓库ID -->
  data-category="Announcements"
  data-category-id="DIC_kwDOOLq3Dc4CpXxf"  <!-- 你的分类ID -->
  ...
></script>
```

## 获取 repo-id 和 category-id

### 方法 1: 通过 Giscus 网站
访问 https://giscus.app/zh-CN 输入仓库名后会自动生成。

### 方法 2: 通过 GitHub API

```bash
# 获取 repo-id
curl -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/hotteano/hotteano.github.io

# 获取 category-id
curl -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/hotteano/hotteano.github.io/discussions/categories
```

## 自定义选项

### 主题切换
评论组件已配置为自动跟随博客的明暗主题。

### 多语言支持
修改 `data-lang` 属性：
- `en` - 英语
- `zh-CN` - 简体中文
- `zh-TW` - 繁体中文

### 页面映射方式
- `pathname` - 按页面路径映射（推荐，每个页面独立评论）
- `url` - 按完整 URL 映射
- `title` - 按页面标题映射
- `og:title` - 按 Open Graph 标题映射

## 隐私说明

Giscus 评论数据存储在 GitHub Discussions 中：
- ✅ 无需第三方数据库
- ✅ 评论者需要 GitHub 账号
- ✅ 支持 Markdown 格式
- ✅ 支持邮件通知
- ✅ 支持 reactions（👍 👎 等）

## 故障排除

### 评论区不显示
1. 检查是否正确安装了 Giscus App
2. 检查仓库是否启用了 Discussions
3. 检查 repo-id 和 category-id 是否正确
4. 打开浏览器开发者工具查看网络请求

### 主题不跟随切换
- 确保 Comments.astro 中的脚本正确加载
- 检查 iframe 是否能正常通信

### 评论无法发布
- 确保用户已登录 GitHub
- 检查用户是否有仓库讨论权限
