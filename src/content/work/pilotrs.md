---
title: Pilotrs
description: Rust 6DOF flight simulator and autopilot where the controller flies on fused sensor estimates, never ground truth — quadrotor, fixed-wing, and a relaxed-stability fly-by-wire fighter.
thesis: A full sensing → estimation → control stack in Rust, built around one hard rule — the autopilot only ever sees noisy sensor data, never the truth.
eyebrow: Flight control stack
blurb: From-scratch 6DOF flight sim and autopilot in Rust — a quadrotor and a fixed-wing flown by complementary/MEKF/INS estimators and PID/LQR control over a 1/1000-scale Earth.
proof: autopilot never sees ground truth · no_std core, Ferrocene-ready
stackLine: Rust / nalgebra / no_std / RK4 / MEKF / INS / LQR / three-d + egui
themeKey: pilotrs
accent: '#0e7c86'
accentDark: '#54cfdd'
hint: ~/pilotrs/fsim-core/lib.rs
galleryColumns: single
publishDate: 2026-06-18 00:00:00
img: /Portfolio/assets/pilotrs-viewer.webp
img_alt: Pilotrs interactive viewer — the fly-by-wire fighter over the 1/1000-scale Earth with route planner and live fixed-wing telemetry
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
    value: no_std · Ferrocene-ready (MSRV 1.91)
heroPoints:
  - The autopilot consumes only the estimator's output — ground truth stays sealed inside the simulator, never read by a controller.
  - One 6DOF core flies both airframes — a quadrotor and a Beard & McLain fixed-wing — integrated with RK4 at 1 kHz.
  - A relaxed-stability fighter departs in ~0.34 s with the flight-control system off — eigenvalues right-half-plane open-loop, left-half-plane closed.
gallery:
  - src: /Portfolio/assets/pilotrs-viewer.webp
    alt: Pilotrs interactive viewer with the fly-by-wire fighter over the globe, route planner, and live telemetry plots
    caption: The interactive viewer — hand-flying the relaxed-stability fighter over the globe. Route planner top-right, live estimate-vs-truth telemetry bottom-right; flip the FCS off and the airframe departs in under a second.
    frame: wide
  - src: /Portfolio/assets/pilotrs-arch.svg
    alt: Pilotrs architecture — simulation truth and sensors above a perception boundary, estimators and control below, closing the loop
    caption: The sensing → estimation → control stack. Nothing below the perception boundary ever reads ground truth — the loop closes through noisy estimates.
    frame: wide
architecture:
  - fsim-core holds the no_std, frame-agnostic 6DOF dynamics, sensor models, estimators, and controllers — shared verbatim by every airframe and example.
  - Sensor models degrade the true state with seeded, reproducible noise and bias random-walk before the autopilot ever sees it.
  - A selectable estimator — complementary filter, 6-state MEKF, or 15-state INS — fuses measurements into the one state estimate every controller reads.
  - PID/LQR inner loops, waypoint guidance, and the fly-by-wire FCS sit behind a common Controller trait, closing the loop back onto the plant.
highlights:
  - The separation between simulation truth and autopilot perception is structural — controllers and estimators consume the estimate, never the truth.
  - Relaxed-stability fly-by-wire proven, not asserted — open-loop short-period eigenvalues in the right-half plane, closed-loop in the left.
  - no_std flight-control core kept Ferrocene-compatible by construction, built to move from sim toward qualified embedded targets.
status: flagship
---

`Pilotrs` is a from-scratch **6-degrees-of-freedom flight simulator and autopilot** in Rust. It runs the full rigid-body dynamics of a quadrotor and a fixed-wing aircraft inside a complete **sensing → estimation → control** stack, over a spherical 1/1000-scale Earth — built around one constraint that shapes everything else.

## The constraint

The simulator knows the aircraft's true state. The autopilot does not, and is not allowed to. Every controller and estimator consumes **only** the estimator's output — a state fused from noisy, biased, degraded sensor measurements — and never the ground truth sitting one layer above it.

That rule is the whole point. It is the same discipline that brought me here: the autonomous submarine fused raw IMU data through a Kalman filter because the heading you can *measure* is never the heading you *have*. Pilotrs is that idea taken to aerospace, with the perception boundary drawn explicitly instead of assumed.

## Decisions

- **One core, two airframes.** 6DOF equations of motion with the full non-diagonal inertia tensor, shared verbatim by a quadrotor plant and a Beard & McLain fixed-wing model (lift/drag/moment coefficients, stall blend, control surfaces, propeller, Newton trim solver). Integration is fixed-step **RK4 at 1 kHz** with per-step quaternion renormalization.
- **Estimation is a choice, not a default.** Three estimators behind one interface: a **complementary filter**, a 6-state quaternion **MEKF** (attitude + gyro bias), and a 15-state **INS** that treats the accelerometer as a strapdown input — so a sustained translating maneuver doesn't corrupt attitude the way a naive AHRS would.
- **Control is swappable.** PID and LQR inner loops sit behind a common `Controller` trait; position/velocity control, waypoint missions, and a successive-loop fixed-wing autopilot ride on top. Switch the controller or estimator at runtime and watch the step response change.
- **The core stays `no_std`.** `fsim-core` carries no standard-library dependency, holds at MSRV 1.91, and is kept **Ferrocene-compatible by construction** — so the qualified Rust toolchain can drop in for embedded and safety-critical targets without a refactor.

## The fly-by-wire demo

The showcase is a **relaxed-stability fighter**: an airframe with a *negative static margin* that is unstable open-loop and pitches away from trim in about **0.34 s** — comparable to an F-16's ~0.3 s divergence. An onboard fly-by-wire system with angle-of-attack and rate feedback, pilot command augmentation, and dynamic-pressure gain scheduling flies it. One key toggles the flight-control system off, and you feel the airframe depart the instant the computer stops flying it.

The instability is proven, not claimed. The short-period eigenvalues are linearized about trim: they sit in the **right-half plane open-loop** and the **left-half plane closed-loop**. A modern fighter *is* its control laws — and here you can switch them off and watch.

## The world

The planet is a **1/1000-scale Earth** (6371 m radius). The fixed-wing flies in a planet-centered inertial frame with **radial, inverse-square gravity** and **great-circle** navigation; the quadrotor flies a flat local-tangent frame near home, where curvature is negligible. The equations of motion are frame-agnostic, so only gravity and the navigation math differ between them.

## Tooling

The deterministic simulation runs on its own thread, decoupled from rendering. Telemetry is **bit-exact record/replay**, and a **parallel Monte-Carlo** harness runs faster than real time. The interactive viewer switches airframes and estimators live, plans routes on a zoomable planisphere, and plots estimate vs. truth vs. setpoint — so you can see exactly where perception and reality come apart.

## Relation to the rest

Where [`llmedge`](/Portfolio/work/llmedge) is native systems work for edge AI, Pilotrs is the control-systems half of the same instinct — explicit state, deterministic loops, and estimators you can trace by hand when they misbehave. It is the line drawn straight from the submarine's Kalman filter to the aerospace and real-time systems the rest of this work points toward.
