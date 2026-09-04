---
title: Neural CVRP
description: 'Research internship at HEC Montréal: empirical limits of machine learning for the CVRP, a Rust engine outperforming PyVRP, and an automated reimplementation pipeline for classical metaheuristics on VRP-REP.'
thesis: 'A four-month research internship at HEC Montréal (CIRRELT). Evaluated neural methods on the CVRP, built a parallel Rust solver that beats PyVRP on Set-X, and developed an automated pipeline that reimplements and benchmarks classical metaheuristics on VRP-REP.'
eyebrow: AI research
blurb: 'Research internship at HEC Montréal (CIRRELT). Neural methods on the CVRP, a parallel Rust engine that beats PyVRP, and an automated reimplementation pipeline for classical metaheuristics on VRP-REP.'
proof: Rust engine beats PyVRP on Set-X · 13 historical heuristics re-run · automated VRP-REP platform
stackLine: PyTorch / GFlowNet / POMO / LEHD / Rust / PyVRP / Slurm / Claude API / Symfony (VRP-REP)
themeKey: neural-cvrp
accent: '#5a3fc0'
accentDark: '#a98bf0'
hint: ~/cvrp/ils.rs
galleryColumns: single
publishDate: 2026-07-04 00:00:00
img: /Portfolio/assets/neural-cvrp-arch.svg
img_alt: 'Architecture overview: learned constructor evaluated and set aside on the left, parallel Rust ILS engine on the right with Set-X benchmark comparison against PyVRP'
featured: true
featuredOrder: 1
metrics:
  - label: Problem
    value: Capacitated VRP · Set-X (n = 100–1,000)
  - label: Study 1 (Neural CVRP)
    value: POMO / LEHD / GFlowNet / Differentiable Split
  - label: Study 2 (Reproducibility)
    value: 13 reimplemented metaheuristics (1964–2004)
  - label: Standing (Set-X gap)
    value: Beats PyVRP @10/60/120 s; AILS-II unbeaten
heroPoints:
  - Built a parallel Rust ILS solver from scratch that beats PyVRP at 10 s, 60 s, and 120 s budgets on the 99-instance Set-X benchmark.
  - 'Mapped structural failure modes in learned CVRP methods: gradient blockage in differentiable split, and solution degeneracy in ML-guided local search.'
  - Built an automated 9-stage pipeline using coding agents to reimplement 13 historical metaheuristics under a uniform protocol on VRP-REP.
gallery:
  - src: /Portfolio/assets/neural-cvrp-arch.svg
    alt: Architecture overview showing the learned constructor and the parallel Rust ILS engine with benchmark results on Set-X
    caption: Project structure. The learned constructor was evaluated and set aside; the parallel Rust ILS engine delivered the best results. Standing reflects mean gap to best-known solutions on Set-X (lower is better).
    frame: wide
architecture:
  - LKH computes an initial giant tour, partitioned into feasible routes via exact Prins Split.
  - Granular local search cleans up route candidates across 15 nearest neighbors per stop.
  - SISR ruin-and-recreate and SREX crossover perturb solutions under simulated annealing acceptance.
  - 'A parallel best-of-K ruin oracle: runs K destructions across K CPU cores and retains the best post-search cost.'
highlights:
  - The Rust solver outperforms PyVRP at every time budget on Set-X and approaches single-threaded state-of-the-art solvers without learned heuristics.
  - 'Detailed structural negative results: smoothed dynamic programming cannot pass gradients to sequence orderings through discrete index operations.'
  - 'Benchmarked 13 historical metaheuristics under identical code standards, revealing historical ranking artifacts (e.g. DETABA matching top 1990s methods).'
status: flagship
---

This project covers my four-month research internship at HEC Montréal (CIRRELT, summer 2026), supervised by Jorge Mendoza and Martin Cousineau. The work began as an investigation into machine learning for the Capacitated Vehicle Routing Problem (CVRP), led to a high-performance classical solver in Rust, and concluded with a reproducibility study of 13 historical metaheuristics integrated into VRP-REP as an automated benchmarking pipeline.

