---
title: LightDiffusion-Next
description: Performance-oriented image generation stack with a local server, workflow tooling, and aggressive implementation tuning.
thesis: A practical diffusion system shaped around local use, model flexibility, and implementation detail rather than benchmark theater.
eyebrow: Generation stack
stackLine: Python / FastAPI / Streamlit / Gradio / PyTorch / Flux / SDXL
themeKey: lightdiffusion-next
publishDate: 2026-04-13 00:00:00
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
  - Treats performance work as implementation detail plus product design, not just a single benchmark number.
gallery:
  - src: /Portfolio/assets/lightdiffusion-home.png
    alt: LightDiffusion-Next browser UI with settings sidebar and generated car image
    caption: Browser-facing interface built around prompt controls, run management, and output previews.
  - src: /Portfolio/assets/LDN.webp
    alt: Desktop LightDiffusion interface with prompt area and generated preview
    caption: Earlier local UI surface showing the same local-first workflow from a different implementation phase.
  - src: /Portfolio/assets/SD1.webp
    alt: Generated landscape image produced by the diffusion pipeline
    caption: Output quality matters, but the project page should emphasize the tooling and routing that make repeated local use viable.
architecture:
  - Pipeline context routes generation settings through shared execution logic instead of scattering branches across the UI.
  - Local server handles queueing, seeds, uploads, previews, and long-running generation workflows.
  - ModelFactory resolves different model layouts and assembles diffusion, encoder, and VAE pieces as needed.
  - UI surfaces stay decoupled from the core pipeline so local experimentation does not collapse into script sprawl.
highlights:
  - Strong performance posture with repo-level emphasis on acceleration, caching, and compiled execution paths.
  - Supports both browser-facing product flow and lower-level execution control.
  - Shows backend architecture and optimization discipline outside the Android runtime work.
status: flagship
---

`LightDiffusion-Next` is my local image-generation system. I framed it around **speed, flexibility, and practical local workflows**, then documented setup, UI tour, REST API, architecture, deployment, and performance so the project reads like a real tool.

## What I want this project to communicate

I do not want this project to read like "I built a Stable Diffusion UI."

The stronger story is:

- there is a real pipeline core
- there are deliberate application surfaces around it
- the system supports repeated local use
- performance work is built into the architecture

I explicitly call out acceleration and optimization features such as **Xformers**, **BFloat16**, **WaveSpeed**, and **Stable-Fast** because they affect how the product feels under real usage.

## Workflow breadth

I built a broader workflow than a minimal text-to-image page:

- prompt and negative prompt control
- presets and generation modes
- enhancement passes like Hires-Fix and ADetailer
- queueing and history
- output preview and uploads
- deployment and REST-facing operation

That breadth matters because it shows I organized the project like a tool people can operate repeatedly, not a single-script experiment.

## Architectural story

The system is most interesting where product concerns and backend concerns meet:

- pipeline state is routed through shared execution logic
- model families are resolved by factory-style assembly rather than hard-coded UI branches
- long-running jobs are handled as queueable local workflows
- the frontend remains separate enough from the pipeline to keep the codebase maintainable

## Why it matters in the portfolio

`llmedge` shows my native runtime work on Android. `LightDiffusion-Next` shows a different muscle: designing and optimizing a larger Python-based local system with user-facing workflow surfaces, deployment paths, and multiple model families.

## Result

This project demonstrates that I can handle both sides of systems-heavy AI work: low-level edge runtime engineering and broader local tooling where performance, architecture, and usability all need to hold together.
