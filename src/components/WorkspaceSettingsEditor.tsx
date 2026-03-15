import { Editor } from "@components/Editor";
import { useRef, useState } from "react";
import type { WorkspaceConfig } from "@/types/workspace";

interface Props {
	initialConfig: WorkspaceConfig;
	workspaceSlug: string;
}

type Section =
	| "site"
	| "banner"
	| "profile"
	| "navbar"
	| "license"
	| "code"
	| "about";

export default function WorkspaceSettingsEditor({
	initialConfig,
	workspaceSlug,
}: Props) {
	const [config, setConfig] = useState<WorkspaceConfig>(initialConfig);
	const [activeSection, setActiveSection] = useState<Section>("site");
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const getAboutMarkdownRef = useRef<() => string>(() => "");

	const sections: { id: Section; label: string; icon: string }[] = [
		{ id: "site", label: "Sitio", icon: "🌐" },
		{ id: "banner", label: "Banner", icon: "🖼️" },
		{ id: "profile", label: "Perfil", icon: "👤" },
		{ id: "navbar", label: "Navegación", icon: "🔗" },
		{ id: "license", label: "Licencia", icon: "📜" },
		{ id: "code", label: "Código", icon: "💻" },
		{ id: "about", label: "About", icon: "📝" },
	];

	async function handleSave() {
		setSaving(true);
		setError(null);

		const aboutContent = getAboutMarkdownRef.current();
		const updatedConfig = {
			...config,
			pages: { ...config.pages, about: aboutContent },
		};

		try {
			const res = await fetch("/api/workspace/update/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					site: updatedConfig.site,
					navBar: updatedConfig.navBar,
					profile: updatedConfig.profile,
					license: updatedConfig.license,
					expressiveCode: updatedConfig.expressiveCode,
					pages: updatedConfig.pages,
					isPublic: updatedConfig.isPublic,
				}),
			});

			if (!res.ok) {
				const { error: msg } = await res.json();
				setError(msg ?? "Error al guardar");
			} else {
				setConfig(updatedConfig);
				setSaved(true);
				setTimeout(() => setSaved(false), 3000);
			}
		} catch {
			setError("Error de red");
		} finally {
			setSaving(false);
		}
	}

	function updateSite(patch: Partial<typeof config.site>) {
		setConfig((c) => ({ ...c, site: { ...c.site, ...patch } }));
	}

	function updateBanner(patch: Partial<typeof config.site.banner>) {
		setConfig((c) => ({
			...c,
			site: { ...c.site, banner: { ...c.site.banner, ...patch } },
		}));
	}

	function updateBannerCredit(
		patch: Partial<typeof config.site.banner.credit>,
	) {
		setConfig((c) => ({
			...c,
			site: {
				...c.site,
				banner: {
					...c.site.banner,
					credit: { ...c.site.banner.credit, ...patch },
				},
			},
		}));
	}

	function updateProfile(patch: Partial<typeof config.profile>) {
		setConfig((c) => ({ ...c, profile: { ...c.profile, ...patch } }));
	}

	function addProfileLink() {
		setConfig((c) => ({
			...c,
			profile: {
				...c.profile,
				links: [...c.profile.links, { name: "", url: "", icon: "" }],
			},
		}));
	}

	function removeProfileLink(index: number) {
		setConfig((c) => ({
			...c,
			profile: {
				...c.profile,
				links: c.profile.links.filter((_, i) => i !== index),
			},
		}));
	}

	function updateProfileLink(
		index: number,
		patch: Partial<{ name: string; url: string; icon: string }>,
	) {
		setConfig((c) => {
			const links = [...c.profile.links];
			links[index] = { ...links[index], ...patch };
			return { ...c, profile: { ...c.profile, links } };
		});
	}

	function updateLicense(patch: Partial<typeof config.license>) {
		setConfig((c) => ({ ...c, license: { ...c.license, ...patch } }));
	}

	const inputClass =
		"w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 transition";
	const labelClass =
		"block text-xs font-semibold text-black/50 dark:text-white/50 mb-1 uppercase tracking-wide";
	const sectionClass = "flex flex-col gap-5";
	const fieldClass = "flex flex-col gap-1";

	const renderSection = () => {
		switch (activeSection) {
			case "site":
				return (
					<div className={sectionClass}>
						<h3 className="font-semibold text-base text-black/80 dark:text-white/80">
							Configuración del Sitio
						</h3>
						<div className={fieldClass}>
							<label className={labelClass}>Título del sitio</label>
							<input
								className={inputClass}
								value={config.site.title}
								onChange={(e) => updateSite({ title: e.target.value })}
							/>
						</div>
						<div className={fieldClass}>
							<label className={labelClass}>Subtítulo</label>
							<input
								className={inputClass}
								value={config.site.subtitle}
								onChange={(e) => updateSite({ subtitle: e.target.value })}
							/>
						</div>
						<div className={fieldClass}>
							<label className={labelClass}>Idioma</label>
							<select
								className={inputClass}
								value={config.site.lang}
								onChange={(e) =>
									updateSite({
										lang: e.target.value as typeof config.site.lang,
									})
								}
							>
								{(
									[
										"en",
										"es",
										"zh_CN",
										"zh_TW",
										"ja",
										"ko",
										"th",
										"vi",
										"tr",
										"id",
									] as const
								).map((l) => (
									<option key={l} value={l}>
										{l}
									</option>
								))}
							</select>
						</div>
						<div className={fieldClass}>
							<label className={labelClass}>Visibilidad pública</label>
							<label className="flex items-center gap-2 text-sm cursor-pointer">
								<input
									type="checkbox"
									checked={config.isPublic}
									onChange={(e) =>
										setConfig((c) => ({ ...c, isPublic: e.target.checked }))
									}
									className="rounded"
								/>
								<span className="text-black/70 dark:text-white/70">
									Workspace visible públicamente en{" "}
									<code className="text-[var(--primary)] font-mono text-xs">
										/w/{workspaceSlug}
									</code>
								</span>
							</label>
						</div>
					</div>
				);

			case "banner":
				return (
					<div className={sectionClass}>
						<h3 className="font-semibold text-base text-black/80 dark:text-white/80">
							Banner
						</h3>
						<div className={fieldClass}>
							<label className="flex items-center gap-2 text-sm cursor-pointer">
								<input
									type="checkbox"
									checked={config.site.banner.enable}
									onChange={(e) => updateBanner({ enable: e.target.checked })}
									className="rounded"
								/>
								<span className={labelClass + " mb-0"}>Mostrar banner</span>
							</label>
						</div>
						<div className={fieldClass}>
							<label className={labelClass}>URL de imagen del banner</label>
							<input
								className={inputClass}
								placeholder="https://..."
								value={config.site.banner.src}
								onChange={(e) => updateBanner({ src: e.target.value })}
							/>
						</div>
						<div className={fieldClass}>
							<label className={labelClass}>Posición</label>
							<select
								className={inputClass}
								value={config.site.banner.position ?? "center"}
								onChange={(e) =>
									updateBanner({
										position: e.target.value as "top" | "center" | "bottom",
									})
								}
							>
								<option value="top">top</option>
								<option value="center">center</option>
								<option value="bottom">bottom</option>
							</select>
						</div>
						<div className="border-t border-black/5 dark:border-white/5 pt-4 flex flex-col gap-4">
							<label className="flex items-center gap-2 text-sm cursor-pointer">
								<input
									type="checkbox"
									checked={config.site.banner.credit.enable}
									onChange={(e) =>
										updateBannerCredit({ enable: e.target.checked })
									}
									className="rounded"
								/>
								<span className={labelClass + " mb-0"}>Mostrar crédito</span>
							</label>
							<div className={fieldClass}>
								<label className={labelClass}>Texto del crédito</label>
								<input
									className={inputClass}
									value={config.site.banner.credit.text}
									onChange={(e) => updateBannerCredit({ text: e.target.value })}
								/>
							</div>
							<div className={fieldClass}>
								<label className={labelClass}>URL del crédito</label>
								<input
									className={inputClass}
									placeholder="https://..."
									value={config.site.banner.credit.url ?? ""}
									onChange={(e) => updateBannerCredit({ url: e.target.value })}
								/>
							</div>
						</div>
					</div>
				);

			case "profile":
				return (
					<div className={sectionClass}>
						<h3 className="font-semibold text-base text-black/80 dark:text-white/80">
							Perfil
						</h3>
						<div className={fieldClass}>
							<label className={labelClass}>URL del avatar</label>
							<input
								className={inputClass}
								placeholder="https://..."
								value={config.profile.avatar ?? ""}
								onChange={(e) => updateProfile({ avatar: e.target.value })}
							/>
						</div>
						<div className={fieldClass}>
							<label className={labelClass}>Nombre</label>
							<input
								className={inputClass}
								value={config.profile.name}
								onChange={(e) => updateProfile({ name: e.target.value })}
							/>
						</div>
						<div className={fieldClass}>
							<label className={labelClass}>Bio</label>
							<textarea
								className={inputClass + " resize-none h-20"}
								value={config.profile.bio ?? ""}
								onChange={(e) => updateProfile({ bio: e.target.value })}
							/>
						</div>
						<div className="flex flex-col gap-3">
							<div className="flex items-center justify-between">
								<label className={labelClass + " mb-0"}>Links sociales</label>
								<button
									type="button"
									onClick={addProfileLink}
									className="text-xs px-3 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition font-medium"
								>
									+ Agregar link
								</button>
							</div>
							{config.profile.links.map((link, i) => (
								<div
									key={i}
									className="flex flex-col gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5"
								>
									<div className="flex gap-2">
										<input
											className={inputClass + " flex-1"}
											placeholder="Nombre"
											value={link.name}
											onChange={(e) =>
												updateProfileLink(i, { name: e.target.value })
											}
										/>
										<button
											type="button"
											onClick={() => removeProfileLink(i)}
											className="shrink-0 h-9 w-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition flex items-center justify-center text-sm"
										>
											✕
										</button>
									</div>
									<input
										className={inputClass}
										placeholder="URL"
										value={link.url}
										onChange={(e) =>
											updateProfileLink(i, { url: e.target.value })
										}
									/>
									<input
										className={inputClass}
										placeholder="Icono (ej: fa6-brands:github)"
										value={link.icon}
										onChange={(e) =>
											updateProfileLink(i, { icon: e.target.value })
										}
									/>
								</div>
							))}
							{config.profile.links.length === 0 && (
								<p className="text-sm text-black/30 dark:text-white/30 italic">
									Sin links sociales. Haz clic en "Agregar link" para añadir
									uno.
								</p>
							)}
						</div>
					</div>
				);

			case "navbar":
				return (
					<div className={sectionClass}>
						<h3 className="font-semibold text-base text-black/80 dark:text-white/80">
							Navegación
						</h3>
						<p className="text-sm text-black/50 dark:text-white/50">
							Los links de navegación del workspace. Puedes usar números para
							presets (0=Inicio, 1=Archivo, 2=Editor, 3=About) o definir links
							personalizados.
						</p>
						<div className="flex flex-col gap-2">
							{config.navBar.links.map((link, i) => {
								const isPreset = typeof link === "number";
								const presetLabels: Record<number, string> = {
									0: "Inicio",
									1: "Archivo",
									2: "Editor",
									3: "About",
								};
								return (
									<div
										key={i}
										className="flex items-center gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5"
									>
										{isPreset ? (
											<span className="flex-1 text-sm text-black/60 dark:text-white/60 font-medium">
												Preset: {presetLabels[link as number] ?? link}
											</span>
										) : (
											<div className="flex flex-col gap-1.5 flex-1">
												<input
													className={inputClass}
													placeholder="Nombre"
													value={(link as { name: string }).name}
													onChange={(e) => {
														const links = [...config.navBar.links];
														links[i] = {
															...(link as object),
															name: e.target.value,
														} as typeof link;
														setConfig((c) => ({
															...c,
															navBar: { links },
														}));
													}}
												/>
												<input
													className={inputClass}
													placeholder="URL"
													value={(link as { url: string }).url}
													onChange={(e) => {
														const links = [...config.navBar.links];
														links[i] = {
															...(link as object),
															url: e.target.value,
														} as typeof link;
														setConfig((c) => ({
															...c,
															navBar: { links },
														}));
													}}
												/>
											</div>
										)}
										<button
											type="button"
											onClick={() => {
												const links = config.navBar.links.filter(
													(_, idx) => idx !== i,
												);
												setConfig((c) => ({ ...c, navBar: { links } }));
											}}
											className="shrink-0 h-9 w-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition flex items-center justify-center text-sm"
										>
											✕
										</button>
									</div>
								);
							})}
						</div>
						<div className="flex gap-2 flex-wrap">
							<button
								type="button"
								onClick={() =>
									setConfig((c) => ({
										...c,
										navBar: {
											links: [
												...c.navBar.links,
												{ name: "Nuevo link", url: "/", external: false },
											],
										},
									}))
								}
								className="text-xs px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition font-medium"
							>
								+ Link personalizado
							</button>
						</div>
					</div>
				);

			case "license":
				return (
					<div className={sectionClass}>
						<h3 className="font-semibold text-base text-black/80 dark:text-white/80">
							Licencia
						</h3>
						<label className="flex items-center gap-2 text-sm cursor-pointer">
							<input
								type="checkbox"
								checked={config.license.enable}
								onChange={(e) => updateLicense({ enable: e.target.checked })}
								className="rounded"
							/>
							<span className="text-black/70 dark:text-white/70">
								Mostrar licencia en los posts
							</span>
						</label>
						<div className={fieldClass}>
							<label className={labelClass}>Nombre de la licencia</label>
							<input
								className={inputClass}
								value={config.license.name}
								onChange={(e) => updateLicense({ name: e.target.value })}
							/>
						</div>
						<div className={fieldClass}>
							<label className={labelClass}>URL de la licencia</label>
							<input
								className={inputClass}
								placeholder="https://..."
								value={config.license.url}
								onChange={(e) => updateLicense({ url: e.target.value })}
							/>
						</div>
					</div>
				);

			case "code":
				return (
					<div className={sectionClass}>
						<h3 className="font-semibold text-base text-black/80 dark:text-white/80">
							Bloques de Código
						</h3>
						<div className={fieldClass}>
							<label className={labelClass}>Tema de Expressive Code</label>
							<select
								className={inputClass}
								value={config.expressiveCode.theme}
								onChange={(e) =>
									setConfig((c) => ({
										...c,
										expressiveCode: { theme: e.target.value },
									}))
								}
							>
								{[
									"github-dark",
									"github-light",
									"dracula",
									"monokai",
									"nord",
									"one-dark-pro",
									"solarized-dark",
									"solarized-light",
									"vitesse-dark",
									"vitesse-light",
								].map((t) => (
									<option key={t} value={t}>
										{t}
									</option>
								))}
							</select>
						</div>
					</div>
				);

			case "about":
				return (
					<div className={sectionClass}>
						<h3 className="font-semibold text-base text-black/80 dark:text-white/80">
							Página About
						</h3>
						<p className="text-sm text-black/50 dark:text-white/50">
							Este contenido aparecerá en{" "}
							<code className="font-mono text-xs text-[var(--primary)]">
								/w/{workspaceSlug}/about
							</code>
						</p>
						<div className="card-base px-6 py-6">
							<Editor
								initialValue={config.pages?.about ?? ""}
								onReady={(getMd) => (getAboutMarkdownRef.current = getMd)}
							/>
						</div>
					</div>
				);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Section tabs */}
			<div className="flex flex-wrap gap-2">
				{sections.map((s) => (
					<button
						key={s.id}
						type="button"
						onClick={() => setActiveSection(s.id)}
						className={`flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-medium transition ${
							activeSection === s.id
								? "bg-[var(--primary)] text-white"
								: "btn-plain"
						}`}
					>
						<span>{s.icon}</span>
						<span>{s.label}</span>
					</button>
				))}
			</div>

			{/* Section content */}
			<div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-6">
				{renderSection()}
			</div>

			{/* Status messages */}
			{error && (
				<div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
					⚠ {error}
				</div>
			)}
			{saved && (
				<div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">
					✓ Cambios guardados correctamente
				</div>
			)}

			{/* Save button */}
			<div className="flex justify-end">
				<button
					type="button"
					onClick={handleSave}
					disabled={saving}
					className="btn-plain px-8 h-11 rounded-xl font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{saving ? "Guardando…" : "Guardar cambios"}
				</button>
			</div>
		</div>
	);
}
