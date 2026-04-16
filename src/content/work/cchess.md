---
title: CChess
description: A pure C chess engine focused on board state, search, pruning, and evaluation with minimal abstraction.
thesis: Small, direct engine work built around explicit state, deterministic search, and performance-aware implementation.
eyebrow: Core systems
stackLine: C / engine logic / minimax / alpha-beta pruning / board evaluation
themeKey: cchess
publishDate: 2026-04-11 00:00:00
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
  - label: Portfolio role
    value: Low-level systems signal outside AI
heroPoints:
  - Keeps the code close to the machine, with explicit state handling and minimal abstraction overhead.
  - Centers the engine around search, pruning, and evaluation rather than framework structure.
  - Stays focused on deterministic behavior and debuggable control flow.
gallery:
  - src: /Portfolio/assets/CChess.webp
    alt: CChess cover art showing a robotic hand and chess piece
    caption: The visual is simple, but the project itself is about implementing search and evaluation logic directly in plain C.
architecture:
  - Board state and move logic stay explicit so search behavior remains understandable and debuggable.
  - Minimax and alpha-beta pruning form the decision core for move selection.
  - Evaluation logic scores positions through heuristic reasoning rather than heavyweight abstraction.
  - I kept the project focused on deterministic control flow and performance-aware implementation.
highlights:
  - Keeps the implementation small enough to reason about directly.
  - Emphasizes memory, algorithms, and debugging discipline in a plain C codebase.
  - Shows the same systems mindset as the AI projects without relying on model tooling.
status: secondary
---

`CChess` is a compact chess engine I wrote in plain C. The point of the project is not breadth. It is to keep the implementation direct enough that board state, search behavior, and evaluation logic all stay visible in the code.

## Core focus

The engine is built around the classic problems that make chess programs interesting:

- board state management
- move generation
- search
- pruning
- evaluation

That combination keeps the project grounded in explicit state and algorithmic decision-making. There is very little abstraction hiding what the engine is doing.

## Implementation approach

I kept the code close to the problem:

- board and move logic stay explicit so search behavior remains inspectable
- minimax and alpha-beta pruning drive move selection
- evaluation remains heuristic and lightweight instead of buried behind unnecessary structure
- deterministic control flow makes the engine easier to debug and reason about

That is what I wanted from the project: a small codebase where the important parts stay understandable.

## Result

`CChess` is a straightforward systems project centered on logic, search, and implementation discipline. It is smaller than the AI work, but it shows the same preference for explicit control over opaque abstraction.
