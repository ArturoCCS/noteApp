import {
	expressiveCodeConfig,
	licenseConfig,
	navBarConfig,
	profileConfig,
	siteConfig,
} from "@/config";
import type { WorkspaceConfig } from "@/types/workspace";
import { db } from "./admin";

export async function getWorkspaceBySlug(
	slug: string,
): Promise<WorkspaceConfig | null> {
	try {
		const doc = await db.collection("workspaces").doc(slug).get();
		if (!doc.exists) return null;

		const data = doc.data() ?? {};

		// Normalize pages.about to always be a string
		const rawPages = data.pages ?? {};
		const aboutRaw = rawPages.about;
		const aboutString: string =
			typeof aboutRaw === "string"
				? aboutRaw
				: typeof aboutRaw === "object" && aboutRaw !== null && typeof aboutRaw.content === "string"
					? aboutRaw.content
					: "";

		return {
			slug,
			ownerUid: data.ownerUid ?? "",
			isPublic: data.isPublic ?? false,
			site: { ...siteConfig, ...(data.site ?? {}) },
			navBar: data.navBar ?? navBarConfig,
			profile: { ...profileConfig, ...(data.profile ?? {}) },
			license: { ...licenseConfig, ...(data.license ?? {}) },
			expressiveCode: {
				...expressiveCodeConfig,
				...(data.expressiveCode ?? {}),
			},
			pages: { ...rawPages, about: aboutString },
			updatedAt: data.updatedAt?.toDate?.() ?? undefined,
		} as WorkspaceConfig;
	} catch (error) {
		console.error("Error al cargar workspace:", error);
		return null;
	}
}
