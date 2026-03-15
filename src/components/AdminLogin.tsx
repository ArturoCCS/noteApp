import { auth, googleProvider } from "@/client/firebase";
import { signInWithPopup } from "firebase/auth";

export default function AdminLogin() {
  async function login() {
    try {
      // 1) Login Google
      const cred = await signInWithPopup(auth, googleProvider);

      // 2) Token inicial (sin claims todavía)
      const idToken = await cred.user.getIdToken();

      // 3) Promote según allowlist en Firestore (set custom claims)
      const promoteRes = await fetch("/api/auth/promote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!promoteRes.ok) {
        const txt = await promoteRes.text();
        alert(
          `Tu correo no está autorizado o no tiene workspace asignado.\n\n${txt}`,
        );
        return;
      }

      // 4) Refrescar token para traer claims nuevos (admin/workspaceSlug)
      await cred.user.getIdToken(true);
      const idToken2 = await cred.user.getIdToken();

      // 5) Crear cookie httpOnly de sesión
      const sessionRes = await fetch("/api/auth/session/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: idToken2 }),
      });

      if (!sessionRes.ok) {
        const txt = await sessionRes.text();
        alert(`No se pudo crear la sesión.\n\n${txt}`);
        return;
      }

      window.location.href = "/admin/";
    } catch (e: any) {
      console.error(e);
      alert(e?.code ? `Login error: ${e.code}` : "Login error");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Iniciar sesión</h1>
      <p className="text-sm opacity-70">
        Solo correos autorizados pueden entrar.
      </p>
      <button
        className="btn-regular btn-plain px-6 h-10 rounded-[var(--radius-large)]"
        onClick={login}
      >
        Sign in with Google
      </button>
    </div>
  );
}