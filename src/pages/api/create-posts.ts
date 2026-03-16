import type { APIRoute } from "astro";
import { Timestamp } from "firebase-admin/firestore";
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
		const data = await request.json();

		// ✅ validación mínima
		if (!data.title || !data.slug || !data.content || !data.type) {
			return new Response(JSON.stringify({ error: "Datos incompletos" }), {
				status: 400,
			});
		}

		const workspaceId = auth.workspaceSlug;
		const slug = String(data.slug).trim();
		const id = postDocId(workspaceId, slug);

		const ref = db.collection("posts").doc(id);
		const now = Timestamp.now();

		await ref.set({
			id,
			workspaceId,
			ownerUid: auth.uid,

			title: data.title,
			slug,
			description: data.description || "",
			image: data.image ?? null,
			tags: Array.isArray(data.tags) ? data.tags : [],
			category: data.category ?? null,
			content: data.content,

			type: data.type, // "study" | "task" | "blog"
			status: data.type === "task" ? (data.status ?? "pending") : "published",

			published: data.published
				? Timestamp.fromDate(new Date(data.published))
				: now,

			words: Number(data.words) || 0,
			minutes: Number(data.minutes) || 1,

			createdAt: now,
			updatedAt: now,
		});

		return new Response(JSON.stringify({ ok: true, slug, id, workspaceId }), {
			status: 201,
		});
	} catch (error) {
		console.error("❌ Error al guardar post:", error);
		return new Response(JSON.stringify({ error: "Error interno" }), {
			status: 500,
		});
	}
};
