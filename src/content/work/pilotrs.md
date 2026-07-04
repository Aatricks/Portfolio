---
title: Pilotrs
description: A 6DOF flight sim and autopilot I wrote in Rust. The autopilot flies on fused sensor estimates, never the real state. It covers a quadrotor, a fixed-wing, and an unstable fly-by-wire fighter.
thesis: A sensing → estimation → control stack in Rust. The autopilot only ever sees noisy sensor readings, never the true state.
eyebrow: Flight control stack
blurb: A 6DOF flight sim and autopilot in Rust. A quadrotor and a fixed-wing, flown by complementary/MEKF/INS estimators and PID/LQR control over a 1/1000-scale Earth.
proof: autopilot never sees ground truth · bare-metal no_std core
stackLine: Rust / nalgebra / no_std / RK4 / MEKF / INS / LQR / three-d + egui
themeKey: pilotrs
accent: '#0e7c86'
accentDark: '#54cfdd'
hint: ~/pilotrs/fsim-core/lib.rs
galleryColumns: single
publishDate: 2026-06-18 00:00:00
img: /Portfolio/assets/pilotrs-viewer.webp
img_alt: Pilotrs viewer, the fly-by-wire fighter over the 1/1000-scale Earth with route planner and live fixed-wing telemetry
featured: true
featuredOrder: 2
repoUrl: https://github.com/Aatricks/Pilotrs
metrics:
  - label: Sim core
    value: 6DOF rigid body · RK4 @ 1 kHz
  - label: Estimators
    value: Complementary · 6-state MEKF · 15-state INS
  - label: Control
    value: Cascaded PID / LQR · waypoints · FBW
  - label: Core
    value: no_std · MSRV 1.91 (bare-metal compatible)
heroPoints:
  - The autopilot logic is completely isolated from the simulator's ground truth, forcing it to rely entirely on the noisy estimator output.
  - One physics core flies both aircraft, a quadrotor and a Beard & McLain fixed-wing, with RK4 at 1 kHz.
  - The fly-by-wire fighter goes unstable in about 0.34 s with the flight computer off. State feedback (LQR/PID) stabilizes it closed-loop.
gallery:
  - src: /Portfolio/assets/pilotrs-viewer.webp
    alt: Pilotrs viewer with the fly-by-wire fighter over the globe, route planner, and live telemetry plots
    caption: The viewer, flying the unstable fighter over the globe. Route planner top-right, live estimate-vs-truth plots bottom-right. Turn the flight computer off and it goes unstable in under a second.
    frame: wide
  - src: /Portfolio/assets/pilotrs-arch.svg
    alt: Pilotrs architecture, simulation truth and sensors above a perception line, estimators and control below, closing the loop
    caption: The sensing → estimation → control loop. Nothing below the perception line reads the real state; it all goes through the estimate.
    frame: wide
architecture:
  - fsim-core has the no_std, frame-agnostic 6DOF physics, sensor models, estimators, and controllers, shared by every aircraft and example.
  - Sensor models add seeded, repeatable noise and bias drift to the true state before the autopilot sees anything.
  - You pick the estimator (complementary filter, 6-state MEKF, or 15-state INS) and it fuses the measurements into the one estimate every controller reads.
  - PID/LQR inner loops, waypoint guidance, and the fly-by-wire system sit behind one Controller trait and close the loop back onto the plant.
highlights:
  - Controllers and estimators only ever get the estimate, never the truth. The split is kept explicit in the code.
  - It's physically unstable and pitches out of control in under a second open-loop, but stays locked in with state feedback.
  - The no_std flight-control core has zero dependencies, making it easy to compile for embedded targets later without a rewrite.
status: flagship
---

`Pilotrs` is a 6DOF flight sim and autopilot I wrote in Rust. It runs the rigid-body physics of a quadrotor and a fixed-wing plane, with a sensing → estimation → control loop on top, over a 1/1000-scale Earth.

## Sensors only

The sim knows the aircraft's true state. The autopilot doesn't, and it's not allowed to. Every controller and estimator only gets the estimate, which is built from noisy, biased sensor readings. I did the same thing on a school submarine project before this, fusing IMU data with a Kalman filter to get a usable heading.

## What's in it

- One physics core runs both aircraft. Full 6DOF equations with the real, non-diagonal inertia tensor, shared between the quadrotor and a Beard & McLain fixed-wing model (lift, drag, moments, stall, control surfaces, propeller, a Newton trim solver). It integrates with RK4 at 1 kHz and renormalizes the quaternion every step.
- Three estimators you can swap between: a complementary filter, a 6-state MEKF, and a 15-state INS. The INS treats the accelerometer as a strapdown input, so a long translating maneuver doesn't wreck the attitude estimate the way a basic AHRS would.
- PID and LQR controllers behind one trait, with waypoint missions and a fixed-wing autopilot on top. You can switch the controller or estimator while it's running.
- The core is `no_std`, sits at MSRV 1.91, and has zero dependencies, so it can easily compile for embedded microcontrollers later.

## Why it's no_std

I made the flight-control core `no_std` with zero dependencies on purpose. No allocator, no hidden runtime, nothing in the loop that isn't deterministic and auditable, which is standard practice in safety-critical avionics. It also means running it through a qualified Rust compiler like Ferrocene (for DO-178C or ISO 26262 work) is actually possible without a complete rewrite down the line. I'm not certifying a real aircraft, but I wrote the code so that option stays open.

## The fly-by-wire fighter

There's also a relaxed-stability fighter. It has a negative static margin, so it's unstable on its own and pitches away from level in about 0.34 s (an F-16 is around 0.3). A fly-by-wire system with angle-of-attack and rate feedback, command shaping, and gain scheduling keeps it flying. One key turns the flight computer off, and it goes unstable.

Without active stabilization from the flight computer, the aircraft pitches up and stalls almost instantly.

## The world

The planet is a 1/1000-scale Earth, 6371 m radius. The fixed-wing flies in a planet-centered inertial frame with radial inverse-square gravity and great-circle navigation; the quadrotor uses a flat local frame near home, where the curvature doesn't matter. The physics is frame-agnostic, so only gravity and the nav math change between them.

## Tooling

The sim runs on its own thread, separate from rendering, and it's deterministic. Telemetry is bit-exact record/replay, and there's a parallel Monte-Carlo harness that runs faster than real time. The viewer lets you switch aircraft and estimators live, plan routes on a zoomable map, and plot estimate vs. truth vs. setpoint.
