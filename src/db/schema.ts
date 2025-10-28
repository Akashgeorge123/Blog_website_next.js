import { pgTable, serial, text, timestamp, boolean, uniqueIndex, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Categories table
export const categories = pgTable(
	"categories",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		description: text("description"),
		slug: text("slug").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		slugIdx: uniqueIndex("category_slug_idx").on(table.slug),
	})
);

// Posts table
export const posts = pgTable(
	"posts",
	{
		id: serial("id").primaryKey(),
		title: text("title").notNull(),
		content: text("content").notNull(),
		slug: text("slug").notNull(),
		author: text("author").notNull(),
		status: text("status").default("draft").notNull(),
		published: boolean("published").default(false).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		slugIdx: uniqueIndex("post_slug_idx").on(table.slug),
	})
);

// Join table for many-to-many between posts and categories
export const postCategories = pgTable(
	"post_categories",
	{
		postId: integer("post_id").notNull(),
		categoryId: integer("category_id").notNull(),
	},
	(table) => ({
		uniquePostCategory: uniqueIndex("unique_post_category").on(table.postId, table.categoryId),
	})
);

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
	posts: many(postCategories),
}));

export const postsRelations = relations(posts, ({ many }) => ({
	categories: many(postCategories),
}));

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
	post: one(posts, {
		fields: [postCategories.postId],
		references: [posts.id],
	}),
	category: one(categories, {
		fields: [postCategories.categoryId],
		references: [categories.id],
	}),
}));

