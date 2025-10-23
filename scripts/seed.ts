import "dotenv/config";
import { db } from "../src/db/index";
import { categories, posts, postCategories } from "../src/db/schema";

type PostData = {
	title: string;
	slug: string;
	content: string;
	author: string;
	status: "draft" | "published";
	published: boolean;
};

async function main() {

	// Categories
	const catData = [
		{ name: "Design", slug: "design", createdAt: new Date(), updatedAt: new Date() },
		{ name: "Research", slug: "research", createdAt: new Date(), updatedAt: new Date() },
		{ name: "Software", slug: "software", createdAt: new Date(), updatedAt: new Date() },
		{ name: "Frameworks", slug: "frameworks", createdAt: new Date(), updatedAt: new Date() },
		{ name: "Management", slug: "management", createdAt: new Date(), updatedAt: new Date() },
		{ name: "Product", slug: "product", createdAt: new Date(), updatedAt: new Date() },
	];
	for (const c of catData) {
		await db.insert(categories).values(c).onConflictDoNothing();
	}
	const allCats = await db.select().from(categories);

	// Helper to find cat by slug
	const catId = (slug: string) => allCats.find((c) => c.slug === slug)?.id!;

	// Posts
	const authors = ["John Doe", "Sarah Chen", "Mike Johnson", "Emma Wilson", "Alex Rodriguez"];
	const postData: PostData[] = [
		{
			title: "The Future of AI in Web Development",
			slug: "future-ai-web-development",
			content: "Explore how artificial intelligence is revolutionizing the way we build and maintain websites, from automated code generation to intelligent design systems.",
			author: authors[0],
			status: "published",
			published: true,
		},
		{
			title: "Mastering React Server Components",
			slug: "mastering-react-server-components",
			content: "Dive deep into React Server Components and learn how they can improve your application's performance and developer experience.",
			author: authors[1],
			status: "published",
			published: true,
		},
		{
			title: "Building Scalable APIs with GraphQL",
			slug: "building-scalable-apis-graphql",
			content: "Learn the fundamentals of GraphQL and how to build efficient, scalable APIs that can handle complex data requirements.",
			author: authors[2],
			status: "published",
			published: true,
		},
		{
			title: "The Rise of Edge Computing",
			slug: "rise-edge-computing",
			content: "Understand edge computing and its impact on modern web applications, including benefits for performance and user experience.",
			author: authors[3],
			status: "published",
			published: true,
		},
		{
			title: "CSS Grid vs Flexbox: When to Use What",
			slug: "css-grid-vs-flexbox",
			content: "A comprehensive guide to choosing between CSS Grid and Flexbox for your layout needs, with practical examples and best practices.",
			author: authors[4],
			status: "published",
			published: true,
		},
		{
			title: "Securing Your Web Applications",
			slug: "securing-web-applications",
			content: "Essential security practices for web developers, including authentication, authorization, and protecting against common vulnerabilities.",
			author: authors[0],
			status: "published",
			published: true,
		},
		{
			title: "The Evolution of JavaScript Frameworks",
			slug: "evolution-javascript-frameworks",
			content: "From jQuery to modern frameworks like React, Vue, and Svelte - explore the journey and future of JavaScript development.",
			author: authors[1],
			status: "published",
			published: true,
		},
		{
			title: "Optimizing Web Performance",
			slug: "optimizing-web-performance",
			content: "Techniques and tools for improving your website's loading speed, runtime performance, and overall user experience.",
			author: authors[2],
			status: "published",
			published: true,
		},
	];

	for (const p of postData) {
		const postWithTimestamps = {
			...p,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		const [inserted] = await db
			.insert(posts)
			.values(postWithTimestamps)
			.onConflictDoNothing()
			.returning();
		if (inserted) {
			// Link 1-3 categories per post
			const tags = ["design", "research", "software", "frameworks", "management", "product"];
			const chosen = tags.sort(() => 0.5 - Math.random()).slice(0, 3);
			for (const slug of chosen) {
				const id = catId(slug);
				if (id) await db.insert(postCategories).values({ postId: inserted.id, categoryId: id }).onConflictDoNothing();
			}
		}
	}

	console.log("Seed complete: posts=", postData.length, "categories=", catData.length);
	process.exit(0);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
