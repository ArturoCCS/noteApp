import { getAuth } from "firebase-admin/auth";
import { db } from "./admin";

export type AdminUser = {
	uid: string;
	workspaceSlug: string;
};

/**
 * Reads the `__session` httpOnly cookie, verifies the Firebase ID token,
 * checks for the `admin: true` custom claim, and returns the admin user info.
 * Throws a Response with status 401 or 403 if the check fails.
 */
export async function requireAdmin(request: Request): Promise<AdminUser> {
	const cookieHeader = request.headers.get("cookie") ?? "";
	const sessionToken = parseCookie(cookieHeader, "__session");

	if (!sessionToken) {
		throw new Response(JSON.stringify({ error: "No autenticado" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const auth = getAuth();
		const decoded = await auth.verifyIdToken(sessionToken);

		if (!decoded.admin) {
			throw new Response(
				JSON.stringify({ error: "Acceso denegado: se requiere rol admin" }),
				{
					status: 403,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const workspaceSlug: string = decoded.workspaceSlug ?? "";

		return { uid: decoded.uid, workspaceSlug };
	} catch (err) {
		if (err instanceof Response) throw err;
		console.error("Error verificando token:", err);
		throw new Response(JSON.stringify({ error: "Token inválido" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}
}

/**
 * Reads the `__session` httpOnly cookie without throwing — returns null if absent/invalid.
 */
export async function getAdminUser(
	request: Request,
): Promise<AdminUser | null> {
	try {
		return await requireAdmin(request);
	} catch {
		return null;
	}
}

function parseCookie(header: string, name: string): string | null {
	for (const part of header.split(";")) {
		const [k, ...v] = part.trim().split("=");
		if (k.trim() === name) return decodeURIComponent(v.join("="));
	}
	return null;
}

/** Helper to verify a workspace exists and belongs to the given admin uid */
export async function verifyWorkspaceOwner(
	workspaceSlug: string,
	uid: string,
): Promise<boolean> {
	try {
		const doc = await db.collection("workspaces").doc(workspaceSlug).get();
		if (!doc.exists) return false;
		return doc.data()?.ownerUid === uid;
	} catch {
		return false;
	}
}
