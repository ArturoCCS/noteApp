import type { APIRoute } from "astro";
import { db } from "@/server/firebase/admin";

export const prerender = false;

// CAMBIO AQUÍ: De DELETE a POST
export const POST: APIRoute = async ({ request }) => {
	try {
		const { id } = await request.json();

		if (!id) {
			return new Response("ID requerido", { status: 400 });
		}

		await db.collection("posts").doc(id).delete();

		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	} catch (error) {
		console.error("Error al eliminar post:", error);
		return new Response("Error interno", { status: 500 });
	}
};
