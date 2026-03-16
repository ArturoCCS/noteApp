import type { APIRoute } from "astro";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/server/firebase/admin";
import { requireAdmin } from "@/server/firebase/auth";
import { upsertWorkspace } from "@/server/firebase/workspaces";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const auth = await requireAdmin(request);
	if (!auth.ok)
		return new Response(JSON.stringify({ error: auth.error }), {
			status: auth.status,
		});
	if (!auth.workspaceSlug) {
		return new Response(
			JSON.stringify({ error: "Missing workspaceSlug custom claim" }),
			{ status: 400 },
		);
	}

	const body = await request.json();

	// Extract about content and write to subcollection
	const aboutContent = body?.pages?.about?.content;
	if (typeof aboutContent === "string") {
		await db
			.collection("workspaces")
			.doc(auth.workspaceSlug)
			.collection("pages")
			.doc("about")
			.set(
				{ content: aboutContent, updatedAt: Timestamp.now() },
				{ merge: true },
			);
	}

	// Write remaining workspace data (strip pages.about to avoid duplication)
	const { pages, ...rest } = body;
	const pagesWithoutAbout = pages ? { ...pages, about: undefined } : undefined;
	await upsertWorkspace(auth.workspaceSlug, {
		...rest,
		...(pagesWithoutAbout ? { pages: pagesWithoutAbout } : {}),
	});

	return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
