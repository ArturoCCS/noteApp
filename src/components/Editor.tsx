/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { useEffect, useRef, useState } from "react";

export type PostType = "study" | "task" | "blog";

interface EditorProps {
  initialValue?: string;
  type?: PostType;
  storageKey?: string;
  onReady?: (getMarkdown: () => string) => void;
  onChange?: (markdown: string) => void;
}

const templates: Record<PostType, string> = {
  blog: `# Título del post

Escribe aquí tu contenido
`,

  study: `# Tema de estudio

## Idea principal
Explica el concepto con tus propias palabras.

## Puntos clave
- 
- 
- 

## Ejemplo

## Resumen
`,

  task: `# Tarea

## Objetivo

## Pasos
- [ ] Paso 1
- [ ] Paso 2

## Notas
`
};

export function Editor({
  initialValue,
  type = "blog",
  storageKey,
  onReady,
  onChange
}: EditorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const crepeRef = useRef<Crepe | null>(null);

  const [words, setWords] = useState(0);
  const [minutes, setMinutes] = useState(1);

 useEffect(() => {
  if (!rootRef.current) return;

  crepeRef.current?.destroy();

  const saved = storageKey && localStorage.getItem(storageKey);

  const defaultValue =
    initialValue?.trim() ||
    saved ||
    templates[type];

  const crepe = new Crepe({
    root: rootRef.current,
    defaultValue
  });

  crepe.create();
  crepeRef.current = crepe;

  let ready = false;

  const safeUpdate = () => {
    if (!ready) return;

    const md = crepe.getMarkdown();
    const w = md.trim().split(/\s+/).filter(Boolean).length;

    setWords(w);
    setMinutes(Math.max(1, Math.ceil(w / 200)));

    storageKey && localStorage.setItem(storageKey, md);
    onChange?.(md);
  };

  requestAnimationFrame(() => {
    ready = true;
    safeUpdate();
    onReady?.(() => crepe.getMarkdown());
  });

  const interval = setInterval(safeUpdate, 1500);

  return () => {
    clearInterval(interval);
    crepe.destroy();
    crepeRef.current = null;
  };
}, [initialValue, type]);


  return (
    <div className="card-base border border-[var(--line-color)] bg-[var(--card-bg)] relative">

      <div className="flex justify-between text-xs px-4 py-2 border-b border-[var(--line-color)] opacity-70">
        <span className="  
          text-xs
          font-semibold
          tracking-widest
        text-black/60
        dark:text-white/60">{words} palabras · {minutes} min lectura</span>
        <span className="capitalize
          text-xs
          font-semibold
          tracking-widest
        text-black/60
        dark:text-white/60">{type}</span>
      </div>

      <div
        ref={rootRef}
        className="
          prose dark:prose-invert max-w-none
          [&_.milkdown]:bg-transparent
          [&_.milkdown]:text-[var(--deep-text)]
          [&_.milkdown-editor]:px-8
          [&_.milkdown-editor]:py-8
        "
      />
    </div>
  );
}
