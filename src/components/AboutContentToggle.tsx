import { Editor } from "@components/Editor";
import { useRef, useState } from "react";

interface Props {
	initialContent: string;
	workspaceSlug?: string;
}

export default function AboutInlineEditor({
	initialContent,
	workspaceSlug,
}: Props) {
	const [isEditing, setIsEditing] = useState(false);
	const [content, setContent] = useState(initialContent);
	const getMarkdownRef = useRef<() => string>(() => "");

	async function handleSave() {
		const newContent = getMarkdownRef.current();

		if (!newContent.trim()) {
			alert("El contenido está vacío");
			return;
		}

		if (workspaceSlug) {
			// Save to the workspace document via the workspace update API
			await fetch("/api/workspace/update/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ pages: { about: newContent } }),
			});
		} else {
			await fetch("/api/update-about/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: newContent }),
			});
		}

		setContent(newContent);
		setIsEditing(false);
	}

	return (
		<div className="flex flex-col gap-4">
			{isEditing && (
				<div className="card-base px-6 py-6">
					<Editor
						initialValue={content}
						onReady={(getMd) => (getMarkdownRef.current = getMd)}
					/>
				</div>
			)}

			<div className="flex justify-end gap-3">
				{!isEditing ? (
					<button
						onClick={() => setIsEditing(true)}
						className="
              btn-plain
              btn-regular
              px-6
              h-10
              rounded-[var(--radius-large)]
              text-sm
            "
					>
						Editar
					</button>
				) : (
					<>
						<button
							onClick={() => setIsEditing(false)}
							className="
                px-6
                h-10
                rounded-[var(--radius-large)]
                text-sm
                bg-[var(--btn-plain-bg-hover)]
                hover:bg-[var(--btn-plain-bg-active)]
                background: [var(--deep-text)]
                btn-regular
              "
						>
							Cancelar
						</button>

						<button
							onClick={handleSave}
							className="
                btn-regular
                btn-plain
                px-6
                h-10
                rounded-[var(--radius-large)]
                text-sm
              "
						>
							Guardar
						</button>
					</>
				)}
			</div>
		</div>
	);
}
