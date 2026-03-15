import type { APIRoute } from "astro";
import { db } from "@/server/firebase/admin";
import { requireAdmin } from "@/server/firebase/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const admin = await requireAdmin(request);
		const body = await request.json();

		// Accept slug (preferred) or a raw document id for legacy compatibility
		let docId: string;
		if (body.slug) {
			if (!admin.workspaceSlug) {
				return new Response(
					JSON.stringify({ error: "workspaceSlug claim no configurado" }),
					{
						status: 400,
						headers: { "Content-Type": "application/json" },
					},
				);
			}
			docId = `${admin.workspaceSlug}__${body.slug}`;
		} else if (body.id) {
			docId = body.id;
		} else {
			return new Response(JSON.stringify({ error: "slug o id requerido" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const ref = db.collection("posts").doc(docId);
		const doc = await ref.get();

		if (!doc.exists) {
			return new Response(JSON.stringify({ error: "Post no encontrado" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Verify ownership for posts that carry ownership metadata
		const postData = doc.data() ?? {};
		if (postData.ownerUid && postData.ownerUid !== admin.uid) {
			return new Response(JSON.stringify({ error: "No autorizado" }), {
				status: 403,
				headers: { "Content-Type": "application/json" },
			});
		}
		if (postData.workspaceId && postData.workspaceId !== admin.workspaceSlug) {
			return new Response(JSON.stringify({ error: "No autorizado" }), {
				status: 403,
				headers: { "Content-Type": "application/json" },
			});
		}

		await ref.delete();

		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		if (err instanceof Response) return err;
		console.error("Error al eliminar post:", err);
		return new Response(JSON.stringify({ error: "Error interno" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
