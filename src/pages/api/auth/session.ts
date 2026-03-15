import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
// ensure Admin SDK is initialized
import "@/server/firebase/admin";

export const prerender = false;

const SESSION_COOKIE = "__session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 5; // 5 days in seconds

/**
 * POST /api/auth/session
 * Body: { idToken: string }
 * Verifies the Firebase ID token, checks the admin custom claim,
 * and sets an httpOnly session cookie.
 */
export const POST: APIRoute = async ({ request }) => {
	try {
		const { idToken } = await request.json();

		if (!idToken) {
			return new Response(JSON.stringify({ error: "idToken requerido" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const auth = getAuth();
		const decoded = await auth.verifyIdToken(idToken);

		if (!decoded.admin) {
			return new Response(
				JSON.stringify({ error: "Acceso denegado: se requiere rol admin" }),
				{
					status: 403,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const cookieValue = `${SESSION_COOKIE}=${encodeURIComponent(idToken)}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Strict`;

		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Set-Cookie": cookieValue,
			},
		});
	} catch (error) {
		console.error("Error al crear sesión:", error);
		return new Response(JSON.stringify({ error: "Token inválido" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}
};

/**
 * DELETE /api/auth/session
 * Clears the session cookie.
 */
export const DELETE: APIRoute = async () => {
	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Set-Cookie": `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
		},
	});
};
