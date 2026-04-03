"use client";

export interface LocalProfile {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

const STORAGE_KEY = "boodschappen-profiel";

export function getLocalProfile(): LocalProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalProfile;
  } catch {
    return null;
  }
}

export function setLocalProfile(profile: LocalProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearLocalProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export const PROFILE_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
];

export const PROFILE_EMOJIS = [
  "🌴", "🥥", "🌺", "🍍", "🐚", "🌊", "☀️", "🏝️",
  "🦋", "🐠", "🌸", "🍹", "🦀", "🥭", "🐢", "🌻",
  "🦜", "🐬", "🌅", "🏄", "🤿", "🧉", "🫧", "🪸",
] as const;
