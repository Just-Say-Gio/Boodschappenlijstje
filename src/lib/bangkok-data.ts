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
        time: "Hele dag",
        id: "fri-day",
        options: [
          {
            id: "markets",
            title: "🚂 Maeklong + Floating Market",
            desc: "Truck naar Maeklong (trein door de markt!) + Damnoen Saduak per longtail. Terug ~14:00",
            type: "culture",
            dur: "7h",
            cost: "฿300pp",
            vibe: "Once in a lifetime",
          },
          {
            id: "covankessel",
            title: "🚲 Co van Kessel Bike+Boat",
            desc: "Nederlands bedrijf. Fietsen door steegjes oud-Bangkok + longtail kanalen. 30+ jaar, 5★",
            type: "culture",
            dur: "5h",
            cost: "฿1,800pp",
            vibe: "Hidden Bangkok",
          },
          {
            id: "combo",
            title: "🚂+🚲 Markets ochtend + Co by Night",
            desc: "07:00 Maeklong+Floating, terug 14:00. Dan 17:00 Co van Kessel avondtour (3h fietsen door verlicht Chinatown)",
            type: "culture",
            dur: "Hele dag",
            cost: "฿2,100pp",
            vibe: "Maximum Bangkok",
          },
        ],
      },
      {
        time: "Avond (als niet combo)",
        id: "fri-eve",
        options: [
          {
            id: "jodd-fri",
            title: "Jodd Fairs",
            desc: "Neon food stalls, cocktails, live muziek. Bij hotel",
            type: "nightlife",
            dur: "2-3h",
            cost: "฿400pp",
            vibe: "Chill afsluiter",
          },
          {
            id: "tuktuk",
            title: "Tuk-tuk Night Tour",
            desc: "Per tuk-tuk door verlicht Bangkok. Tempels bij nacht, bloemenmarkt, street food stops",
            type: "culture",
            dur: "3h",
            cost: "฿1,500pp",
            vibe: "Bangkok after dark",
          },
          {
            id: "dinner-cruise-fri",
            title: "Chao Phraya Dinner Cruise",
            desc: "Diner op de rivier, verlichte tempels + Grand Palace vanaf het water",
            type: "food",
            dur: "2.5h",
            cost: "฿1,500pp",
            vibe: "Romantisch/chic",
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
        time: "Ochtend",
        id: "sun-am",
        options: [
          {
            id: "chatuchak",
            title: "🛒 Chatuchak Market",
            desc: "15.000 kraampjes! Vintage, kunst, streetwear, antiek. 's Werelds grootste weekendmarkt",
            type: "shopping",
            dur: "2-3h",
            cost: "฿500+pp",
            vibe: "Sensory overload",
          },
          {
            id: "palace-sun",
            title: "👑 Grand Palace (backup)",
            desc: "Als je zaterdag hebt overgeslagen",
            type: "culture",
            dur: "2h",
            cost: "฿500pp",
            vibe: "Must-see backup",
          },
        ],
      },
      {
        time: "Middag",
        id: "sun-pm",
        options: [
          {
            id: "lumpini",
            title: "🦎 Lumpini Park + Massage",
            desc: "Central Park van BKK. 2-meter hagedissen spotten + Thai massage bij het park",
            type: "chill",
            dur: "2-3h",
            cost: "฿300pp",
            vibe: "Groene oase",
          },
          {
            id: "talad-noi-sun",
            title: "🏚️ Talad Noi + street art",
            desc: "Verborgen buurt, street art, hipster cafés in pakhuizen",
            type: "culture",
            dur: "2h",
            cost: "Gratis",
            vibe: "Urban exploration",
          },
          {
            id: "muay-class",
            title: "🥊 Muay Thai proefles",
            desc: "Na het zien, nu zelf doen! 1-2h beginnerles",
            type: "active",
            dur: "1.5h",
            cost: "฿500-800pp",
            vibe: "Fighter mode",
          },
          {
            id: "wat-arun-sun",
            title: "🌅 Wat Arun golden hour",
            desc: "Porselein toren beklimmen voor uitzicht. Ga laat voor het beste licht",
            type: "culture",
            dur: "1h",
            cost: "฿100pp",
            vibe: "Golden hour magic",
          },
        ],
      },
      {
        time: "Avond",
        id: "sun-eve",
        options: [
          {
            id: "cruise",
            title: "🚢 Dinner Cruise",
            desc: "Diner op de rivier, verlichte Grand Palace + Wat Arun. Live muziek, buffet. Perfecte afsluiter!",
            type: "food",
            dur: "2.5h",
            cost: "฿1,500pp",
            vibe: "Perfect farewell",
          },
          {
            id: "rooftop-sun",
            title: "🌇 Rooftop + Street Food",
            desc: "Sunset cocktails, dan afdalen voor laatste street food ronde",
            type: "nightlife",
            dur: "3h",
            cost: "฿800pp",
            vibe: "Casual farewell",
          },
        ],
      },
    ],
  },
];

export const TOTAL_SLOTS = DAYS.reduce((s, d) => s + d.slots.length, 0);
