import type { APIRoute } from "astro";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/server/firebase/admin";
import { requireAdmin } from "@/server/firebase/auth";

export const prerender = false;

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
		const { content } = await request.json();

		if (content === undefined || content === null) {
			return new Response(JSON.stringify({ error: "Contenido requerido" }), {
				status: 400,
			});
		}

		await db
			.collection("workspaces")
			.doc(auth.workspaceSlug)
			.set(
				{
					pages: { about: String(content) },
					updatedAt: Timestamp.now(),
				},
				{ merge: true },
			);

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: "Error guardando About" }), {
			status: 500,
		});
	}
};
