/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
/** biome-ignore-all lint/suspicious/noAssignInExpressions: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import { useRef, useState } from "react";
import { Editor } from "./Editor";
import EditorStudyTips from "./EditorStudyTips";

export default function EditorForm() {
  const getMarkdownRef = useRef<() => string>(() => "");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"study" | "task" | "blog">("study");
  const [status, setStatus] = useState<"pending" | "done">("pending");
  const [liveContent, setLiveContent] = useState("");


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

    await fetch("/api/create-posts/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        description,
        image: image || null,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        category: category || null,
        content,
        type,
        status: type === "task" ? status : null,
        published: new Date().toISOString(),
        words,
        minutes,
      }),
    });

    
    window.location.href = "/";

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
          onChange={e => {
            setTitle(e.target.value);
            setSlug(
              e.target.value
                .toLowerCase()
                .replace(/[^\w]+/g, "-")
                .replace(/(^-|-$)/g, "")
            );
          }}
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
            onChange={e => setSlug(e.target.value)}
          />
      </div>
      <div className="card-base px-1 py-4 flex gap-4">
          {[
            { value: "study", label: "Notas" },
            { value: "task", label: "Pendiente" },
            { value: "blog", label: "Blog" },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setType(opt.value as any)}
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
                ${type === opt.value
                  ? "bg-[var(--primary)] text-white"
                  : "bg-black/5 dark:bg-white/10"}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-base px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

        <div className="flex flex-col gap-2">
          <label className={labelBase}>Descripción</label>
          <input
            placeholder="Breve resumen del post…"
            className={inputBase}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelBase}>Imagen destacada</label>
          <input
            placeholder="https://..."
            className={inputBase}
            value={image}
            onChange={e => setImage(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelBase}>Etiquetas</label>
          <input
            placeholder="React, Diseño, IA…"
            className={inputBase}
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelBase}>
            {type === "study" && "Clase / Materia"}
            {type === "blog" && "Categoría"}
            {type === "task" && "Área (opcional)"}
          </label>

          <input
            placeholder={
              type === "study"
                ? "IA, Matemáticas, React..."
                : type === "blog"
                ? "Guías, Opinión..."
                : "Escuela, Personal..."
            }
            className={inputBase}
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
        </div>


      </div>

      <div className="card-base px-6 py-6">
          <Editor
            onReady={(getMd) => (getMarkdownRef.current = getMd)}
            onChange={(md) => setLiveContent(md)}
          />
      </div>

      <EditorStudyTips content={liveContent} type={type} />
      

      <div className="flex justify-end pt-6 pb-12">
        <button
          onClick={handleSave}
          className="
            btn-regular
            px-10
            h-12
            rounded-[var(--radius-large)]
            font-semibold
            tracking-wide
            transition-all
            hover:scale-[1.03]
            active:scale-95
          "
        >
          Publicar
        </button>
      </div>

    </div>
  );
}
