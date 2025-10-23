"use client";

import { trpc } from "@/src/utils/trpcClient";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { use } from "react";

export default function PostViewPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = use(params);
	const { data: post, isLoading } = trpc.posts.getBySlug.useQuery({ slug });

	if (isLoading) return <div className="mx-auto max-w-3xl p-4">Loading...</div>;
	if (!post) return <div className="mx-auto max-w-3xl p-4">Not found</div>;

	return (
		<div className="mx-auto max-w-3xl p-4">
			<Link href="/posts" className="text-sm underline">Back</Link>
			<h1 className="text-3xl font-semibold mt-2 mb-4">{post.title}</h1>
			<div className="prose">
				<ReactMarkdown>{post.content}</ReactMarkdown>
			</div>
		</div>
	);
}
