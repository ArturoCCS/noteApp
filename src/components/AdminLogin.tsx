import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/client/firebase";

export default function AdminLogin() {
  async function login() {
    const cred = await signInWithPopup(auth, googleProvider);
    const idToken = await cred.user.getIdToken();

    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      const text = await res.text();
      alert(`No se pudo crear sesión.\n${text}`);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Iniciar sesión</h1>
      <p className="text-sm opacity-70">
        Solo admins (custom claim <code>admin: true</code>) pueden entrar.
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