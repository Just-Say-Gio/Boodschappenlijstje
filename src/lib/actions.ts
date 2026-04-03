"use server";

import { db, ensureMigrated } from "@/db";
import {
  profiles,
  lists,
  listMembers,
  items,
  activityLog,
} from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { nanoid } from "nanoid";

// ── Profiles ────────────────────────────────────────────────────────────────

export async function createProfile(
  name: string,
  emoji: string,
  color: string
) {
  await ensureMigrated();
  const [profile] = await db
    .insert(profiles)
    .values({ name, emoji, color })
    .returning();
  return profile;
}

export async function getProfile(id: string) {
  await ensureMigrated();
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, id),
  });
  return profile ?? null;
}

export async function updateProfile(
  id: string,
  data: { name?: string; emoji?: string; color?: string }
) {
  const [updated] = await db
    .update(profiles)
    .set(data)
    .where(eq(profiles.id, id))
    .returning();
  return updated;
}

// ── Lists ───────────────────────────────────────────────────────────────────

export async function createList(name: string, profileId: string) {
  await ensureMigrated();
  const shareCode = nanoid(8);

  const [list] = await db
    .insert(lists)
    .values({
      name,
      shareCode,
      createdBy: profileId,
    })
    .returning();

  // Add creator as a member
  await db.insert(listMembers).values({
    listId: list.id,
    profileId,
  });

  return list;
}

export async function getList(id: string) {
  const list = await db.query.lists.findFirst({
    where: eq(lists.id, id),
    with: {
      items: {
        orderBy: [asc(items.sortOrder), asc(items.createdAt)],
      },
      members: {
        with: {
          profile: true,
        },
      },
      creator: true,
    },
  });
  return list ?? null;
}

export async function getMyLists(profileId: string) {
  await ensureMigrated();
  const memberships = await db.query.listMembers.findMany({
    where: eq(listMembers.profileId, profileId),
    with: {
      list: {
        with: {
          items: true,
          members: {
            with: {
              profile: true,
            },
          },
        },
      },
    },
  });

  return memberships
    .map((m) => m.list)
    .filter((list) => !list.isArchived);
}

export async function archiveList(id: string) {
  const [updated] = await db
    .update(lists)
    .set({ isArchived: true, updatedAt: new Date() })
    .where(eq(lists.id, id))
    .returning();
  return updated;
}

export async function getArchivedLists(profileId: string) {
  const memberships = await db.query.listMembers.findMany({
    where: eq(listMembers.profileId, profileId),
    with: {
      list: {
        with: {
          items: true,
          members: {
            with: {
              profile: true,
            },
          },
        },
      },
    },
  });

  return memberships
    .map((m) => m.list)
    .filter((list) => list.isArchived);
}

// ── Items ───────────────────────────────────────────────────────────────────

export async function addItem(
  listId: string,
  name: string,
  quantity: string | null,
  category: string | null,
  addedBy: string
) {
  const [item] = await db
    .insert(items)
    .values({
      listId,
      name,
      quantity,
      category,
      addedBy,
    })
    .returning();

  // Update list's updatedAt
  await db
    .update(lists)
    .set({ updatedAt: new Date() })
    .where(eq(lists.id, listId));

  // Log activity
  await db.insert(activityLog).values({
    listId,
    profileId: addedBy,
    action: "item_added",
    details: { itemId: item.id, itemName: name },
  });

  return item;
}

export async function toggleItem(itemId: string, profileId: string) {
  const existing = await db.query.items.findFirst({
    where: eq(items.id, itemId),
  });

  if (!existing) return null;

  const newChecked = !existing.checked;

  const [updated] = await db
    .update(items)
    .set({
      checked: newChecked,
      checkedBy: newChecked ? profileId : null,
      updatedAt: new Date(),
    })
    .where(eq(items.id, itemId))
    .returning();

  // Update list's updatedAt
  await db
    .update(lists)
    .set({ updatedAt: new Date() })
    .where(eq(lists.id, existing.listId));

  // Log activity
  await db.insert(activityLog).values({
    listId: existing.listId,
    profileId,
    action: newChecked ? "item_checked" : "item_unchecked",
    details: { itemId: updated.id, itemName: updated.name },
  });

  return updated;
}

export async function removeItem(itemId: string, profileId: string) {
  const existing = await db.query.items.findFirst({
    where: eq(items.id, itemId),
  });

  if (!existing) return null;

  await db.delete(items).where(eq(items.id, itemId));

  // Update list's updatedAt
  await db
    .update(lists)
    .set({ updatedAt: new Date() })
    .where(eq(lists.id, existing.listId));

  // Log activity
  await db.insert(activityLog).values({
    listId: existing.listId,
    profileId,
    action: "item_removed",
    details: { itemName: existing.name },
  });

  return existing;
}

// ── List Sharing / Members ──────────────────────────────────────────────────

export async function joinList(shareCode: string, profileId: string) {
  await ensureMigrated();
  const list = await db.query.lists.findFirst({
    where: eq(lists.shareCode, shareCode),
  });

  if (!list) return null;

  // Check if already a member
  const existingMember = await db.query.listMembers.findFirst({
    where: and(
      eq(listMembers.listId, list.id),
      eq(listMembers.profileId, profileId)
    ),
  });

  if (!existingMember) {
    await db.insert(listMembers).values({
      listId: list.id,
      profileId,
    });

    // Log activity
    await db.insert(activityLog).values({
      listId: list.id,
      profileId,
      action: "member_joined",
      details: {},
    });
  }

  return list;
}

export async function getListMembers(listId: string) {
  const members = await db.query.listMembers.findMany({
    where: eq(listMembers.listId, listId),
    with: {
      profile: true,
    },
  });
  return members;
}

// ── Activity ────────────────────────────────────────────────────────────────

export async function getListActivity(listId: string, limit: number = 50) {
  const logs = await db.query.activityLog.findMany({
    where: eq(activityLog.listId, listId),
    with: {
      profile: true,
    },
    orderBy: [desc(activityLog.createdAt)],
    limit,
  });
  return logs;
}

// ── List Items ──────────────────────────────────────────────────────────────

export async function getListItems(listId: string) {
  const listItems = await db.query.items.findMany({
    where: eq(items.listId, listId),
    orderBy: [asc(items.sortOrder), asc(items.createdAt)],
    with: {
      addedByProfile: true,
      checkedByProfile: true,
    },
  });
  return listItems;
}
