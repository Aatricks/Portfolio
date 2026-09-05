---
title: Emaki
description: Android reader for web novels, manga, manhwa, EPUB, and PDF. Own scrapers with unified search across sources, offline chapter downloads, reading position that sticks, on-device chapter summaries through llmedge. 54k lines of Kotlin. The one project I actively maintain.
thesis: Web novels, manga, EPUB, PDF, one reader. Scrapers, download queue, backups, self-update from GitHub releases. Summaries run on the phone through llmedge. v0.6.1, still moving.
eyebrow: Android reader · active
blurb: Android reader for web novels, manga, manhwa, EPUB, and PDF. Own scrapers, unified search, offline downloads, on-device chapter summaries through llmedge. 54k lines of Kotlin, 87 test files. Actively maintained.
proof: v0.6.1 (September 2026) · actively maintained · user text never leaves the phone
stackLine: Kotlin / Jetpack Compose / Room / Hilt / WorkManager / Ktor / Jsoup / llmedge
themeKey: emaki
accent: '#2f7a3a'
accentDark: '#7ad88a'
hint: ~/Emaki/MainActivity.kt
galleryColumns: single
publishDate: 2025-10-23 00:00:00
img: /Portfolio/assets/easyreader-explorer.jpg
img_alt: Emaki explore screen showing discovery cards on Android
featured: true
featuredOrder: 5
repoUrl: https://github.com/Aatricks/Emaki
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
    alt: Emaki manhwa reader screen from the Emaki repository
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

`Emaki` (formerly EasyReader, named after the Japanese picture scroll) is an Android reader for web novels, manga, manhwa, EPUB, and PDF. It's the one project I actively maintain. Last release v0.6.1, September 2026. It's also where [`llmedge`](/Portfolio/work/llmedge) ships.

## What it does

- **Sources.** Built-in scrapers for novel and manga sites (AsuraScans, MangaBat, NovelFire, Novelight), plus a `SmartSource` that infers the parser for a site it hasn't seen. Unified search runs across all sources at once. A kill switch can disable a source remotely when a site changes.
- **Offline.** A `ChapterDownloadWorker` on WorkManager pre-fetches whole series with a per-host throttle and a download limiter. An offline chapter store serves them back. A reconciler keeps download status honest after crashes.
- **Formats.** Web chapters, EPUB, PDF, and local HTML all go through `ContentRepository` into one reading pipeline. EPUB and PDF images are cached on disk. Manga pages are tiled and zoomable, with image bounds parsed ahead so the scroll doesn't jump.
- **Reader.** Paged and scrolling modes, text paginator with its own cache, reading position restored per chapter, reading sessions tracked in Room, brightness, fonts, themes, reduced motion.
- **Library.** Filters, sort modes, multi-select, auto-deletion policy, library update worker that checks for new chapters, and full backup and restore of library and settings (schema versioned, migration tested).
- **Self-update.** The app checks GitHub releases, downloads the APK, and installs it. No store in the middle.
- **Safety.** URL sanitiser, safe DNS, redirect interceptor, and a security test suite for the reader's WebView paths.

## The AI part

Chapter summaries run on the phone through llmedge. `LlmEdgeSummaryEngine` pulls `Qwen3-0.6B` Q4_K_M from Hugging Face, streams a 256-token summary, and the text never leaves the device. The app has two flavours: `standard` builds without llmedge (the summary button shows as unavailable) and `ai` pulls llmedge from Maven Central.

## Size and testing

About 54k lines of Kotlin. 87 test files and 8 macrobenchmarks (cold and warm startup, PDF opening, manhwa scrolling, restored reader, AI initialisation), with a baseline profile generator. Min SDK 30.
