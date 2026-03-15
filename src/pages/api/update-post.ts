import { db } from "@/server/firebase/admin";
import { requireAdmin } from "@/server/firebase/auth";
import type { APIRoute } from "astro";
import { Timestamp } from "firebase-admin/firestore";

export const prerender = false;

function postDocId(workspaceId: string, slug: string) {
  return `${workspaceId}__${slug}`;
}

export const POST: APIRoute = async ({ request }) => {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status,
    });
  }
  if (!auth.workspaceSlug) {
    return new Response(
      JSON.stringify({ error: "Missing workspaceSlug custom claim" }),
      { status: 400 },
    );
  }

  try {
    const data = await request.json();
    if (!data.slug) {
      return new Response(JSON.stringify({ error: "Slug requerido" }), {
        status: 400,
      });
    }

    const workspaceId = auth.workspaceSlug;
    const slug = String(data.slug).trim();
    const id = postDocId(workspaceId, slug);

    const ref = db.collection("posts").doc(id);

    // ✅ validar ownership
    const snap = await ref.get();
    if (!snap.exists) {
      return new Response(JSON.stringify({ error: "Post no encontrado" }), {
        status: 404,
      });
    }

    const existing = snap.data() || {};
    if (existing.workspaceId !== workspaceId || existing.ownerUid !== auth.uid) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    const updateData: Record<string, any> = {
      updatedAt: Timestamp.now(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.category !== undefined) updateData.category = data.category;
    if (Array.isArray(data.tags)) updateData.tags = data.tags;
    if (data.words !== undefined) updateData.words = Number(data.words);
    if (data.minutes !== undefined) updateData.minutes = Number(data.minutes);

    if (data.type) updateData.type = data.type;
    if (data.type === "task") updateData.status = data.status ?? "pending";

    await ref.update(updateData);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Error actualizando post:", error);
    return new Response(JSON.stringify({ error: "Error actualizando post" }), {
      status: 500,
    });
  }
};