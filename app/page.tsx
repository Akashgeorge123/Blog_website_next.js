"use client";

import Link from "next/link";
import Image from "next/image";
import { trpc } from "@/src/utils/trpcClient";
import { useEffect, useState } from "react";

export default function Home() {
	const { data: recentPosts, isLoading } = trpc.posts.list.useQuery({}, {
		select: (data) => data?.posts?.slice(0, 3)
	});

	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 md:py-32 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
				<div className="mx-auto max-w-6xl px-4 md:px-6 relative">
					<div className="text-center">
						<h1 className={`text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
							Share Your
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient-x"> Stories</span>
						</h1>
						<p className={`text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
							A modern, full-stack blogging platform built for creators, writers, and content makers.
							Publish, manage, and share your ideas with the world.
						</p>
						<div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
							<Link
								href="/posts"
								className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 animate-bounce-subtle"
							>
								Explore Posts
							</Link>
							<Link
								href="/dashboard"
								className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
							>
								Start Writing
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-white">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Built with modern technologies and designed for the best user experience
						</p>
					</div>
					
					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow">
								<svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
							<p className="text-gray-600">Built with Next.js 15 and optimized for speed and performance</p>
						</div>

						<div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
								<svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">Type Safe</h3>
							<p className="text-gray-600">End-to-end type safety with tRPC and TypeScript</p>
						</div>

						<div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
							<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
								<svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">User Friendly</h3>
							<p className="text-gray-600">Intuitive interface designed for writers and readers alike</p>
						</div>
					</div>
				</div>
			</section>

			{/* Recent Posts Preview */}
			<section className="py-20 bg-gray-50">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Stories</h2>
						<p className="text-lg text-gray-600">Discover what our community is writing about</p>
					</div>

					{isLoading ? (
						<div className="grid md:grid-cols-3 gap-8">
							{[1, 2, 3].map((i) => (
								<div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse animate-fade-in-up" style={{ animationDelay: `${i * 0.2}s` }}>
									<div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-shimmer"></div>
									<div className="p-6">
										<div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
										<div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
										<div className="h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
										<div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
									</div>
								</div>
							))}
						</div>
					) : recentPosts && recentPosts.length > 0 ? (
						<div className="grid md:grid-cols-3 gap-8">
							{recentPosts.map((post, index) => (
								<Link
									key={post.id}
									href={`/posts/${post.slug}`}
									className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 animate-fade-in-up"
									style={{ animationDelay: `${index * 0.2}s` }}
								>
									<div className="relative h-48 overflow-hidden">
										<Image
											src={`https://picsum.photos/seed/${post.id}-preview/600/400`}
											alt={post.title}
											fill
											className="object-cover group-hover:scale-110 transition-transform duration-500 animate-zoom-in"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									</div>
									<div className="p-6">
										<div className="text-sm text-gray-500 mb-2 animate-slide-in-left">
											{post.createdAt ? new Date(post.createdAt as any).toLocaleDateString() : ""}
										</div>
										<h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 animate-slide-in-right">
											{post.title}
										</h3>
										<p className="text-gray-600 line-clamp-3 animate-fade-in">
											{post.content}
										</p>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className="text-center py-12 animate-fade-in-up">
							<div className="text-gray-500 mb-4 animate-bounce-gentle">
								<svg className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2 animate-slide-in-left">No posts yet</h3>
							<p className="text-gray-600 mb-6 animate-slide-in-right">Be the first to share your story!</p>
							<Link
								href="/dashboard"
								className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 animate-pulse"
							>
								Start Writing
							</Link>
						</div>
					)}

					{recentPosts && recentPosts.length > 0 && (
						<div className="text-center mt-12">
							<Link
								href="/posts"
								className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg"
							>
								View All Posts
								<svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</Link>
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
				<div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Ready to Start Writing?
					</h2>
					<p className="text-xl text-blue-100 mb-8">
						Join our community of writers and share your stories with the world
					</p>
					<Link 
						href="/dashboard"
						className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
					>
						Get Started Now
						<svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<div className="text-center">
						<p className="text-sm text-gray-400 mb-2">
							Blog Platform
						</p>
						<p className="text-xs text-gray-500 mb-4">
							Built with Next.js 15, TypeScript, tRPC, Drizzle ORM, and Tailwind CSS
						</p>
						<div className="flex justify-center space-x-6">
							<Link href="/posts" className="text-xs text-gray-400 hover:text-white transition-colors">Posts</Link>
							<Link href="/dashboard" className="text-xs text-gray-400 hover:text-white transition-colors">Dashboard</Link>
						</div>
					</div>
				</div>
			</footer>
		</main>
	);
}
