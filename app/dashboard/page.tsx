"use client";
import { trpc } from "@/src/utils/trpcClient";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
	const utils = trpc.useUtils();
	const { data: cats } = trpc.categories.list.useQuery();
	const { data: posts } = trpc.posts.list.useQuery({}, { select: (data) => data });

	const createPost = trpc.posts.create.useMutation({ onSuccess: () => utils.posts.list.invalidate() });
	const deletePost = trpc.posts.delete.useMutation({
		onMutate: async (v: { id: number }) => {
			await utils.posts.list.cancel();
			const prev = utils.posts.list.getData();
			utils.posts.list.setData(undefined, (old: any) => {
				if (!old) return old;
				return { ...old, posts: old.posts?.filter((p: any) => p.id !== v.id) ?? [] };
			});
			return { prev } as { prev: any };
		},
		onError: (_e: unknown, _v: { id: number }, ctx: { prev: any } | undefined) => ctx?.prev && utils.posts.list.setData(undefined, ctx.prev),
		onSettled: () => utils.posts.list.invalidate(),
	});
	const createCategory = trpc.categories.create.useMutation({ onSuccess: () => utils.categories.list.invalidate() });
	const deleteCategory = trpc.categories.delete.useMutation({ onSuccess: () => utils.categories.list.invalidate() });

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [status, setStatus] = useState<"draft" | "published">("draft");
	const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
	const [newCat, setNewCat] = useState("");

	const canCreate = title.trim().length > 0 && content.trim().length > 0 && !createPost.isPending;

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
							<p className="text-gray-600">Manage your blog posts and categories</p>
						</div>
						<Link
							href="/posts"
							className="text-sm text-blue-600 hover:text-blue-700 font-medium"
						>
							View site →
						</Link>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Create Post */}
					<div className="lg:col-span-2">
						<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>
							<div className="grid gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
									<input
										className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
										placeholder="Enter post title"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
									<textarea
										className="w-full border border-gray-300 rounded-lg px-4 py-3 h-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
										placeholder="Write your post content in Markdown..."
										value={content}
										onChange={(e) => setContent(e.target.value)}
									/>
								</div>
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
										<select
											className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
											value={status}
											onChange={(e) => setStatus(e.target.value as any)}
										>
											<option value="draft">Draft</option>
											<option value="published">Published</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
										<div className="flex flex-wrap gap-2">
											{cats?.map((c: any) => (
												<label key={c.id} className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 cursor-pointer transition-colors">
													<input
														type="checkbox"
														checked={selectedCatIds.includes(c.id)}
														onChange={(e) => setSelectedCatIds((prev) => (e.target.checked ? [...prev, c.id] : prev.filter((id) => id !== c.id)))}
														className="rounded"
													/>
													<span className="text-sm font-medium">{c.name}</span>
												</label>
											))}
										</div>
									</div>
								</div>
								<button
									disabled={!canCreate}
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-6 py-4 font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
									onClick={() => createPost.mutate({ title, content, status, categoryIds: selectedCatIds })}
								>
									{createPost.isPending ? "Creating..." : "Create Post"}
								</button>
							</div>
						</section>
					</div>

					{/* Categories Sidebar */}
					<div>
						<section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
							<h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
							<div className="space-y-3 mb-4">
								<input
									className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
									placeholder="New category name"
									value={newCat}
									onChange={(e) => setNewCat(e.target.value)}
								/>
								<button
									className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									disabled={!newCat.trim() || createCategory.isPending}
									onClick={() => createCategory.mutate({ name: newCat })}
								>
									{createCategory.isPending ? "Adding..." : "Add Category"}
								</button>
							</div>
							<div className="space-y-2">
								{cats?.map((c: any) => (
									<div key={c.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
										<span className="text-sm font-medium text-gray-900">{c.name}</span>
										<button
											className="text-xs text-red-600 hover:text-red-700 font-medium"
											onClick={() => deleteCategory.mutate({ id: c.id })}
										>
											Remove
										</button>
									</div>
								))}
							</div>
						</section>
					</div>
				</div>

				{/* Posts list */}
				<section className="mt-12">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Your Posts</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{posts?.posts?.map((p: any) => (
							<div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
								<div className="flex items-start justify-between mb-4">
									<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
										p.status === 'published'
											? 'bg-green-100 text-green-800'
											: 'bg-yellow-100 text-yellow-800'
									}`}>
										{p.status}
									</span>
								</div>
								<h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{p.title}</h3>
								<p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
									{p.content.replace(/[#*`]/g, '').substring(0, 120)}...
								</p>
								<div className="flex items-center justify-between pt-4 border-t border-gray-100">
									<Link
										href={`/edit/${p.id}`}
										className="text-sm font-medium text-blue-600 hover:text-blue-700"
									>
										Edit
									</Link>
									<button
										className="text-sm font-medium text-red-600 hover:text-red-700"
										onClick={() => deletePost.mutate({ id: p.id })}
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
