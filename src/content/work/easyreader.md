---
title: EasyReader
description: Offline-first Android reading software with local summaries, persistent state, and a product surface people can live in.
thesis: Productized Android UX backed by local model integration instead of remote summarization shortcuts.
eyebrow: Product surface
blurb: Offline-first Android reader for web chapters, PDF, EPUB, and manga — with on-device chapter summaries running through llmedge.
proof: ships llmedge in production · user text never leaves the phone
stackLine: Kotlin / Jetpack Compose / Room / Hilt / llmedge
themeKey: easyreader
accent: '#2f7a3a'
accentDark: '#7ad88a'
hint: ~/EasyReader/MainActivity.kt
galleryColumns: single
publishDate: 2025-10-23 00:00:00
img: /Portfolio/assets/easyreader-explorer.jpg
img_alt: EasyReader explore screen showing discovery cards on Android
featured: true
featuredOrder: 3
repoUrl: https://github.com/Aatricks/EasyReader
metrics:
  - label: Product scope
    value: Discovery, library, reader, and summary workflow
  - label: Reading inputs
    value: Web chapters, PDF, EPUB, and local HTML
  - label: AI mode
    value: On-device chapter summaries through llmedge
  - label: Product focus
    value: Offline-first Android UX
heroPoints:
  - Built as a reader people can return to, with discovery, persistence, local file ingestion, and reading-state management.
  - Uses llmedge for on-device summaries so user text stays local and the AI feature remains inside the product workflow.
  - Emphasizes Android product craft as much as model integration.
gallery:
  - src: /Portfolio/assets/easyreader-manhwa.jpg
    alt: EasyReader manwha reader screen from the EasyReader repository
    caption: The reader mid-manwha with the fast-access library drawer open.
    frame: phone
architecture:
  - MainActivity coordinates reader, library, explore, deep links, and local file selection.
  - ContentRepository normalizes remote chapters, PDF, EPUB, and HTML into one reading pipeline.
  - SummaryService uses llmedge to fetch a local model and summarize chapters without sending user text away.
  - Compose, Room, and Hilt hold the application together as a durable Android product rather than a prototype shell.
highlights:
  - Production consumer of llmedge — the runtime work ships inside a real reading product.
  - Bridges persistent state, ingestion, and on-device inference inside one mobile workflow.
  - Four input formats normalize into a single reading pipeline with persistent reading state.
status: flagship
---

`EasyReader` is an Android reading app — discovery, library, multi-format reader — that happens to run its AI feature entirely on device. It is also the production consumer of [`llmedge`](/Portfolio/work/llmedge): the runtime work ships here, inside software built for daily use.

## The product

The core job is reading, and the app covers the full loop:

- discovering content and organizing a library
- opening web chapters, PDF, EPUB, manga/manwha, and local HTML
- preserving reading position and library state across sessions
- staying fully usable offline

Each input format is normalized through `ContentRepository` into one reading pipeline, so the reader surface never cares where a chapter came from.

## The AI feature, scoped on purpose

Chapter summaries run on device through llmedge:

- `SummaryService` fetches a local model and summarizes without any network round-trip
- user text never leaves the phone — privacy is a property of the architecture, not a policy
- the summary sits inside the reading flow, supporting it rather than replacing it

Local inference earns its place where the data is sensitive and the latency budget is human. A reading app is exactly that case.

## Architecture

- `MainActivity` coordinates reader, library, explore, deep links, and local file selection
- `ContentRepository` owns ingestion and normalization
- `SummaryService` delegates to llmedge instead of baking inference into UI code
- Compose, Room, and Hilt give it a real application lifecycle

## Result

End-to-end delivery: Android UX, ingestion, persistence, navigation, and local AI integration in one shipped product — the application-layer counterpart to the runtime work in llmedge.
