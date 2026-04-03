interface ShareItem {
  name: string;
  quantity?: string | null;
  checked: boolean;
}

/**
 * Get the full URL to the join page for a given share code.
 */
export function getShareUrl(shareCode: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/join/${shareCode}`;
}

/**
 * Get a WhatsApp share URL with a Dutch invite message.
 */
export function getWhatsAppShareUrl(
  shareCode: string,
  listName: string
): string {
  const shareUrl = getShareUrl(shareCode);
  const message = `Doe je mee met mijn boodschappenlijst "${listName}"? ${shareUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Get a WhatsApp URL that shares the actual list content.
 */
export function getWhatsAppListUrl(
  items: ShareItem[],
  listName: string
): string {
  const formatted = formatListForSharing(items);
  const message = `${listName}\n\n${formatted}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Format a list of items as text with checkmarks for sharing.
 */
export function formatListForSharing(items: ShareItem[]): string {
  if (items.length === 0) return "(Lege lijst)";

  return items
    .map((item) => {
      const check = item.checked ? "\u2705" : "\u2B1C";
      const quantity = item.quantity ? ` (${item.quantity})` : "";
      return `${check} ${item.name}${quantity}`;
    })
    .join("\n");
}

/**
 * Use the Web Share API to share content natively.
 * Returns true if the share was successful, false otherwise.
 */
export async function shareNative(
  title: string,
  text: string,
  url?: string
): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) {
    return false;
  }

  try {
    await navigator.share({
      title,
      text,
      ...(url ? { url } : {}),
    });
    return true;
  } catch (error) {
    // User cancelled the share or an error occurred
    if (error instanceof Error && error.name === "AbortError") {
      // User cancelled - not really an error
      return false;
    }
    console.error("Native share error:", error);
    return false;
  }
}
