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
    locked: "🌙 19:00 Jodd Fairs Rama 9 (open tot 01:00) — 5 min walk MRT Phra Ram 9",
    slots: [
      {
        time: "Na Jodd Fairs (optioneel)",
        id: "thu-late",
        options: [
          {
            id: "octave-thu",
            title: "🌃 Octave Rooftop (Marriott Thong Lo)",
            desc: "15 min Grab vanaf Jodd. Skyline cocktails tot 02:00. Smart-casual dress code",
            type: "nightlife",
            dur: "1.5h",
            cost: "฿800pp",
            vibe: "Easy nightcap",
          },
          {
            id: "chinatown-thu",
            title: "🍜 Yaowarat Chinatown",
            desc: "25-30 min Grab van Jodd (andere kant van stad). Late food walk Thip Samai (tot 02:00), T&K Seafood (tot 24:00). Reken in tijd",
            type: "food",
            dur: "2h+reistijd",
            cost: "฿500pp",
            vibe: "Street food heaven",
          },
          {
            id: "hotel-thu",
            title: "🏨 Hotel + slapen",
            desc: "Net aangekomen, jetlag. Drankje aan pool en vroeg bed voor verse start vrijdag",
            type: "chill",
            dur: "Vrij",
            cost: "Gratis",
            vibe: "Smart move",
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
            desc: "06:00-07:00 pickup. Trein door de markt (08:30) + Damnoen Saduak per longtail. Terug 13:00-15:00. Lunch onderweg",
            type: "culture",
            dur: "7h",
            cost: "฿1,000-1,200pp",
            vibe: "Once in a lifetime",
          },
          {
            id: "covankessel-am",
            title: "🚲 Co van Kessel Combo (07:00)",
            desc: "Nederlands, 30+ jr, 5★. 5h fietsen+boot door oud BKK + Chinatown + kanalen. Lunch inbegrepen. Ook 13:00 slot mogelijk",
            type: "culture",
            dur: "5h",
            cost: "฿1,800pp",
            vibe: "Hidden Bangkok",
          },
          {
            id: "wat-pho-am",
            title: "💆 Wat Pho + Thai massage",
            desc: "Reclining Buddha (46m) + massage bij OG school. Open 08:00-18:30. Entry ฿300 + 30min ฿340 of 60min ฿520",
            type: "culture",
            dur: "3h",
            cost: "฿640-820pp",
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
            desc: "Teakhouten complex, zijdemuseum. Verplichte gids, geen online tickets. Open 10:00-17:00. Lunch in restaurant",
            type: "culture",
            dur: "1.5h",
            cost: "฿250pp",
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
            id: "ratchada-night",
            title: "🛒 JJ Green / Train Night Market Ratchada",
            desc: "Vintage, food, drinks. Wo-Zo 17:00-24:00. Vlak bij hotel (MRT Cultural Centre). DE night market voor toeristen (Friday Chatuchak is wholesale-only, niks voor jullie)",
            type: "shopping",
            dur: "3h",
            cost: "฿500pp",
            vibe: "Echte BKK markt vibe",
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
            title: "🛺 Expique Tuk-tuk Night Lights",
            desc: "4h per tuk-tuk vanaf BTS Krung Thonburi (19:00). Bloemenmarkt, Old Town, food stops",
            type: "culture",
            dur: "4h",
            cost: "฿2,000pp",
            vibe: "Bangkok after dark",
          },
          {
            id: "dinner-cruise-fri",
            title: "🚢 Chao Phraya Dinner Cruise",
            desc: "19:30 vanaf ICONSIAM/Asiatique pier (40-60 min reistijd vanaf Rama 9). 2h buffet + live muziek",
            type: "food",
            dur: "2h+reistijd",
            cost: "฿1,200-1,800pp",
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
            desc: "08:30-15:30 (last entry 14:30). Start 08:30 want 35-40°C + queue. Dress code: lange broek/schouders bedekt",
            type: "culture",
            dur: "3h",
            cost: "฿500pp",
            vibe: "Bucket list #1",
          },
          {
            id: "golden-mount",
            title: "🏔️ Wat Saket (Golden Mount)",
            desc: "318 treden, 360° panorama over oud BKK. Open 07:30-17:30. Vlak bij Old Rajadamnern stadion",
            type: "culture",
            dur: "1h",
            cost: "฿50pp",
            vibe: "Best view in BKK",
          },
          {
            id: "jim-thompson",
            title: "🏡 Jim Thompson House",
            desc: "Verplichte gids (geen online tickets). Open 10:00-17:00. Pathumwan/Siam (BTS National Stadium)",
            type: "culture",
            dur: "1.5h",
            cost: "฿250pp",
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
            desc: "Reclining Buddha (46m!) + massage bij OG school. Open 08:00-18:30. Entry ฿300 + massage ฿340-520",
            type: "culture",
            dur: "2h",
            cost: "฿640-820pp",
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
            title: "🌃 Octave Rooftop nightcap",
            desc: "Marriott Thong Lo (open tot 02:00). 20 min Grab van stadion. Smart-casual dress code. Skyline + cocktails",
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
            desc: "Ga 06:30-07:30 voor tai chi met locals + koelte. Hagedissen spotten. Open vanaf 04:30",
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
            desc: "19:30 vanaf ICONSIAM/Asiatique (40-60 min reistijd vanaf Rama 9). 2h buffet + live muziek. Verlichte Grand Palace + Wat Arun",
            type: "food",
            dur: "2h+reistijd",
            cost: "฿1,200-1,800pp",
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
            title: "🌅 Wat Arun + sunset overkant",
            desc: "Klim 16:30-17:30 (sluit 18:00, sunset 18:31). Boot oversteken naar Sala Arun/The Deck voor sunset + verlichte tempel view + diner",
            type: "culture",
            dur: "3h",
            cost: "฿200pp + diner",
            vibe: "Golden hour magic",
          },
          {
            id: "asiatique",
            title: "🎡 Asiatique + reuzenrad",
            desc: "Open 16:00-24:00. Vanaf Rama 9: 45+ min via BTS Saphan Taksin + gratis shuttle boot. Reuzenrad ฿300-600",
            type: "nightlife",
            dur: "3h+reistijd",
            cost: "฿600pp",
            vibe: "Family fun",
          },
        ],
      },
    ],
  },
];

export const TOTAL_SLOTS = DAYS.reduce((s, d) => s + d.slots.length, 0);
