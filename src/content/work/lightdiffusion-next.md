---
title: LightDiffusion-Next
description: A local Stable Diffusion and Flux backend written for speed. Own sampler stack, attention cascade, Stable-Fast compilation, FP8 / NVFP4 weights, request coalescing. FastAPI server, React UI, HuggingFace Space.
thesis: Started as 3,000 lines of plain PyTorch, became a full diffusion backend with about 35 documented optimisations. 2.8 it/s on a mobile 3060 against ComfyUI's 1.4 on the same box. Last commit April 2026.
eyebrow: Diffusion backend
blurb: Local Stable Diffusion and Flux backend written for speed. Own samplers (AYS, CFG++), attention cascade, Stable-Fast, FP8 / NVFP4, DeepCache, request coalescing. FastAPI + React, HuggingFace Space. 51 stars.
proof: 2.8 it/s vs ComfyUI 1.4 (SD1.5, 1024², mobile 3060) · Ready Tensor CV Expo 2024 · 51 stars
stackLine: Python / PyTorch / FastAPI / React / Gradio / SD1.5 / SDXL / Flux2 Klein / CUDA / ROCm / MPS
themeKey: lightdiffusion-next
accent: '#b8421a'
accentDark: '#f4b458'
hint: ~/LightDiffusion-Next/pipeline.py
galleryColumns: double
publishDate: 2024-12-13 00:00:00
img: /Portfolio/assets/lightdiffusion-home.png
img_alt: LightDiffusion-Next browser interface with prompt controls and generated output
featured: true
featuredOrder: 4
repoUrl: https://github.com/Aatricks/LightDiffusion-Next
docsUrl: https://aatricks.github.io/LightDiffusion-Next/
demoUrl: https://huggingface.co/spaces/Aatricks/LightDiffusion-Next
metrics:
  - label: Runtime shape
    value: Local server, browser UI, and pipeline core
  - label: Model support
    value: SD1.5, SDXL, Flux, LoRAs, and enhancement passes
  - label: Performance focus
    value: Xformers, BFloat16, WaveSpeed, and Stable-Fast
  - label: Product surface
    value: Queue, history, presets, previews, uploads, and API
heroPoints:
  - Built to run locally and repeatedly, with a queue, previews, and deployment options.
  - Supports several model families plus Hires-Fix, ADetailer, prompt enhancement, and img2img.
  - I measured about 30% less inference time than the open-source baselines, from scheduler work and VRAM-level tensor allocation.
gallery:
  - src: /Portfolio/assets/lightdiffusion-home.png
    alt: LightDiffusion-Next browser UI with settings sidebar and generated car image
    caption: The browser UI, with prompt controls, run management, and output previews.
  - src: /Portfolio/assets/LDN.webp
    alt: Desktop LightDiffusion interface with prompt area and generated preview
    caption: The older desktop UI, one version earlier.
  - src: /Portfolio/assets/SD1.webp
    alt: Generated landscape image produced by the diffusion pipeline
    caption: Pipeline output with Hires-Fix and enhancement passes.
architecture:
  - Generation settings go through one shared pipeline context instead of branching across the UI.
  - The local server handles the queue, seeds, uploads, previews, and long-running jobs.
  - ModelFactory works out the different model layouts and assembles the diffusion, encoder, and VAE pieces.
  - The UI is kept separate from the core pipeline.
highlights:
  - About 30% less inference time than the open-source baselines, and it got into the Ready Tensor CV Projects Expo 2024.
  - It works as a browser app and as lower-level execution you can drive directly.
  - The speedups (Xformers, BFloat16, WaveSpeed, Stable-Fast) are wired into the execution path.
status: flagship
---

`LightDiffusion-Next` is a local image-generation backend I wrote for speed. It started as a 3,000-line plain PyTorch script (the original LightDiffusion), then got refactored into a modular backend with a FastAPI server, a React UI, a Gradio entry for HuggingFace ZeroGPU, and Docker.

Last commit April 2026. The repo, docs, and [HuggingFace Space](https://huggingface.co/spaces/Aatricks/LightDiffusion-Next) are up, and it has 51 stars.

## Speed

Measured on a mobile 3060, SD1.5, 1024×1024, batch 1, BF16, stock installs:

| tool | it/s |
|---|---|
| LightDiffusion + Stable-Fast | 2.8 |
| LightDiffusion | 1.9 |
| ComfyUI | 1.4 |
| SD Forge | 1.3 |
| SD WebUI | 0.9 |

The first version measured about 30% less inference time than the baselines and got into the Ready Tensor CV Projects Expo 2024.

## Where the speed comes from

The repo has a [source-based optimisation report](https://aatricks.github.io/LightDiffusion-Next/implemented-optimizations-report/) listing about 35 items with the file each one lives in. The ones that matter most:

- **Attention cascade.** SpargeAttn, then SageAttention, then xformers, then PyTorch SDPA, whichever is present. Flux2 prefers cuDNN / Flash SDPA.
- **Caches.** Prompt embedding cache so a repeated prompt is not re-encoded. Cross-attention K/V projection cache for static context. DeepCache and First Block Cache reuse denoiser output between steps.
- **Sampling.** AYS scheduler by default (same quality in fewer steps), CFG++ samplers, CFG=1 skips the unconditional branch, optional CFG-free tapering and dynamic CFG rescale. Multi-scale latent switching does part of the denoising at lower resolution.
- **Compilation and precision.** Stable-Fast traces the UNet. `torch.compile` as the alternative. BF16/FP16 picked per hardware. FP8 and NVFP4 weight quantisation, and load-time weight-only quantisation so Flux2 Klein fits on smaller VRAM.
- **Memory.** Partial loading and offload policy for low-VRAM cards (down to 2 GB, or CPU only). Pinned checkpoint tensors and async transfers. Tiled VAE.
- **Serving.** The FastAPI server coalesces compatible requests into one batch, prefetches the next checkpoint, keeps models loaded, and returns PNG bytes from memory instead of disk.

## What it runs

SD1.5, SDXL, Flux2 Klein, LoRAs, textual inversion. Hires-Fix, ADetailer (Impact Pack based), UltimateSD upscale, img2img, TAESD live previews, an optional Ollama prompt enhancer. CUDA, ROCm, and Apple MPS. It also served as the image backend for a Discord bot (Boubou) and a Newelle extension.
