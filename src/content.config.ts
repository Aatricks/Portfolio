import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';

export const collections = {
	work: defineCollection({
		loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
			featured: z.boolean().default(false),
			featuredOrder: z.number().optional(),
			repoUrl: z.string().url(),
			demoUrl: z.string().url().optional(),
			status: z.enum(['flagship', 'secondary', 'archive']).default('secondary'),
		}),
	}),
};
