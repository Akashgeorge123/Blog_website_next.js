import Link from "next/link";

export default function Nav() {
	return (
		<nav className="w-full border-b bg-white">
			<div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
				<Link href="/" className="font-semibold">Blog</Link>
				<div className="flex items-center gap-4 text-sm">
					<Link href="/posts">Posts</Link>
					<Link href="/dashboard">Dashboard</Link>
				</div>
			</div>
		</nav>
	);
}
