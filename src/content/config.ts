import { defineCollection, z } from 'astro:content';

export const collections = {
	work: defineCollection({
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
