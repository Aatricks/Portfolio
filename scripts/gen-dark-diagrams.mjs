// Generate dark-mode variants of the architecture diagrams.
//
// The source SVGs are authored with the light palette (see src/styles/global.css).
// Diagrams render as <img> (PortfolioPreview card, ProjectGallery figure), so an
// internal `prefers-color-scheme` media query can't follow the site's manual theme
// toggle. Instead we emit a `<name>-dark.svg` next to each source and let CSS swap
// the visible <img> based on [data-theme='dark'] on <html>.
//
// Run: node scripts/gen-dark-diagrams.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const assets = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets');

// Light hex -> dark hex. Keys mirror the CSS custom properties in global.css.
const palette = {
	'#f3efe6': '#0d0c0a', // --paper        (diagram canvas)
	'#ece7da': '#1c1915', // --paper-soft -> --paper-deep dark (filled panels, lifted for contrast)
	'#161310': '#ede6d7', // --ink          (text, box strokes)
	'#6b6157': '#8a8170', // --mute         (secondary text, connector arrows)
	'#9a9082': '#5e564a', // faint mute   -> --mute-soft dark (tertiary captions)
	'#cfc6b3': '#2a261f', // --rule         (divider lines)
};

// Per-diagram accent: light accent -> accentDark (from each project's frontmatter).
const diagrams = [
	{ file: 'llmedge-arch.svg', accent: { '#2b6cb0': '#79a7ff' } },
	{ file: 'pilotrs-arch.svg', accent: { '#0e7c86': '#54cfdd' } },
	{ file: 'framelimiter-arch.svg', accent: { '#9d6b0f': '#e3a73a' } },
	{ file: 'neural-cvrp-arch.svg', accent: { '#5a3fc0': '#a98bf0' } },
];

const replaceAll = (svg, map) =>
	Object.entries(map).reduce(
		(out, [from, to]) => out.replaceAll(from, to).replaceAll(from.toUpperCase(), to),
		svg,
	);

for (const { file, accent } of diagrams) {
	const src = join(assets, file);
	const out = join(assets, file.replace(/\.svg$/, '-dark.svg'));
	const dark = replaceAll(replaceAll(readFileSync(src, 'utf8'), palette), accent);
	writeFileSync(out, dark);
	console.log(`wrote ${out}`);
}
