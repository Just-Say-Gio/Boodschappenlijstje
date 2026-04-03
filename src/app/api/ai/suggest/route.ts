import { NextRequest, NextResponse } from "next/server";
import { suggestItems, autocompleteItem } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { query, mode, existingItems } = body as {
      query?: string;
      mode?: "suggest" | "autocomplete";
      existingItems?: string[];
    };

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query is verplicht" },
        { status: 400 }
      );
    }

    if (!mode || (mode !== "suggest" && mode !== "autocomplete")) {
      return NextResponse.json(
        { error: "Mode moet 'suggest' of 'autocomplete' zijn" },
        { status: 400 }
      );
    }

    if (mode === "autocomplete") {
      const suggestions = await autocompleteItem(query.trim());
      return NextResponse.json({ suggestions });
    }

    // mode === "suggest"
    const items = await suggestItems(
      query.trim(),
      Array.isArray(existingItems) ? existingItems : []
    );
    return NextResponse.json({ items });
  } catch (error) {
    console.error("AI suggest API error:", error);
    return NextResponse.json(
      { error: "Er is iets misgegaan met de AI-suggesties" },
      { status: 500 }
    );
  }
}
