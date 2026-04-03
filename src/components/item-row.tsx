"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string | null;
  category: string;
  checked: boolean;
  addedBy: { emoji: string; color: string; name?: string };
  checkedBy?: { emoji: string; color: string; name?: string };
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
          className="size-6 rounded-md data-checked:bg-cyan-700 data-checked:border-cyan-700"
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
        {/* Show "checked by" info when item is checked */}
        {item.checked && item.checkedBy && (
          <p className="text-xs text-muted-foreground mt-0.5">
            ✓ Afgevinkt door {item.checkedBy.emoji} {item.checkedBy.name || ""}
          </p>
        )}
      </div>

      {/* Added-by avatar - bigger, with name on hover */}
      <div
        className="flex items-center gap-1.5 shrink-0"
        title={
          item.checked && item.checkedBy
            ? `Afgevinkt door ${item.checkedBy.emoji} ${item.checkedBy.name || ""}`
            : `Toegevoegd door ${item.addedBy.emoji} ${item.addedBy.name || ""}`
        }
      >
        <div
          className="flex items-center justify-center rounded-full text-sm"
          style={{
            width: 32,
            height: 32,
            backgroundColor: item.checked && item.checkedBy
              ? item.checkedBy.color
              : item.addedBy.color,
          }}
        >
          {item.checked && item.checkedBy
            ? item.checkedBy.emoji
            : item.addedBy.emoji}
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline max-w-[60px] truncate">
          {item.checked && item.checkedBy
            ? item.checkedBy.name
            : item.addedBy.name}
        </span>
      </div>
    </div>
  );
}
