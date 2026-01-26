import { useState } from "react";

interface Card {
  front: string;
  back: string;
}

export default function Flashcards({ cards }: { cards: Card[] }) {
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  if (!cards.length) {
    return <p className="text-sm opacity-60">No hay tarjetas aún.</p>;
  }

  const card = cards[index];

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onClick={() => setFlip(!flip)}
        className="cursor-pointer w-full max-w-xl min-h-[160px] p-6 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-center font-semibold"
      >
        {flip ? card.back : card.front}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setFlip(false);
            setIndex((i) => Math.max(0, i - 1));
          }}
          disabled={index === 0}
          className="btn-regular px-4 h-9"
        >
          ←
        </button>
        <button
          onClick={() => {
            setFlip(false);
            setIndex((i) => Math.min(cards.length - 1, i + 1));
          }}
          disabled={index === cards.length - 1}
          className="btn-regular px-4 h-9"
        >
          →
        </button>
      </div>
    </div>
  );
}
