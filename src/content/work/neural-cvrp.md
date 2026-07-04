---
title: Neural CVRP
description: A corpus of structural negative results on when machine learning helps the Capacitated VRP, from a research internship at HEC Montréal. Includes a classical Rust engine that beats HGS.
thesis: Evaluated 40+ learned and hybrid CVRP variants. The structural conclusion is that learning does not move the needle on quality at bounded sizes, while a classical parallel Rust engine outperforms HGS.
eyebrow: AI research
blurb: A corpus of structural negative results on when machine learning helps the Capacitated VRP, from a research internship at HEC Montréal. Includes a classical Rust engine that beats HGS.
proof: engine beats HGS at every budget · negative results write-up
stackLine: PyTorch / GFlowNet / POMO / LEHD / Rust / PyVRP / slurm
themeKey: neural-cvrp
accent: '#5a3fc0'
accentDark: '#a98bf0'
hint: ~/cvrp/ils.rs
galleryColumns: single
publishDate: 2026-07-04 00:00:00
img: /Portfolio/assets/neural-cvrp-arch.svg
img_alt: Two arenas for the CVRP, a learned attention constructor measured and set aside on the left, a classical ruin-and-recreate Rust engine on the right, with a standing strip showing the engine ahead of PyVRP on gap to best-known
featured: true
featuredOrder: 1
metrics:
  - label: Problem
    value: capacitated VRP · Set-X, n=100–1000
  - label: Study A (Learned CVRP)
    value: POMO / LEHD / GFlowNet / diffsplit
  - label: Study B (ML + Engine)
    value: GNN ruin / neural column pricing
  - label: Standing (gap to BKS)
    value: beats HGS @10/60/120 s; AILS-II unbeaten
heroPoints:
  - A classical Rust solver, built from the papers up, that beats HGS (PyVRP) at every time budget on the 99-instance Set-X benchmark.
  - A learned attention policy that constructs routes stop by stop, strong at small n, but it loses to classical search where it counts.
  - The write-up is a corpus of negative results, at bounded instance size, learning is not the lever that moves CVRP quality.
gallery:
  - src: /Portfolio/assets/neural-cvrp-arch.svg
    alt: The two arenas of the project, a learned constructor set aside and a classical ruin-and-recreate engine as the spine, with the standing strip showing the engine ahead of PyVRP
    caption: The two arenas. The learned constructor was measured and set aside; the classical ruin-and-recreate engine is the spine that actually wins. Standing is gap to best-known on the 99-instance Set-X set, lower is better.
    frame: wide
architecture:
  - LKH lays down one giant tour, then an exact Prins split cuts it into capacity-feasible routes.
  - Granular local search over each stop's 15 nearest neighbours cleans up every candidate.
  - SISR ruin-and-recreate and SREX crossover perturb the solution, with simulated-annealing acceptance.
  - A best-of-K ruin oracle tries K destructions per step across K cores and keeps the lowest post-search cost.
highlights:
  - The engine beats PyVRP (HGS) at every budget and closes on AILS-II, the single-thread state of the art, with no learned component in the hot loop.
  - On the learned side, the entire test-set improvement turned out to be test-time search, not the network, one of several structural negatives in the write-up.
  - Near-optimal CVRP partitions are degenerate, two equally good solutions share only about 41% of their same-route pairs, so there is little stable signal to learn.
status: flagship
---

This project represents my research internship at HEC Montréal: a systematic evaluation of when machine learning helps the Capacitated Vehicle Routing Problem, culminating in a detailed write-up of structural negative results. The work is a systematic map of why machine learning fails to move the needle on CVRP quality at bounded sizes, backed by a high-performance classical parallel solver in Rust.

## Study A: Learned CVRP (NCO)

I ran a broad sweep of neural combinatorial optimization (NCO) models, including attention encoder-decoders (POMO, LEHD), GFlowNets (with SubTB RL), D3PM diffusion, normalizing flows, and AlphaZero-style searches. The core finding is that constructive RL needs a strong prior; at n = 50, they all underperform the warm-started LEHD/POMO baseline.

One of the key ideas I evaluated was using a **differentiable-split decomposition**: trying to train a network to output a giant TSP tour and letting a softened Prins Split layer handle the vehicle capacity cuts. The goal was to backpropagate through the split recurrence (using a -τ · logsumexp smoothing) to optimize the giant-tour ordering. However, we found this is structurally blocked:
*   The smoothed Split is differentiable in the cut placements (j), which the exact dynamic program already places optimally.
*   The policy controls the giant tour ordering (σ), but the ordering enters the cost function only through a discrete gather (`tour.long()`), blocking the gradient (∂cost/∂σ).
*   Continuous permutation relaxations (like Sinkhorn or Gumbel Straight-Through) that unblock it collapse to degenerate uniform permutations during training.

## Study B: ML-Augmented Search

Study B asked the reverse question: starting from a SOTA classical iterated local search (ILS) engine, can we inject machine-learning steering (like GNN route rebuild-scorers, demand-aware co-assignments, or neural column pricing) into the hot loop? 

Inside a SOTA engine, the learnable signal is too weak. Near-optimal CVRP solutions are massively degenerate: two equally good solutions share only about 41% of their same-route pairs, so any consensus signal is noise. The residual gap behaves as an "assignment lottery" over degenerate local minima. A neural network paying per-call GPU latency on every local search step is simply the wrong tool.

## The Classical Rust Solver

Because the neural variants plateaued, the primary artifact that shipped was a high-performance classical ILS engine built in Rust. It uses LKH for initial tours, Prins split for vehicle capacity partitioning, granular local search over nearest neighbors, SISR ruin-and-recreate, SREX crossover, and simulated annealing. 

The main performance lever is a **best-of-K ruin oracle**: at each perturbation step, it runs K destructions in parallel across K CPU cores, re-optimizes, and keeps the lowest post-search cost.

On the full 99-instance Set-X benchmark, gap to best-known (lower is better):

*   **@10 s (multi-core)**: 0.664% against PyVRP's 1.367% (single-core engine: 0.755%)
*   **@60 s (multi-core)**: 0.362% against PyVRP's 0.511% (single-core engine: 0.497%)
*   **@120 s (multi-core)**: 0.302% against PyVRP's 0.433% (single-core engine: 0.429%)

It beats PyVRP (the HGS implementation) at every budget. Single-threaded it's tighter: FILO is the one to catch at a 10-second budget, and AILS-II is the converged state of the art, which I didn't beat.

## MHStudy

Alongside this, I'm working through a slower, stricter project: reproducing the classical CVRP canon from scratch. I'm implementing thirteen metaheuristics (Clarke-Wright in 1964 through Prins' memetic GA in 2004) from the original papers alone in zero-dependency Rust. I run them against a separate Python validator that independently checks feasibility and cost to make sure there's no code bias. 

The point is to measure the algorithms with everything else held constant (same language, data structures, and tuning effort) so a win is actually the algorithm and not just a better implementation. The first one is done and validated: Clarke-Wright, landing a 6.62% mean gap to best-known across 119 benchmark instances.

Code is kept private (research IP). Happy to talk through the approach.
