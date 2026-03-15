import { Editor } from "@/components/Editor";
import { useEffect, useRef, useState } from "react";

export default function WorkspaceSettingsEditor() {
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<any>(null);

  const aboutGetMdRef = useRef<() => string>(() => "");

  useEffect(() => {
    (async () => {
      // Bootstrap the workspace doc if it doesn't exist yet
      await fetch("/api/workspace/bootstrap", { method: "POST" });
      const res = await fetch("/api/workspace/get");
      const json = await res.json();
      setWorkspace(json.workspace ?? {});
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="opacity-70">Cargando...</div>;

  const w = workspace || {};
  w.site ||= {};
  w.site.banner ||= { enable: false, src: "", position: "center", credit: { enable: false, text: "" } };
  w.profile ||= {};
  w.navBar ||= { links: [0, 1, 2, 3] };
  w.license ||= {};
  w.expressiveCode ||= {};
  w.pages ||= {};
  if (typeof w.pages.about !== "string") {
    w.pages.about = "";
  }

  async function save() {
    const updated = {
      ...w,
      pages: {
        ...w.pages,
        about: aboutGetMdRef.current?.() ?? w.pages.about,
      },
    };

    const res = await fetch("/api/workspace/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (!res.ok) {
      alert("Error guardando workspace");
      return;
    }
    alert("Workspace guardado ✅");
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="card-base p-4">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">Sitio</div>
        <input
          className="w-full bg-transparent border-b border-[var(--line-divider)] py-2"
          placeholder="Título"
          value={w.site.title ?? ""}
          onChange={(e) => setWorkspace({ ...w, site: { ...w.site, title: e.target.value } })}
        />
        <input
          className="w-full bg-transparent border-b border-[var(--line-divider)] py-2 mt-2"
          placeholder="Subtítulo"
          value={w.site.subtitle ?? ""}
          onChange={(e) => setWorkspace({ ...w, site: { ...w.site, subtitle: e.target.value } })}
        />
        <input
          className="w-full bg-transparent border-b border-[var(--line-divider)] py-2 mt-2"
          placeholder="URL del banner (https://...)"
          value={w.site.banner.src ?? ""}
          onChange={(e) => {
            const bannerSrc = e.target.value;
            const updatedBanner = { ...w.site.banner, src: bannerSrc, enable: !!bannerSrc };
            setWorkspace({ ...w, site: { ...w.site, banner: updatedBanner } });
          }}
        />
      </section>

      <section className="card-base p-4">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">Perfil</div>
        <input
          className="w-full bg-transparent border-b border-[var(--line-divider)] py-2"
          placeholder="Nombre"
          value={w.profile.name ?? ""}
          onChange={(e) => setWorkspace({ ...w, profile: { ...w.profile, name: e.target.value } })}
        />
        <input
          className="w-full bg-transparent border-b border-[var(--line-divider)] py-2 mt-2"
          placeholder="Avatar URL"
          value={w.profile.avatar ?? ""}
          onChange={(e) => setWorkspace({ ...w, profile: { ...w.profile, avatar: e.target.value } })}
        />
        <input
          className="w-full bg-transparent border-b border-[var(--line-divider)] py-2 mt-2"
          placeholder="Bio"
          value={w.profile.bio ?? ""}
          onChange={(e) => setWorkspace({ ...w, profile: { ...w.profile, bio: e.target.value } })}
        />
      </section>

      <section className="card-base p-4">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">Licencia</div>
        <div className="flex items-center gap-3 mb-2">
          <input
            type="checkbox"
            id="license-enable"
            checked={w.license.enable ?? false}
            onChange={(e) => setWorkspace({ ...w, license: { ...w.license, enable: e.target.checked } })}
          />
          <label htmlFor="license-enable" className="text-sm">Mostrar licencia en los posts</label>
        </div>
        <input
          className="w-full bg-transparent border-b border-[var(--line-divider)] py-2"
          placeholder="Nombre de la licencia (ej. CC BY-NC-SA 4.0)"
          value={w.license.name ?? ""}
          onChange={(e) => setWorkspace({ ...w, license: { ...w.license, name: e.target.value } })}
        />
        <input
          className="w-full bg-transparent border-b border-[var(--line-divider)] py-2 mt-2"
          placeholder="URL de la licencia"
          value={w.license.url ?? ""}
          onChange={(e) => setWorkspace({ ...w, license: { ...w.license, url: e.target.value } })}
        />
      </section>

      <section className="card-base p-4">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">About</div>
        <Editor
          initialValue={w.pages.about ?? ""}
          onReady={(getMd) => (aboutGetMdRef.current = getMd)}
        />
      </section>

      <div className="flex justify-end">
        <button className="btn-regular btn-plain px-6 h-10 rounded-[var(--radius-large)]" type="button" onClick={save}>
          Guardar
        </button>
      </div>
    </div>
  );
}