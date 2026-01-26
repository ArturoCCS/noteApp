import { useState } from "react";

interface Question {
  q: string;
  a: string;
}

export default function StudyQuestions({ questions }: { questions: Question[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (!questions.length) {
    return <p className="text-sm opacity-60">No hay preguntas generadas.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {questions.map((item, i) => (
        <div key={i} className="rounded-lg bg-black/5 dark:bg-white/10 p-4">
          <button
            className="font-semibold text-left w-full"
            onClick={() => setOpen(open === i ? null : i)}
          >
            ❓ {item.q}
          </button>
          {open === i && (
            <div className="mt-2 text-sm opacity-80">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
