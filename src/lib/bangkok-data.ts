export const VOTERS = ["Gio", "Kirsten", "Boas", "Willemijn", "Pim"] as const;
export type Voter = (typeof VOTERS)[number];

export const VOTER_COLORS: Record<Voter, string> = {
  Gio: "#E8B84B",
  Kirsten: "#DB6B5C",
  Boas: "#5CB8B2",
  Willemijn: "#B07FDB",
  Pim: "#7BA37B",
};

export const VOTER_EMOJI: Record<Voter, string> = {
  Gio: "🧔",
  Kirsten: "👩‍🦰",
  Boas: "🧑‍🦱",
  Willemijn: "👩",
  Pim: "🧑",
};

export type OptionType =
  | "culture"
  | "food"
  | "nightlife"
  | "chill"
  | "active"
  | "shopping";

export const TYPE_CFG: Record<
  OptionType,
  { color: string; icon: string; label: string }
> = {
  culture: { color: "#D4A574", icon: "🏛", label: "Cultuur" },
  food: { color: "#E8B84B", icon: "🍜", label: "Food" },
  nightlife: { color: "#B07FDB", icon: "🌙", label: "Nightlife" },
  chill: { color: "#7BA37B", icon: "🌿", label: "Chill" },
  active: { color: "#DB6B5C", icon: "💪", label: "Active" },
  shopping: { color: "#5CB8B2", icon: "🛒", label: "Shopping" },
};

export interface DayOption {
  id: string;
  title: string;
  desc: string;
  type: OptionType;
  dur: string;
  cost: string;
  vibe: string;
}

export interface DaySlot {
  time: string;
  id: string;
  options: DayOption[];
}

export interface Day {
  id: string;
  date: string;
  full: string;
  emoji: string;
  label: string;
  locked: string | null;
  slots: DaySlot[];
}

