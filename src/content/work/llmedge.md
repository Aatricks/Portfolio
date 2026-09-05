---
title: llmedge
description: Android library for running GGUF models on the phone. Text, speech, image and video generation, vision, RAG, tool calling. One Kotlin API over llama.cpp, stable-diffusion.cpp, whisper.cpp, bark.cpp and ONNX. On Maven Central, ships inside Emaki and other apps.
thesis: 72k lines of Kotlin over four native engines. Backend fallback, runtime pooling, model download and validation, on-device safetensors to GGUF conversion. Published on Maven Central, maintained on issues.
eyebrow: Android on-device AI library
blurb: Android library that runs LLMs, image and video generation, speech, vision, and RAG on the phone. One Kotlin API over llama.cpp, stable-diffusion.cpp, whisper.cpp, bark.cpp, and ONNX. 72k lines of Kotlin, 161 test files.
proof: 2,000 Maven Central downloads (July 2026) · v0.4.7 · ships in Emaki and other people's apps · maintained on issues
stackLine: Kotlin / JNI / C++ / Android NDK / OpenCL / Vulkan / ONNX / GGUF
themeKey: llmedge
accent: '#2b6cb0'
accentDark: '#79a7ff'
hint: ~/llmedge/runtime.kt
galleryColumns: single
publishDate: 2025-09-18 00:00:00
img: /Portfolio/assets/llmedge-arch.svg
img_alt: llmedge architecture diagram, a Kotlin layer over JNI bridges, native engines, and the backend fallback chain
featured: true
featuredOrder: 3
repoUrl: https://github.com/Aatricks/llmedge
docsUrl: https://aatricks.github.io/llmedge/
metrics:
  - label: Adoption
    value: 2,000 Maven Central downloads from 364 unique sources and 92 corporate networks over three months, measured July 2026
  - label: Runtime target
    value: Android-native multimodal inference
  - label: Backends
    value: OpenCL first, Vulkan fallback, CPU last
  - label: Modalities
    value: LLM, vision, speech, image, and video utilities
  - label: API shape
    value: Kotlin-first facade over JNI/C++
heroPoints:
  - It bundles JNI/C++ bindings for llama.cpp, stable-diffusion.cpp, whisper.cpp, bark.cpp, and ONNX utilities.
  - Backends fall over differently on every phone, so it has fallback, engine reuse, and model validation built in.
  - It's aimed at real apps that need downloads, caching, memory limits, and inference that behaves predictably.
gallery:
  - src: /Portfolio/assets/llmedge-site.png
    alt: llmedge documentation site showing navigation and feature overview
    caption: The docs cover install, usage, architecture, the quirks, and troubleshooting. There's enough going on that it needed real docs.
architecture:
  - A Kotlin layer owns the app-facing API, coroutine entrypoints, and lifecycle-safe sessions.
  - ModelRepository handles downloading models, validating them, resuming interrupted fetches, and where they get cached.
  - RuntimePool and RuntimeCoordinator reuse native engines, check what a device can do, and skip backends that have already failed on it.
  - JNI bridges connect the Kotlin side to llama.cpp, stable-diffusion.cpp, whisper.cpp, bark.cpp, and the ONNX embedding utilities.
highlights:
  - Backends fall back across OpenCL, Vulkan, and CPU instead of betting on one path working.
  - It reuses runtimes and keeps context around, so short jobs don't pay native startup every time. That cost adds up on phones.
  - On-device RAG, PDF reading, speech, and image generation all live behind one Android toolkit instead of separate demos.
status: flagship
---

`llmedge` is an Android library for running AI models on the phone. One Kotlin API over four native engines (llama.cpp, stable-diffusion.cpp, whisper.cpp, bark.cpp) plus ONNX for embeddings. It is on Maven Central as `io.github.aatricks:llmedge`, it ships inside [`Emaki`](/Portfolio/work/emaki), and other people ship it in their apps. Last fix August 2026. Issues get handled when they come in.

## On a real phone

one Kotlin API over llama.cpp / sd.cpp / whisper.cpp. stock Galaxy S22: 35 tok/s text (qwen3-0.6B, Q4_K_M), ~40s for a 128×128 SD1.5 image (20 steps, dpmpp2m). no server, no cloud call.

## What it does

- **Text.** GGUF models through llama.cpp (an ik_llama.cpp build, so BitNet b1.58 IQ2_BN runs). Batched blocking and streaming generation, native KV-cache reuse across turns, separate prompt and generation thread counts, a `ChatSession` that replays transcripts for reasoning models, reasoning on/off controls.
- **Tool calling.** `edge.text.toolAgent(...)` lets the model call app-defined tools through a JSON envelope. Read-only tools run automatically. Action tools need an explicit policy. A bash tool exists for JVM hosts.
- **Speech.** whisper.cpp with timestamps, language detection, streaming transcription, SRT output. bark.cpp for text-to-speech with ARM optimisations.
- **Image.** stable-diffusion.cpp with EasyCache and LoRA, FLUX.2 Klein 4B (distilled DiT), per-step progress streaming, ESRGAN upscaling (Remacri).
- **Video.** Wan 2.1, 4 to 64 frames, components loaded sequentially so it fits.
- **Vision.** LLaVA-style models and a SmolVLM2-256M preset. OCR through ML Kit.
- **RAG.** PDF indexing, ONNX embeddings, vector search, Q&A, all on the phone.
- **Model files.** Hugging Face download with resume, progress, private repos, validation, old-mirror redirects. Big files can go through Android's DownloadManager so they stay off the Dalvik heap. Context window is read from the model and capped to what the heap allows (2K to 8K).
- **On-device conversion.** safetensors to GGUF on the phone (Llama arch, GPT2-BPE tokenizer), with optional Q8_0 / Q4_K_M / IQ2_BN quantisation. So a model that only exists as safetensors can still run.

## How it's built

- `LLMEdge` is a thin facade that lazy-creates `text`, `speech`, `image`, `vision`, `rag` clients on first access. Each client is also constructible on its own.
- `ModelRepository` owns download, validation, and caching. Inference clients never fetch files themselves.
- `RuntimePool` and `RuntimeCoordinator` cache native runtimes across calls and pick the backend. Order is OpenCL, then Vulkan, then CPU. A backend that fails on a device gets recorded in a verdict store and is not retried on that device.
- `RuntimePoolProfile` lets each domain say how its pool is keyed, sized, and loaded without duplicating the pool code.
- Native loading is explicit and overridable, so the Kotlin layer runs in JVM tests without an emulator. 161 test files, including Linux end-to-end runs of the native engines.

## Adoption

2,000 Maven Central downloads from 364 unique sources and 92 corporate networks over three months, measured July 2026. Current release is v0.4.7. Emaki uses it for chapter summaries. The [`llmedge-examples`](https://github.com/Aatricks/llmedge-examples) repo has each feature as its own small Android app, and the [docs site](https://aatricks.github.io/llmedge/) covers install, usage, architecture, quirks, and testing.
