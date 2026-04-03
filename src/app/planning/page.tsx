"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { getLocalProfile } from "@/lib/profile";
import {
  getAgendaTopics,
  addAgendaTopic,
  toggleAgendaTopic,
  updateAgendaNotes,
  removeAgendaTopic,
  ensureProfileInDb,
} from "@/lib/actions";

interface AgendaTopic {
  id: string;
  title: string;
  description: string | null;
  date: string;
  timeSlot: string | null;
  checked: boolean;
  notes: string | null;
  creator: { name: string; emoji: string; color: string } | null;
  checkedByProfile: { name: string; emoji: string } | null;
}

const TIME_SLOTS = [
  { value: "ochtend", label: "Ochtend", icon: "🌅" },
  { value: "middag", label: "Middag", icon: "☀️" },
  { value: "avond", label: "Avond", icon: "🌙" },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const days = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
  const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split("T")[0];
}

export default function PlanningPage() {
  const [topics, setTopics] = useState<AgendaTopic[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ id: string; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // New topic form
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTimeSlot, setNewTimeSlot] = useState<string | null>(null);

  const loadTopics = useCallback(async () => {
    try {
      const data = await getAgendaTopics();
      setTopics(
        data.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          date: t.date,
          timeSlot: t.timeSlot,
          checked: t.checked ?? false,
          notes: t.notes,
          creator: t.creator
            ? { name: t.creator.name, emoji: t.creator.emoji, color: t.creator.color }
            : null,
          checkedByProfile: t.checkedByProfile
            ? { name: t.checkedByProfile.name, emoji: t.checkedByProfile.emoji }
            : null,
        }))
      );
    } catch {
      // DB not available
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const profile = getLocalProfile();
    if (!profile) return;

    await ensureProfileInDb(profile.id, profile.name, profile.emoji, profile.color);
    await addAgendaTopic(
      newTitle.trim(),
      newDate,
      newDescription.trim() || null,
      newTimeSlot,
      profile.id
    );

    setNewTitle("");
    setNewDescription("");
    setNewTimeSlot(null);
    setDrawerOpen(false);
    loadTopics();
  };

  const handleToggle = async (topicId: string) => {
    // Optimistic
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, checked: !t.checked } : t))
    );
    const profile = getLocalProfile();
    if (profile) {
      await ensureProfileInDb(profile.id, profile.name, profile.emoji, profile.color);
      await toggleAgendaTopic(topicId, profile.id);
      loadTopics();
    }
  };

  const handleSaveNotes = async (topicId: string, notes: string) => {
    await updateAgendaNotes(topicId, notes);
    setEditingNotes(null);
    loadTopics();
  };

  const handleDelete = async (topicId: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
    await removeAgendaTopic(topicId);
  };

  // Group topics by date
  const grouped = topics.reduce<Record<string, AgendaTopic[]>>((acc, topic) => {
    if (!acc[topic.date]) acc[topic.date] = [];
    acc[topic.date].push(topic);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <Calendar className="size-8 text-cyan-700 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 gradient-header text-white shadow-md">
        <div className="flex items-center gap-2 px-3 h-14">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">🗓️ Workcation Planning</h1>
            <p className="text-xs text-white/70">Co-creatie agenda</p>
          </div>
        </div>
      </header>

      {/* Topics by date */}
      <main className="flex-1 pb-24 px-4 pt-4">
        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🗓️</div>
            <p className="text-lg font-medium text-muted-foreground">Nog geen agendapunten</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Tik op &quot;+&quot; om een topic toe te voegen
            </p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="mb-6">
              {/* Date header */}
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="size-4 text-cyan-700" />
                <h2 className="font-semibold text-base">
                  {formatDate(date)}
                </h2>
                {isToday(date) && (
                  <Badge className="bg-cyan-700 text-white text-xs">Vandaag</Badge>
                )}
              </div>

              {/* Topics for this date */}
              <div className="flex flex-col gap-2">
                {grouped[date].map((topic) => (
                  <Card
                    key={topic.id}
                    className={`transition-all duration-200 ${
                      topic.checked ? "opacity-60" : ""
                    }`}
                  >
                    <CardContent className="py-3">
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggle(topic.id)}
                          className="mt-0.5 shrink-0"
                        >
                          <Checkbox
                            checked={topic.checked}
                            onCheckedChange={() => handleToggle(topic.id)}
                            className="size-6 rounded-md data-checked:bg-cyan-700 data-checked:border-cyan-700"
                          />
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium text-base ${
                                topic.checked ? "line-through text-muted-foreground" : ""
                              }`}
                            >
                              {topic.title}
                            </span>
                            {topic.timeSlot && (
                              <Badge variant="secondary" className="text-xs shrink-0">
                                <Clock className="size-3 mr-1" />
                                {TIME_SLOTS.find((s) => s.value === topic.timeSlot)?.icon}{" "}
                                {TIME_SLOTS.find((s) => s.value === topic.timeSlot)?.label}
                              </Badge>
                            )}
                          </div>

                          {topic.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {topic.description}
                            </p>
                          )}

                          {/* Creator */}
                          {topic.creator && (
                            <p className="text-xs text-muted-foreground mt-1">
                              door {topic.creator.emoji} {topic.creator.name}
                              {topic.checked && topic.checkedByProfile && (
                                <span>
                                  {" "}
                                  · afgevinkt door {topic.checkedByProfile.emoji}{" "}
                                  {topic.checkedByProfile.name}
                                </span>
                              )}
                            </p>
                          )}

                          {/* Notes section */}
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedNotes(expandedNotes === topic.id ? null : topic.id)
                              }
                              className="flex items-center gap-1 text-xs text-cyan-700 hover:text-cyan-800"
                            >
                              <MessageSquare className="size-3" />
                              Notities
                              {topic.notes && " ✏️"}
                              {expandedNotes === topic.id ? (
                                <ChevronUp className="size-3" />
                              ) : (
                                <ChevronDown className="size-3" />
                              )}
                            </button>

                            {expandedNotes === topic.id && (
                              <div className="mt-2">
                                {editingNotes?.id === topic.id ? (
                                  <div className="flex flex-col gap-2">
                                    <textarea
                                      className="w-full p-2 text-sm border rounded-md min-h-[80px] bg-muted/50"
                                      value={editingNotes.text}
                                      onChange={(e) =>
                                        setEditingNotes({ id: topic.id, text: e.target.value })
                                      }
                                      placeholder="Voeg notities toe... (iedereen kan bewerken)"
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-cyan-700 hover:bg-cyan-800 text-white"
                                        onClick={() =>
                                          handleSaveNotes(topic.id, editingNotes.text)
                                        }
                                      >
                                        Opslaan
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingNotes(null)}
                                      >
                                        Annuleer
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="p-2 text-sm bg-muted/50 rounded-md cursor-pointer hover:bg-muted min-h-[40px]"
                                    onClick={() =>
                                      setEditingNotes({
                                        id: topic.id,
                                        text: topic.notes || "",
                                      })
                                    }
                                  >
                                    {topic.notes || (
                                      <span className="text-muted-foreground italic">
                                        Klik om notities toe te voegen...
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(topic.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-t">
        <div className="px-4 py-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <Button
            onClick={() => setDrawerOpen(true)}
            className="w-full h-12 text-base font-medium bg-cyan-700 hover:bg-cyan-800 text-white"
          >
            <Plus className="size-5 mr-2" />
            Agendapunt toevoegen
          </Button>
        </div>
      </div>

      {/* Add Topic Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Nieuw agendapunt</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Topic *</label>
              <Input
                placeholder="Bijv. Songkran planning, Team retrospective..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Omschrijving</label>
              <Input
                placeholder="Optioneel: wat willen we bespreken?"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Datum</label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Dagdeel</label>
              <div className="flex gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() =>
                      setNewTimeSlot(newTimeSlot === slot.value ? null : slot.value)
                    }
                    className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                      newTimeSlot === slot.value
                        ? "bg-cyan-700 text-white border-cyan-700"
                        : "bg-background border-border hover:bg-muted"
                    }`}
                  >
                    {slot.icon} {slot.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAdd}
              disabled={!newTitle.trim()}
              className="h-12 text-base font-medium bg-cyan-700 hover:bg-cyan-800 text-white"
            >
              Toevoegen
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
