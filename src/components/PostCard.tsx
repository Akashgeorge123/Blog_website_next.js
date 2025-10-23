import Link from "next/link";
import Image from "next/image";

type Post = {
	id: number;
	title: string;
	content: string;
	slug: string;
	status: string;
	createdAt: string | Date | null;
	categories?: Array<{ name: string; slug: string }>;
};

export function PostCard({ post }: { post: Post }) {
	return (
		<Link href={`/posts/${post.slug}`} className="group border rounded-lg overflow-hidden bg-white hover:shadow-sm transition-shadow">
			<div className="relative w-full h-40">
				<Image src={`https://picsum.photos/seed/${post.id}-grid/600/400`} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
			</div>
			<div className="p-3">
				<div className="text-xs text-gray-500">{post.createdAt ? new Date(post.createdAt as any).toLocaleDateString() : ""}</div>
				<h3 className="font-medium mt-1 line-clamp-2">{post.title}</h3>
				<p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
				<div className="mt-2 flex flex-wrap gap-2 text-[10px]">
					{post.categories?.map((cat) => (
						<span key={cat.slug} className="bg-gray-100 text-gray-700 rounded px-2 py-0.5">
							{cat.name}
						</span>
					))}
				</div>
			</div>
		</Link>
	);
}
