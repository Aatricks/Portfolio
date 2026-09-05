---
title: Neural CVRP
description: 'four months of research at HEC Montréal on the capacitated vehicle routing problem. neural methods lost to classical solvers. then 13 old metaheuristics re-implemented under one protocol to measure implementation bias, and a pipeline on VRP-REP that does it per paper.'
thesis: 'research internship, HEC Montréal (CIRRELT), april to august 2026. part one: can a learned model beat HGS / AILS-II on CVRP? no. part two: how much of the published ranking is code quality rather than algorithm? enough to reorder a decade. part three: the protocol as a VRP-REP pipeline.'
eyebrow: research · negative result
blurb: 'neural CVRP (POMO / LEHD, GFlowNets, diffusion) tested against classical solvers: lost. 13 metaheuristics from 1964 to 2004 re-implemented in Rust under one protocol to measure implementation bias. now a reproduction pipeline on VRP-REP.'
proof: learned methods 1.05% behind, never faster · 13 metaheuristics, 30 seeds, one cluster · DETABA (1999) joins the top group
stackLine: PyTorch / POMO / LEHD / GFlowNet / Rust / PyVRP / Slurm / Claude agents / Symfony (VRP-REP)
themeKey: neural-cvrp
accent: '#5a3fc0'
accentDark: '#a98bf0'
hint: ~/cvrp/ils.rs
galleryColumns: single
publishDate: 2026-07-04 00:00:00
img: /Portfolio/assets/neural-cvrp-arch.svg
img_alt: 'two-column diagram: learned construction on the left, tested and stopped; classical Rust ILS engine on the right with its single-core Set-X gap against PyVRP'
featured: true
featuredOrder: 1
gallery:
  - src: /Portfolio/assets/neural-cvrp-arch.svg
    alt: learned construction on the left, tested and stopped; classical Rust ILS engine on the right with its single-core Set-X gap against PyVRP
    caption: part one. the learned side was measured and stopped. the Rust engine is single core here. gap to best-known on Set-X, lower is better.
    frame: wide
architecture:
  - a coding agent reads the paper. a second agent, a different model family, reads it blind and answers the same questions. if they disagree the run stops.
  - the method is written in Rust from the paper text only. no reference code, no internet. a shared core only parses instances and checks solutions.
  - a separate Python checker recomputes cost and feasibility for every solution. the solver and its judge never share code.
  - reproduce the paper's own tables under its own stopping rule. then the common protocol, 30 seeds, 3×N seconds, one node type, gap to best-known.
highlights:
  - best neural model landed 1.05% behind the best solver in-distribution and was never faster. the line of work was stopped after two months.
  - 13 CVRP metaheuristics (1964 to 2004) re-implemented from the paper alone, same language, same core, same cluster. the ranking moved.
  - the protocol now runs as a 7-stage pipeline in VRP-REP under Contribute → Reimplementation.
status: flagship
---

four months at HEC Montréal (CIRRELT), april to august 2026, on the capacitated vehicle routing problem: a depot, customers with demands, trucks with a capacity limit, minimise total distance. three parts, in the order they happened.

## part one: can a learned model beat the classical solvers?

the question was whether a neural model could get close to HGS (PyVRP) or AILS-II quality on CVRP at n = 50 to 100, but faster. one constraint from the lab: the model had to stay purely neural. no classical local search after it to clean up.

i tried a lot of things. most failed.

- **perturbing the solver's input distances** so the giant tour it returns splits well. the solver and the split both move in steps: a small change in distances does nothing, then the solution flips. the model gets almost no signal. random search did as well.
- **generating routes directly** with diffusion, flow matching, score matching, GFlowNets. an instance has many very different solutions of about equal cost, and a model trained to imitate all of them learns their average. the average of two good partitions is not a partition. GFlowNets got stuck on bad solutions without a good start.
- **imitate a solver, then refine with RL.** RL slowly undid what imitation had learned.
- **learning the split.** Prins' split can be written in a differentiable form, so in principle you can backprop through it. in practice the gradient is zero almost everywhere. where it isn't zero, it marks a jump, not a direction. "differentiable" is true and useless here.

what worked best built the solution one customer at a time: a LEHD-style decoder trained with POMO, an equivariant encoder, and adversarial instances so it saw hard layouts during training.

