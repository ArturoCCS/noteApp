import type { APIRoute } from "astro";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/server/firebase/admin";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const data = await request.json();

		// 🔒 Validación mínima pero correcta
		if (!data.title || !data.slug || !data.content || !data.type) {
			return new Response(JSON.stringify({ error: "Datos incompletos" }), {
				status: 400,
			});
		}

		const ref = db.collection("posts").doc(data.slug);

		const now = Timestamp.now();

		await ref.set({
			title: data.title,
			slug: data.slug,
			description: data.description || "",
			image: data.image ?? null,
			tags: Array.isArray(data.tags) ? data.tags : [],
			category: data.category ?? null,
			content: data.content,

			workspaceId: data.workspaceId ?? null,

			// 🔑 CLAVE
			type: data.type, // "study" | "task" | "blog"

			// ⏳ status solo importa para tareas
			status: data.type === "task" ? (data.status ?? "pending") : "published",

			published: data.published
				? Timestamp.fromDate(new Date(data.published))
				: now,

			words: Number(data.words) || 0,
			minutes: Number(data.minutes) || 1,

			createdAt: now,
			updatedAt: now,
		});

		return new Response(JSON.stringify({ ok: true, slug: data.slug }), {
			status: 201,
		});
	} catch (error) {
		console.error("❌ Error al guardar post:", error);

		return new Response(JSON.stringify({ error: "Error interno" }), {
			status: 500,
		});
	}
};
