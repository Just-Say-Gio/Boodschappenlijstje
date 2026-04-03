import { db } from "@/db";
import { items } from "@/db/schema";
import { eq, gt } from "drizzle-orm";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: listId } = await params;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let lastCheck = new Date();
      let intervalId: ReturnType<typeof setInterval> | null = null;

      const sendEvent = (data: unknown) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial items
      try {
        const initialItems = await db.query.items.findMany({
          where: eq(items.listId, listId),
          orderBy: [asc(items.sortOrder), asc(items.createdAt)],
          with: {
            addedByProfile: true,
            checkedByProfile: true,
          },
        });

        sendEvent({ type: "init", items: initialItems });
        lastCheck = new Date();
      } catch {
        controller.close();
        return;
      }

      // Poll for updates every 2 seconds
      intervalId = setInterval(async () => {
        try {
          const updatedItems = await db.query.items.findMany({
            where: eq(items.listId, listId),
            orderBy: [asc(items.sortOrder), asc(items.createdAt)],
            with: {
              addedByProfile: true,
              checkedByProfile: true,
            },
          });

          // Check if any items have been updated since last check
          const hasUpdates = updatedItems.some(
            (item) =>
              (item.updatedAt && item.updatedAt > lastCheck) ||
              (item.createdAt && item.createdAt > lastCheck)
          );

          if (hasUpdates) {
            sendEvent({ type: "update", items: updatedItems });
          }

          lastCheck = new Date();
        } catch {
          // If DB query fails, close the stream
          if (intervalId) clearInterval(intervalId);
          controller.close();
        }
      }, 2000);

      // Handle abort signal
      request.signal.addEventListener("abort", () => {
        if (intervalId) clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
