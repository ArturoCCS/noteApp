import type { APIRoute } from "astro";
import { db } from "@/server/firebase/admin";
import { requireAdmin } from "@/server/firebase/auth";

export const prerender = false;

function postDocId(workspaceId: string, slug: string) {
	return `${workspaceId}__${slug}`;
}

export const POST: APIRoute = async ({ request }) => {
	const auth = await requireAdmin(request);
	if (!auth.ok) {
		return new Response(JSON.stringify({ error: auth.error }), {
			status: auth.status,
		});
	}
	if (!auth.workspaceSlug) {
		return new Response(
			JSON.stringify({ error: "Missing workspaceSlug custom claim" }),
			{ status: 400 },
		);
	}

	try {
		// Soportar legacy: { id } o nuevo: { slug }
		const body = await request.json();
		const slug = body.slug ?? body.id; // si tu UI manda id=slug todavía
		if (!slug) {
			return new Response(JSON.stringify({ error: "slug requerido" }), {
				status: 400,
			});
		}

		const workspaceId = auth.workspaceSlug;
		const id = postDocId(workspaceId, String(slug).trim());
		const ref = db.collection("posts").doc(id);

		const snap = await ref.get();
		if (!snap.exists) {
			return new Response(JSON.stringify({ error: "Post no encontrado" }), {
				status: 404,
			});
		}

		const existing = snap.data() || {};
		if (
			existing.workspaceId !== workspaceId ||
			existing.ownerUid !== auth.uid
		) {
			return new Response(JSON.stringify({ error: "Forbidden" }), {
				status: 403,
			});
		}

		await ref.delete();

		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	} catch (error) {
		console.error("Error al eliminar post:", error);
		return new Response(JSON.stringify({ error: "Error interno" }), {
			status: 500,
		});
	}
};