| architecture | gap in-distribution | gap out-of-distribution |
|---|---|---|
| first decoder (graph-based) | 2.5% | 25.5% |
| LEHD decoder, POMO training | 1.1% | 9.7% |
| + adversarial instances | 1.05% | 8.45% |

gap to the best solver, lower is better. it never beat the solver and was never faster.

### the classical engine i built alongside

i wanted a solver i could open up and put learned parts inside, so i wrote one in Rust. LKH giant tour, exact Prins split, then an iterated local search: granular moves over each stop's 15 nearest neighbours, SISR ruin and recreate, SREX crossover, simulated annealing acceptance.

single core on Set-X (100 instances), mean gap to best-known, lower is better:

| budget | mine | PyVRP | FILO | AILS-II |
|---|---|---|---|---|
| 10 s | 0.76% | 1.37% | 0.61% | 0.31% |
| 60 s | 0.50% | 0.51% | 0.38% | 0.16% |
| 120 s | 0.43% | 0.43% | 0.30% | 0.13% |

ahead of PyVRP at short budgets, tied at 120 s. FILO is ahead at every budget. AILS-II is well ahead at every budget.

### why learning didn't help the engine either

once local search has fixed the order inside each route, what's left is which customers go together. two near-optimal solutions share only about 40% of their same-route pairs. there are many good partitions and they look nothing alike, so there is no single answer for a model to aim at. a model was useful for coarse choices (which solutions to recombine) and useless for the detail. per-call GPU latency inside the hot loop bought nothing.

after two months the conclusion was clear: at this size nothing i tried beats AILS-II, learned or not. we stopped.

## part two: how much of the published ranking is the code?

the lab had a question that follows from that. when a 1999 paper beats a 1993 one in a table, is the idea better, or the code, the tuning, the machine? nobody re-implements the old method with equal care to find out.

so: 13 CVRP metaheuristics from Clarke and Wright (1964) to Prins' genetic algorithm (2004), at least one per family. Clarke-Wright, one simulated annealing (Alfa 1991), Osman 1993 (SA + tabu), seven tabu searches (Taillard 1993, Taburoute 1994, Rochat-Taillard 1995, Xu-Kelly 1996, DETABA 1999, Rego 2001, GTS 2003), record-to-record (Golden 1998), ant system (Bullnheimer 1999), Prins 2004.

i didn't write them myself. each was written by a coding agent (Claude Opus, fixed config), from the original paper only, under a written charter:

- no reference code, no internet during implementation
- Rust throughout, on a shared core that only parses instances and checks solutions. anything that touches the search trajectory is rewritten per paper, even a 2-opt
- every ambiguity in the paper settled in a decision log, with the section it came from
- every constant the paper doesn't state is registered as a proxy and swept before it enters a comparison
- a separate Python checker recomputes cost and feasibility for every solution, so the same bug can't sit in both the solver and its judge
- each method first has to reproduce its own paper's tables

then all 13 under one protocol: CMT (14 instances), Golden (20), Set-X (100), 30 seeds per instance, 3×N seconds, one node type (AMD EPYC 9655 on the Alliance cluster Fir), gap to best-known.

### what came out

Set-X, mean gap to best-known, lower is better:

| method | year | family | X |
|---|---|---|---|
| Prins | 2004 | genetic | 1.82% |
| Osman | 1993 | SA + tabu | 1.96% |
| DETABA (Barbarosoglu-Ozgur) | 1999 | tabu | 1.97% |
| Golden et al. | 1998 | record-to-record | 3.24% |
| Rochat-Taillard | 1995 | tabu + memory | 3.67% |
| Rego | 2001 | tabu | 3.96% |
| Taburoute | 1994 | tabu | 4.28% |
| GTS (Toth-Vigo) | 2003 | granular tabu | 4.59% on the 74/100 it solves |
| Taillard | 1993 | tabu | 4.73% |
| Clarke-Wright | 1964 | construction | 5.96% |
| Bullnheimer et al. | 1999 | ant system | 7.03% |
| Alfa et al. | 1991 | simulated annealing | 11.92% |
| Xu-Kelly | 1996 | tabu | feasible on 2/100, not ranked |

