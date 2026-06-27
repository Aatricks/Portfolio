# Design Review: Portfolio (full site)

Reviewed against: no DESIGN_BRIEF.md exists — reviewed against the site's own evident direction ("editorial-terminal": display serif + mono labels, numbered sections, paper/ink palette) plus context from the GitHub profile, profile README, and `public/CV-English.pdf`.
Date: 2026-06-09

## Screenshots Captured

| Screenshot                                            | Breakpoint          | Description                                  |
| ----------------------------------------------------- | ------------------- | -------------------------------------------- |
| `screenshots/review-home-desktop-1280.png`             | Desktop (1280, full) | Full homepage, light mode                    |
| `screenshots/review-work-flagship-desktop.png`         | Desktop viewport     | §01 heading + llmedge flagship card          |
| `screenshots/review-work-secondary-desktop.png`        | Desktop viewport     | LightDiffusion-Next + EasyReader cards       |
| `screenshots/review-about-desktop.png`                 | Desktop viewport     | §02 about: heading, pull quote, facts, notes |
| `screenshots/review-stack-desktop.png`                 | Desktop viewport     | §03 stack inventory, 3 columns               |
| `screenshots/review-footer-desktop.png`                | Desktop viewport     | §05 index (single row) + footer contact      |
| `screenshots/review-hero-dark-desktop.png`             | Desktop viewport     | Hero, dark mode                              |
| `screenshots/review-home-mobile-375.png`               | Mobile (375, full)   | Full homepage mobile                         |
| `screenshots/review-home-tablet-768.png`               | Tablet (768, full)   | Full homepage tablet                         |
| `screenshots/review-case-llmedge-full.png`             | Desktop (1280, full) | Full llmedge case study                      |
| `screenshots/review-case-llmedge-hero.png`             | Desktop viewport     | Case study hero — title clipping visible     |

> All screenshots in `.design/portfolio-critique/screenshots/`.

## Summary

The visual system is genuinely strong — coherent editorial-terminal aesthetic, disciplined tokens, excellent motion hygiene (reduced-motion handled everywhere). The two things holding it back are not visual: **the words repeat one sentence four times and never show evidence**, and **the project previews carry zero information beyond a title and a washed-out screenshot**. Plus one real layout bug: the case-study title is clipped off the left edge of the screen at 1280px.

## Must Fix

1. **Case study title clipped off-screen**: `.project-page__title` has `margin-left: -56px` (optical bleed) in `src/components/work/CaseStudyLayout.astro`, but the wrapper padding at 1280px is only ~38px, so "llmedge" renders as "lmedge" with the first letter cut off (measured `left: -17.6px`). See `screenshots/review-case-llmedge-hero.png`. _Fix: cap the bleed to the available padding, e.g. `margin-left: max(-56px, calc(-1 * (50vw - 50% - 1px)))`, or only apply the negative margin above 90em._

2. **No `:focus-visible` styles on primary link patterns**: `.topbar__link` (TopBar.astro), `.pp__link` (PortfolioPreview.astro), `.project-index__link` (index.astro), `.notfound__row` (404.astro) have hover states but no visible keyboard focus. WCAG failure; keyboard users navigate blind. _Fix: a shared `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }` in global.css._

3. **Section numbering is out of order on the page**: reading top to bottom the markers go `§01 work → §02 about → §03 stack → §05 index → §04 contact` (contact lives in the footer, index was renumbered around it). See `screenshots/review-footer-desktop.png`. The numbered-section conceit is the site's signature — a visible numbering error undermines exactly the "precision" the aesthetic is selling. _Fix: renumber so the page reads 01–05 in document order (index = 04, contact = 05; update TopBar nav marks to match)._

## Should Fix

