---
title: llmedge
description: An Android-native runtime for running AI models locally on phones. LLMs, image generation, speech, and embeddings, all behind one Kotlin API.
thesis: A Kotlin wrapper that handles the messy native engines, memory allocations, and fallback logic so Android apps don't have to.
eyebrow: Flagship system
blurb: Android runtime that runs LLMs, diffusion, and speech models locally on real phones. One Kotlin API over llama.cpp, stable-diffusion.cpp, whisper.cpp, and ONNX.
proof: pulled by 70+ companies via Maven Central · powers EasyReader summaries
stackLine: Kotlin / JNI / C++ / Android NDK / Vulkan / OpenCL / ONNX
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
    value: Downloaded by 70+ companies via Maven Central
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

`llmedge` is an Android toolkit for running AI models on the device: LLMs, image generation, speech, and embeddings, all behind one Kotlin API, with the native engines and their failure modes kept out of app code.

## The problem

Running local AI on Android is mostly a systems problem:

- devices vary a lot between vendors
- GPU paths break differently on different phones
- model files are big and annoying to move around
- native runtimes are expensive to start up over and over
- and apps still want a clean Kotlin API

Wrapping a single backend doesn't cover that. The runtime has to handle the model files, device checks, and fallback itself.

## What I decided

- Kotlin handles the app-facing API, while JNI encapsulates the C++ code to keep the UI layer clean. Coroutines and Flow keep the public API normal even though the inside is heavily native.
- Backends fall back in a set order: OpenCL if the device can do it, Vulkan if not, CPU as the safe last resort. The coordinator checks what works and stops retrying paths that already failed on that phone.
- Runtimes get pooled and reused, so a session doesn't re-init native code on every call. On phones that startup cost is most of a short job.
- Model files are the library's job. Downloading, resuming, validating, and caching all happen in ModelRepository instead of every app redoing it.

## What it can do

- LLM inference (GGUF via llama.cpp), with KV-cache reuse for multi-turn chat
- image generation through stable-diffusion.cpp
- speech-to-text and text-to-speech (whisper.cpp, bark.cpp)
- embeddings, RAG, and PDF reading via ONNX utilities
- example Android apps that exercise the whole API

## On a real phone

A single Kotlin API wrapping llama.cpp, stable-diffusion.cpp, and whisper.cpp. On a stock Galaxy S22: 35 tok/s text generation (Qwen-0.6B, Q4_K_M) and ~40s for a 128×128 SD1.5 image (20 steps, dpmpp2m). Zero servers, zero cloud calls.

## Where it runs

It's published on Maven Central as `io.github.aatricks:llmedge`, where Sonatype's publisher insights show it being pulled by 70+ distinct companies each quarter. [`EasyReader`](/Portfolio/work/easyreader) ships llmedge in production for on-device chapter summaries, so the user's text never leaves the phone. The [`llmedge-examples`](https://github.com/Aatricks/llmedge-examples) repo has each feature as its own small Android app.
