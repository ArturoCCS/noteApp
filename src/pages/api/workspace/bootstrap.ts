import type { APIRoute } from "astro";
import { FieldValue } from "firebase-admin/firestore";
import {
	expressiveCodeConfig,
	licenseConfig,
	navBarConfig,
	profileConfig,
	siteConfig,
} from "@/config";
import { db } from "@/server/firebase/admin";
import { requireAdmin } from "@/server/firebase/auth";

export const prerender = false;

/**
 * POST /api/workspace/bootstrap
 * Admin-only. Creates the workspace document from defaults if it does not exist yet.
 */
export const POST: APIRoute = async ({ request }) => {
	try {
		const admin = await requireAdmin(request);

		if (!admin.workspaceSlug) {
			return new Response(
				JSON.stringify({ error: "workspaceSlug claim no configurado" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const ref = db.collection("workspaces").doc(admin.workspaceSlug);
		const doc = await ref.get();

		if (doc.exists) {
			return new Response(
				JSON.stringify({ ok: true, created: false, message: "Ya existe" }),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		await ref.set({
			slug: admin.workspaceSlug,
			ownerUid: admin.uid,
			isPublic: false,
			site: siteConfig,
			navBar: navBarConfig,
			profile: profileConfig,
			license: licenseConfig,
			expressiveCode: expressiveCodeConfig,
			pages: { about: "" },
			updatedAt: FieldValue.serverTimestamp(),
		});

		return new Response(JSON.stringify({ ok: true, created: true }), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		if (err instanceof Response) return err;
		console.error("Error al crear workspace:", err);
		return new Response(JSON.stringify({ error: "Error interno" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