- **three methods form the top group** and the gaps between them are smaller than the protocol can resolve. one is DETABA. the period survey (Gendreau, Laporte, Potvin 2002) didn't put it in the first tier, and the published tables had it losing to the famous tabus. coded with the same care, it joins the top. part of the historical ranking was an implementation artefact.
- **the most elaborate tabu in the study, GTS (2003), finds no feasible solution on 26 of 100 Set-X instances** with the fleet size imposed. parameters were not hand-tuned for any method, on purpose.
- **the gap to modern solvers is not about speed.** every implementation reports moves evaluated per second. GTS evaluates about 6× more moves than DETABA on large instances and still finishes behind. AILS-II sits at 0.08% on Set-X against 1.8 to 2% for the best here. what separates 1999 from now is move quality and the acceptance rule, not throughput.
- **i had one paper re-implemented a second time, blind, by a different model.** same load-bearing decisions. the means differed by about 2.4%, all of it traceable to things the paper leaves open (integer vs real distances, on that one). so any difference in the table under 2.4% reads as a rank, not a decimal.

conclusion: implementation-quality bias is real and big enough to reorder a decade. it does not explain the last twenty years. at equal code the gap to AILS-II is still there, so the recent ideas are real algorithmic progress.

## part three: the protocol as a pipeline on VRP-REP

the corpus answers the question for 13 old methods. a platform asks it per paper, for methods that aren't written yet. during the corpus i drove the agent by hand at every step. the pipeline replaces that with 7 stages, one command:

1. **intake.** parse the PDF, pull the result tables, check the cited instances exist, list the procedures the paper delegates to another paper.
2. **conduct.** write the spec, the decision log, the proxy register.
3. **second read.** a different model family reads the paper blind and answers the same decisive questions (which statistic each table reports, what the paper leaves unset, what it delegates). blinding is enforced by the file system, not by an instruction. disagreement stops the run.
4. **implement.** Rust, from the paper, on the shared core, in a sandbox.
5. **review.** a second agent reviews the code against a rubric.
6. **validate.** build, tests, determinism, and the independent Python checker.
7. **reproduce.** run the paper's own instances under its own stopping rule and compare to its printed numbers.

any stage that hits an unregistered constant, a divergent reading, or a solution the checker can't confirm stops and says why in the submitter's terms. half the stages exist only to doubt the result.

### what it produced

- 7 papers end to end. median cost 53 USD of model time per paper, range 25 to 102. about an hour of session time plus the reproduction runs.
- first paper outside the corpus that went all the way: a 2004 savings-based ant system (submitted by me, not a stranger). reimplementation matches its published values, and under the common protocol lands at 1.10% on Set-X, top of the table. its lead over the top group is smaller than the 2.4% spread measured above, so it's a rank, not a win.
- a 1983 heuristic that wasn't worth ranking still found four bugs in the pipeline itself. one of them let a reimplementation that beat its own paper through without comment.
- 3 of 5 screened papers stopped at intake. all three hand an essential procedure to another paper and never describe it. the pipeline was right to refuse.
- the thing that broke most was not the work but the report of the work: a number shown without being computed, a permission error counted as an algorithm result, a table said to be regenerated when it wasn't. the fix was guards that fail closed, and a rule that a guard doesn't count until it has been made to fire at least once. about half the guards written in a day caught nothing when first tested.

### integrating it into VRP-REP

VRP-REP is the vehicle routing community's public repository (instances, solutions, papers). the lab administers it. the pipeline lives there rather than on a new site, because a verdict only matters where people already look.

that meant taking over a PHP/Symfony app on a framework unsupported since 2016. two serious security holes, one of them let any registered account grant itself admin. the repo no longer built from source (a dependency had vanished from its host). deploy worked by accident on a leftover file. all fixed and in production, plus HTTPS with automatic renewal and uploaded files moved out of the web root.

the tab is live under Contribute → Reimplementation for signed-in users, release 1.7.0. two ways to run it:

- **hosted.** an Anthropic sandbox on the submitter's own API key. artifacts come back over one outbound channel that reads no response.
- **local runner.** a downloadable CLI (v1.94) that runs on the submitter's machine and their own Claude subscription. the PDF never leaves their computer. it gives a reproduction verdict without a cluster for any paper whose stopping rule is a count, not a clock.

code kept private (research IP). happy to talk through the approach.
