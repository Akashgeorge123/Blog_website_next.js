import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { and, desc, eq } from "drizzle-orm";
import { db, posts, categories, postCategories } from "@/src/db";

function slugify(input: string) {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

export const postsRouter = router({
	list: publicProcedure
		.input(z.object({
			categorySlug: z.string().optional(),
			page: z.number().min(1).default(1),
			limit: z.number().min(1).max(50).default(6)
		}).optional())
		.query(async ({ input }) => {
			const page = input?.page ?? 1;
			const limit = input?.limit ?? 6;
			const offset = (page - 1) * limit;

			if (input?.categorySlug) {
				const cat = await db.select().from(categories).where(eq(categories.slug, input.categorySlug)).limit(1);
				if (cat.length === 0) return { posts: [], total: 0, totalPages: 0, currentPage: page };
				const rows = await db
					.select({
						id: posts.id,
						title: posts.title,
						content: posts.content,
						slug: posts.slug,
						author: posts.author,
						status: posts.status,
						published: posts.published,
						createdAt: posts.createdAt,
						updatedAt: posts.updatedAt,
						categories: categories
					})
					.from(posts)
					.leftJoin(postCategories, eq(posts.id, postCategories.postId))
					.leftJoin(categories, eq(postCategories.categoryId, categories.id))
					.where(and(eq(postCategories.categoryId, cat[0]!.id), eq(posts.published, true)))
					.orderBy(desc(posts.createdAt))
					.limit(limit)
					.offset(offset);

				// Group categories by post
				const postMap = new Map();
				rows.forEach(row => {
					if (!postMap.has(row.id)) {
						postMap.set(row.id, {
							id: row.id,
							title: row.title,
							content: row.content,
							slug: row.slug,
							author: row.author,
							status: row.status,
							published: row.published,
							createdAt: row.createdAt,
							updatedAt: row.updatedAt,
							categories: []
						});
					}
					if (row.categories) {
						postMap.get(row.id).categories.push(row.categories);
					}
				});

				const filteredPosts = Array.from(postMap.values());

				// Get total count for pagination
				const totalRows = await db
					.select()
					.from(posts)
					.leftJoin(postCategories, eq(posts.id, postCategories.postId))
					.where(and(eq(postCategories.categoryId, cat[0]!.id), eq(posts.published, true)));

				const total = totalRows.length;
				const totalPages = Math.ceil(total / limit);

				return {
					posts: filteredPosts,
					total,
					totalPages,
					currentPage: page
				};
			}

			const rows = await db
				.select({
					id: posts.id,
					title: posts.title,
					content: posts.content,
					slug: posts.slug,
					author: posts.author,
					status: posts.status,
					published: posts.published,
					createdAt: posts.createdAt,
					updatedAt: posts.updatedAt,
					categories: categories
				})
				.from(posts)
				.leftJoin(postCategories, eq(posts.id, postCategories.postId))
				.leftJoin(categories, eq(postCategories.categoryId, categories.id))
				.where(eq(posts.published, true))
				.orderBy(desc(posts.createdAt))
				.limit(limit)
				.offset(offset);

			// Group categories by post
			const postMap = new Map();
			rows.forEach(row => {
				if (!postMap.has(row.id)) {
					postMap.set(row.id, {
						id: row.id,
						title: row.title,
						content: row.content,
						slug: row.slug,
						author: row.author,
						status: row.status,
						published: row.published,
						createdAt: row.createdAt,
						updatedAt: row.updatedAt,
						categories: []
					});
				}
				if (row.categories) {
					postMap.get(row.id).categories.push(row.categories);
				}
			});

			const allPosts = Array.from(postMap.values());
			const totalRows = await db.select().from(posts).where(eq(posts.published, true));
			const total = totalRows.length;
			const totalPages = Math.ceil(total / limit);

			return {
				posts: allPosts,
				total,
				totalPages,
				currentPage: page
			};
		}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			const rows = await db.select().from(posts).where(eq(posts.slug, input.slug)).limit(1);
			return rows[0] ?? null;
		}),

	create: publicProcedure
		.input(
			z.object({
				title: z.string().min(1),
				content: z.string().min(1),
				status: z.enum(["draft", "published"]).default("draft"),
				categoryIds: z.array(z.number()).optional(),
			})
		)
		.mutation(async ({ input }) => {
			const newSlug = slugify(input.title);
			const authors = ["John Doe", "Sarah Chen", "Mike Johnson", "Emma Wilson", "Alex Rodriguez"];
			const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
			const [inserted] = await db
				.insert(posts)
				.values({ title: input.title, content: input.content, slug: newSlug, author: randomAuthor, status: input.status, published: input.status === "published", createdAt: new Date(), updatedAt: new Date() })
				.returning();
			if (input.categoryIds?.length) {
				await db.insert(postCategories).values(
					input.categoryIds.map((cid) => ({ postId: inserted.id, categoryId: cid }))
				);
			}
			return inserted;
		}),

	update: publicProcedure
		.input(
			z.object({
				id: z.number(),
				title: z.string().min(1),
				content: z.string().min(1),
				status: z.enum(["draft", "published"]).default("draft"),
				categoryIds: z.array(z.number()).optional(),
			})
		)
		.mutation(async ({ input }) => {
			const newSlug = slugify(input.title);
			const [updated] = await db
				.update(posts)
				.set({ title: input.title, content: input.content, slug: newSlug, status: input.status, published: input.status === "published", updatedAt: new Date() })
				.where(eq(posts.id, input.id))
				.returning();
			if (input.categoryIds) {
				await db.delete(postCategories).where(eq(postCategories.postId, input.id));
				if (input.categoryIds.length) {
					await db.insert(postCategories).values(
						input.categoryIds.map((cid) => ({ postId: input.id, categoryId: cid }))
					);
				}
			}
			return updated;
		}),

	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			await db.delete(postCategories).where(eq(postCategories.postId, input.id));
			const [deleted] = await db.delete(posts).where(eq(posts.id, input.id)).returning();
			return deleted ?? null;
		}),
});

