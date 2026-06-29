---
title: FrameLimiter
description: A frame-rate limiter for native Metal games on Apple Silicon. A small injected dylib hooks CAMetalLayer's nextDrawable and paces the render loop, trading input lag for less GPU power and heat.
thesis: A frame cap that actually does less GPU work, not just shows fewer frames. It paces the one call every Metal game goes through and lets back-pressure do the rest.
eyebrow: Native systems
blurb: Frame-rate limiter for native Metal games on Apple Silicon. An injected dylib hooks nextDrawable and paces the render loop, trading lag for power and heat.
proof: back-pressure cuts real GPU work · menu-bar app & CLI · background throttling
stackLine: Objective-C / Metal / CAMetalLayer / C / DYLD injection
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
  - label: Control
    value: Menu-bar companion & flctl CLI
  - label: Throttling
    value: Active pacing & background/occluded drop (10 fps)
  - label: Display
    value: Dynamic screen refresh auto-detection
heroPoints:
  - It swizzles -[CAMetalLayer nextDrawable] to pace the render loop. Pacing nextDrawable drains the drawable pool and stalls the render thread, letting back-pressure do the real work of saving GPU energy.
  - A menu-bar app shows live FPS and manages targets. The game's wrapper auto-launches it, and the app self-quits using pid liveness when the game exits.
  - It drops the frame rate to 10 FPS when the game window is occluded, minimized, or on another Space, releasing App Nap blocks so macOS can sleep the process.
gallery:
  - src: /Portfolio/assets/framelimiter-arch.svg
    alt: FrameLimiter data flow, the game's render loop into a hooked nextDrawable, paced by mach_wait_until against a live control file, with an adaptive-VSync branch and back-pressure cutting GPU work
    caption: One hooked present call, paced against a live control file. The adaptive-VSync branch only kills VSync above the panel's refresh, and the back-pressure is what actually throttles things.
    frame: wide
architecture:
  - A small C wrapper replaces the game binary (renaming the real executable to .real) and inherits its entitlements, keeping macOS Game Mode and fullscreen paths intact.
  - The wrapper spins up the menu-bar app, sets the injection env vars, and execs the real game binary under the same PID.
  - The dylib swizzles nextDrawable and sleeps via mach_wait_until, pacing presentation to apply back-pressure to the GPU.
  - AppKit screen observers track refresh rates on monitor changes and handle occlusion states to apply background limits dynamically.
highlights:
  - The installer was rebuilt to identify previous wrappers (even old markerless ones) to prevent data loss, with trap-based signature rollback on failures.
  - Throttling drops to a custom cap (default 10 FPS) when you swipe to another Space, saving battery when you're not looking.
  - Display refresh rate is auto-detected from AppKit and updates dynamically if you move the window to a high-refresh external monitor.
  - The menu-bar app contains a Steam game auto-discovery list, letting you toggle the wrapper installer directly from the UI.
status: secondary
---

`FrameLimiter` is a frame-rate limiter for native Metal games on Apple Silicon. It injects a small dylib using `DYLD_INSERT_LIBRARIES` that caps a game's frame rate to a custom target, trading input lag for less GPU power and heat.

I've evolved this from a simple terminal experiment into a robust game utility with a companion menu-bar app, background occlusion throttling, dynamic screen-refresh detection, and a safe install lifecycle.

## One hook

A game gets each frame by asking its `CAMetalLayer` for the next drawable. FrameLimiter hooks `-[CAMetalLayer nextDrawable]` (via method swizzling) and paces that one call with `mach_wait_until`. Basically every native Metal game goes through that method—whether it's raw Metal, MetalKit/`MTKView`, SDL2, or MoltenVK—so one hook covers all of them. It sleeps until the next frame is due instead of busy-looping, because busy-looping would burn the power the cap is trying to save.

## Back-pressure

Pacing nextDrawable does more than just delay frame presentation. Holding the call back drains the drawable pool and stalls the render thread, which applies back-pressure so the GPU stops rendering new frames. On a fanless laptop, running at 200+ FPS just wastes battery and makes the machine hot for frames the screen can't even show.

## Ephemeral menu-bar & Game wrappers

Steam on macOS can't pass environment variables through launch options, and script wrappers fail because Steam expects the launched process to have the exact game identifier.

To solve this, I wrote a tiny C wrapper (`wrapper.c`). The installer swaps the game's main executable for this compiled wrapper and renames the real game binary to `Executable.real`. The wrapper inherits the original game's entitlements during installation so macOS Game Mode and direct-to-display high-refresh paths keep working.

When the game launches:
1. The wrapper boots up the `FrameLimiter.app` menu-bar helper.
2. It sets the `DYLD_INSERT_LIBRARIES` env vars.
3. It `execv`s into the real binary.

Because `execv` preserves the PID, the menu-bar helper can monitor the game's exact PID and automatically exit the moment you quit the game. If you open the menu-bar app manually, it stays open for configuring global defaults.

## Background occlusion throttling

Running a game in the background or on another Space shouldn't bake your laptop. FrameLimiter tracks focus and window occlusion using AppKit notifications (`NSApplicationDidResignActiveNotification` and `NSWindowDidChangeOcclusionStateNotification`).

When the game is out of sight, it immediately drops the target frame rate to a low cap (default 10 FPS, configurable via `~/.framelimiter.bgfps`). Crucially, it releases its App Nap activity assertion, letting macOS step in and put the game's render thread to sleep.

## Dynamic display detection

The adaptive VSync logic needs to know the display's actual refresh rate to decide whether to disable sync (above display refresh, prioritizing lower latency) or leave it alone.

Instead of hardcoding 60 Hz or forcing manual config, FrameLimiter queries the main display's actual refresh rate via AppKit (`[NSScreen maximumFramesPerSecond]`). It listens for screen configuration changes, so if you drag the game window to a 120 Hz external monitor or change resolutions, the pacing target and VSync decisions adapt on the fly.

## Control files and flctl

All configuration—the FPS target, background cap, HUD state, and live status—is stored in simple files under `~/.framelimiter.*`.
- The dylib writes a status heartbeat (`~/.framelimiter.status`) containing the game's PID, measured FPS, and state once per second.
- The `flctl` CLI reads and writes these files, letting you bind caps to global hotkeys (e.g. via Hammerspoon).
- The menu-bar app reads the status heartbeat to draw live FPS charts and displays a list of your Steam library, letting you install or uninstall the wrapper with a single click.
