export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "groente-fruit", name: "Groente & Fruit", emoji: "\u{1F96C}" },
  { id: "zuivel", name: "Zuivel", emoji: "\u{1F9C0}" },
  { id: "vlees-vis", name: "Vlees & Vis", emoji: "\u{1F969}" },
  { id: "brood-gebak", name: "Brood & Gebak", emoji: "\u{1F35E}" },
  { id: "dranken", name: "Dranken", emoji: "\u{1F964}" },
  { id: "pasta-rijst-wereld", name: "Pasta/Rijst/Wereldkeuken", emoji: "\u{1F35D}" },
  { id: "conserven-sauzen", name: "Conserven & Sauzen", emoji: "\u{1F96B}" },
  { id: "snacks-snoep", name: "Snacks & Snoep", emoji: "\u{1F37F}" },
  { id: "diepvries", name: "Diepvries", emoji: "\u{1F9CA}" },
  { id: "huishouden", name: "Huishouden", emoji: "\u{1F9F9}" },
  { id: "persoonlijke-verzorging", name: "Persoonlijke Verzorging", emoji: "\u{1F9F4}" },
  { id: "overig", name: "Overig", emoji: "\u{1F4E6}" },
];

/**
 * Map of common Dutch grocery items to category IDs.
 * Keys are lowercase for case-insensitive matching.
 */
export const ITEM_CATEGORY_MAP: Record<string, string> = {
  // Groente & Fruit
  appel: "groente-fruit",
  appels: "groente-fruit",
  banaan: "groente-fruit",
  bananen: "groente-fruit",
  tomaat: "groente-fruit",
  tomaten: "groente-fruit",
  ui: "groente-fruit",
  uien: "groente-fruit",
  aardappel: "groente-fruit",
  aardappelen: "groente-fruit",
  aardappels: "groente-fruit",
  sla: "groente-fruit",
  komkommer: "groente-fruit",
  wortel: "groente-fruit",
  wortels: "groente-fruit",
  paprika: "groente-fruit",
  citroen: "groente-fruit",
  sinaasappel: "groente-fruit",
  sinaasappels: "groente-fruit",
  druiven: "groente-fruit",
  champignons: "groente-fruit",
  broccoli: "groente-fruit",
  spinazie: "groente-fruit",
  courgette: "groente-fruit",
  avocado: "groente-fruit",

  // Zuivel
  melk: "zuivel",
  kaas: "zuivel",
  boter: "zuivel",
  yoghurt: "zuivel",
  eieren: "zuivel",
  ei: "zuivel",
  room: "zuivel",
  slagroom: "zuivel",
  kwark: "zuivel",
  cottage: "zuivel",
  roomkaas: "zuivel",

  // Vlees & Vis
  kip: "vlees-vis",
  kipfilet: "vlees-vis",
  gehakt: "vlees-vis",
  biefstuk: "vlees-vis",
  zalm: "vlees-vis",
  garnalen: "vlees-vis",
  worst: "vlees-vis",
  spek: "vlees-vis",
  ham: "vlees-vis",
  rookvlees: "vlees-vis",

  // Brood & Gebak
  brood: "brood-gebak",
  croissants: "brood-gebak",
  beschuit: "brood-gebak",
  crackers: "brood-gebak",
  taart: "brood-gebak",
  cake: "brood-gebak",

  // Dranken
  water: "dranken",
  sap: "dranken",
  sinaasappelsap: "dranken",
  cola: "dranken",
  bier: "dranken",
  wijn: "dranken",
  koffie: "dranken",
  thee: "dranken",
  frisdrank: "dranken",
  limonade: "dranken",

  // Pasta/Rijst/Wereldkeuken
  pasta: "pasta-rijst-wereld",
  spaghetti: "pasta-rijst-wereld",
  rijst: "pasta-rijst-wereld",
  noodles: "pasta-rijst-wereld",
  couscous: "pasta-rijst-wereld",
  tortilla: "pasta-rijst-wereld",
  wraps: "pasta-rijst-wereld",

  // Conserven & Sauzen
  ketchup: "conserven-sauzen",
  mayonaise: "conserven-sauzen",
  mayo: "conserven-sauzen",
  mosterd: "conserven-sauzen",
  sojasaus: "conserven-sauzen",
  tomatensaus: "conserven-sauzen",
  passata: "conserven-sauzen",
  olijfolie: "conserven-sauzen",

  // Snacks & Snoep
  chips: "snacks-snoep",
  chocolade: "snacks-snoep",
  koekjes: "snacks-snoep",
  noten: "snacks-snoep",
  popcorn: "snacks-snoep",
  drop: "snacks-snoep",
  snoep: "snacks-snoep",

  // Diepvries
  pizza: "diepvries",
  ijsjes: "diepvries",
  ijs: "diepvries",
  diepvriespizza: "diepvries",
  friet: "diepvries",
  patat: "diepvries",

  // Huishouden
  afwasmiddel: "huishouden",
  schoonmaakmiddel: "huishouden",
  toiletpapier: "huishouden",
  keukenpapier: "huishouden",
  vuilniszakken: "huishouden",
  wasmiddel: "huishouden",
  aluminiumfolie: "huishouden",
  bakpapier: "huishouden",

  // Persoonlijke Verzorging
  tandpasta: "persoonlijke-verzorging",
  shampoo: "persoonlijke-verzorging",
  zeep: "persoonlijke-verzorging",
  deodorant: "persoonlijke-verzorging",
  scheermesjes: "persoonlijke-verzorging",
  tissues: "persoonlijke-verzorging",
};

/**
 * Guess the category for a grocery item name.
 * Tries exact match first, then partial (substring) matching.
 * Returns the category ID or null if no match is found.
 */
export function guessCategory(itemName: string): string | null {
  const lower = itemName.toLowerCase().trim();

  // 1. Direct match
  if (ITEM_CATEGORY_MAP[lower]) {
    return ITEM_CATEGORY_MAP[lower];
  }

  // 2. Partial match: check if the item name contains a known key
  //    or if a known key contains the item name
  for (const [key, categoryId] of Object.entries(ITEM_CATEGORY_MAP)) {
    if (lower.includes(key) || key.includes(lower)) {
      return categoryId;
    }
  }

  return null;
}
