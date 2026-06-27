---
title: "WheelChair Editor"
description: "A modern, extensible rich-text editor built on ProseMirror with full TypeScript support, Markdown support, and LaTeX math."
date: "2026-03-25"
repoURL: "https://github.com/hotteano/WheelChair"
category: "工程类"
subcategory: "应用软件"
---

WheelChair is a modern, extensible rich-text editor that I built for developers who need full control over content editing. It is based on ProseMirror and written entirely in TypeScript.

The editor provides a WYSIWYG experience with a plugin-based architecture. It supports common formatting, lists, tables, media embedding, code blocks, and real-time Markdown input conversion. A standout feature is native LaTeX math support, making it suitable for technical writing and academic notes.

Core features:

- **WYSIWYG editing** based on ProseMirror with smooth rendering
- **Markdown shortcuts**: type `## `, `- `, or `$$E=mc^2$$` and watch them convert automatically
- **Rich formatting**: bold, italic, underline, strikethrough, sub/superscript, colors, font size, inline code
- **Structural elements**: headings, blockquotes, code blocks with syntax highlighting, tables, horizontal rules, task lists
- **Math**: inline and block LaTeX formula support
- **Media**: images, videos, links, iframe embeds
- **Type safety**: 100% TypeScript across core, React, Vue, and extensions packages

The project is published as a monorepo with packages for core, React, Vue, and official extensions, plus a demo app for trying out all features.
