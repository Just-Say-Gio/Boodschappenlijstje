"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2, MoreHorizontal, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BoodschappenLijst } from "@/components/boodschappen-lijst";
import { ToevoegenDrawer } from "@/components/toevoegen-drawer";
import { DeelSheet } from "@/components/deel-sheet";
import type { GroceryItem } from "@/components/item-row";
import { getLocalProfile } from "@/lib/profile";
import { guessCategory } from "@/lib/categories";
import {
  getList,
  getListItems,
  addItem,
  toggleItem,
  archiveList,
} from "@/lib/actions";

export default function LijstPage() {
  const params = useParams();
  const listId = params.id as string;

  const [listName, setListName] = useState("Laden...");
  const [shareCode, setShareCode] = useState("");
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const list = await getList(listId);
      if (list) {
        setListName(list.name);
        setShareCode(list.shareCode);
      }

      const listItems = await getListItems(listId);
      setItems(
        listItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          category: item.category ?? "overig",
          checked: item.checked ?? false,
          addedBy: item.addedByProfile
            ? { emoji: item.addedByProfile.emoji, color: item.addedByProfile.color }
            : { emoji: "😊", color: "#999" },
          checkedBy: item.checkedByProfile
            ? { emoji: item.checkedByProfile.emoji, color: item.checkedByProfile.color }
            : undefined,
        }))
      );
    } catch {
      // DB not available - show empty state
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // SSE for real-time updates
  useEffect(() => {
    const eventSource = new EventSource(`/api/lists/${listId}/events`);
    eventSource.onmessage = () => {
      loadData();
    };
    eventSource.onerror = () => {
      eventSource.close();
    };
    return () => eventSource.close();
  }, [listId, loadData]);

  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const handleToggle = async (id: string) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    const profile = getLocalProfile();
    if (profile) {
      await toggleItem(id, profile.id);
    }
  };

  const handleAdd = async (name: string, quantity?: string, category?: string) => {
    const profile = getLocalProfile();
    if (!profile) return;

    const cat: string = category || guessCategory(name) || "overig";
    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name,
      quantity: quantity ?? null,
      category: cat,
      checked: false,
      addedBy: { emoji: profile.emoji, color: profile.color },
    };
    setItems((prev) => [...prev, newItem]);

    try {
      const dbItem = await addItem(listId, name, quantity ?? null, cat, profile.id);
      // Replace temp id with real id
      setItems((prev) =>
        prev.map((item) =>
          item.id === newItem.id ? { ...item, id: dbItem.id } : item
        )
      );
    } catch {
      // Keep optimistic item
    }
  };

  const handleArchive = async () => {
    await archiveList(listId);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="text-muted-foreground">Laden...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 gradient-header text-white shadow-md">
        <div className="flex items-center gap-2 px-3 h-14">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="size-5" />
            </Button>
          </Link>

          <h1 className="flex-1 text-lg font-semibold truncate">
            {listName}
          </h1>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="size-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <MoreHorizontal className="size-5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="size-4 mr-2" />
                Archiveren
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-sm text-white/90 mb-1.5">
            <span>
              {checkedCount} van {totalCount} afgevinkt
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Items List */}
      <main className="flex-1 pb-24 touch-scroll">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-lg font-medium text-muted-foreground">
              Nog geen items
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Tik op &quot;Toevoegen&quot; om te beginnen
            </p>
          </div>
        ) : (
          <BoodschappenLijst items={items} onToggle={handleToggle} />
        )}
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-t">
        <div className="px-4 py-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <Button
            onClick={() => setDrawerOpen(true)}
            className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700 text-white"
          >
            + Toevoegen
          </Button>
        </div>
      </div>

      {/* Add Item Drawer */}
      <ToevoegenDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onAdd={handleAdd}
      />

      {/* Share Sheet */}
      <DeelSheet
        shareCode={shareCode}
        listName={listName}
        items={items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          checked: i.checked,
        }))}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </div>
  );
}
