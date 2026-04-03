"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getLocalProfile,
  setLocalProfile,
  PROFILE_COLORS,
  PROFILE_EMOJIS,
  type LocalProfile,
} from "@/lib/profile";
import { createProfile, joinList } from "@/lib/actions";

interface JoinListClientProps {
  shareCode: string;
}

export function JoinListClient({ shareCode }: JoinListClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New profile form state
  const [name, setName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(PROFILE_EMOJIS[0]);
  const [selectedColor, setSelectedColor] = useState(PROFILE_COLORS[0]);

  useEffect(() => {
    const stored = getLocalProfile();
    if (stored) {
      setProfile(stored);
    }
    setLoading(false);
  }, []);

  async function handleJoin() {
    setJoining(true);
    setError(null);

    try {
      let currentProfile = profile;

      // Create profile if we don't have one
      if (!currentProfile) {
        if (!name.trim()) {
          setError("Vul je naam in");
          setJoining(false);
          return;
        }

        const newProfile = await createProfile(
          name.trim(),
          selectedEmoji,
          selectedColor
        );
        currentProfile = {
          id: newProfile.id,
          name: newProfile.name,
          emoji: newProfile.emoji,
          color: newProfile.color,
        };
        setLocalProfile(currentProfile);
        setProfile(currentProfile);
      }

      // Join the list
      const list = await joinList(shareCode, currentProfile.id);

      if (!list) {
        setError("Deze lijst bestaat niet");
        setJoining(false);
        return;
      }

      router.push(`/lijst/${list.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Er is iets misgegaan"
      );
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-muted-foreground">Laden...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 text-5xl">🛒</div>
          <CardTitle className="text-xl">Je bent uitgenodigd!</CardTitle>
          <CardDescription>
            Iemand heeft je uitgenodigd voor een boodschappenlijst
          </CardDescription>
        </CardHeader>

        <CardContent>
          {profile ? (
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex size-16 items-center justify-center rounded-full text-3xl"
                style={{ backgroundColor: profile.color + "20" }}
              >
                {profile.emoji}
              </div>
              <p className="text-base font-medium">
                Welkom terug, {profile.name}!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Je naam
                </label>
                <Input
                  id="name"
                  placeholder="Bijv. Anna"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Kies een emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROFILE_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`flex size-10 items-center justify-center rounded-lg text-xl transition-all ${
                        selectedEmoji === emoji
                          ? "bg-green-100 ring-2 ring-green-500 dark:bg-green-900/30"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Kies een kleur
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROFILE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`size-8 rounded-full transition-all ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-green-500"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            className="w-full bg-green-600 text-white hover:bg-green-700"
            onClick={handleJoin}
            disabled={joining || (!profile && !name.trim())}
          >
            {joining ? "Even geduld..." : "Doe mee!"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
