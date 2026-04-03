"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getLocalProfile } from "@/lib/profile";
import { createList } from "@/lib/actions";

const QUICK_SUGGESTIONS = [
  "Weekboodschappen",
  "Feestje",
  "BBQ",
  "Avondeten",
];

export default function NieuweLijstPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || creating) return;
    setCreating(true);
    try {
      const profile = getLocalProfile();
      if (!profile) {
        router.push("/");
        return;
      }
      const list = await createList(name.trim(), profile.id);
      router.push(`/lijst/${list.id}`);
    } catch {
      setCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Nieuwe lijst</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-md mx-auto flex flex-col gap-6">
          {/* List name input */}
          <div className="space-y-2">
            <label
              htmlFor="lijst-naam"
              className="text-sm font-medium text-foreground"
            >
              Naam van de lijst
            </label>
            <Input
              id="lijst-naam"
              placeholder="Bijv. Weekboodschappen, BBQ, Feestje..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 text-lg px-4"
              autoFocus
            />
          </div>

          {/* Quick suggestion chips */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Snel kiezen:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setName(suggestion)}
                  className={`px-4 py-2 text-sm rounded-full border transition-all duration-150 ${
                    name === suggestion
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Create button */}
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || creating}
            className="h-12 text-base font-medium bg-green-600 hover:bg-green-700 text-white w-full"
          >
            Aanmaken
          </Button>
        </div>
      </main>
    </div>
  );
}
