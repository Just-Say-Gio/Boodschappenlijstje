"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { CATEGORIES } from "@/lib/categories";
import { CategorieGroep } from "@/components/categorie-groep";
import type { GroceryItem } from "@/components/item-row";

interface BoodschappenLijstProps {
  items: GroceryItem[];
  onToggle: (id: string) => void;
}

export function BoodschappenLijst({ items, onToggle }: BoodschappenLijstProps) {
  const allDone = items.length > 0 && items.every((item) => item.checked);
  const prevAllDone = useRef(false);

  useEffect(() => {
    if (allDone && !prevAllDone.current) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#16a34a", "#22c55e", "#4ade80", "#fbbf24", "#f97316"],
      });
    }
    prevAllDone.current = allDone;
  }, [allDone]);

  // Group items by category
  const grouped = new Map<string, GroceryItem[]>();
  for (const item of items) {
    const cat = item.category || "overig";
    if (!grouped.has(cat)) {
      grouped.set(cat, []);
    }
    grouped.get(cat)!.push(item);
  }

  // Sort groups by CATEGORIES order
  const categoryOrder = CATEGORIES.map((c) => c.id);
  const sortedEntries = [...grouped.entries()].sort((a, b) => {
    const ai = categoryOrder.indexOf(a[0]);
    const bi = categoryOrder.indexOf(b[0]);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;

  return (
    <div className="flex flex-col">
      {/* Category groups */}
      {sortedEntries.map(([catId, catItems]) => {
        const category = CATEGORIES.find((c) => c.id === catId);
        return (
          <CategorieGroep
            key={catId}
            categoryName={category?.name ?? "Overig"}
            categoryEmoji={category?.emoji ?? "📦"}
            items={catItems}
            onToggle={onToggle}
          />
        );
      })}

      {/* Progress footer */}
      <div className="px-4 py-4 text-center">
        {allDone ? (
          <p className="text-lg font-medium text-green-600">
            Alles gedaan! 🎉
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {checkedCount} van {totalCount} items afgevinkt
          </p>
        )}
      </div>
    </div>
  );
}
