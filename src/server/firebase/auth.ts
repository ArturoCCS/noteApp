import { getAuth } from "firebase-admin/auth";

// Reusa la inicialización que ya haces en src/server/firebase/admin.ts
// Importa admin.ts para garantizar que initializeApp ya corrió.
import "@/server/firebase/admin";

export const adminAuth = getAuth();

function getCookie(request: Request, name: string) {
	const cookie = request.headers.get("cookie") || "";
	const parts = cookie.split(";").map((p) => p.trim());
	const found = parts.find((p) => p.startsWith(name + "="));
	return found ? decodeURIComponent(found.split("=").slice(1).join("=")) : null;
}

export async function requireAdmin(request: Request) {
	const sessionCookie = getCookie(request, "session");
	if (!sessionCookie)
		return { ok: false as const, status: 401, error: "No session cookie" };

	try {
		const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

		if (decoded.admin !== true) {
			return { ok: false as const, status: 403, error: "Not admin" };
		}

		const workspaceSlug =
			typeof decoded.workspaceSlug === "string" ? decoded.workspaceSlug : null;

		return { ok: true as const, uid: decoded.uid, workspaceSlug, decoded };
	} catch {
		return { ok: false as const, status: 401, error: "Invalid session" };
	}
}