1. **The same sentence appears four times in one scroll**: "native runtimes / sensor fusion / edge inference / embedded control / constrained hardware" is the hero lede (`index.astro:149`), the about heading (`index.astro:200`), the about pull quote (`index.astro:207`), and the about `focus` fact row (`index.astro:22`) — plus the meta description. See `review-about-desktop.png`: the h2 and the pull quote are two consecutive big italic serif blocks saying the same thing. _Fix: each touchpoint should add information, not restate the claim. Hero = the claim. About heading = the person (school, year, what's next). Pull quote = replace with something only you can say — e.g. the submarine/Kalman origin story, or a concrete "shipped X to Y devices" line. Delete the `focus` fact row (it's the lede again)._

2. **Project previews carry no evidence**: each card is eyebrow + title + image + stack line — no description, no outcome (PortfolioPreview.astro). The section claims "Systems I built and *shipped*" but nothing shows shipping: llmedge's 47★, LightDiffusion-Next's 51★ and the measured ~30% inference reduction, EasyReader's 17★ — all invisible until you open the case study. The data is even already fetched (build-time repo stats in index.astro). _Fix: add one plain-language line ("Android-native runtime for local LLM/diffusion/speech inference") and one proof point (★ count, "30% faster than baseline", "Ready Tensor Expo 2024") per card._

3. **Flagship media reads as an empty box**: the llmedge card image is a screenshot of a white docs page; at card size it's an illegible pale rectangle, and at tablet width the work section looks like three empty placeholders (`review-home-tablet-768.png`, `review-work-flagship-desktop.png`). For an Android runtime, a docs homepage is the weakest possible visual. _Fix: phone-frame capture of the example app running inference, a short looping demo, or a clean architecture diagram in the site's ink/accent palette. Same issue, milder, for LightDiffusion-Next._

4. **Self-scored n/10 skill bars**: "ranked by hours in hand" then C/C++ 9, Kotlin 9, Python 9, Linux 9 (StackInventory.astro) — the scores don't discriminate (four 9s = no ranking), and a student self-rating 9/10 in C++ invites skeptical interviewers to calibrate against it. The notes column ("native runtimes, JNI bridges, Kalman") is the credible part. _Fix: drop the numbers; keep bars as relative weight or replace with years + the projects that prove each skill ("C/C++ — since 2022 · llmedge, CChess, submarine"). Evidence ranks; scores assert._

5. **Case study prose talks about the portfolio instead of the work**: recurring meta-commentary in `src/content/work/*.md` — "the project page should emphasize the tooling…" (a literal gallery caption in lightdiffusion-next.md), "I do not want this project to read like…", "That breadth matters because it shows my work here is about…", "is the strongest proof in the portfolio that I can…". This is stage direction addressed to the reader, and it reads as insecurity. _Fix: cut every sentence whose subject is "this project's impression". State problem → decision → result, and quantify where possible (tokens/s on a named device, model sizes, cold-start cost saved by runtime reuse, devices tested). The llmedge "What the project is solving" bullet list is the right register — more of that._

6. **"More work" section is one row under a giant heading**: §05 renders a full section header + one CChess row + dead space (`review-footer-desktop.png`). Meanwhile the GitHub profile has real candidates: Android-battery-optimizer (64★ — your most-starred repo, absent from the site entirely), Atoll (Swift, macOS Dynamic Island), llmedge-examples, NixOS-EasyConfig. _Fix: either populate the index with 4–6 rows (title + stack + ★, linking to GitHub for ones without case studies) or fold CChess into the featured grid and delete the section._

