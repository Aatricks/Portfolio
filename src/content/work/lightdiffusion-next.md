---
title: LightDiffusion-Next
description: A local image-generation stack I tuned for speed. A pipeline core, a queueing server, and a browser UI.
thesis: A local diffusion setup focused on speed, model support, and the implementation details.
eyebrow: Generation stack
blurb: Local image-generation system. Pipeline core, queueing server, browser UI, tuned with Xformers, BFloat16, WaveSpeed, and Stable-Fast.
proof: ~30% faster inference than open-source baseline · Ready Tensor CV Expo 2024
stackLine: Python / FastAPI / Streamlit / Gradio / PyTorch / Flux / SDXL
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

`LightDiffusion-Next` is a local image-generation system built around a pipeline core, a queueing server, and a web interface. The project includes a complete setup guide, API docs, and a breakdown of the architecture and performance optimizations.

## The speed work

The first version of this project measured about **30% less inference time** than open-source baselines, earning a spot in the **Ready Tensor CV Projects Expo 2024**. The speedup comes from:

- **Scheduler optimizations**: reworking the sampling loop instead of using the stock reference implementation.
- **VRAM tensor management**: controlling exactly where and when tensors are allocated in memory instead of delegating it to the framework.

It also wires **Xformers**, **BFloat16**, **WaveSpeed**, and **Stable-Fast** into the execution path.

## The workflow

It's built to be used repeatedly, with:

- prompt and negative prompt, presets, and generation modes
- enhancement passes: Hires-Fix, ADetailer, prompt enhancement, img2img
- queue, history, output previews, and uploads
- a REST API and deployment paths (including a hosted HuggingFace Space)

## Architecture

The main pieces:

- generation settings go through one shared pipeline context, no per-UI branches
- model families (SD1.5, SDXL, Flux, LoRAs) get assembled from diffusion, encoder, and VAE pieces
- long jobs are queueable, not blocking calls
- the frontend is kept separate from the pipeline
