import { db } from "@/server/firebase/admin";
import { adminAuth } from "@/server/firebase/auth";
import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Promueve un usuario a admin si su email está en Firestore:
 * adminAllowlist/<emailLowercase> { enabled: true, workspaceSlug: "juan" }
 *
 * Se llama desde el frontend justo después del login con Google.
 */
export const POST: APIRoute = async ({ request }) => {
  const { idToken } = await request.json();
  if (!idToken) {
    return new Response(JSON.stringify({ error: "Missing idToken" }), { status: 400 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const email = (decoded.email || "").toLowerCase().trim();
    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email in token" }), { status: 400 });
    }

    const snap = await db.collection("adminAllowlist").doc(email).get();
    if (!snap.exists) {
      return new Response(JSON.stringify({ error: "Not allowed" }), { status: 403 });
    }

    const allow = snap.data() || {};
    if (allow.enabled !== true) {
      return new Response(JSON.stringify({ error: "Disabled" }), { status: 403 });
    }

    const workspaceSlug = String(allow.workspaceSlug || "").trim();
    if (!workspaceSlug) {
      return new Response(
        JSON.stringify({ error: "Missing workspaceSlug in allowlist doc" }),
        { status: 400 },
      );
    }

    await adminAuth.setCustomUserClaims(decoded.uid, {
      admin: true,
      workspaceSlug,
    });

    return new Response(JSON.stringify({ ok: true, email, workspaceSlug }), { status: 200 });
  } catch (e) {
    console.error("promote error:", e);
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }
};