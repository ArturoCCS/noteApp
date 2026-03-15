import type { APIRoute } from "astro";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/server/firebase/admin";
import { requireAdmin } from "@/server/firebase/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const admin = await requireAdmin(request);

		if (!admin.workspaceSlug) {
			return new Response(
				JSON.stringify({ error: "workspaceSlug claim no configurado" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		const data = await request.json();

		if (!data.title || !data.slug || !data.content || !data.type) {
			return new Response(JSON.stringify({ error: "Datos incompletos" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Composite document id: workspaceSlug__slug
		const docId = `${admin.workspaceSlug}__${data.slug}`;
		const ref = db.collection("posts").doc(docId);

		const now = Timestamp.now();

		await ref.set({
			title: data.title,
			slug: data.slug,
			description: data.description || "",
			image: data.image ?? null,
			tags: Array.isArray(data.tags) ? data.tags : [],
			category: data.category ?? null,
			content: data.content,

			// Derived from the verified session — never trusted from the client
			workspaceId: admin.workspaceSlug,
			ownerUid: admin.uid,

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

		return new Response(
			JSON.stringify({ ok: true, slug: data.slug, id: docId }),
			{ status: 201, headers: { "Content-Type": "application/json" } },
		);
	} catch (err) {
		if (err instanceof Response) return err;
		console.error("❌ Error al guardar post:", err);

		return new Response(JSON.stringify({ error: "Error interno" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
