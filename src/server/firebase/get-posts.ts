import type { Post } from "@/types/Post";
import { db } from "./admin";

export async function getSortedPosts(workspaceId?: string) {
	try {
		let query = db
			.collection("posts")
			.orderBy("published", "desc") as FirebaseFirestore.Query;

		if (workspaceId) {
			query = query.where("workspaceId", "==", workspaceId);
		}

		const snapshot = await query.get();

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

/* ✅ ESTA ES LA PIEZA QUE FALTABA */
export async function getPostBySlug(slug: string, workspaceId?: string) {
	try {
		let query = db
			.collection("posts")
			.where("slug", "==", slug)
			.limit(1) as FirebaseFirestore.Query;

		if (workspaceId) {
			query = db
				.collection("posts")
				.where("slug", "==", slug)
				.where("workspaceId", "==", workspaceId)
				.limit(1);
		}

		const snapshot = await query.get();

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
		console.error("Error al traer post por slug:", error);
		return null;
	}
}

export async function getTagList(workspaceId?: string) {
	const allPosts = await getSortedPosts(workspaceId);
	const countMap: Record<string, number> = {};

	allPosts.forEach((post) => {
		(post.tags || []).forEach((tag) => {
			countMap[tag] = (countMap[tag] || 0) + 1;
		});
	});

	return Object.keys(countMap)
		.sort((a, b) => a.localeCompare(b))
		.map((name) => ({ name, count: countMap[name] }));
}

export async function getCategoryList(workspaceId?: string) {
	const allPosts = await getSortedPosts(workspaceId);
	const countMap: Record<string, number> = {};

	allPosts.forEach((post) => {
		const category = post.category || "Uncategorized";
		countMap[category] = (countMap[category] || 0) + 1;
	});

	return Object.keys(countMap)
		.sort((a, b) => a.localeCompare(b))
		.map((name) => ({
			name,
			count: countMap[name],
			url: `/archive/?category=${name}`,
		}));
}
