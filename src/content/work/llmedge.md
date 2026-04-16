---
title: llmedge
description: Android-native inference runtime for local multimodal workloads on constrained devices.
thesis: Kotlin-owned orchestration over raw native engines, with practical control over memory, artifact lifecycle, and backend fallback.
eyebrow: Flagship system
stackLine: Kotlin / JNI / C++ / Android NDK / Vulkan / OpenCL / ONNX
publishDate: 2026-04-10 00:00:00
img: /Portfolio/assets/llmedge-site.png
img_alt: llmedge repository and documentation preview
featured: true
featuredOrder: 1
repoUrl: https://github.com/Aatricks/llmedge
architecture:
  - Kotlin facade owns product-facing APIs and lifecycle-safe entrypoints.
  - ModelRepository isolates artifact download, validation, and local caching.
  - RuntimePool and RuntimeCoordinator reuse native engines and blacklist failing backends.
  - JNI bridge connects Kotlin orchestration to llama.cpp, stable-diffusion.cpp, whisper.cpp, and bark.cpp.
highlights:
  - Backend fallback across OpenCL, Vulkan, and CPU instead of optimistic single-path execution.
  - Lower JNI overhead through batched decoding and streaming chunk control.
  - On-device RAG with ONNX embeddings, vector persistence, and PDF ingestion support.
status: flagship
---

`llmedge` is an Android-native inference runtime for local multimodal workloads.

## Scope

The project owns model artifacts, backend selection, and runtime reuse behind a Kotlin API designed for mobile product surfaces.

## Engineering constraints

- Diverse Android hardware with uneven GPU support.
- Large local artifacts that need validation and resumable acquisition.
- Native runtimes that must be reused carefully to avoid wasteful reinitialization.
- Product APIs that need to stay simple while the implementation remains low-level and defensive.

## Result

The result is a practical local AI foundation that can support real Android applications rather than isolated model demos.
