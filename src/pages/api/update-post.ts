import type { APIRoute } from "astro";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/server/firebase/admin";
import { requireAdmin } from "@/server/firebase/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const admin = await requireAdmin(request);
		const data = await request.json();

		if (!data.slug) {
			return new Response(JSON.stringify({ error: "Slug requerido" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		if (!admin.workspaceSlug) {
			return new Response(
				JSON.stringify({ error: "workspaceSlug claim no configurado" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		// Composite document id derived from the verified session
		const docId = `${admin.workspaceSlug}__${data.slug}`;
		const ref = db.collection("posts").doc(docId);

		const doc = await ref.get();
		if (!doc.exists) {
			return new Response(JSON.stringify({ error: "Post no encontrado" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Verify ownership
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

		if (data.type === "task") {
			updateData.status = data.status ?? "pending";
		}

		await ref.update(updateData);

		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		if (err instanceof Response) return err;
		console.error("❌ Error actualizando post:", err);

		return new Response(JSON.stringify({ error: "Error actualizando post" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
