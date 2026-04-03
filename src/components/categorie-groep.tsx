"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ItemRow, type GroceryItem } from "@/components/item-row";

interface CategorieGroepProps {
  categoryName: string;
  categoryEmoji: string;
  items: GroceryItem[];
  onToggle: (id: string) => void;
}

export function CategorieGroep({
  categoryName,
  categoryEmoji,
  items,
  onToggle,
}: CategorieGroepProps) {
  const [isOpen, setIsOpen] = useState(true);
  const allChecked = items.length > 0 && items.every((item) => item.checked);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      {/* Category Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 w-full px-4 py-2.5 text-left transition-all duration-200 hover:bg-muted/50 ${
          allChecked ? "opacity-50" : ""
        }`}
      >
        <span className="text-lg">{categoryEmoji}</span>
        <span className="font-medium text-sm text-foreground flex-1">
          {categoryName}
        </span>
        <Badge variant="secondary" className="text-xs font-normal">
          {items.filter((i) => i.checked).length}/{items.length}
        </Badge>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "" : "-rotate-90"
          }`}
        />
      </button>

      {/* Items */}
      {isOpen && (
        <div className="pb-1">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
