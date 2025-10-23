import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/src/server/root";

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
	});

export async function GET(req: Request) {
	return handler(req);
}

export async function POST(req: Request) {
	return handler(req);
}

