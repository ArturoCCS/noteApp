import type { Post } from "@/types/Post";
import { db } from "./admin";

export async function getSortedPosts() {
  try {
    const snapshot = await db.collection("posts").orderBy("published", "desc").get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        published: data.published?.toDate ? data.published.toDate() : data.published,
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


export async function getTagList() {
  const allPosts = await getSortedPosts();
  const countMap: { [key: string]: number } = {};
  
  allPosts.forEach(post => {
    (post.tags || []).forEach(tag => {
      countMap[tag] = (countMap[tag] || 0) + 1;
    });
  });

  return Object.keys(countMap)
    .sort((a, b) => a.localeCompare(b))
    .map(name => ({ name, count: countMap[name] }));
}

export async function getCategoryList() {
  const allPosts = await getSortedPosts();
  const countMap: { [key: string]: number } = {};

  allPosts.forEach(post => {
    const category = post.category || "Uncategorized";
    countMap[category] = (countMap[category] || 0) + 1;
  });

  return Object.keys(countMap)
    .sort((a, b) => a.localeCompare(b))
    .map(name => ({
      name,
      count: countMap[name],
      url: `/archive/?category/${name}`
    }));
}