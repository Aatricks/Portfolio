---
title: LightDiffusion-Next
description: Performance-oriented image generation stack with a local server, workflow tooling, and aggressive implementation tuning.
thesis: A practical diffusion system shaped around local use, model flexibility, and implementation detail rather than benchmark theater.
eyebrow: Generation stack
blurb: Local image-generation system — pipeline core, queueing server, browser UI — tuned with Xformers, BFloat16, WaveSpeed, and Stable-Fast.
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
featuredOrder: 2
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
  - Built for local iteration, not a one-button demo, with queueing, preview flow, deployment options, and maintainable execution routing.
  - Supports multiple model families and workflow features such as Hires-Fix, ADetailer, prompt enhancement, and img2img-style operations.
  - Measured ~30% inference-time reduction over open-source baselines through scheduler optimization and VRAM-level tensor allocation.
gallery:
  - src: /Portfolio/assets/lightdiffusion-home.png
    alt: LightDiffusion-Next browser UI with settings sidebar and generated car image
    caption: Browser-facing interface built around prompt controls, run management, and output previews.
  - src: /Portfolio/assets/LDN.webp
    alt: Desktop LightDiffusion interface with prompt area and generated preview
    caption: The earlier desktop UI — same local-first workflow, one implementation phase earlier.
  - src: /Portfolio/assets/SD1.webp
    alt: Generated landscape image produced by the diffusion pipeline
    caption: Pipeline output with Hires-Fix and enhancement passes applied.
architecture:
  - Pipeline context routes generation settings through shared execution logic instead of scattering branches across the UI.
  - Local server handles queueing, seeds, uploads, previews, and long-running generation workflows.
  - ModelFactory resolves different model layouts and assembles diffusion, encoder, and VAE pieces as needed.
  - UI surfaces stay decoupled from the core pipeline so local experimentation does not collapse into script sprawl.
highlights:
  - Measured ~30% inference-time reduction over open-source baselines; selected for the Ready Tensor CV Projects Expo 2024.
  - Supports both browser-facing product flow and lower-level execution control.
  - Acceleration is architectural — Xformers, BFloat16, WaveSpeed, and Stable-Fast are wired into the execution path, not bolted on.
status: flagship
---

`LightDiffusion-Next` is a local image-generation system: a pipeline core, a queueing server, and a browser UI, documented end to end (setup, UI tour, REST API, architecture, deployment, performance).

## The performance work

The headline number: the `LightDiffusion` lineage this project descends from measured a **~30% inference-time reduction** against open-source baselines, and was **selected for the Ready Tensor CV Projects Expo 2024** on the strength of that work. The reduction came from two places:

- scheduler optimization — reworking the sampling loop instead of accepting reference implementations
- VRAM-level tensor allocation — controlling when and where tensors live rather than letting the framework decide

On top of that, the execution path wires in **Xformers**, **BFloat16**, **WaveSpeed**, and **Stable-Fast**, because repeated local use is where acceleration is actually felt.

## The workflow surface

The system is organized as a tool for repeated local use, not a single-script demo:

- prompt and negative prompt control, presets, and generation modes
- enhancement passes: Hires-Fix, ADetailer, prompt enhancement, img2img-style operations
- queueing, history, output previews, and uploads
- REST API and deployment paths (including a hosted HuggingFace Space demo)

## Architecture

The interesting part is where product concerns meet backend concerns:

- generation settings route through one shared pipeline context — no per-UI execution branches
- model families (SD1.5, SDXL, Flux, LoRAs) resolve through factory-style assembly of diffusion, encoder, and VAE pieces
- long-running jobs are queueable local workflows, not blocking calls
- the frontend is decoupled enough from the pipeline that experiments don't degrade the codebase

## Relation to the rest

`llmedge` is C++/Kotlin systems work on Android; `LightDiffusion-Next` is the same optimization discipline applied to a larger Python system with real user-facing surfaces — both sides of performance-critical AI tooling.
