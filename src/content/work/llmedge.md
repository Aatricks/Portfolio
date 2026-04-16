---
title: llmedge
description: Android-native inference runtime for local multimodal workloads on constrained devices.
thesis: Kotlin-owned orchestration over raw native engines, with practical control over memory, artifact lifecycle, and backend fallback.
eyebrow: Flagship system
stackLine: Kotlin / JNI / C++ / Android NDK / Vulkan / OpenCL / ONNX
themeKey: llmedge
publishDate: 2026-04-10 00:00:00
img: /Portfolio/assets/llmedge-site.png
img_alt: llmedge documentation homepage
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
    caption: I documented installation, usage, architecture, troubleshooting, and examples because I wanted the runtime to be usable beyond a toy demo.
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

`llmedge` is the most infrastructure-heavy project in my portfolio. I built it as an Android-native toolkit for **local multimodal inference**, not as a wrapper around one backend.

## What the project is solving

Running local AI on Android is mostly a systems problem:

- device capabilities vary heavily across vendors
- GPU paths fail differently on different phones
- model artifacts are large and expensive to move around
- native runtimes are costly to initialize repeatedly
- application teams still need a clean Kotlin API

The value is not only "it can run models locally." The value is that I own the ugly parts that make local inference unreliable on real hardware, then hide that complexity behind a Kotlin-facing runtime.

## Why the architecture matters

I wrote the docs around installation, usage, examples, architecture, quirks, and troubleshooting because the runtime has real operational surface area.

The architectural split is the core point:

- Kotlin remains the stable application layer.
- Native engines stay behind JNI rather than leaking engine-specific complexity into app code.
- Model acquisition, validation, and caching are centralized.
- Backend detection and fallback are treated as first-class policy.

That separation is what makes the runtime useful beyond a single benchmark or device-specific experiment.

## Capability surface

I designed the runtime to span more than text generation:

- LLM inference
- image generation utilities
- speech/audio support
- vision and embeddings utilities
- Android examples that demonstrate the API in use

That multimodal breadth matters because it shows my work here is about **runtime systems** and **native orchestration**, not a thin frontend over one model family.

## Engineering decisions worth surfacing

- Backend order is intentional: OpenCL is preferred when viable, Vulkan is a fallback, and CPU remains the safe last resort.
- Runtime reuse is part of the design so sessions do not constantly pay reinitialization cost.
- Artifact lifecycle is owned by the library rather than pushed to application code.
- Kotlin coroutines and Flow support keep the public API usable even though the implementation is deeply native.

## Result

`llmedge` is the strongest proof in the portfolio that I can build edge AI systems where reliability, memory pressure, backend policy, and application ergonomics all matter at the same time.
