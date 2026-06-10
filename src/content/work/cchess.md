---
title: CChess
description: A pure C chess engine focused on board state, search, pruning, and evaluation with minimal abstraction.
thesis: Small, direct engine work built around explicit state, deterministic search, and performance-aware implementation.
eyebrow: Core systems
blurb: Chess engine in pure C — minimax with alpha-beta pruning, bitboard state, heuristic evaluation, no frameworks.
proof: search, pruning, and evaluation from scratch
stackLine: C / engine logic / minimax / alpha-beta pruning / board evaluation
themeKey: cchess
accent: '#6b2b8a'
accentDark: '#b288d4'
hint: ~/CChess/board.c
galleryColumns: single
publishDate: 2024-11-07 00:00:00
img: /Portfolio/assets/CChess.webp
img_alt: CChess project artwork with robotic hand moving a chess piece
featured: false
repoUrl: https://github.com/Aatricks/CChess
metrics:
  - label: Language
    value: Pure C
  - label: Domain
    value: Chess engine
  - label: Core techniques
    value: Minimax, alpha-beta pruning, and evaluation heuristics
  - label: Footprint
    value: Small enough to reason about directly
heroPoints:
  - Keeps the code close to the machine, with explicit state handling and minimal abstraction overhead.
  - Centers the engine around search, pruning, and evaluation rather than framework structure.
  - Stays focused on deterministic behavior and debuggable control flow.
architecture:
  - Board state and move logic stay explicit so search behavior remains understandable and debuggable.
  - Minimax and alpha-beta pruning form the decision core for move selection.
  - Evaluation logic scores positions through heuristic reasoning rather than heavyweight abstraction.
  - Deterministic control flow keeps the engine inspectable under a debugger.
highlights:
  - Bitboard structures keep board state compact and move operations bitwise.
  - Alpha-beta pruning cuts the minimax tree without changing the chosen move.
  - Plain C, no dependencies — memory layout and control flow are fully owned.
status: secondary
---

`CChess` is a compact chess engine in plain C. The design constraint: keep board state, search behavior, and evaluation logic visible in the code — no abstraction hiding what the engine is doing.

## Core mechanics

- **Board state** lives in bitboard structures, so position updates and move generation are bitwise operations rather than object traversal.
- **Search** is minimax with alpha-beta pruning; pruning cuts the tree aggressively while preserving the selected move.
- **Evaluation** scores positions through lightweight heuristics — material, position, mobility — kept deliberately simple to stay tunable.

## Why plain C

The engine owns its memory layout and control flow entirely. Deterministic behavior makes search bugs reproducible under a debugger, and the absence of dependencies means the performance profile is the code, nothing else.

The same instinct — explicit state over opaque abstraction — drove the IMU sensor fusion and Kalman filter work on the autonomous submarine prototype: control loops you can trace by hand when they misbehave.