## Part one: neural methods for the CVRP

During the first two months, I evaluated whether neural combinatorial optimization could match or outperform classical solvers on CVRP instances ($n = 50$ to $100$). I tested several architectures: attention encoder-decoders (POMO, LEHD), GFlowNets with SubTB, D3PM diffusion, normalizing flows, and tree search variants. 

On pure constructive methods, the strongest baseline was an equivariant LEHD decoder trained with POMO and adversarial instances. It reached a 1.05% gap on in-distribution instances and 8.45% on out-of-distribution instances, but could not outperform classical baselines in quality or runtime.

### The differentiable split bottleneck

The main model I investigated was a differentiable split approach: training a policy to output a giant TSP tour, using a smoothed Prins Split layer ($-\tau \cdot \text{logsumexp}$) to place capacity cuts, and backpropagating through the dynamic programming recurrence to optimize the tour ordering.

This formulation is structurally blocked:
- The smoothed Split is differentiable with respect to cut placements ($j$). However, standard dynamic programming already computes optimal cut placements in $O(n)$ time, leaving nothing useful for the network to learn at that stage.
- The policy controls the giant tour sequence ($\sigma$). But that sequence enters the Split cost through discrete indexing (`tour.long()`), which has zero gradient with respect to $\sigma$ ($\partial \text{cost} / \partial \sigma = 0$).
- Continuous relaxations designed to bypass discrete indexing (such as Sinkhorn permutation matrices or Gumbel Straight-Through estimators) consistently collapsed to uniform permutations during training.

### ML-augmented local search

I also tested injecting learned components into a classical Iterated Local Search (ILS) loop (GNN rebuild scorers, demand-aware co-assignment, and neural column pricing).

This ran into solution degeneracy. Near-optimal CVRP solutions for a given instance share only about 40% to 41% of their customer-to-route assignments. Because many distinct route configurations yield nearly identical total costs, there is no consistent consensus signal for a model to learn. In practice, evaluating a neural network inside the local search loop added per-call GPU latency without improving move quality over fast geometric heuristics.

## The parallel Rust engine

Because the learned variants plateaued, I implemented a classical ILS solver in Rust to establish a strong baseline:
- Initial giant tours generated with LKH, partitioned into feasible routes via exact Prins Split.
- Granular local search restricted to each stop's 15 nearest neighbors.
- SISR (Slack Induction by String Removals) ruin-and-recreate, SREX (Selective Route Exchange) crossover, and simulated annealing acceptance.
- A parallel best-of-K ruin oracle: runs $K$ randomized destructions across $K$ CPU cores simultaneously at each step and keeps the lowest post-search cost.

### Benchmark results on Set-X (99 instances)

Mean gap to best-known solution (BKS), lower is better:

- **@10 s (multi-core)**: 0.664% vs PyVRP's 1.367% (single-core: 0.755%)
- **@60 s (multi-core)**: 0.362% vs PyVRP's 0.511% (single-core: 0.497%)
- **@120 s (multi-core)**: 0.302% vs PyVRP's 0.433% (single-core: 0.429%)

The solver outperforms PyVRP (the open-source HGS reference) at every budget. In single-threaded execution, FILO is faster at short budgets (0.61% at 10 s), and AILS-II remains the top-performing state-of-the-art solver across all budgets (0.31% at 10 s, 0.13% at 120 s).

## Part two: metaheuristic reimplementation study

In operations research, comparing algorithms from different papers is confounded by differences in programming languages, data structures, hardware, and tuning effort. When a 1999 paper reports better numbers than a 1993 method, it is often unclear whether the gain comes from the algorithm itself or from implementation advantages.

