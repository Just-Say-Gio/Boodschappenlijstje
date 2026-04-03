import { NextResponse } from "next/server";
import { db, ensureMigrated } from "@/db";
import { profiles, lists, listMembers, items, agendaTopics } from "@/db/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { guessCategory } from "@/lib/categories";

export async function POST() {
  await ensureMigrated();

  // Find or create a default profile
  let profile = await db.query.profiles.findFirst();
  if (!profile) {
    const [p] = await db.insert(profiles).values({
      name: "Giovanni",
      emoji: "🌴",
      color: "#0891B2",
    }).returning();
    profile = p;
  }

  // Find existing list or create one
  let list = await db.query.lists.findFirst({
    where: eq(lists.isArchived, false),
  });
  if (!list) {
    const [l] = await db.insert(lists).values({
      name: "Koh Samui Boodschappen",
      shareCode: nanoid(8),
      createdBy: profile.id,
    }).returning();
    list = l;

    await db.insert(listMembers).values({
      listId: list.id,
      profileId: profile.id,
    });
  }

  // Check if items already exist for this list - skip seeding to prevent duplicates
  const existingItems = await db.query.items.findFirst({
    where: eq(items.listId, list.id),
  });

  const added: string[] = [];
  if (!existingItems) {
    // Items from WhatsApp
    const boodschappen = [
      { name: "Kwark/yoghurt", quantity: null },
      { name: "Granola", quantity: null },
      { name: "Vers fruit", quantity: null },
      { name: "Broodbeleg", quantity: null },
      { name: "Vaatwasserblokjes", quantity: null },
      { name: "IJsblokjes", quantity: null },
      { name: "Normale koffie (zonder suiker)", quantity: null },
      { name: "Fanta", quantity: null },
      { name: "IJsthee (Thaise, met honing)", quantity: null },
      { name: "Limonade", quantity: null },
      { name: "Water", quantity: null },
      { name: "Aansteker", quantity: null },
    ];

    for (const item of boodschappen) {
      const [i] = await db.insert(items).values({
        listId: list.id,
        name: item.name,
        quantity: item.quantity,
        category: guessCategory(item.name),
        addedBy: profile.id,
      }).returning();
      added.push(i.name);
    }
  }

  // Check if agenda topics already exist - skip seeding to prevent duplicates
  const existingTopics = await db.query.agendaTopics.findFirst();

  const topicsAdded: string[] = [];
  if (!existingTopics) {
    // Workcation Planning Topics
    const planningTopics = [
      {
        title: "Songkran planning",
        description: "Waar gaan we heen? Wat doen we? Vervoer regelen",
        date: "2026-04-03",
        timeSlot: "avond",
        sortOrder: 0,
      },
      {
        title: "Kookcursus plannen",
        description: "Thaise kookcursus boeken voor de groep",
        date: "2026-04-03",
        timeSlot: "avond",
        sortOrder: 1,
      },
      {
        title: "Hoe brengen we de groepscohesie terug?",
        description: "Open discussie: wat missen we, wat kunnen we verbeteren, hoe zorgen we voor meer verbinding",
        date: "2026-04-04",
        timeSlot: "ochtend",
        sortOrder: 0,
      },
    ];

    for (const topic of planningTopics) {
      const [t] = await db.insert(agendaTopics).values({
        ...topic,
        createdBy: profile.id,
      }).returning();
      topicsAdded.push(t.title);
    }
  }

  return NextResponse.json({
    listId: list.id,
    listName: list.name,
    itemsAdded: added,
    topicsAdded,
    skippedItems: !!existingItems,
    skippedTopics: !!existingTopics,
    profileId: profile.id,
  });
}
