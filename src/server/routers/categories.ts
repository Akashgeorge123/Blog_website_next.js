import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db, categories } from "@/src/db";
import { desc, eq } from "drizzle-orm";

function slugify(input: string) {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

export const categoriesRouter = router({
	list: publicProcedure.query(async () => {
		return await db.select().from(categories).orderBy(desc(categories.createdAt));
	}),
	create: publicProcedure
		.input(z.object({ name: z.string().min(1), description: z.string().optional() }))
		.mutation(async ({ input }) => {
			const [inserted] = await db
				.insert(categories)
				.values({ name: input.name, description: input.description, slug: slugify(input.name), createdAt: new Date(), updatedAt: new Date() })
				.returning();
			return inserted;
		}),
	update: publicProcedure
		.input(z.object({ id: z.number(), name: z.string().min(1), description: z.string().optional() }))
		.mutation(async ({ input }) => {
			const [updated] = await db
				.update(categories)
				.set({ name: input.name, description: input.description, slug: slugify(input.name), updatedAt: new Date() })
				.where(eq(categories.id, input.id))
				.returning();
			return updated;
		}),
	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const [deleted] = await db.delete(categories).where(eq(categories.id, input.id)).returning();
			return deleted ?? null;
		}),
});