To test this, I set up a study reimplementing 13 historical CVRP metaheuristics published between Clarke & Wright (1964) and Prins (2004):
- **Methods covered**: Clarke & Wright (1964), Alfa et al. (1991, SA), Osman (1993, SA/TS), Taillard (1993, TS), Taburoute (1994, TS), Rochat & Taillard (1995, adaptive memory TS), Xu & Kelly (1996, network flow TS), Golden et al. (1998, Record-to-Record), Bullnheimer et al. (1999, Ant Colony), DETABA / Barbarosoglu & Ozgur (1999, TS), Rego (2001, node ejection TS), GTS / Toth & Vigo (2003, granular TS), and Prins (2004, genetic algorithm).
- **Execution**: Each method was reimplemented from its original paper alone by an LLM coding agent (Claude Opus in a standardized configuration). Agents had no access to external reference code or internet resources during implementation.
- **Shared infrastructure**: A common, zero-dependency Rust core handled instance parsing, distance calculations, and solution data structures. All search logic was written per paper.
- **Validation**: An independent Python verifier recalculated feasibility and exact costs for every generated solution to eliminate cross-language evaluation bugs. Unspecified parameters were documented in a proxy registry and swept systematically.

### Common protocol and findings

After reproducing the original paper tables, all 13 methods were benchmarked under a single protocol: CMT (14 instances), Golden (20 instances), and Set-X (100 instances), with 30 seeds per instance and a compute budget of $3 \times N$ seconds on identical AMD EPYC 9655 nodes (Alliance Canada cluster *Fir*).

Key findings:
- **Historical rankings shifted under uniform code quality**: On Set-X, three algorithms shared the top tier: Prins (2004, 1.82%), Osman (1993, 1.96%), and DETABA (1999, 1.97%). DETABA was largely overlooked in period surveys (such as Gendreau et al., 2002) and had worse reported numbers in older literature; reimplemented with equal care, it matched the top tabu searches.
- **Fragility in complex methods**: Granular Tabu Search (Toth & Vigo, 2003) failed to find feasible solutions on 25% of Set-X instances under fixed fleet constraints.
- **Move quality matters more than throughput**: GTS evaluated roughly $6\times$ more moves per second than DETABA on large instances, yet achieved worse overall gaps. The performance gap between 1990s algorithms and modern solvers like AILS-II (0.08% on Set-X) is driven by neighborhood design and acceptance rules, not evaluation throughput.
- **Independent reimplementation consistency**: Reimplementing a paper a second time with a different model (Sonnet) showed identical algorithmic decisions. The small 1–2.5% variance in reproduction numbers stemmed entirely from ambiguities in the original papers (e.g. integer vs. floating-point distance rounding).

## Part three: automated reproducibility platform on VRP-REP

To make this benchmarking methodology reusable, I built an automated 9-stage pipeline that processes a paper end-to-end:
1. Intake and parsing of published result tables, instances, and evaluation metrics.
2. Specification drafting.
3. Blind independent second reading by a different model to cross-check ambiguities.
4. Rust implementation against the shared core.
5. Code review by a secondary agent.
6. Mechanical validation (compilation, automated tests, independent Python solution verification).
7. Reproduction of published results under the paper's original setup.
8. Standardized benchmarking under the common protocol ($3 \times N$ s budget).
9. Output generation for leaderboard submission.

If any stage detects an unresolvable ambiguity, unregistered constant, or invalid solution, the pipeline halts and reports the exact citation discrepancy to the submitter.

### Integration with VRP-REP

The platform is integrated directly into [VRP-REP](http://www.vrp-rep.org), the public vehicle routing repository, under the *Contribute* section.

As part of the deployment, I modernized the legacy VRP-REP infrastructure: patched critical authentication vulnerabilities in the PHP/Symfony application, fixed defunct source dependencies, automated HTTPS certificate renewals, and isolated submitted file storage outside the web root.

The platform supports two workflows:
- **Hosted execution**: Runs inside an isolated Anthropic sandbox using the submitter's API key. Progress updates stream to VRP-REP over a one-way webhook with no incoming execution channel.
- **Local runner**: A downloadable CLI container that runs on the researcher's local machine using their own subscription. It reproduces count-based stopping criteria locally in under an hour without requiring cluster resources.

The pipeline was validated on seven complete papers (including a 1996 heuristic and a 2004 ACO method), averaging ~$50 USD in API token costs per paper. It is currently running in administrator testing on VRP-REP ahead of public release.

