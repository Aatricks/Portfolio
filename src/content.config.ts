import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';

export const collections = {
	work: defineCollection({
		loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			thesis: z.string(),
			eyebrow: z.string(),
			blurb: z.string().optional(),
			proof: z.string().optional(),
			stackLine: z.string(),
			themeKey: z.enum([
				'llmedge',
				'lightdiffusion-next',
				'easyreader',
				'cchess',
				'pilotrs',
				'framelimiter',
				'pixcii',
			]),
			accent: z.string().default('#b8421a'),
			accentDark: z.string().default('#e07a4a'),
			hint: z.string().optional(),
			galleryColumns: z.enum(['single', 'double']).default('single'),
			publishDate: z.coerce.date(),
			img: z.string(),
			img_alt: z.string().optional(),
			featured: z.boolean().default(false),
			featuredOrder: z.number().optional(),
			repoUrl: z.string().url(),
			docsUrl: z.string().url().optional(),
			demoUrl: z.string().url().optional(),
			metrics: z
				.array(
					z.object({
						label: z.string(),
						value: z.string(),
					}),
				)
				.default([]),
			heroPoints: z.array(z.string()).default([]),
			gallery: z
				.array(
					z.object({
						src: z.string(),
						alt: z.string(),
						caption: z.string().optional(),
						frame: z.enum(['wide', 'phone']).default('wide'),
					}),
				)
				.default([]),
			architecture: z.array(z.string()),
			highlights: z.array(z.string()),
			status: z.enum(['flagship', 'secondary', 'archive']).default('secondary'),
		}),
	}),
};