7. **Tiny mono text at the readability floor**: heavy use of 0.7rem (11.2px) and 0.62rem (9.9px) labels, in light-mode `--mute` (~6:1 contrast — passes AA but at sizes where it's tight). Worst: `.gallery__id` at 9.9px. _Fix: raise the label floor to 0.72–0.75rem, and use `--ink-soft` instead of `--mute` for any label that carries information (section markers, stack lines)._

8. **CV ↔ site inconsistencies** (recruiters cross-check): CV email is `emilio.melis@etu.univ-tours.fr`, site footer is `melis.emilio1@gmail.com`; CV says "Light Diffusion", site says "LightDiffusion-Next"; CV phone is "+33 07 83…" (should be "+33 7 83…"); CV headline "Engineering student in training" is redundant — "Engineering student" already says it. GitHub profile has no display name set (shows only the handle) and the bio says "Polytechnique University of Tours", which isn't the school's name — "Polytech Tours (University of Tours)" matches the CV and site. _Fix: pick one email, one project name, set the GitHub display name._

## Could Improve

1. **Extract the `.label` atom**: the mono/uppercase/letter-spaced/muted label pattern is hand-rolled 12+ times across components (audit found it in `.section-marker`, `.stack-group__label`, `.topbar__mobile-mark`, footer `dt`s, etc.). One utility class in global.css would delete ~80 lines.

2. **Standardize hover timing**: link transitions are variously 220ms, 280ms, 320ms across Footer, TopBar, PortfolioPreview, project index. Define `--t-link: 240ms` and use it everywhere — uniform motion is part of what makes minimal sites feel engineered.

3. **Dead code**: `.hero__strip`, `.hero__spec*`, `.hero__eyebrow` (~40 lines in index.astro:433–473) have no matching markup; `src/components/Hero.astro` is unused. Delete. Also ~30 stray screenshot PNGs (`after-*.png`, `baseline-*.png`, `stack-*.png`, `bh-*.png`) sit untracked in the repo root — gitignore or remove.

4. **Wire up the title view-transition pair**: the case-study title has a view-transition name but the homepage preview title doesn't share it, so the morph never fires. Connecting them would be the single highest-value "smarter animation" — title flows from card to case study on click. (Beyond that: don't add animation. The reveal/stagger/parallax system is already at the right dose; restraint is the elegant move.)

5. **Project accent colors live in CSS selectors**: PortfolioPreview hardcodes `--pp-accent` per slug (`#2b6cb0`, `#b8421a`, …) while CaseStudyLayout already takes accent from frontmatter. Move the preview accents to the same frontmatter fields so a new project needs zero CSS edits.

6. **Consolidate breakpoints**: 40 / 48 / 52 / 64 / 68 / 80em used ad hoc across components. Pick three (≈48 / 64 / 80) and align.

7. **Stack section weight on mobile**: 21 scored rows + 5 languages makes §03 the longest section of the homepage on a phone (`review-home-mobile-375.png`) — inverted priority vs. the work section. Trimming to the top ~4 per group (the case studies already prove the rest) would shorten the scroll and sharpen the signal.

## What Works Well

- **The aesthetic is distinctive and consistent**: display serif + mono pairing, paper/ink palette, numbered sections, dashed rules — it does not look like a template, and dark mode is a real palette, not an inversion (`review-hero-dark-desktop.png` is the best frame on the site).
- **Motion hygiene is genuinely excellent**: reveal/stagger system is semantic (`data-reveal`), GPU-friendly (transform/opacity only), and `prefers-reduced-motion` is respected in every single component — rarer than it should be.
- **Token discipline**: full color/type/motion token system with dark-mode overrides; theme persists via pre-paint inline script with no flash.
- **The live GitHub activity strip** with build-time baseline + client refresh and graceful fallback is a quietly impressive touch that fits the "honest about the hardware" voice.
- **Case study information architecture** (ribbon → thesis → numbered hero points → metrics → architecture → notes) is a strong skeleton — it just needs the prose inside it to show rather than tell.
- **A11y fundamentals**: skip link, correct heading order, aria-expanded/pressed on toggles, Escape-to-close with focus return on mobile nav.

---

## Applied (2026-06-10)

All must-fix, should-fix, and could-improve items were applied in the working tree, plus visual-language additions (terminal-chrome media frames, llmedge architecture diagram SVG, paper grain overlay, hero registration marks). Verified: `astro check` 0 errors, production build, `npm run smoke:site` pass, manual screenshots at 1280/375 light+dark (see `after-*.png` in screenshots/).

Not applicable from code: GitHub display name + bio wording (set on github.com), CV PDF fixes (binary asset — regenerate from source), email unification (gmail vs univ address — owner's call; site currently uses gmail everywhere).
