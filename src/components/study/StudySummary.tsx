export default function StudySummary({ bullets }: { bullets: string[] }) {
  if (!bullets.length) {
    return <p className="text-sm opacity-60">No se pudo generar resumen.</p>;
  }

  return (
    <ul className="list-disc pl-6 space-y-2 text-sm">
      {bullets.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}
