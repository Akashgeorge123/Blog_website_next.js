"use client";
import { trpc } from "@/src/utils/trpc";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPostPage() {
	const params = useParams<{ id: string }>();
	const id = Number(params.id);
	const router = useRouter();
	const utils = trpc.useUtils();
	const { data: posts } = trpc.posts.list.useQuery({}, { select: (data) => data });
	const { data: cats } = trpc.categories.list.useQuery();
	const post = posts?.posts?.find((p) => p.id === id);
	const update = trpc.posts.update.useMutation({
		onSuccess: async () => {
			await utils.posts.list.invalidate();
			router.push("/dashboard");
		},
	});

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [status, setStatus] = useState<"draft" | "published">("draft");
	const [selected, setSelected] = useState<number[]>([]);

	useEffect(() => {
		if (post) {
			setTitle(post.title);
			setContent(post.content);
			setStatus(post.status as any);
		}
	}, [post]);

	if (!post) return <div className="mx-auto max-w-3xl p-4">Loading...</div>;

	return (
		<div className="mx-auto max-w-3xl p-4 grid gap-3">
			<h1 className="text-2xl font-semibold">Edit Post</h1>
			<input className="border rounded p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
			<textarea className="border rounded p-2 h-60" value={content} onChange={(e) => setContent(e.target.value)} />
			<select className="border rounded p-2 w-fit" value={status} onChange={(e) => setStatus(e.target.value as any)}>
				<option value="draft">Draft</option>
				<option value="published">Published</option>
			</select>
			<div className="flex flex-wrap gap-2">
				{cats?.map((c) => (
					<label key={c.id} className="text-sm flex items-center gap-1 border rounded px-2 py-1">
						<input
							type="checkbox"
							checked={selected.includes(c.id)}
							onChange={(e) => setSelected((prev) => (e.target.checked ? [...prev, c.id] : prev.filter((id) => id !== c.id)))}
						/>
						{c.name}
					</label>
				))}
			</div>
			<button className="bg-black text-white rounded px-3 py-2 w-fit" onClick={() => update.mutate({ id, title, content, status, categoryIds: selected })}>Save</button>
		</div>
	);
}
