import OpenAI from "openai";

function getClient() {
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseURL: "https://api.deepseek.com",
  });
}

export async function suggestItems(
  query: string,
  existingItems: string[] = []
): Promise<Array<{ name: string; quantity?: string; category?: string }>> {
  try {
    const existingItemsList =
      existingItems.length > 0
        ? `\n\nItems die al op de lijst staan (suggereer deze NIET): ${existingItems.join(", ")}`
        : "";

    const response = await getClient().chat.completions.create({
      model: "deepseek-chat",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "Je bent een slimme Nederlandse boodschappenlijst-assistent. " +
            "Geef suggesties voor boodschappen op basis van de input van de gebruiker. " +
            "Als de gebruiker een gerecht of recept noemt, geef dan alle benodigde ingredienten. " +
            "Antwoord ALLEEN met een JSON array van objecten met: name (string), quantity (string, optioneel bv '2 stuks', '500g', '1 pak'), category (string, optioneel, een van: groente-fruit, zuivel, vlees-vis, brood-gebak, dranken, pasta-rijst, conserven, snacks, diepvries, huishouden, persoonlijk, overig). " +
            "Geef maximaal 10 suggesties. Suggereer NIET items die al op de lijst staan.",
        },
        {
          role: "user",
          content: `${query}${existingItemsList}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) return [];

    // Try to extract JSON from the response (handle markdown code blocks)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item: unknown): item is { name: string; quantity?: string; category?: string } =>
          typeof item === "object" &&
          item !== null &&
          "name" in item &&
          typeof (item as Record<string, unknown>).name === "string"
      )
      .slice(0, 10);
  } catch (error) {
    console.error("AI suggestItems error:", error);
    return [];
  }
}

export async function autocompleteItem(partial: string): Promise<string[]> {
  try {
    const response = await getClient().chat.completions.create({
      model: "deepseek-chat",
      temperature: 0.2,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content:
            "Je bent een autocomplete voor een Nederlandse boodschappenlijst. " +
            "De gebruiker typt een deel van een boodschap. Geef 5 mogelijke voltooiingen. " +
            "Antwoord ALLEEN met een JSON array van strings (de volledige itemnamen).",
        },
        {
          role: "user",
          content: partial,
        },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) return [];

    // Try to extract JSON from the response (handle markdown code blocks)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item: unknown): item is string => typeof item === "string")
      .slice(0, 5);
  } catch (error) {
    console.error("AI autocompleteItem error:", error);
    return [];
  }
}
