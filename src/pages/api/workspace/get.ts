import type { APIRoute } from "astro";
import { requireAdmin } from "@/server/firebase/auth";
import { getWorkspaceAbout } from "@/server/firebase/get-workspace";
import { getWorkspaceBySlug } from "@/server/firebase/workspaces";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
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

	const [ws, aboutContent] = await Promise.all([
		getWorkspaceBySlug(auth.workspaceSlug),
		getWorkspaceAbout(auth.workspaceSlug),
	]);

	const existingPages =
		(ws as { pages?: Record<string, unknown> })?.pages ?? {};
	const wsWithAbout = {
		...(ws ?? {}),
		pages: {
			...existingPages,
			about: { content: aboutContent },
		},
	};

	return new Response(JSON.stringify({ ok: true, workspace: wsWithAbout }), {
		status: 200,
	});
};
