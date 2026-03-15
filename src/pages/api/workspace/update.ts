import type { APIRoute } from "astro";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "@/server/firebase/admin";
import { requireAdmin, verifyWorkspaceOwner } from "@/server/firebase/auth";

export const prerender = false;

/**
 * POST /api/workspace/update
 * Admin-only. Merges partial workspace data into the caller's workspace document.
 * Body: Partial WorkspaceConfig (site, navBar, profile, license, expressiveCode, pages, isPublic)
 */
export const POST: APIRoute = async ({ request }) => {
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

		const isOwner = await verifyWorkspaceOwner(admin.workspaceSlug, admin.uid);
		if (!isOwner) {
			return new Response(
				JSON.stringify({ error: "No autorizado para este workspace" }),
				{
					status: 403,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const body = await request.json();

		// Only allow known fields to be updated
		const allowed = [
			"site",
			"navBar",
			"profile",
			"license",
			"expressiveCode",
			"pages",
			"isPublic",
		];

		const updateData: Record<string, unknown> = {
			updatedAt: FieldValue.serverTimestamp(),
		};
		for (const key of allowed) {
			if (body[key] !== undefined) {
				updateData[key] = body[key];
			}
		}

		await db
			.collection("workspaces")
			.doc(admin.workspaceSlug)
			.set(updateData, { merge: true });

		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		if (err instanceof Response) return err;
		console.error("Error al actualizar workspace:", err);
		return new Response(JSON.stringify({ error: "Error interno" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
