"use client";

import { useState, useRef, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { guessCategory, CATEGORIES } from "@/lib/categories";

interface ToevoegenDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, quantity?: string, category?: string) => void;
}

const MOCK_SUGGESTIONS = [
  "Melk",
  "Brood",
  "Eieren",
  "Kaas",
  "Boter",
  "Yoghurt",
  "Appels",
  "Bananen",
  "Tomaten",
  "Komkommer",
  "Kipfilet",
  "Gehakt",
  "Rijst",
  "Pasta",
  "Aardappelen",
  "Uien",
  "Koffie",
  "Thee",
  "Chips",
  "Chocolade",
];

export function ToevoegenDrawer({
  open,
  onOpenChange,
  onAdd,
}: ToevoegenDrawerProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Small delay to let the drawer animate open
      const t = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const detectedCategoryId = name.trim() ? guessCategory(name.trim()) : null;
  const detectedCategory = detectedCategoryId
    ? CATEGORIES.find((c) => c.id === detectedCategoryId)
    : null;

  const filteredSuggestions = name.trim().length >= 1
    ? MOCK_SUGGESTIONS.filter((s) =>
        s.toLowerCase().startsWith(name.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(
      name.trim(),
      quantity.trim() || undefined,
      detectedCategoryId ?? undefined
    );
    setName("");
    setQuantity("");
    // Keep drawer open for rapid entry
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setName(suggestion);
    inputRef.current?.focus();
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Item toevoegen</DrawerTitle>
          <DrawerDescription>
            Typ een item en druk op Enter om snel toe te voegen.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-4 pb-6">
          {/* Main input */}
          <div className="space-y-2">
            <Input
              ref={inputRef}
              placeholder="Wat heb je nodig?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 text-lg px-4"
            />

            {/* Autocomplete suggestions */}
            {filteredSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quantity input */}
          <Input
            placeholder="Hoeveelheid bv. 2 stuks, 500g"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-10"
          />

          {/* Detected category */}
          {detectedCategory && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Categorie:</span>
              <Badge variant="secondary" className="text-sm">
                {detectedCategory.emoji} {detectedCategory.name}
              </Badge>
            </div>
          )}

          {/* Add button */}
          <Button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="h-12 text-base font-medium bg-cyan-700 hover:bg-cyan-800 text-white"
          >
            <Plus className="size-5 mr-1" />
            Toevoegen
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
