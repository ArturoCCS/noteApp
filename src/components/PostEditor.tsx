/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
/** biome-ignore-all lint/suspicious/noAssignInExpressions: <explanation> */
/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */

import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import type { Post } from "@/types/Post";
import { Editor } from "./Editor";

interface Props {
	post: Post;
	workspaceSlug?: string;
}

export default function PostEditor({ post, workspaceSlug }: Props) {
	const getMarkdownRef = useRef<() => string>(() => "");

	const [title, setTitle] = useState(post.title ?? "");
	const [slug, setSlug] = useState(post.slug);
	const [description, setDescription] = useState(post.description ?? "");
	const [image, setImage] = useState(post.image ?? "");
	const [tags, setTags] = useState((post.tags ?? []).join(", "));
	const [category, setCategory] = useState(post.category ?? "");
	const [type, setType] = useState<"study" | "task" | "blog">(
		post.type ?? "study",
	);
	const [status, setStatus] = useState<"pending" | "done">(
		post.status ?? "pending",
	);

	async function handleSave() {
		if (!title.trim()) {
			alert("El título es obligatorio");
			return;
		}

		if (!slug.trim()) {
			alert("El slug es obligatorio");
			return;
		}

		const content = getMarkdownRef.current();
		if (!content.trim()) {
			alert("El contenido está vacío");
			return;
		}

		const words = content.trim().split(/\s+/).length;
		const minutes = Math.max(1, Math.ceil(words / 200));

		await fetch("/api/update-post", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				slug,
				title,
				description,
				image: image || null,
				tags: tags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
				category: category || null,
				content,
				words,
				minutes,
				type,
				status: type === "task" ? status : null,
			}),
		});

		alert("Post actualizado ✨");
		window.location.href = "/admin/";
	}

	const inputBase = `
    bg-transparent
    border-b border-[var(--line-divider)]
    py-2
    text-base
    text-black dark:text-white
    placeholder:text-black dark:placeholder:text-white
    placeholder:opacity-40
    outline-none
    transition-all duration-200
    focus:border-[var(--primary)]
  `;

	const labelBase = `
    text-xs
    font-semibold
    uppercase
    tracking-widest
    text-black/60 dark:text-white/60
  `;

	return (
		<div className="flex flex-col gap-8 max-w-[900px] mx-auto w-full">
			<div className="card-base px-8 py-7 flex flex-col gap-4">
				<input
					placeholder="Título del post"
					className="
            bg-transparent
            text-4xl md:text-5xl
            font-bold
            leading-tight
            outline-none
            text-black dark:text-white
            placeholder:text-black/40
            dark:placeholder:text-white/40
          "
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<div className="flex items-center gap-3 text-sm">
					<span className="text-black/40 dark:text-white/40">/</span>
					<input
						placeholder="slug-del-post"
						className="
              bg-transparent
              outline-none
              w-full
              text-black dark:text-white
              placeholder:text-black/60
              dark:placeholder:text-white/40
            "
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-2 pt-6 ">
					<label className={labelBase}>Tipo</label>
				</div>

				<div className="card-base px-1 pb-4 flex gap-4">
					{[
						{ value: "study", label: "Notas" },
						{ value: "task", label: "Pendiente" },
						{ value: "blog", label: "Blog" },
					].map((opt) => (
						<button
							key={opt.value}
							onClick={() => {
								setType(opt.value as any);
								if (opt.value !== "task") {
									setStatus("pending");
								}
							}}
							className={`
                    btn-regular
                    px-10
                    h-9
                    rounded-[var(--radius-large)]
                    font-semibold
                    tracking-wide
                    transition-all
                    hover:scale-[1.03]
                    active:scale-95
                    ${
											type === opt.value
												? "bg-[var(--primary)] text-white"
												: "bg-black/5 dark:bg-white/10"
										}
                `}
						>
							{opt.label}
						</button>
					))}
				</div>

				{type === "task" && (
					<div>
						<div className="flex flex-col pb-4 gap-2">
							<label className={labelBase}>Estado</label>
						</div>
						<div className="flex gap-4">
							{["pending", "done"].map((s) => (
								<button
									key={s}
									onClick={() => setStatus(s as any)}
									className={`  
                            btn-regular
                            px-10
                            h-9
                            rounded-[var(--radius-large)]
                            font-semibold
                            tracking-wide
                            transition-all
                            hover:scale-[1.03]
                            active:scale-95 ${
															status === s
																? "bg-[var(--primary)] text-white"
																: "bg-black/5 dark:bg-white/10"
														}`}
								>
									{s === "pending" ? "Pendiente" : "Completado"}
								</button>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="card-base px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
				<div className="flex flex-col gap-2">
					<label className={labelBase}>Descripción</label>
					<input
						placeholder="Breve resumen del post…"
						className={inputBase}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label className={labelBase}>Imagen destacada</label>
					<input
						placeholder="https://..."
						className={inputBase}
						value={image}
						onChange={(e) => setImage(e.target.value)}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label className={labelBase}>Etiquetas</label>
					<input
						placeholder="React, Diseño, IA…"
						className={inputBase}
						value={tags}
						onChange={(e) => setTags(e.target.value)}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label className={labelBase}>Categoría</label>
					<input
						placeholder="Guías, Notas, Opinión…"
						className={inputBase}
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					/>
				</div>
			</div>

			<div className="card-base px-6 py-6">
				<Editor
					initialValue={post.content ?? ""}
					onReady={(getMd) => (getMarkdownRef.current = getMd)}
				/>
			</div>

			<div className="flex justify-end gap-4 pt-6 pb-12">
			<div className="flex flex-col md:flex-row justify-between mb-4 gap-4 overflow-hidden w-full onload-animation">
				<a
					href="/admin/"
					className="w-full font-bold overflow-hidden active:scale-95"
				>
					<div className="btn-card rounded-2xl w-full h-[3.75rem] px-4 flex items-center justify-start gap-4">
						<Icon
							name="material-symbols:chevron-left-rounded"
							className="text-[2rem] text-[var(--primary)]"
							icon={""}
						/>
						<div className="text-black/75 dark:text-white/75">
							Volver al admin
						</div>
					</div>
				</a>
				{workspaceSlug && (
					<a
						href={`/w/${workspaceSlug}/posts/${post.slug}/`}
						target="_blank"
						rel="noopener noreferrer"
						className="w-full font-bold overflow-hidden active:scale-95"
					>
						<div className="btn-card rounded-2xl w-full h-[3.75rem] px-4 flex items-center justify-start gap-4">
							<Icon
								name="material-symbols:open-in-new"
								className="text-[1.5rem] text-[var(--primary)]"
								icon={""}
							/>
							<div className="text-black/75 dark:text-white/75">
								Ver público
							</div>
						</div>
					</a>
				)}
				<button
					onClick={handleSave}
					className="
            btn-regular
            px-10
            h-15
            rounded-[var(--radius-large)]
            font-semibold
            tracking-wide
            transition-all
            hover:scale-[1.03]
            active:scale-95
          "
				>
					Guardar
				</button>
			</div>
		</div>
	</div>
	);
}
