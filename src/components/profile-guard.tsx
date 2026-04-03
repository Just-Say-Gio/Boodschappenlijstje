"use client";

import { useState, useEffect } from "react";
import { ProfielDialog } from "@/components/profiel-dialog";
import { getLocalProfile, setLocalProfile, type LocalProfile } from "@/lib/profile";
import { createProfile } from "@/lib/actions";

export function ProfileGuard({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getLocalProfile();
    if (stored) {
      setProfile(stored);
    } else {
      setShowDialog(true);
    }
  }, []);

  const handleSave = async (name: string, emoji: string, color: string) => {
    try {
      const dbProfile = await createProfile(name, emoji, color);
      const local: LocalProfile = { id: dbProfile.id, name: dbProfile.name, emoji: dbProfile.emoji, color: dbProfile.color };
      setLocalProfile(local);
      setProfile(local);
      setShowDialog(false);
    } catch {
      const local: LocalProfile = { id: crypto.randomUUID(), name, emoji, color };
      setLocalProfile(local);
      setProfile(local);
      setShowDialog(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {children}
      <ProfielDialog open={showDialog} onOpenChange={setShowDialog} onSave={handleSave} />
    </>
  );
}
