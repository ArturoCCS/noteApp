import { useMemo } from "react";

interface Props {
	content: string;
	type: "study" | "task" | "blog";
}

export default function EditorStudyTips({ content, type }: Props) {
	if (type !== "study") return null;

	const tips = useMemo(() => {
		const tips: string[] = [];

		const hasTitle = /^##\s+/m.test(content);
		const hasList = /^-\s+/m.test(content);
		const hasDefinition = /:\s+/.test(content);
		const length = content.trim().length;

		if (length === 0) {
			tips.push("✍️ Empieza con un título usando `## Tema`");
			return tips;
		}

		if (!hasTitle) {
			tips.push("💡 Usa `## Títulos` para generar tarjetas automáticamente");
		}

		if (!hasList) {
			tips.push("📌 Usa listas (`-`) para crear preguntas de estudio");
		}

		if (!hasDefinition) {
			tips.push("🧠 Define conceptos usando `Concepto: definición`");
		}

		if (hasTitle && hasList && hasDefinition) {
			tips.push(
				"🔥 Excelente estructura, este contenido generará muy buen material de estudio",
			);
		}

		return tips;
	}, [content, type]);

	if (!tips.length) return null;

	const textobase = `
        text-xs
        font-semibold
        uppercase
        tracking-widest
        text-black/60 dark:text-white/60
    `;

	return (
		<div className="card-base px-5 py-4 mt-4 text-sm">
			<div className={textobase}>Tips para estudiar</div>
			<ul className={textobase}>
				{tips.map((tip, i) => (
					<li key={i}>{tip}</li>
				))}
			</ul>
		</div>
	);
}
