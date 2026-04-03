"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROFILE_COLORS, PROFILE_EMOJIS } from "@/lib/profile";

interface ProfielDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, emoji: string, color: string) => void;
  initialValues?: { name?: string; emoji?: string; color?: string };
}

export function ProfielDialog({
  open,
  onOpenChange,
  onSave,
  initialValues,
}: ProfielDialogProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [selectedEmoji, setSelectedEmoji] = useState(
    initialValues?.emoji ?? PROFILE_EMOJIS[0]
  );
  const [selectedColor, setSelectedColor] = useState(
    initialValues?.color ?? PROFILE_COLORS[0]
  );

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), selectedEmoji, selectedColor);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Welkom bij Boodschappenlijstje!
          </DialogTitle>
          <DialogDescription className="text-center">
            Maak je profiel aan zodat anderen je herkennen.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Live Preview */}
          <div className="flex justify-center">
            <div
              className="flex items-center justify-center rounded-full text-3xl shadow-lg transition-all duration-300"
              style={{
                width: 72,
                height: 72,
                backgroundColor: selectedColor,
              }}
            >
              {selectedEmoji}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="profiel-naam"
              className="text-sm font-medium text-foreground"
            >
              Hoe heet je?
            </label>
            <Input
              id="profiel-naam"
              placeholder="Je naam..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 text-base"
              autoComplete="given-name"
            />
          </div>

          {/* Emoji Grid */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Kies een emoji
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PROFILE_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`flex items-center justify-center rounded-lg text-2xl transition-all duration-150 hover:scale-110 ${
                    selectedEmoji === emoji
                      ? "ring-2 ring-green-500 ring-offset-2 bg-green-50"
                      : "hover:bg-muted"
                  }`}
                  style={{ width: 48, height: 48 }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Grid */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Kies een kleur
            </label>
            <div className="grid grid-cols-6 gap-2 justify-items-center">
              {PROFILE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-full transition-all duration-150 hover:scale-110 ${
                    selectedColor === color
                      ? "ring-2 ring-green-500 ring-offset-2"
                      : ""
                  }`}
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: color,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full h-10 bg-green-600 hover:bg-green-700 text-white text-base font-medium"
          >
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
