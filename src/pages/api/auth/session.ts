import type { APIRoute } from "astro";
import { adminAuth } from "@/server/firebase/auth";

export const prerender = false;

const COOKIE_NAME = "session";

export const POST: APIRoute = async ({ request }) => {
	const { idToken } = await request.json();
	if (!idToken) {
		return new Response(JSON.stringify({ error: "Missing idToken" }), {
			status: 400,
		});
	}

	try {
		const expiresIn = 5 * 24 * 60 * 60 * 1000;
		const sessionCookie = await adminAuth.createSessionCookie(idToken, {
			expiresIn,
		});

		const headers = new Headers();
		headers.append(
			"Set-Cookie",
			`${COOKIE_NAME}=${sessionCookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(
				expiresIn / 1000,
			)}`,
		);

		return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
	} catch (e) {
		console.error("createSessionCookie error:", e);
		return new Response(JSON.stringify({ error: "Invalid token" }), {
			status: 401,
		});
	}
};

export const DELETE: APIRoute = async () => {
	const headers = new Headers();
	headers.append(
		"Set-Cookie",
		`${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
	);
	return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
};
