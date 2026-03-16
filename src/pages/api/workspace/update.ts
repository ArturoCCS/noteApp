import type { APIRoute } from "astro";
import { requireAdmin } from "@/server/firebase/auth";
import { upsertWorkspace } from "@/server/firebase/workspaces";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const auth = await requireAdmin(request);
	if (!auth.ok)
		return new Response(JSON.stringify({ error: auth.error }), {
			status: auth.status,
		});
	if (!auth.workspaceSlug) {
		return new Response(
			JSON.stringify({ error: "Missing workspaceSlug custom claim" }),
			{ status: 400 },
		);
	}

	const body = await request.json();
	await upsertWorkspace(auth.workspaceSlug, body);

	return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
