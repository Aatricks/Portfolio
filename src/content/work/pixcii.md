---
title: pixcii
description: A command-line tool that turns images into colorized ASCII art. A dense character set for the detail, the original colors kept, output to the terminal or back to an image.
thesis: Each pixel becomes a character that carries its brightness and its color, so the result still looks like the picture.
eyebrow: Tools
blurb: CLI that turns images into colorized ASCII art. A dense character ramp for brightness, original colors kept, plus an ML-assisted sticker mode.
proof: color-preserving ASCII · ML background removal
stackLine: Python / CLI / ASCII rendering / color quantization / ML background removal
themeKey: pixcii
accent: '#b03088'
accentDark: '#ea84cf'
hint: ~/pixcii/src/pixcii/conversion.py
publishDate: 2025-11-03 00:00:00
img: /Portfolio/assets/pixcii-home.webp
img_alt: pixcii before and after, the original illustration on the left, its colorized ASCII version on the right
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
  - It uses a big set of ASCII characters mapped to brightness, so the detail survives instead of turning into blocks.
  - It puts the original colors back on the characters, so it reads as the picture, not just text.
  - A "sticker" mode pulls the subject out against black, with simple color keying or ML background removal.
gallery:
  - src: /Portfolio/assets/pixcii-home.webp
    alt: Side by side, the original illustration on the left, pixcii's colorized ASCII version on the right
    caption: Original on the left, pixcii's version on the right. Brightness mapped to a dense character set, the source colors put back, so it still reads as the image.
    frame: wide
architecture:
  - It samples the image down to a target width and character ratio, then maps brightness onto a dense ASCII set.
  - It carries the color from the source onto each character, with optional retro quantization or a black-and-white mode.
  - Sticker mode cuts out the subject (color keying or ML matting with U2Net / BiRefNet) and sharpens the edges against black.
  - The same renderer goes to a color terminal or a saved image, with gamma, brightness, and contrast knobs and progress bars.
highlights:
  - A dense character set keeps gradients readable where a small set would just band.
  - Keeping the original colors is what makes it look like the photo instead of a typewriter effect.
  - Plenty of knobs, width, character ratio, gamma, brightness, contrast, retro quantization, and black-and-white.
  - Prints straight to the terminal for a quick look, or saves an image to share.
status: archive
---

`pixcii` is a command-line tool that turns images into colorized ASCII art. It tries to keep enough detail and color that the output still looks like the original photo.

## Brightness to characters

It samples each part of the image down to a target width and ratio, then maps brightness onto a **dense** set of ASCII characters. The dense set is what keeps the gradients; a small set just bands the image.

## Keeping the color

Brightness alone gives you a gray stencil, so pixcii puts the source colors back on the characters. After that there's a bunch you can tweak: retro color quantization for a limited palette, a black-and-white mode, and gamma, brightness, and contrast.

## Sticker mode and output

The "sticker" mode cuts the subject out against black and sharpens the edges, either with simple color keying or, for harder images, ML background removal (U2Net and BiRefNet). The same render goes either to the terminal in color for a quick look, or to an image file to share, with progress bars while it works.
