---
title: CChess
description: A chess engine I wrote in plain C. Board state, search, pruning, and evaluation, with almost no abstraction in the way.
thesis: Small, direct engine work in C. Explicit state, deterministic search, and code you can actually follow.
eyebrow: Core systems
blurb: Chess engine in plain C. Minimax with alpha-beta pruning, bitboard state, heuristic evaluation, no frameworks.
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
    value: Small enough to keep in your head
heroPoints:
  - Stays close to the machine, explicit state, not much abstraction.
  - It's about search, pruning, and evaluation, not framework structure.
  - Behavior is deterministic and the control flow is easy to step through.
architecture:
  - Board state and moves stay explicit, so you can follow what the search is doing.
  - Minimax with alpha-beta pruning picks the move.
  - Evaluation scores positions with simple heuristics instead of anything heavy.
  - Deterministic control flow means you can step through it in a debugger.
highlights:
  - Bitboards keep board state compact and make move operations bitwise.
  - Alpha-beta pruning cuts the search tree without changing the move it picks.
  - Plain C, no dependencies, so I own the memory layout and the control flow.
status: secondary
---

`CChess` is a small chess engine in plain C. The idea was to keep the board state, the search, and the evaluation visible in the code, with nothing hiding what the engine is doing.

## How it works

- **Board state** lives in bitboards, so updating a position and generating moves are bitwise operations instead of walking objects.
- **Search** is minimax with alpha-beta pruning. The pruning cuts the tree hard but still picks the same move.
- **Evaluation** scores positions with light heuristics (material, position, mobility), kept simple so it's easy to tune.

## Why plain C

The engine owns its memory and control flow. Bugs are reproducible because the behavior is deterministic, and with no dependencies the performance comes down to the code itself.
