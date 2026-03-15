import type { APIRoute } from "astro";
import { requireAdmin } from "@/server/firebase/auth";
import { getWorkspaceBySlug } from "@/server/firebase/get-workspace";

export const prerender = false;

/**
 * GET /api/workspace/get
 * Admin-only. Returns the workspace document for the caller's workspaceSlug claim.
 */
export const GET: APIRoute = async ({ request }) => {
	try {
		const admin = await requireAdmin(request);

		if (!admin.workspaceSlug) {
			return new Response(
				JSON.stringify({ error: "workspaceSlug claim no configurado" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const workspace = await getWorkspaceBySlug(admin.workspaceSlug);

		if (!workspace) {
			return new Response(
				JSON.stringify({ error: "Workspace no encontrado" }),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		return new Response(JSON.stringify(workspace), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		if (err instanceof Response) return err;
		console.error("Error al obtener workspace:", err);
		return new Response(JSON.stringify({ error: "Error interno" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
