---
title: pixcii
description: A CLI that converts images into high-quality, colorized ASCII art — a dense character ramp for brightness, original colors preserved, with an ML-assisted sticker mode and terminal or image output.
thesis: Map every pixel to a character that carries both its brightness and its color — a dense ASCII ramp for detail, original colors kept, rendered to the terminal or back to an image.
eyebrow: Tools
blurb: CLI that turns images into colorized ASCII art — a dense character ramp for brightness, original colors preserved, with an ML-assisted sticker mode.
proof: color-preserving ASCII · ML background removal
stackLine: Python / CLI / ASCII rendering / color quantization / ML background removal
themeKey: pixcii
accent: '#b03088'
accentDark: '#ea84cf'
hint: ~/pixcii/src/pixcii/conversion.py
publishDate: 2025-11-03 00:00:00
img: /Portfolio/assets/pixcii-home.webp
img_alt: pixcii before and after — the original illustration on the left, its colorized ASCII rendering on the right
repoUrl: https://github.com/Aatricks/pixcii
metrics:
  - label: Language
    value: Python 3.11+
  - label: Output
    value: color terminal or image file
  - label: Detail
    value: dense ASCII brightness ramp
  - label: Sticker mode
    value: edge enhance · ML matting (U2Net / BiRefNet)
heroPoints:
  - A dense set of ASCII characters maps image brightness to glyphs, so fine detail survives the conversion instead of collapsing into blocks.
  - Original colors and gradients are reapplied to the characters, so the output reads as the source image rather than a monochrome stencil.
  - A minimalistic "sticker" mode isolates the subject against black with edge enhancement, using either simple color keying or ML background removal.
gallery:
  - src: /Portfolio/assets/pixcii-home.webp
    alt: Side by side — the original illustration on the left, pixcii's colorized ASCII rendering on the right
    caption: Original on the left, pixcii's output on the right — brightness mapped onto a dense character ramp with the source colors reapplied, so the rendering still reads as the image.
    frame: wide
architecture:
  - Pixels are sampled to a target width and character ratio, then mapped onto a dense ASCII ramp by brightness to preserve detail.
  - Per-character color is carried over from the source, with optional retro quantization or a black-and-white mode.
  - Sticker mode segments the subject — simple color-based keying or ML matting (U2Net / BiRefNet variants) — and enhances edges against a black field.
  - The same renderer targets either a color terminal or a saved image file, with gamma, brightness, and contrast controls and progress bars.
highlights:
  - Detail-first — a dense character set keeps gradients legible where a sparse ramp would posterize them.
  - Color preservation makes the result read as the original image rather than a typewriter effect.
  - Tunable end to end — width, character ratio, gamma, brightness, contrast, retro quantization, black-and-white.
  - Outputs both ways — straight to the terminal for a quick look, or to an image file for sharing.
status: secondary
---

`pixcii` is a command-line tool that converts images into colorized ASCII art. The goal is fidelity: keep enough detail and color that the result reads as the original picture, not as a generic typewriter effect.

## Brightness becomes character

Each region of the image is sampled down to a target width and character ratio, then mapped onto a **dense** set of ASCII characters by brightness. Using a wide ramp instead of a handful of glyphs is what preserves gradients — a sparse ramp posterizes; a dense one keeps the tonal detail intact.

## Color, kept

Brightness alone would give a monochrome stencil, so pixcii reapplies the source colors and gradients to the characters themselves. From there the look is tunable: retro color quantization for a constrained palette, a black-and-white mode, and gamma, brightness, and contrast controls to push the result.

## Sticker mode and output

A minimalistic "sticker" mode isolates the subject against a black background with edge enhancement — either simple color-based keying or, for complex images, ML background removal (U2Net and BiRefNet variants). The same render targets either the terminal, in color, for a quick look, or a saved image file for sharing, with progress bars over the work.
