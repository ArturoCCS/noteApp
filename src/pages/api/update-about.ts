import { db } from "@/server/firebase/admin";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return new Response(
        JSON.stringify({ error: "Contenido vacío" }),
        { status: 400 }
      );
    }

    await db.collection("pages").doc("about").set(
      {
        content,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Error guardando About" }),
      { status: 500 }
    );
  }
};
