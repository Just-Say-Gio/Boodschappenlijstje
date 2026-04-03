"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string | null;
  category: string;
  checked: boolean;
  addedBy: { emoji: string; color: string };
  checkedBy?: { emoji: string; color: string };
}

interface ItemRowProps {
  item: GroceryItem;
  onToggle: (id: string) => void;
}

export function ItemRow({ item, onToggle }: ItemRowProps) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
        item.checked ? "opacity-50" : ""
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        className="flex items-center justify-center shrink-0"
      >
        <Checkbox
          checked={item.checked}
          onCheckedChange={() => onToggle(item.id)}
          className="size-6 rounded-md data-checked:bg-green-600 data-checked:border-green-600"
        />
      </button>

      {/* Item Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-base truncate transition-all duration-200 ${
              item.checked ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {item.name}
          </span>
          {item.quantity && (
            <Badge variant="secondary" className="shrink-0 text-xs font-normal">
              {item.quantity}
            </Badge>
          )}
        </div>
      </div>

      {/* Added-by avatar */}
      <div
        className="flex items-center justify-center rounded-full shrink-0 text-xs"
        style={{
          width: 28,
          height: 28,
          backgroundColor: item.checked && item.checkedBy
            ? item.checkedBy.color
            : item.addedBy.color,
        }}
        title={item.checked ? "Afgevinkt" : "Toegevoegd"}
      >
        {item.checked && item.checkedBy
          ? item.checkedBy.emoji
          : item.addedBy.emoji}
      </div>
    </div>
  );
}
