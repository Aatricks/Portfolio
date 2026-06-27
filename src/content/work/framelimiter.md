---
title: FrameLimiter
description: A frame-rate limiter for native Metal games on Apple Silicon — an injected dylib that swizzles CAMetalLayer's nextDrawable and paces the render loop, trading input latency for GPU power and heat.
thesis: A frame cap that does less GPU work, not just less display — pace the one method every Metal game presents through, and let back-pressure drain the work upstream.
eyebrow: Native systems
blurb: Frame-rate limiter for native Metal games on Apple Silicon — an injected dylib that swizzles nextDrawable and paces the render loop, trading latency for power and heat.
proof: back-pressure cuts real GPU work · live-tunable, no restart
stackLine: Objective-C / Metal / CAMetalLayer / DYLD injection / mach_wait_until
themeKey: framelimiter
accent: '#9d6b0f'
accentDark: '#e3a73a'
hint: ~/FrameLimiter/src/frame_limiter.m
publishDate: 2026-06-27 00:00:00
img: /Portfolio/assets/framelimiter-arch.svg
img_alt: FrameLimiter architecture — an injected dylib swizzles CAMetalLayer nextDrawable and paces the render loop, applying back-pressure to cut GPU work
repoUrl: https://github.com/Aatricks/FrameLimiter
metrics:
  - label: Platform
    value: Apple Silicon · native Metal
  - label: Injection
    value: DYLD_INSERT_LIBRARIES dylib
  - label: Pacing
    value: mach_wait_until · sleeps, never spins
  - label: Control
    value: live-tunable fps file · no restart
heroPoints:
  - It swizzles -[CAMetalLayer nextDrawable] — the single method essentially every Metal game presents through — and paces it, so one interception point covers MetalKit and SDL2 alike.
  - Pacing nextDrawable applies back-pressure — the in-flight drawable pool drains and the render thread stalls, so the GPU does less real work rather than merely delaying frames.
  - Adaptive VSync forces displaySyncEnabled off only above the panel refresh; at or below it, the layer's original VSync is restored.
gallery:
  - src: /Portfolio/assets/framelimiter-arch.svg
    alt: FrameLimiter data flow — game render loop into a swizzled nextDrawable, paced by mach_wait_until against a live control file, with an adaptive-VSync branch and back-pressure throttling the GPU
    caption: The injection path — one swizzled present call, paced against a live control file. The adaptive-VSync branch only forces sync off above the panel refresh; back-pressure does the actual throttling.
    frame: wide
architecture:
  - An ad-hoc-signed dylib loads via DYLD_INSERT_LIBRARIES and swizzles -[CAMetalLayer nextDrawable], the one present path shared by MetalKit/MTKView and SDL2's Metal backend.
  - The swizzled method paces the render loop with mach_wait_until — it sleeps to the next frame deadline rather than busy-waiting, because the whole point is to save power.
  - Back-pressure does the throttling — a paced nextDrawable drains the drawable pool and stalls the render thread, so the GPU produces less work, not just later frames.
  - Adaptive VSync resolves the target against the display refresh — above it, displaySyncEnabled is forced off (tearing accepted for latency); at or below, the original VSync is left intact.
highlights:
  - The cap is a power and heat lever — on a fanless Apple Silicon laptop, rendering far above what the panel shows just burns battery for frames no one sees.
  - A limiter can only cap downward — an above-refresh target only does anything if the game already produces those frames with VSync off.
  - The target lives in a control file the dylib watches, so flctl can retarget it or toggle the limiter off while the game runs, with no restart.
  - Installs on macOS Steam through a reversible bundle wrapper, working around Steam's inability to pass environment variables in launch options.
status: secondary
---

`FrameLimiter` is a frame-rate limiter for native Metal games on Apple Silicon, injected as a dylib through `DYLD_INSERT_LIBRARIES`. It caps a game's frame rate to a configurable, live-tunable target — independent of the engine's own VSync — to trade input latency against GPU power and heat.

## One interception point

A game presents frames by asking its `CAMetalLayer` for the next drawable. FrameLimiter swizzles `-[CAMetalLayer nextDrawable]` and paces that single call with `mach_wait_until`. Because essentially every native Metal target — MetalKit/`MTKView`, SDL2's Metal backend — presents through that method, one hook covers them all. It sleeps to each frame deadline rather than spinning; busy-waiting would defeat the purpose, which is to save power.

## Back-pressure, not delay

Pacing `nextDrawable` does more than postpone display. Holding the call drains the in-flight drawable pool, which stalls the render thread, which means the GPU does *less real work* — it isn't merely delaying frames it already rendered. On a fanless laptop that is the whole point: rendering far above what the panel can show wastes battery and generates heat for frames no one sees.

## Adaptive VSync and live control

A limiter can only cap downward. If the target sits above the display refresh, FrameLimiter forces `displaySyncEnabled` off so the engine can outrun the panel — which tears, the accepted price of lower latency; at or below refresh, the layer's original VSync setting is restored. The cap itself lives in a small control file the dylib watches, so `flctl` can retarget it, disable it, or toggle it while the game runs — no restart. On macOS Steam, which can't pass environment variables through launch options, a reversible bundle wrapper sets the environment and execs the original binary.