export const DAYS: Day[] = [
  {
    id: "thu16",
    date: "Thu 16",
    full: "Donderdag 16 April",
    emoji: "✈️",
    label: "Arrival Day",
    locked: null,
    slots: [
      {
        time: "Avond",
        id: "thu-eve",
        options: [
          {
            id: "chinatown",
            title: "Yaowarat Chinatown",
            desc: "Thip Samai, T&K Seafood, mango sticky rice + Pak Khlong bloemenmarkt",
            type: "food",
            dur: "3h",
            cost: "฿500pp",
            vibe: "Street food heaven",
          },
          {
            id: "jodd-thu",
            title: "Jodd Fairs Night Market",
            desc: "Hip night market vlak bij hotel. Neon vibes, cocktails, Instagram",
            type: "nightlife",
            dur: "2-3h",
            cost: "฿400pp",
            vibe: "Modern BKK",
          },
          {
            id: "rooftop-thu",
            title: "Rooftop Bar",
            desc: "Sky Bar (Lebua/Hangover II), Octave, of Vertigo. Welkomstdrankje",
            type: "nightlife",
            dur: "2h",
            cost: "฿800pp",
            vibe: "Skyline views",
          },
        ],
      },
    ],
  },
  {
    id: "fri17",
    date: "Fri 17",
    full: "Vrijdag 17 April",
    emoji: "🚂",
    label: "Ervaringen Dag",
    locked: null,
    slots: [
      {
        time: "Ochtend (07:00–13:00)",
        id: "fri-am",
        options: [
          {
            id: "markets-am",
            title: "🚂 Maeklong + Floating Market",
            desc: "07:00 vertrek per truck. Trein door de markt + Damnoen Saduak per longtail. Terug ±14:00. Lunch onderweg",
            type: "culture",
            dur: "7h",
            cost: "฿300pp",
            vibe: "Once in a lifetime",
          },
          {
            id: "covankessel-am",
            title: "🚲 Co van Kessel (08:00)",
            desc: "Nederlands, 30+ jr, 5★. 08:00 start, fietsen+boot door oud BKK + Chinatown + kanalen. Terug ±13:00 met lunch onderweg",
            type: "culture",
            dur: "5h",
            cost: "฿1,800pp",
            vibe: "Hidden Bangkok",
          },
          {
            id: "wat-pho-am",
            title: "💆 Wat Pho + Thai massage",
            desc: "Reclining Buddha (46m) + massage bij de OG school. Rustige ochtend, klaar voor lunch",
            type: "culture",
            dur: "3h",
            cost: "฿360pp",
            vibe: "Slow start",
          },
          {
            id: "chill-am",
            title: "🌿 Hotel chill / zwembad",
            desc: "Uitslapen, ontbijt, zwembad. Energie sparen voor avond",
            type: "chill",
            dur: "Vrij",
            cost: "Gratis",
            vibe: "Recovery mode",
          },
        ],
      },
      {
        time: "Middag (lunch + 14:00–17:00)",
        id: "fri-pm",
        options: [
          {
            id: "talad-noi-pm",
            title: "🏚️ Talad Noi street art + cafés",
            desc: "Hipster cafés in oude pakhuizen, Chinese shophouses, street art. Aircooled break",
            type: "culture",
            dur: "2h",
            cost: "Gratis",
            vibe: "Creative BKK",
          },
          {
            id: "jim-thompson-pm",
            title: "🏡 Jim Thompson House",
            desc: "Teakhouten complex, zijdemuseum, mysterieuze verdwijning. Mooie tuin + airco. Lunch in restaurant",
            type: "culture",
            dur: "2h",
            cost: "฿200pp",
            vibe: "Cultuur + airco",
          },
          {
            id: "pool-pm",
            title: "🏊 Pool + lunch hotel",
            desc: "Te heet om buiten te zijn (35°C+). Zwemmen, drankje, lunch in hotel. Klaar voor avond",
            type: "chill",
            dur: "3h",
            cost: "Gratis",
            vibe: "Smart move",
          },
          {
            id: "chatuchak-pm",
            title: "🛒 Chatuchak (alleen vrij avond!)",
            desc: "Friday Night Market editie (18:00-00:00). Minder druk dan weekend. Vintage, eten, drinken",
            type: "shopping",
            dur: "3h",
            cost: "฿500+pp",
            vibe: "Locals only night",
          },
        ],
      },
      {
        time: "Avond (vanaf 17:00)",
        id: "fri-eve",
        options: [
          {
            id: "jodd-fri",
            title: "🌙 Jodd Fairs",
            desc: "Neon food stalls, cocktails, live muziek. Vlak bij hotel. Chill afsluiter",
            type: "nightlife",
            dur: "2-3h",
            cost: "฿400pp",
            vibe: "Easy + lokaal",
          },
          {
            id: "tuktuk",
            title: "🛺 Tuk-tuk Night Tour",
            desc: "3h per tuk-tuk door verlicht BKK. Tempels by night, bloemenmarkt, street food stops",
            type: "culture",
            dur: "3h",
            cost: "฿1,500pp",
            vibe: "Bangkok after dark",
          },
          {
            id: "dinner-cruise-fri",
            title: "🚢 Chao Phraya Dinner Cruise",
            desc: "Diner op de rivier, verlichte tempels + Grand Palace vanaf het water. Buffet + live muziek",
            type: "food",
            dur: "2.5h",
            cost: "฿1,500pp",
            vibe: "Romantisch/chic",
          },
          {
            id: "chinatown-eve",
            title: "🍜 Yaowarat Chinatown food walk",
            desc: "Thip Samai pad thai, T&K Seafood, mango sticky rice. Pak Khlong bloemenmarkt erna",
            type: "food",
            dur: "3h",
            cost: "฿500pp",
            vibe: "Street food heaven",
          },
        ],
      },
    ],
  },
  {
    id: "sat18",
    date: "Sat 18",
    full: "Zaterdag 18 April",
    emoji: "🥊",
    label: "Cultuur + Muay Thai",
    locked: "🥊 19:00–22:00 Muay Thai RWS Rajadamnern — Ringside Sec 6",
    slots: [
      {
        time: "Ochtend",
        id: "sat-am",
        options: [
          {
            id: "grand-palace",
            title: "👑 Grand Palace",
            desc: "HET icoon. Emerald Buddha, gouden chedis. Ga 08:30. ฿500pp. Dress code!",
            type: "culture",
            dur: "2h",
            cost: "฿500pp",
            vibe: "Bucket list #1",
          },
          {
            id: "golden-mount",
            title: "🏔️ Wat Saket (Golden Mount)",
            desc: "344 treden, 360° panorama over oud-Bangkok. Bijna geen toeristen",
            type: "culture",
            dur: "1h",
            cost: "฿100pp",
            vibe: "Best view in BKK",
          },
          {
            id: "jim-thompson",
            title: "🏡 Jim Thompson House",
            desc: "Teakhouten complex, zijdemuseum, mysterieuze verdwijning. Mooie tuin + airco",
            type: "culture",
            dur: "1h",
            cost: "฿200pp",
            vibe: "Cultuur + mysterie",
          },
        ],
      },
      {
        time: "Middag",
        id: "sat-pm",
        options: [
          {
            id: "canal-boat",
            title: "🚤 Thonburi kanalenboottour",
            desc: "Longtail boot door oude kanalen. Houten huizen op palen, lokaal leven, kleine tempeltjes",
            type: "culture",
            dur: "1.5h",
            cost: "฿300pp",
            vibe: "Venice of the East",
          },
          {
            id: "watpho-massage",
            title: "💆 Wat Pho + Thai Massage",
            desc: "Reclining Buddha (46m!) + massage bij de OG school waar het is uitgevonden",
            type: "culture",
            dur: "2h",
            cost: "฿360pp",
            vibe: "Relax before fight",
          },
          {
            id: "talad-noi",
            title: "🏚️ Talad Noi buurt",
            desc: "Street art, Chinese shophouses, hipster cafés in pakhuizen. Het 'echte' Bangkok",
            type: "culture",
            dur: "2h",
            cost: "Gratis",
            vibe: "Hidden creative BKK",
          },
          {
            id: "pool-sat",
            title: "🌿 Zwembad + rust",
            desc: "Opladen bij hotel voor Muay Thai vanavond",
            type: "chill",
            dur: "3h",
            cost: "Gratis",
            vibe: "Recovery mode",
          },
        ],
      },
      {
        time: "Na Muay Thai (~22:00)",
        id: "sat-late",
        options: [
          {
            id: "khao-san",
            title: "🍺 Khao San Road",
            desc: "5 min van stadion. Bier, chaos, buckets, backpacker mayhem. Eén keer moet.",
            type: "nightlife",
            dur: "2-3h",
            cost: "฿500pp",
            vibe: "Gecontroleerde chaos",
          },
          {
            id: "rambuttri",
            title: "🍹 Rambuttri Alley",
            desc: "Chillere versie van Khao San, om de hoek. Betere bars, meer locals",
            type: "nightlife",
            dur: "2h",
            cost: "฿400pp",
            vibe: "Khao San maar fijn",
          },
          {
            id: "rooftop-sat",
            title: "🌃 Rooftop nightcap",
            desc: "Sky Bar (Lebua) of Octave. Drankje + skyline view. Iets chics na de chaos",
            type: "nightlife",
            dur: "1.5h",
            cost: "฿800pp",
            vibe: "Adrenaline → cocktail",
          },
          {
            id: "hotel-sat",
            title: "🏨 Hotel + slapen",
            desc: "Muay Thai was intens. Naar hotel, drankje aan pool, vroeg slapen voor zondag",
            type: "chill",
            dur: "Vrij",
            cost: "Gratis",
            vibe: "Smart recovery",
          },
        ],
      },
    ],
  },
  {
    id: "sun19",
    date: "Sun 19",
    full: "Zondag 19 April",
    emoji: "🚢",
    label: "Laatste Dag BKK",
    locked: null,
    slots: [
      {
        time: "Ochtend (08:00–12:00)",
        id: "sun-am",
        options: [
          {
            id: "chatuchak",
            title: "🛒 Chatuchak Market",
            desc: "15.000 kraampjes! Vintage, kunst, streetwear, antiek. Ga 08:30 voor het te druk/heet wordt. Wereld's grootste weekendmarkt",
            type: "shopping",
            dur: "3h",
            cost: "฿500+pp",
            vibe: "Sensory overload",
          },
          {
            id: "palace-sun",
            title: "👑 Grand Palace (als gemist)",
            desc: "Als je zaterdag hebt overgeslagen. 08:30 erheen. Dress code!",
            type: "culture",
            dur: "2h",
            cost: "฿500pp",
            vibe: "Must-see backup",
          },
          {
            id: "muay-class",
            title: "🥊 Muay Thai proefles",
            desc: "Na het zien zelf doen! 09:00 beginnerles bij lokale gym. 1.5h sweat + technique",
            type: "active",
            dur: "1.5h",
            cost: "฿500-800pp",
            vibe: "Fighter mode",
          },
          {
            id: "lumpini-am",
            title: "🦎 Lumpini Park ochtend",
            desc: "Ga 08:00. Hagedissen spotten, taichi met locals, joggen. Super rustig en koel",
            type: "chill",
            dur: "2h",
            cost: "Gratis",
            vibe: "Locals' Bangkok",
          },
        ],
      },
      {
        time: "Middag (12:00–17:00)",
        id: "sun-pm",
        options: [
          {
            id: "lumpini-massage",
            title: "🦎 Lumpini + Thai massage",
            desc: "Hagedissen spotten + 1h massage bij park. Lunch in de buurt",
            type: "chill",
            dur: "3h",
            cost: "฿500pp",
            vibe: "Groene oase",
          },
          {
            id: "talad-noi-sun",
            title: "🏚️ Talad Noi + street art",
            desc: "Verborgen buurt, street art, hipster cafés in pakhuizen. Lunch onderweg",
            type: "culture",
            dur: "3h",
            cost: "Gratis",
            vibe: "Urban exploration",
          },
          {
            id: "siam-mall",
            title: "🛍️ Siam mall ronde + AC lunch",
            desc: "Siam Paragon/Center/MBK. Te heet om buiten te zijn. Shop, eet, geniet airco",
            type: "shopping",
            dur: "3h",
            cost: "฿500+pp",
            vibe: "Comfortabel",
          },
          {
            id: "pool-sun",
            title: "🏊 Pool + lunch hotel",
            desc: "Laatste rustdag. Pakken voor Pattaya morgen. Pool, lunch, douche, klaar",
            type: "chill",
            dur: "3h",
            cost: "Gratis",
            vibe: "Laatste rust",
          },
        ],
      },
      {
        time: "Avond (vanaf 17:00)",
        id: "sun-eve",
        options: [
          {
            id: "cruise",
            title: "🚢 Chao Phraya Dinner Cruise",
            desc: "Diner op de rivier, verlichte Grand Palace + Wat Arun. Live muziek, buffet. Perfecte afsluiter!",
            type: "food",
            dur: "2.5h",
            cost: "฿1,500pp",
            vibe: "Perfect farewell",
          },
          {
            id: "rooftop-sun",
            title: "🌇 Rooftop + Street Food",
            desc: "Sunset cocktails (Sky Bar/Octave), dan afdalen voor laatste street food ronde",
            type: "nightlife",
            dur: "3h",
            cost: "฿800pp",
            vibe: "Casual farewell",
          },
          {
            id: "wat-arun-sun",
            title: "🌅 Wat Arun sunset + diner",
            desc: "17:00 Wat Arun beklimmen voor sunset (last entry 17:30!). Daarna diner aan de overkant met view",
            type: "culture",
            dur: "3h",
            cost: "฿500pp",
            vibe: "Golden hour magic",
          },
          {
            id: "asiatique",
            title: "🎡 Asiatique + reuzenrad",
            desc: "Riverside night market + reuzenrad voor BKK skyline view. Eten, shoppen, drankjes",
            type: "nightlife",
            dur: "3h",
            cost: "฿600pp",
            vibe: "Family fun",
          },
        ],
      },
    ],
  },
];

export const TOTAL_SLOTS = DAYS.reduce((s, d) => s + d.slots.length, 0);
