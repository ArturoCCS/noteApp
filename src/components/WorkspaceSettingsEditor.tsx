import { useEffect, useRef, useState } from "react";
import { Editor } from "@/components/Editor";

export default function WorkspaceSettingsEditor() {
	const [loading, setLoading] = useState(true);
	const [workspace, setWorkspace] = useState<any>(null);

	const aboutGetMdRef = useRef<() => string>(() => "");

	useEffect(() => {
		(async () => {
			const res = await fetch("/api/workspace/get");
			const json = await res.json();
			setWorkspace(json.workspace ?? {});
			setLoading(false);
		})();
	}, []);

	if (loading) return <div className="opacity-70">Cargando...</div>;

	const w = workspace || {};
	w.site ||= {};
	w.profile ||= {};
	w.navBar ||= { links: [0, 1, 2, 3] };
	w.license ||= {};
	w.expressiveCode ||= {};
	w.pages ||= { about: { content: "" } };
	w.pages.about ||= { content: "" };

	async function save() {
		const updated = {
			...w,
			pages: {
				...w.pages,
				about: {
					...w.pages.about,
					content: aboutGetMdRef.current?.() ?? w.pages.about.content,
				},
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
				<div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">
					Sitio
				</div>
				<input
					className="w-full bg-transparent border-b border-[var(--line-divider)] py-2"
					placeholder="Título"
					value={w.site.title ?? ""}
					onChange={(e) => {
						const next = { ...w, site: { ...w.site, title: e.target.value } };
						setWorkspace(next);
					}}
				/>
				<input
					className="w-full bg-transparent border-b border-[var(--line-divider)] py-2 mt-2"
					placeholder="Subtítulo"
					value={w.site.subtitle ?? ""}
					onChange={(e) => {
						const next = {
							...w,
							site: { ...w.site, subtitle: e.target.value },
						};
						setWorkspace(next);
					}}
				/>
			</section>

			<section className="card-base p-4">
				<div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">
					Perfil
				</div>
				<input
					className="w-full bg-transparent border-b border-[var(--line-divider)] py-2"
					placeholder="Nombre"
					value={w.profile.name ?? ""}
					onChange={(e) =>
						setWorkspace({
							...w,
							profile: { ...w.profile, name: e.target.value },
						})
					}
				/>
				<input
					className="w-full bg-transparent border-b border-[var(--line-divider)] py-2 mt-2"
					placeholder="Avatar URL"
					value={w.profile.avatar ?? ""}
					onChange={(e) =>
						setWorkspace({
							...w,
							profile: { ...w.profile, avatar: e.target.value },
						})
					}
				/>
			</section>

			<section className="card-base p-4">
				<div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">
					About
				</div>
				<Editor
					initialValue={w.pages.about.content ?? ""}
					onReady={(getMd) => (aboutGetMdRef.current = getMd)}
				/>
			</section>

			<div className="flex justify-end">
				<button
					className="btn-regular btn-plain px-6 h-10 rounded-[var(--radius-large)]"
					onClick={save}
				>
					Guardar
				</button>
			</div>
		</div>
	);
}
