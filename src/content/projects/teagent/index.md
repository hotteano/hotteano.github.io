---
title: "TEAgent"
description: "A local-first desktop agent and CLI for personal development and research workflows, built with TypeScript and a monorepo architecture."
date: "2026-05-26"
repoURL: "https://github.com/hotteano/TEAgent"
---

TEAgent is a local-first desktop agent and CLI that I built to automate personal development and research workflows. It keeps all runtime data locally under `.teagent/` and runs without relying on external cloud services.

The system is organized as a TypeScript monorepo with separate packages for the CLI, runtime engine, and context-management utilities. A typical workflow starts with `init`, then `run <task>`, followed by `show <run_id>` or `runs` to inspect execution traces. Each run has a configurable timeout and records stage traces, hazards, metrics, permission decisions, and confirmation state.

Key capabilities:

- **CLI-first interaction**: init, run, resume, show, pending, confirm/deny, and context inspection commands
- **Local runtime storage**: all data stays in `.teagent/`, ignored by Git by default
- **Timeout and permission controls**: per-run deadline overrides and explicit confirmation/deny flows
- **Context analysis**: inspect workspace context and summarize files on demand

The project uses Node's built-in test runner and supports type checking with `--experimental-strip-types` so it remains dependency-light.
