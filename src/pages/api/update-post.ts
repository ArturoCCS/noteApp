import type { APIRoute } from "astro";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/server/firebase/admin";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const data = await request.json();

		if (!data.slug) {
			return new Response(JSON.stringify({ error: "Slug requerido" }), {
				status: 400,
			});
		}

		const ref = db.collection("posts").doc(data.slug);

		const updateData: Record<string, any> = {
			updatedAt: Timestamp.now(),
		};

		if (data.title !== undefined) updateData.title = data.title;
		if (data.description !== undefined)
			updateData.description = data.description;
		if (data.image !== undefined) updateData.image = data.image;
		if (data.content !== undefined) updateData.content = data.content;
		if (data.category !== undefined) updateData.category = data.category;
		if (Array.isArray(data.tags)) updateData.tags = data.tags;
		if (data.words !== undefined) updateData.words = Number(data.words);
		if (data.minutes !== undefined) updateData.minutes = Number(data.minutes);

		if (data.type) updateData.type = data.type;

		if (data.workspaceId !== undefined)
			updateData.workspaceId = data.workspaceId;

		if (data.type === "task") {
			updateData.status = data.status ?? "pending";
		}

		await ref.update(updateData);

		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	} catch (error) {
		console.error("❌ Error actualizando post:", error);

		return new Response(JSON.stringify({ error: "Error actualizando post" }), {
			status: 500,
		});
	}
};
