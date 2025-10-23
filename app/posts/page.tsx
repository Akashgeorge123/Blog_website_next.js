"use client";
import Link from "next/link";
import Image from "next/image";
import { trpc } from "@/src/utils/trpcClient";
import { useState } from "react";

export default function PostsPage() {
	const [categorySlug, setCategorySlug] = useState<string | undefined>(undefined);
	const [currentPage, setCurrentPage] = useState(1);
	const { data: result, isLoading } = trpc.posts.list.useQuery({
		categorySlug,
		page: currentPage,
		limit: 6
	});
	const { data: categories } = trpc.categories.list.useQuery();

	const posts = result?.posts ?? [];
	const totalPages = result?.totalPages ?? 1;
	const total = result?.total ?? 0;

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Blog</h1>
							<p className="text-gray-600">Thoughts, stories and ideas.</p>
						</div>
						<Link
							href="/dashboard"
							className="text-sm text-blue-600 hover:text-blue-700 font-medium"
						>
							Dashboard →
						</Link>
					</div>
				</div>
			</div>

			{/* Category Filter */}
			<div className="bg-white border-b border-gray-200">
				<div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
					<div className="flex flex-wrap gap-3">
						<button
							onClick={() => {
								setCategorySlug(undefined);
								setCurrentPage(1);
							}}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
								categorySlug === undefined
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
						>
							All
						</button>
						{categories?.map((cat) => (
							<button
								key={cat.id}
								onClick={() => {
									setCategorySlug(cat.slug);
									setCurrentPage(1);
								}}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
									categorySlug === cat.slug
										? "bg-blue-600 text-white"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
							>
								{cat.name}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
				{isLoading && (
					<div className="flex items-center justify-center py-20">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					</div>
				)}

				{!isLoading && posts && posts.length === 0 && (
					<div className="text-center py-20">
						<p className="text-gray-500 text-lg">No posts found.</p>
					</div>
				)}

				{posts && posts.length > 0 && (
					<div className="space-y-8 md:space-y-12">
						<div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
							{posts.map((post, index) => (
								<article
									key={post.id}
									className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 break-inside-avoid mb-6"
								>
									<Link href={`/posts/${post.slug}`} className="block">
										{/* Image */}
										<div className="relative aspect-[4/3] overflow-hidden">
											<Image
												src={`https://picsum.photos/seed/${post.id}/800/600`}
												alt={post.title}
												fill
												className="object-cover transition-transform duration-700 group-hover:scale-105"
												priority={index < 3}
											/>
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
										</div>

										{/* Content */}
										<div className="p-6">
											<div className="flex items-center gap-3 mb-3">
												<span className="text-xs font-medium text-gray-900">By {post.author}</span>
												<span className="text-gray-300">•</span>
												<time className="text-xs text-gray-500">
													{post.createdAt ? new Date(post.createdAt as any).toLocaleDateString('en-US', {
														year: 'numeric',
														month: 'short',
														day: 'numeric'
													}) : ''}
												</time>
											</div>

											{/* Tags/Categories */}
											<div className="flex flex-wrap gap-2 mb-4">
												{post.categories?.map((cat: any, idx: number) => {
													const colors = [
														'bg-blue-100 text-blue-800',
														'bg-green-100 text-green-800',
														'bg-purple-100 text-purple-800',
														'bg-pink-100 text-pink-800',
														'bg-yellow-100 text-yellow-800',
														'bg-indigo-100 text-indigo-800'
													];
													return (
														<span
															key={cat.id}
															className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[idx % colors.length]}`}
														>
															{cat.name}
														</span>
													);
												})}
											</div>

											<h2 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
												{post.title}
											</h2>

											<p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
												{post.content.replace(/[#*`]/g, '').substring(0, 150)}...
											</p>

											<div className="flex items-center text-xs font-medium text-blue-600 group-hover:text-blue-700">
												Read article
												<svg className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</div>
										</div>
									</Link>
								</article>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-center gap-2 pt-8">
								<button
									onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
									disabled={currentPage === 1}
									className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									Previous
								</button>

								<div className="flex items-center gap-1">
									{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
										<button
											key={page}
											onClick={() => setCurrentPage(page)}
											className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
												currentPage === page
													? "bg-blue-600 text-white"
													: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
											}`}
										>
											{page}
										</button>
									))}
								</div>

								<button
									onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
									disabled={currentPage === totalPages}
									className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									Next
								</button>
							</div>
						)}

						{/* Results info */}
						{total > 0 && (
							<div className="text-center text-sm text-gray-500 pt-4">
								Showing {((currentPage - 1) * 6) + 1}-{Math.min(currentPage * 6, total)} of {total} posts
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
