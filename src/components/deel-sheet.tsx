"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, MessageCircle, Link2 } from "lucide-react";
import { toast } from "sonner";
import {
  getShareUrl,
  getWhatsAppShareUrl,
  getWhatsAppListUrl,
  formatListForSharing,
  shareNative,
} from "@/lib/share";

interface DeelSheetItem {
  name: string;
  quantity?: string | null;
  checked: boolean;
}

interface DeelSheetProps {
  shareCode: string;
  listName: string;
  items: DeelSheetItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeelSheet({
  shareCode,
  listName,
  items,
  open,
  onOpenChange,
}: DeelSheetProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = getShareUrl(shareCode);
  const supportsNativeShare =
    typeof navigator !== "undefined" && !!navigator.share;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link gekopieerd!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kon de link niet kopieren");
    }
  }

  function handleWhatsAppInvite() {
    const url = getWhatsAppShareUrl(shareCode, listName);
    window.open(url, "_blank");
  }

  function handleWhatsAppList() {
    const url = getWhatsAppListUrl(items, listName);
    window.open(url, "_blank");
  }

  async function handleNativeShare() {
    const text = formatListForSharing(items);
    const success = await shareNative(listName, text, shareUrl);
    if (success) {
      toast.success("Gedeeld!");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8">
        <SheetHeader>
          <SheetTitle className="text-lg">Lijst delen</SheetTitle>
          <SheetDescription>
            Deel je boodschappenlijst met anderen
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          {/* Section 1: Invite link */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Uitnodigen
            </p>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2">
              <Link2 className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-sm">{shareUrl}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Section 2: WhatsApp invite */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-11"
            onClick={handleWhatsAppInvite}
          >
            <MessageCircle className="size-5 text-green-600" />
            <span>Uitnodiging via WhatsApp</span>
          </Button>

          {/* Section 3: Share list content via WhatsApp */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-11"
            onClick={handleWhatsAppList}
          >
            <MessageCircle className="size-5 text-green-600" />
            <span>Lijst versturen via WhatsApp</span>
          </Button>

          {/* Section 4: Native share (only if supported) */}
          {supportsNativeShare && (
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-11"
              onClick={handleNativeShare}
            >
              <Share2 className="size-5 text-green-600" />
              <span>Delen</span>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
