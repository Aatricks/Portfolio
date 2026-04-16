---
title: EasyReader
description: Offline-first Android reading software with local summaries, persistent state, and a product surface people can live in.
thesis: Productized Android UX backed by local model integration instead of remote summarization shortcuts.
eyebrow: Product surface
stackLine: Kotlin / Jetpack Compose / Room / Hilt / llmedge
themeKey: easyreader
publishDate: 2026-04-12 00:00:00
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
  - src: https://raw.githubusercontent.com/Aatricks/EasyReader/main/ManwhaReader.jpg
    alt: EasyReader manwha reader screen from the EasyReader repository
    caption: The image shows the reader in a manwha with the fast access library opened.
architecture:
  - MainActivity coordinates reader, library, explore, deep links, and local file selection.
  - ContentRepository normalizes remote chapters, PDF, EPUB, and HTML into one reading pipeline.
  - SummaryService uses llmedge to fetch a local model and summarize chapters without sending user text away.
  - Compose, Room, and Hilt hold the application together as a durable Android product rather than a prototype shell.
highlights:
  - Shows product sense without abandoning local-systems discipline.
  - Bridges persistent state, ingestion, and on-device inference inside one mobile workflow.
  - Demonstrates that edge AI work can ship in software people actually use repeatedly.
status: flagship
---

`EasyReader` is the clearest product-focused project in my portfolio. It uses local AI, but I do not want it presented as "an app with summaries." The stronger angle is that it is a **real Android reading product** that happens to integrate on-device summarization well.

## Product framing

The app’s core job is reading:

- discovering content
- organizing a library
- opening multiple input formats
- preserving reading state
- staying usable offline

That matters because the AI feature only works if the surrounding product is solid. The summary capability belongs inside a broader reading flow, not as a gimmick floating above the app.

## Why the architecture is interesting

I structured the app around a clean product pipeline:

- ingestion is normalized through repository code
- the reading surface stays separate from acquisition and persistence concerns
- local summaries are delegated through `llmedge` rather than baked directly into UI code
- Room and Hilt support a real application lifecycle

This is different from my runtime-heavy projects, but it complements them. It proves I can turn infrastructure into a usable mobile product.

## The AI story

The AI angle is still important, but it is intentionally scoped:

- chapter summaries run on device
- user text does not need to leave the phone
- the summary feature supports the reading experience rather than replacing it

That is a stronger signal than a generic "AI assistant" layer because it shows my product judgment about where local inference actually adds value.

## Result

`EasyReader` shows end-to-end delivery: Android UX, ingestion, persistence, navigation, and local AI integration tied together into software I would present as a product, not a demo.
