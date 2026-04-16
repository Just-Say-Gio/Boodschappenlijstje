"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings, Plus, ShoppingCart, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfielDialog } from "@/components/profiel-dialog";
import {
  getLocalProfile,
  setLocalProfile,
  type LocalProfile,
} from "@/lib/profile";
import { createProfile, getAllLists, getAllArchivedLists } from "@/lib/actions";
import { toast } from "sonner";

interface ListSummary {
  id: string;
  name: string;
  itemCount: number;
  checkedCount: number;
  memberCount: number;
  members: Array<{ emoji: string; color: string }>;
  creator: { name: string; emoji: string; color: string } | null;
  updatedAt: string;
}

const APP_URL = "https://boodschappenlijstje-production.up.railway.app";

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"actief" | "archief">("actief");
  const [mounted, setMounted] = useState(false);
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [archivedLists, setArchivedLists] = useState<ListSummary[]>([]);

  useEffect(() => {
    setMounted(true);
    const stored = getLocalProfile();
    if (stored) {
      setProfile(stored);
    } else {
      // Auto-open profile dialog if no profile
      setShowProfileDialog(true);
    }
    loadLists();
  }, []);

  function mapListData(l: Awaited<ReturnType<typeof getAllLists>>[number]): ListSummary {
    return {
      id: l.id,
      name: l.name,
      itemCount: l.items.length,
      checkedCount: l.items.filter((i) => i.checked).length,
      memberCount: l.members.length,
      members: l.members.map((m) => ({
        emoji: m.profile.emoji,
        color: m.profile.color,
      })),
      creator: l.creator
        ? { name: l.creator.name, emoji: l.creator.emoji, color: l.creator.color }
        : null,
      updatedAt: l.updatedAt
        ? new Date(l.updatedAt).toLocaleDateString("nl-NL")
        : "zojuist",
    };
  }

  async function loadLists() {
    try {
      const allLists = await getAllLists();
      setLists(allLists.map(mapListData));
    } catch {
      // Database not available yet
    }
  }

  async function loadArchivedLists() {
    try {
      const allArchived = await getAllArchivedLists();
      setArchivedLists(allArchived.map(mapListData));
    } catch {
      // Database not available yet
    }
  }

  useEffect(() => {
    if (activeTab === "archief") {
      loadArchivedLists();
    }
  }, [activeTab]);

  const totalItemCount = lists.reduce((sum, l) => sum + l.itemCount, 0);

  const handleSaveProfile = async (name: string, emoji: string, color: string) => {
    try {
      const dbProfile = await createProfile(name, emoji, color);
      const newProfile: LocalProfile = {
        id: dbProfile.id,
        name: dbProfile.name,
        emoji: dbProfile.emoji,
        color: dbProfile.color,
      };
      setLocalProfile(newProfile);
      setProfile(newProfile);
      setShowProfileDialog(false);
    } catch {
      // If DB not available, create local-only profile
      const newProfile: LocalProfile = {
        id: crypto.randomUUID(),
        name,
        emoji,
        color,
      };
      setLocalProfile(newProfile);
      setProfile(newProfile);
      setShowProfileDialog(false);
    }
  };

  const handleNewList = (e: React.MouseEvent) => {
    if (!profile) {
      e.preventDefault();
      setShowProfileDialog(true);
    }
  };

  const handleShareWhatsApp = () => {
    const message = `🌴 Check onze Koh Samui boodschappenlijst! ${APP_URL}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      toast.success("Link gekopieerd!");
    } catch {
      toast.error("Kon de link niet kopiëren");
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-background">
        <ShoppingCart className="size-8 text-cyan-700 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-zinc-50">
      {/* Header with gradient */}
      <header className="gradient-header text-white pb-6 pt-4 px-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex items-center gap-3 ${lists.length === 1 ? "cursor-pointer" : ""}`}
            onClick={() => {
              if (lists.length === 1) {
                router.push(`/lijst/${lists[0].id}`);
              }
            }}
          >
            {/* Profile avatar */}
            {profile && (
              <div
                className="flex items-center justify-center rounded-full text-xl shadow-md"
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: profile.color,
                }}
              >
                {profile.emoji}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">
                {profile ? `Hoi, ${profile.name}!` : "🌴 Boodschappenlijstje"}
              </h1>
              <p className="text-sm text-white/80">
                {profile
                  ? totalItemCount > 0
                    ? `${totalItemCount} items op ${lists.length === 1 ? "je lijstje" : `${lists.length} lijstjes`}`
                    : "Wat staat er op je lijstje?"
                  : "Maak een profiel om mee te doen"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleShareWhatsApp}
              title="Deel via WhatsApp"
            >
              <MessageCircle className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() =>
                setShowProfileDialog(true)
              }
            >
              <Settings className="size-5" />
            </Button>
          </div>
        </div>

        {/* Banner if no profile */}
        {!profile && (
          <div className="bg-white/20 rounded-xl px-4 py-3 mb-4 text-center border border-white/30">
            <p className="text-sm font-medium text-white">
              Maak eerst een profiel aan om mee te doen!
            </p>
            <Button
              onClick={() => setShowProfileDialog(true)}
              className="mt-2 bg-white text-cyan-800 hover:bg-white/90 text-sm font-semibold h-9 px-6"
            >
              Profiel aanmaken
            </Button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Link href="/lijst/nieuw" className="flex-1" onClick={handleNewList}>
            <Button className="w-full h-12 bg-white text-cyan-800 hover:bg-white/90 font-semibold text-base shadow-md">
              <Plus className="size-5 mr-2" />
              Nieuwe lijst
            </Button>
          </Link>
          <Link href="/planning">
            <Button className="h-12 px-4 bg-white/20 text-white hover:bg-white/30 font-semibold text-base border border-white/30">
              🗓️ Planning
            </Button>
          </Link>
        </div>

        {/* Bangkok vote banner */}
        <Link href="/bangkok" className="block mt-3">
          <div
            className="rounded-xl px-4 py-3 text-center border-2 border-amber-300/40 shadow-md"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,165,116,0.95), rgba(232,184,75,0.95))",
            }}
          >
            <div className="text-base font-bold text-zinc-900">
              🇹🇭 Stem op Bangkok plan
            </div>
            <div className="text-xs text-zinc-800/80 mt-0.5">
              Thu 16 – Sun 19 Apr · Tap om mee te beslissen
            </div>
          </div>
        </Link>
      </header>

      {/* Tab Toggle */}
      <div className="px-4 pt-5 pb-2">
        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("actief")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "actief"
                ? "bg-cyan-700 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Actief
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("archief")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "archief"
                ? "bg-cyan-700 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Archief
          </button>
        </div>
      </div>

      {/* Lists */}
      <main className="flex-1 px-4 pb-24">
        <div className="flex flex-col gap-3 mt-2">
          {(() => {
            const displayLists = activeTab === "actief" ? lists : archivedLists;
            if (displayLists.length > 0) {
              return displayLists.map((list) => {
                const progress =
                  list.itemCount > 0
                    ? (list.checkedCount / list.itemCount) * 100
                    : 0;

                return (
                  <Link key={list.id} href={`/lijst/${list.id}`}>
                    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white">
                      <CardContent className="flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-base truncate">
                                {list.name}
                              </h3>
                              {activeTab === "archief" && (
                                <Badge variant="secondary" className="text-xs shrink-0">
                                  Gearchiveerd
                                </Badge>
                              )}
                            </div>
                            {list.creator && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                door {list.creator.emoji} {list.creator.name}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {list.updatedAt}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Users className="size-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {list.memberCount}
                            </span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>
                              {list.checkedCount} van {list.itemCount} items
                            </span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-600 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Member avatars */}
                        <div className="flex items-center gap-1">
                          {list.members.slice(0, 3).map((m, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-center rounded-full text-xs"
                              style={{
                                width: 24,
                                height: 24,
                                backgroundColor: m.color,
                                marginLeft: i > 0 ? -4 : 0,
                              }}
                            >
                              {m.emoji}
                            </div>
                          ))}
                          {list.memberCount > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs ml-1"
                            >
                              +{list.memberCount - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              });
            }
            return (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingCart className="size-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">
                  {activeTab === "archief"
                    ? "Geen gearchiveerde lijsten"
                    : "Nog geen lijsten. Maak er een aan!"}
                </p>
              </div>
            );
          })()}
        </div>
      </main>

      {/* Floating + button on mobile */}
      <div className="fixed bottom-6 right-6 z-20 sm:hidden">
        <Link href="/lijst/nieuw" onClick={handleNewList}>
          <Button
            size="icon"
            className="size-14 rounded-full bg-cyan-700 hover:bg-cyan-800 text-white shadow-lg"
          >
            <Plus className="size-6" />
          </Button>
        </Link>
      </div>

      {/* Profile Dialog */}
      <ProfielDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        onSave={handleSaveProfile}
        initialValues={
          profile
            ? {
                name: profile.name,
                emoji: profile.emoji,
                color: profile.color,
              }
            : undefined
        }
      />
    </div>
  );
}
