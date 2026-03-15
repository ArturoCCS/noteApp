import { useMemo, useState } from "react";
import Flashcards from "./Flashcards";
import StudyQuestions from "./StudyQuestions";
import StudySummary from "./StudySummary";

type TabProps = {
	label: string;
	active: boolean;
	onClick: () => void;
};

function Tab({ label, active, onClick }: TabProps) {
	return (
		<button
			className={`px-3 py-1 rounded ${active ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
			onClick={onClick}
			type="button"
		>
			{label}
		</button>
	);
}

export default function StudyTools({ content }: { content: string }) {
	const [active, setActive] = useState<"summary" | "flashcards" | "questions">(
		"summary",
	);

	const parsed = useMemo(() => parseStudyMarkdown(content), [content]);

	if (!content.trim()) {
		return (
			<div className="card-base p-6 mt-8 text-sm opacity-60">
				✍️ Escribe contenido para activar las herramientas de estudio.
			</div>
		);
	}

	return (
		<div className="card-base px-6 py-6 mt-10">
			<p className="text-xs opacity-60 mb-4">
				💡 Tip: Usa títulos <code>##</code> y listas para mejores resultados
			</p>

			<div className="flex gap-3 mb-6">
				<Tab
					label={`Resumen (${parsed.summary.length})`}
					active={active === "summary"}
					onClick={() => setActive("summary")}
				/>
				<Tab
					label={`Tarjetas (${parsed.flashcards.length})`}
					active={active === "flashcards"}
					onClick={() => setActive("flashcards")}
				/>
				<Tab
					label={`Preguntas (${parsed.questions.length})`}
					active={active === "questions"}
					onClick={() => setActive("questions")}
				/>
			</div>

			{active === "summary" && <StudySummary bullets={parsed.summary} />}
			{active === "flashcards" && <Flashcards cards={parsed.flashcards} />}
			{active === "questions" && (
				<StudyQuestions questions={parsed.questions} />
			)}
		</div>
	);
}

export function parseStudyMarkdown(md: string) {
	const lines = md.split("\n");

	const summary: string[] = [];
	const flashcards: { front: string; back: string }[] = [];
	const questions: { q: string; a: string }[] = [];

	let currentSection = "";
	let buffer: string[] = [];

	const flushSection = () => {
		if (!currentSection || !buffer.length) return;

		const text = buffer.join(" ").trim();

		summary.push(text.slice(0, 180));

		flashcards.push({
			front: currentSection,
			back: text,
		});

		questions.push(
			{ q: `¿Qué es ${currentSection}?`, a: text },
			{ q: `¿Para qué sirve ${currentSection}?`, a: text },
		);

		buffer = [];
	};

	for (const line of lines) {
		if (line.startsWith("## ")) {
			flushSection();
			currentSection = line.replace("## ", "").trim();
		} else if (line.startsWith("- ")) {
			buffer.push(line.replace("- ", ""));
		} else if (line.includes(":")) {
			const [term, def] = line.split(":");
			flashcards.push({
				front: term.trim(),
				back: def.trim(),
			});
		} else if (line.trim()) {
			buffer.push(line.trim());
		}
	}

	flushSection();

	return { summary, flashcards, questions };
}
