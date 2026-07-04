---
title: EasyReader
description: An offline-first Android reading app with on-device chapter summaries. It keeps your library and reading state, and the AI runs locally through llmedge.
thesis: An Android reading app where the chapter summaries run on the phone instead of calling a server.
eyebrow: Product surface
blurb: Offline-first Android reader for web chapters, PDF, EPUB, and manga, with on-device chapter summaries through llmedge.
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
featuredOrder: 5
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
  - A reader with discovery, saved state, local file import, and reading position that sticks.
  - Summaries run on-device through llmedge, so the text stays on the phone.
  - I put as much work into the Android side as the model part.
gallery:
  - src: /Portfolio/assets/easyreader-manhwa.jpg
    alt: EasyReader manhwa reader screen from the EasyReader repository
    caption: The reader mid-manhwa with the quick library drawer open.
    frame: phone
architecture:
  - MainActivity ties together the reader, library, explore, deep links, and local file picking.
  - ContentRepository turns remote chapters, PDF, EPUB, and HTML into one reading pipeline.
  - SummaryService uses llmedge to load a local model and summarize chapters without sending the text anywhere.
  - Compose, Room, and Hilt hold it together as a normal app.
highlights:
  - It's the app that uses llmedge in production.
  - Saved state, file import, and on-device summaries in one workflow.
  - Four input formats go through one reading pipeline, with reading position kept across sessions.
status: flagship
---

`EasyReader` is an Android reading app: discovery, a library, and a multi-format reader, with the AI feature running on the phone. It's also where [`llmedge`](/Portfolio/work/llmedge) actually ships.

## The app

The main job is reading, and it covers the whole loop:

- finding content and organizing a library
- opening web chapters, PDF, EPUB, manga/manhwa, and local HTML
- keeping your position and library between sessions
- working fully offline

Every format goes through `ContentRepository` into one pipeline, so the reader doesn't care where a chapter came from.

## The AI part

Chapter summaries run on the device through llmedge:

- `SummaryService` loads a local model and summarizes with no network call
- the text never leaves the phone
- the summary sits inside the reading flow

## Architecture

- `MainActivity` runs the reader, library, explore, deep links, and file picking
- `ContentRepository` handles import and normalizing formats
- `SummaryService` hands off to llmedge instead of putting inference in the UI
- Compose, Room, and Hilt give it a normal app lifecycle
