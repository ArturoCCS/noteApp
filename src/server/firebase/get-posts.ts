import type { Post } from "@/types/Post";
import { db } from "./admin";

/**
 * Lista posts
 * - si workspaceId está presente => solo posts de ese workspace
 * - si no => legacy (todos)
 */
export async function getSortedPosts(workspaceId?: string) {
	try {
		let q: FirebaseFirestore.Query = db
			.collection("posts")
			.orderBy("published", "desc");

		if (workspaceId) {
			q = q.where("workspaceId", "==", workspaceId);
		}

		const snapshot = await q.get();

		return snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				...data,
				published: data.published?.toDate
					? data.published.toDate()
					: data.published,
				updated: data.updated?.toDate ? data.updated.toDate() : data.updated,
			} as Post;
		});
	} catch (error) {
		console.error("Error al traer posts de Firestore:", error);
		return [];
	}
}

/**
 * Legacy: obtener post por ID de documento.
 * OJO: con docId compuesto, este método sirve si le pasas `workspace__slug`.
 */
export async function getPostById(id: string) {
	try {
		const doc = await db.collection("posts").doc(id).get();
		if (!doc.exists) return null;

		const data = doc.data();

		return {
			id: doc.id,
			...data,
			published: data?.published?.toDate?.() ?? data?.published,
			updated: data?.updated?.toDate?.() ?? data?.updated,
		} as Post;
	} catch (error) {
		console.error("Error al traer post:", error);
		return null;
	}
}

/**
 * Legacy: buscar post por slug global (SIN workspace).
 * Útil mientras tengas rutas viejas /posts/:slug o posts antiguos sin workspaceId.
 */
export async function getPostBySlugLegacy(slug: string) {
	try {
		const snapshot = await db
			.collection("posts")
			.where("slug", "==", slug)
			.limit(1)
			.get();

		if (snapshot.empty) return null;

		const doc = snapshot.docs[0];
		const data = doc.data();

		return {
			id: doc.id,
			...data,
			published: data?.published?.toDate?.() ?? data?.published,
			updated: data?.updated?.toDate?.() ?? data?.updated,
		} as Post;
	} catch (error) {
		console.error("Error al traer post por slug legacy:", error);
		return null;
	}
}

/** workspace docId */
function postDocId(workspaceId: string, slug: string) {
	return `${workspaceId}__${slug}`;
}

/**
 * Nuevo: post por workspace + slug (para rutas públicas /w/:slug/posts/:postSlug)
 * y para admin si quieres acceder por slug dentro de su workspace.
 */
export async function getPostBySlug(workspaceId: string, slug: string) {
	try {
		const id = postDocId(workspaceId, slug);
		const doc = await db.collection("posts").doc(id).get();
		if (!doc.exists) return null;

		const data = doc.data();

		return {
			id: doc.id,
			...data,
			published: data?.published?.toDate?.() ?? data?.published,
			updated: data?.updated?.toDate?.() ?? data?.updated,
		} as Post;
	} catch (error) {
		console.error("Error al traer post por workspace+slug:", error);
		return null;
	}
}

// ------------------------------
// Tags / Categories
// ------------------------------

// ✅ tags, opcionalmente filtrado por workspace
export async function getTagList(workspaceId?: string) {
	const allPosts = await getSortedPosts(workspaceId);
	const countMap: Record<string, number> = {};

	allPosts.forEach((post) => {
		(post.tags || []).forEach((tag: string) => {
			const t = String(tag).trim();
			if (!t) return;
			countMap[t] = (countMap[t] || 0) + 1;
		});
	});

	return Object.keys(countMap)
		.sort((a, b) => a.localeCompare(b))
		.map((name) => ({ name, count: countMap[name] }));
}

// ✅ categories, opcionalmente filtrado por workspace
export async function getCategoryList(
	workspaceId?: string,
	workspaceSlug?: string,
) {
	const allPosts = await getSortedPosts(workspaceId);
	const countMap: Record<string, number> = {};

	allPosts.forEach((post) => {
		const category =
			(post.category && String(post.category).trim()) || "Uncategorized";
		countMap[category] = (countMap[category] || 0) + 1;
	});

	const baseUrl = workspaceSlug ? `/w/${workspaceSlug}/archive` : "/archive";

	return Object.keys(countMap)
		.sort((a, b) => a.localeCompare(b))
		.map((name) => ({
			name,
			count: countMap[name],
			url: `${baseUrl}/?category=${encodeURIComponent(name)}`,
		}));
}
