---
title: llmedge
description: Android-native inference runtime for local multimodal workloads on constrained devices.
thesis: Kotlin-owned orchestration over raw native engines, with practical control over memory, artifact lifecycle, and backend fallback.
eyebrow: Flagship system
blurb: Android-native runtime that runs LLMs, diffusion, and speech models locally on real phones — one Kotlin API over llama.cpp, stable-diffusion.cpp, whisper.cpp, and ONNX.
proof: powers EasyReader summaries · OpenCL → Vulkan → CPU fallback
stackLine: Kotlin / JNI / C++ / Android NDK / Vulkan / OpenCL / ONNX
themeKey: llmedge
accent: '#2b6cb0'
accentDark: '#79a7ff'
hint: ~/llmedge/runtime.kt
galleryColumns: single
publishDate: 2025-09-18 00:00:00
img: /Portfolio/assets/llmedge-arch.svg
img_alt: llmedge architecture diagram, Kotlin facade over JNI bridges, native engines, and backend fallback chain
featured: true
featuredOrder: 1
repoUrl: https://github.com/Aatricks/llmedge
docsUrl: https://aatricks.github.io/llmedge/
metrics:
  - label: Runtime target
    value: Android-native multimodal inference
  - label: Backends
    value: OpenCL first, Vulkan fallback, CPU last
  - label: Modalities
    value: LLM, vision, speech, image, and video utilities
  - label: API shape
    value: Kotlin-first facade over JNI/C++
heroPoints:
  - Bundles JNI/C++ bindings over llama.cpp, stable-diffusion.cpp, whisper.cpp, bark.cpp, and ONNX-backed utilities.
  - Treats backend instability as a product problem, with fallback policy, runtime reuse, and artifact validation inside the stack.
  - Targets real Android applications that need downloads, caching, memory limits, and predictable local inference behavior.
gallery:
  - src: /Portfolio/assets/llmedge-site.png
    alt: llmedge documentation site showing navigation and feature overview
    caption: The docs cover installation, usage, architecture, quirks, and troubleshooting — the runtime has real operational surface area, so it is documented like an operated system.
architecture:
  - Kotlin facade owns product-facing APIs, coroutine-friendly entrypoints, and lifecycle-safe session management.
  - ModelRepository isolates artifact download, validation, resumable fetches, and local cache placement.
  - RuntimePool and RuntimeCoordinator reuse native engines, probe device capabilities, and blacklist failing backend paths.
  - JNI bridges connect Kotlin orchestration to llama.cpp, stable-diffusion.cpp, whisper.cpp, bark.cpp, and ONNX embedding utilities.
highlights:
  - Backend fallback across OpenCL, Vulkan, and CPU replaces optimistic single-path execution.
  - Memory-aware context and runtime reuse reduce repeated startup cost on constrained devices.
  - On-device RAG, PDF ingestion, speech, and image generation live behind one Android-facing toolkit instead of separate demos.
status: flagship
---

`llmedge` is an Android-native toolkit for **local multimodal inference**: LLMs, image generation, speech, and embeddings behind one Kotlin API, with the native engines and their failure modes kept out of application code.

## The problem

Running local AI on Android is mostly a systems problem:

- device capabilities vary heavily across vendors
- GPU paths fail differently on different phones
- model artifacts are large and expensive to move around
- native runtimes are costly to initialize repeatedly
- application teams still need a clean Kotlin API

A wrapper around one backend solves none of this. The runtime has to own artifact lifecycle, device probing, and fallback policy before "it can run models locally" means anything on real hardware.

## Decisions

- **Kotlin stays the stable application layer.** Engines live behind JNI; engine-specific complexity never leaks into app code. Coroutines and Flow keep the public API idiomatic even though the implementation is deeply native.
- **Backend order is policy, not luck.** OpenCL is preferred when viable, Vulkan is the fallback, CPU is the safe last resort. The RuntimeCoordinator probes capabilities and blacklists paths that fail on a given device instead of retrying them forever.
- **Runtimes are pooled and reused.** Sessions don't pay native re-initialization on every call — on constrained devices that startup cost dominates short workloads.
- **Artifacts are the library's job.** Download, resumable fetch, validation, and cache placement are centralized in ModelRepository rather than re-implemented by every app.

## Capability surface

- LLM inference (GGUF via llama.cpp), with KV-cache reuse for multi-turn chat
- image generation through stable-diffusion.cpp
- speech-to-text and text-to-speech (whisper.cpp, bark.cpp)
- embeddings, RAG, and PDF ingestion via ONNX-backed utilities
- Android example apps exercising the API end to end

## Where it runs

[`EasyReader`](/Portfolio/work/easyreader) ships llmedge in production for on-device chapter summaries — user text never leaves the phone. The [`llmedge-examples`](https://github.com/Aatricks/llmedge-examples) repo demonstrates each modality as a standalone Android app.
