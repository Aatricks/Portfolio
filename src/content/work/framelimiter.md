---
title: FrameLimiter
description: A frame-rate limiter for native Metal games on Apple Silicon. A small injected dylib hooks CAMetalLayer's nextDrawable and paces the render loop, trading input lag for less GPU power and heat.
thesis: A frame cap that actually does less GPU work, not just shows fewer frames. It paces the one call every Metal game goes through and lets back-pressure do the rest.
eyebrow: Native systems
blurb: Frame-rate limiter for native Metal games on Apple Silicon. An injected dylib hooks nextDrawable and paces the render loop, trading lag for power and heat.
proof: back-pressure cuts real GPU work · live-tunable, no restart
stackLine: Objective-C / Metal / CAMetalLayer / DYLD injection / mach_wait_until
themeKey: framelimiter
accent: '#9d6b0f'
accentDark: '#e3a73a'
hint: ~/FrameLimiter/src/frame_limiter.m
publishDate: 2026-06-27 00:00:00
img: /Portfolio/assets/framelimiter-arch.svg
img_alt: FrameLimiter architecture, an injected dylib hooks CAMetalLayer nextDrawable and paces the render loop, applying back-pressure to cut GPU work
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
  - It hooks -[CAMetalLayer nextDrawable], the one call basically every Metal game goes through, and paces it. So one hook covers MetalKit and SDL2 the same way.
  - Pacing nextDrawable pushes back on the game. The drawable pool drains and the render thread stalls, which applies back-pressure so the GPU doesn't waste energy rendering extra frames.
  - Above the panel's refresh it turns VSync off; at or below, it leaves the game's own VSync alone.
gallery:
  - src: /Portfolio/assets/framelimiter-arch.svg
    alt: FrameLimiter data flow, the game's render loop into a hooked nextDrawable, paced by mach_wait_until against a live control file, with an adaptive-VSync branch and back-pressure cutting GPU work
    caption: One hooked present call, paced against a live control file. The adaptive-VSync branch only kills VSync above the panel's refresh, and the back-pressure is what actually throttles things.
    frame: wide
architecture:
  - A small ad-hoc-signed dylib loads through DYLD_INSERT_LIBRARIES and hooks -[CAMetalLayer nextDrawable], the one present path MetalKit/MTKView and SDL2's Metal backend all share.
  - The hook paces the render loop with mach_wait_until. It sleeps until the next frame is due instead of busy-looping, since the whole point is to save power.
  - The throttling comes from back-pressure. Holding back nextDrawable drains the drawable pool and stalls the render thread, preventing the GPU from doing extra work.
  - It compares the target to the display's refresh. Above it, VSync gets forced off (which tears, the trade for lower lag); at or below, the game's VSync is left alone.
highlights:
  - On a fanless Apple Silicon laptop, running way above what the screen shows just drains the battery and makes heat for frames you never see. The cap stops that.
  - A limiter can only cap downward. Asking for more than the refresh only helps if the game already renders that fast with VSync off.
  - The cap lives in a little file the dylib watches, so flctl can change it or turn the limiter off mid-game, no restart.
  - For Steam it installs by adding an LSEnvironment block to the game's Info.plist and re-signing, which keeps the real executable so Game Mode and the over-60 Hz path still work.
status: secondary
---

`FrameLimiter` is a frame-rate limiter for native Metal games on Apple Silicon. It's a small dylib you inject with `DYLD_INSERT_LIBRARIES` that caps a game's frame rate to whatever target you want, separate from the game's own VSync, so you can trade input lag for less GPU power and heat.

## One hook

A game gets each frame by asking its `CAMetalLayer` for the next drawable. FrameLimiter hooks `-[CAMetalLayer nextDrawable]` (method swizzling) and paces that one call with `mach_wait_until`. Basically every native Metal game goes through that method, whether it's raw Metal, MetalKit/`MTKView`, SDL2, or MoltenVK, so one hook covers all of them. It sleeps until the next frame is due instead of busy-looping, because busy-looping would burn the power the cap is trying to save.

## Back-pressure

Pacing nextDrawable does more than just delay frame presentation. Holding the call back drains the drawable pool and stalls the render thread, which applies back-pressure so the GPU stops rendering new frames. On a fanless laptop, running at 200+ FPS just wastes battery and makes the machine hot for frames the screen can't even show.

## Adaptive VSync and live control

A limiter can only cap downward. If your target is above the display refresh, FrameLimiter forces `displaySyncEnabled` off so the game can run faster than the panel. That tears on a fixed-refresh screen, which is the trade for lower lag; at or below the refresh it leaves the game's VSync alone. The cap itself lives in a small file the dylib watches, so `flctl` can change it, disable it, or toggle it while the game runs without a restart.

Steam on macOS can't pass environment variables through launch options, so installing per game means touching the game bundle. FrameLimiter adds an `LSEnvironment` block to the game's `Info.plist` and ad-hoc re-signs it, so the system injects the dylib when the game launches as itself. I could've just replaced the executable, but that makes macOS stop recognizing the app, which kills Game Mode and the direct-to-display path that lets a game go past 60 Hz. Editing `Info.plist` keeps the app's identity, so those keep working.
