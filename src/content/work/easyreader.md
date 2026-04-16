---
title: EasyReader
description: Offline-first Android reading software with local summaries, persistent state, and a product surface people can live in.
thesis: Productized Android UX backed by local model integration instead of remote summarization shortcuts.
eyebrow: Product surface
stackLine: Kotlin / Jetpack Compose / Room / Hilt / llmedge
publishDate: 2026-04-12 00:00:00
img: /Portfolio/assets/easyreader-explorer.jpg
img_alt: EasyReader explore screen
featured: true
featuredOrder: 3
repoUrl: https://github.com/Aatricks/EasyReader
metrics:
  - label: Product scope
    value: Reader / library / summary workflow
  - label: Reading inputs
    value: Web chapters / PDF / EPUB / local HTML
  - label: AI mode
    value: On-device chapter summaries
  - label: Product focus
    value: Offline-first Android UX
architecture:
  - MainActivity coordinates reader, library, explore, deep links, and local file picks.
  - ContentRepository normalizes remote chapters, PDFs, EPUBs, and HTML into one reading pipeline.
  - SummaryService uses llmedge to fetch a local model and summarize chapters without sending user text away.
  - Compose, Room, and Hilt hold the application together as a real product instead of a prototype shell.
highlights:
  - Shows product sense without abandoning local-systems discipline.
  - Bridges persistent state, ingestion, and on-device inference in one flow.
  - Demonstrates that edge AI work can ship in software people use repeatedly.
status: flagship
---

EasyReader is an offline-first Android reading app backed by local summarization through llmedge.

## Scope

The app unifies ingestion, persistence, and reading workflows across multiple formats while keeping summaries on device.

## Result

It shows end-to-end product delivery: native runtime integration plus a daily-use mobile interface.
