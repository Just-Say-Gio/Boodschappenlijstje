import { useState, useEffect, useCallback } from "react";

const VOTERS = ["Gio", "Kirsten", "Boas", "Willemijn", "Pim"];
const VOTER_COLORS = {
  Gio: "#E8B84B", Kirsten: "#DB6B5C", Boas: "#5CB8B2",
  Willemijn: "#B07FDB", Pim: "#7BA37B"
};
const VOTER_EMOJI = {
  Gio: "🧔", Kirsten: "👩‍🦰", Boas: "🧑‍🦱",
  Willemijn: "👩", Pim: "🧑"
};

const TYPE_CFG = {
  culture: { color: "#D4A574", icon: "🏛", label: "Cultuur" },
  food: { color: "#E8B84B", icon: "🍜", label: "Food" },
  nightlife: { color: "#B07FDB", icon: "🌙", label: "Nightlife" },
  chill: { color: "#7BA37B", icon: "🌿", label: "Chill" },
  active: { color: "#DB6B5C", icon: "💪", label: "Active" },
  shopping: { color: "#5CB8B2", icon: "🛒", label: "Shopping" },
};

const DAYS = [
  {
    id: "thu16", date: "Thu 16", full: "Donderdag 16 April", emoji: "✈️", label: "Arrival Day",
    locked: null,
    slots: [
      { time: "Avond", id: "thu-eve", options: [
        { id: "chinatown", title: "Yaowarat Chinatown", desc: "Thip Samai, T&K Seafood, mango sticky rice + Pak Khlong bloemenmarkt", type: "food", dur: "3h", cost: "฿500pp", vibe: "Street food heaven" },
        { id: "jodd-thu", title: "Jodd Fairs Night Market", desc: "Hip night market vlak bij hotel. Neon vibes, cocktails, Instagram", type: "nightlife", dur: "2-3h", cost: "฿400pp", vibe: "Modern BKK" },
        { id: "rooftop-thu", title: "Rooftop Bar", desc: "Sky Bar (Lebua/Hangover II), Octave, of Vertigo. Welkomstdrankje", type: "nightlife", dur: "2h", cost: "฿800pp", vibe: "Skyline views" },
      ]},
    ]
  },
  {
    id: "fri17", date: "Fri 17", full: "Vrijdag 17 April", emoji: "🚂", label: "Ervaringen Dag",
    locked: null,
    slots: [
      { time: "Hele dag", id: "fri-day", options: [
        { id: "markets", title: "🚂 Maeklong + Floating Market", desc: "Truck naar Maeklong (trein door de markt!) + Damnoen Saduak per longtail. Terug ~14:00", type: "culture", dur: "7h", cost: "฿300pp", vibe: "Once in a lifetime" },
        { id: "covankessel", title: "🚲 Co van Kessel Bike+Boat", desc: "Nederlands bedrijf. Fietsen door steegjes oud-Bangkok + longtail kanalen. 30+ jaar, 5★", type: "culture", dur: "5h", cost: "฿1,800pp", vibe: "Hidden Bangkok" },
        { id: "combo", title: "🚂+🚲 Markets ochtend + Co by Night", desc: "07:00 Maeklong+Floating, terug 14:00. Dan 17:00 Co van Kessel avondtour (3h fietsen door verlicht Chinatown)", type: "culture", dur: "Hele dag", cost: "฿2,100pp", vibe: "Maximum Bangkok" },
      ]},
      { time: "Avond (als niet combo)", id: "fri-eve", options: [
        { id: "jodd-fri", title: "Jodd Fairs", desc: "Neon food stalls, cocktails, live muziek. Bij hotel", type: "nightlife", dur: "2-3h", cost: "฿400pp", vibe: "Chill afsluiter" },
        { id: "tuktuk", title: "Tuk-tuk Night Tour", desc: "Per tuk-tuk door verlicht Bangkok. Tempels bij nacht, bloemenmmarkt, street food stops", type: "culture", dur: "3h", cost: "฿1,500pp", vibe: "Bangkok after dark" },
        { id: "dinner-cruise-fri", title: "Chao Phraya Dinner Cruise", desc: "Diner op de rivier, verlichte tempels + Grand Palace vanaf het water", type: "food", dur: "2.5h", cost: "฿1,500pp", vibe: "Romantisch/chic" },
      ]},
    ]
  },
  {
    id: "sat18", date: "Sat 18", full: "Zaterdag 18 April", emoji: "🥊", label: "Cultuur + Muay Thai",
    locked: "🥊 19:00–22:00 Muay Thai RWS Rajadamnern — Ringside Sec 6",
    slots: [
      { time: "Ochtend", id: "sat-am", options: [
        { id: "grand-palace", title: "👑 Grand Palace", desc: "HET icoon. Emerald Buddha, gouden chedis. Ga 08:30. ฿500pp. Dress code!", type: "culture", dur: "2h", cost: "฿500pp", vibe: "Bucket list #1" },
        { id: "golden-mount", title: "🏔️ Wat Saket (Golden Mount)", desc: "344 treden, 360° panorama over oud-Bangkok. Bijna geen toeristen", type: "culture", dur: "1h", cost: "฿100pp", vibe: "Best view in BKK" },
        { id: "jim-thompson", title: "🏡 Jim Thompson House", desc: "Teakhouten complex, zijdemuseum, mysterieuze verdwijning. Mooie tuin + airco", type: "culture", dur: "1h", cost: "฿200pp", vibe: "Cultuur + mysterie" },
      ]},
      { time: "Middag", id: "sat-pm", options: [
        { id: "canal-boat", title: "🚤 Thonburi kanalenboottour", desc: "Longtail boot door oude kanalen. Houten huizen op palen, lokaal leven, kleine tempeltjes", type: "culture", dur: "1.5h", cost: "฿300pp", vibe: "Venice of the East" },
        { id: "watpho-massage", title: "💆 Wat Pho + Thai Massage", desc: "Reclining Buddha (46m!) + massage bij de OG school waar het is uitgevonden", type: "culture", dur: "2h", cost: "฿360pp", vibe: "Relax before fight" },
        { id: "talad-noi", title: "🏚️ Talad Noi buurt", desc: "Street art, Chinese shophouses, hipster cafés in pakhuizen. Het 'echte' Bangkok", type: "culture", dur: "2h", cost: "Gratis", vibe: "Hidden creative BKK" },
        { id: "pool-sat", title: "🌿 Zwembad + rust", desc: "Opladen bij hotel voor Muay Thai vanavond", type: "chill", dur: "3h", cost: "Gratis", vibe: "Recovery mode" },
      ]},
      { time: "Na Muay Thai (~22:00)", id: "sat-late", options: [
        { id: "khao-san", title: "🍺 Khao San Road", desc: "5 min van stadion. Bier, chaos, buckets, backpacker mayhem. Eén keer moet.", type: "nightlife", dur: "2-3h", cost: "฿500pp", vibe: "Gecontroleerde chaos" },
        { id: "rambuttri", title: "🍹 Rambuttri Alley", desc: "Chillere versie van Khao San, om de hoek. Betere bars, meer locals", type: "nightlife", dur: "2h", cost: "฿400pp", vibe: "Khao San maar fijn" },
      ]},
    ]
  },
  {
    id: "sun19", date: "Sun 19", full: "Zondag 19 April", emoji: "🚢", label: "Laatste Dag BKK",
    locked: null,
    slots: [
      { time: "Ochtend", id: "sun-am", options: [
        { id: "chatuchak", title: "🛒 Chatuchak Market", desc: "15.000 kraampjes! Vintage, kunst, streetwear, antiek. 's Werelds grootste weekendmarkt", type: "shopping", dur: "2-3h", cost: "฿500+pp", vibe: "Sensory overload" },
        { id: "palace-sun", title: "👑 Grand Palace (backup)", desc: "Als je zaterdag hebt overgeslagen", type: "culture", dur: "2h", cost: "฿500pp", vibe: "Must-see backup" },
      ]},
      { time: "Middag", id: "sun-pm", options: [
        { id: "lumpini", title: "🦎 Lumpini Park + Massage", desc: "Central Park van BKK. 2-meter hagedissen spotten + Thai massage bij het park", type: "chill", dur: "2-3h", cost: "฿300pp", vibe: "Groene oase" },
        { id: "talad-noi-sun", title: "🏚️ Talad Noi + street art", desc: "Verborgen buurt, street art, hipster cafés in pakhuizen", type: "culture", dur: "2h", cost: "Gratis", vibe: "Urban exploration" },
        { id: "muay-class", title: "🥊 Muay Thai proefles", desc: "Na het zien, nu zelf doen! 1-2h beginnerles", type: "active", dur: "1.5h", cost: "฿500-800pp", vibe: "Fighter mode" },
        { id: "wat-arun-sun", title: "🌅 Wat Arun golden hour", desc: "Porselein toren beklimmen voor uitzicht. Ga laat voor het beste licht", type: "culture", dur: "1h", cost: "฿100pp", vibe: "Golden hour magic" },
      ]},
      { time: "Avond", id: "sun-eve", options: [
        { id: "cruise", title: "🚢 Dinner Cruise", desc: "Diner op de rivier, verlichte Grand Palace + Wat Arun. Live muziek, buffet. Perfecte afsluiter!", type: "food", dur: "2.5h", cost: "฿1,500pp", vibe: "Perfect farewell" },
        { id: "rooftop-sun", title: "🌇 Rooftop + Street Food", desc: "Sunset cocktails, dan afdalen voor laatste street food ronde", type: "nightlife", dur: "3h", cost: "฿800pp", vibe: "Casual farewell" },
      ]},
    ]
  },
];

const STORAGE_KEY = "bkk-votes-v2";

export default function App() {
  const [activeUser, setActiveUser] = useState(null);
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("plan");

  const loadVotes = useCallback(async () => {
    try {
      const r = await window.storage.get(STORAGE_KEY, true);
      if (r?.value) setVotes(JSON.parse(r.value));
    } catch { }
    setLoading(false);
  }, []);

  useEffect(() => { loadVotes(); }, [loadVotes]);

  const castVote = async (slotId, optionId) => {
    if (!activeUser) return;
    const next = { ...votes };
    if (!next[slotId]) next[slotId] = {};
    next[slotId][activeUser] = next[slotId]?.[activeUser] === optionId ? null : optionId;
    setVotes(next);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(next), true); } catch {}
  };

  const getVoters = (slotId, optionId) =>
    VOTERS.filter(v => votes[slotId]?.[v] === optionId);

  const getWinner = (slotId, options) => {
    let best = null, max = 0;
    for (const o of options) {
      const c = getVoters(slotId, o.id).length;
      if (c > max) { max = c; best = o; }
    }
    return max >= 3 ? best : null;
  };

  const totalSlots = DAYS.reduce((s, d) => s + d.slots.length, 0);
  const decidedSlots = DAYS.reduce((s, d) =>
    s + d.slots.filter(sl => getWinner(sl.id, sl.options)).length, 0);

  const resetAll = async () => {
    if (confirm("Alle stemmen wissen? Dit kan niet ongedaan worden.")) {
      setVotes({});
      try { await window.storage.set(STORAGE_KEY, JSON.stringify({}), true); } catch {}
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0A0908", color: "#706B64", fontFamily: "'DM Sans',sans-serif" }}>
      Loading votes...
    </div>
  );

  // User select screen
  if (!activeUser) return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#0A0908", color: "#E8E4DF", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
      <div style={{ fontSize: 52, marginBottom: 12 }}>🇹🇭</div>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 900, margin: "0 0 4px", textAlign: "center", background: "linear-gradient(135deg,#D4A574,#E8B84B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Bangkok Planner
      </h1>
      <p style={{ color: "#706B64", fontSize: 14, margin: "0 0 28px", textAlign: "center" }}>Thu 16 – Sun 19 Apr · Kies wie je bent</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 }}>
        {VOTERS.map(v => {
          const hasVoted = Object.values(votes).some(sl => sl[v]);
          return (
            <button key={v} onClick={() => setActiveUser(v)} style={{
              background: `${VOTER_COLORS[v]}15`, border: `2px solid ${VOTER_COLORS[v]}40`,
              borderRadius: 14, padding: "14px 18px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s",
              color: VOTER_COLORS[v], fontSize: 17, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
            }}>
              <span style={{ fontSize: 26 }}>{VOTER_EMOJI[v]}</span>
              <span style={{ flex: 1, textAlign: "left" }}>{v}</span>
              {hasVoted && <span style={{ fontSize: 11, opacity: 0.6, fontWeight: 400 }}>heeft gestemd</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#0A0908", color: "#E8E4DF", minHeight: "100vh", padding: "0 0 100px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "18px 16px 12px", position: "sticky", top: 0, zIndex: 50, background: "rgba(10,9,8,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🇹🇭</span>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 18, background: "linear-gradient(135deg,#D4A574,#E8B84B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>BKK</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: `${VOTER_COLORS[activeUser]}20`, border: `1px solid ${VOTER_COLORS[activeUser]}50`, borderRadius: 20, padding: "4px 12px", fontSize: 13, color: VOTER_COLORS[activeUser], fontWeight: 600 }}>
              {VOTER_EMOJI[activeUser]} {activeUser}
            </div>
            <button onClick={() => setActiveUser(null)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#706B64", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>
              Wissel
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, maxWidth: 640, margin: "10px auto 0" }}>
          {[["plan", "🗓 Stemmen"], ["result", "📊 Resultaat"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              flex: 1, padding: "8px 0", border: "none", borderRadius: 8, cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
              background: tab === k ? "rgba(212,165,116,0.15)" : "rgba(255,255,255,0.04)",
              color: tab === k ? "#D4A574" : "#706B64",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 0" }}>

        {/* Progress */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 8 }}>
            {VOTERS.map(v => {
              const c = Object.values(votes).filter(sl => sl[v]).length;
              return (
                <div key={v} style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "3px 8px", fontSize: 11 }}>
                  <span>{VOTER_EMOJI[v]}</span>
                  <span style={{ color: c > 0 ? VOTER_COLORS[v] : "#504B44", fontWeight: 600 }}>{c}/{totalSlots}</span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: "#504B44" }}>
            {decidedSlots}/{totalSlots} beslist (3+ stemmen)
          </div>
        </div>

        {tab === "plan" && DAYS.map(day => (
          <div key={day.id} style={{ marginBottom: 24 }}>
            {/* Day header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 12, borderLeft: "4px solid #D4A574" }}>
              <span style={{ fontSize: 22 }}>{day.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{day.full}</div>
                <div style={{ fontSize: 12, color: "#706B64" }}>{day.label}</div>
              </div>
            </div>

            {day.locked && (
              <div style={{ background: "rgba(219,107,92,0.08)", border: "1px solid rgba(219,107,92,0.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#DB6B5C", fontWeight: 600 }}>
                🔒 {day.locked}
              </div>
            )}

            {day.slots.map(slot => {
              const winner = getWinner(slot.id, slot.options);
              return (
                <div key={slot.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, paddingLeft: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#5CB8B2", textTransform: "uppercase", letterSpacing: 1 }}>{slot.time}</span>
                    {winner && <span style={{ fontSize: 10, background: "rgba(123,163,123,0.15)", color: "#7BA37B", padding: "2px 8px", borderRadius: 8, fontWeight: 600 }}>✅ Beslist</span>}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {slot.options.map(opt => {
                      const voters = getVoters(slot.id, opt.id);
                      const myVote = votes[slot.id]?.[activeUser] === opt.id;
                      const isWinner = winner?.id === opt.id;
                      const tc = TYPE_CFG[opt.type];
                      return (
                        <div key={opt.id} onClick={() => castVote(slot.id, opt.id)} style={{
                          background: isWinner ? "rgba(123,163,123,0.08)" : myVote ? `${tc.color}10` : "rgba(255,255,255,0.02)",
                          border: isWinner ? "2px solid rgba(123,163,123,0.4)" : myVote ? `2px solid ${tc.color}50` : "2px solid rgba(255,255,255,0.06)",
                          borderRadius: 12, padding: "12px 14px", cursor: "pointer", transition: "all 0.15s",
                          position: "relative",
                        }}>
                          {isWinner && (
                            <div style={{ position: "absolute", top: -8, right: 10, background: "#7BA37B", color: "#000", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>WINNER</div>
                          )}
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: 14, color: myVote ? tc.color : "#E8E4DF", marginBottom: 3 }}>
                                {opt.title}
                              </div>
                              <p style={{ fontSize: 12, color: "#9A958E", lineHeight: 1.45, margin: "0 0 8px" }}>{opt.desc}</p>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 10, color: "#706B64" }}>
                                <span style={{ background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 5 }}>⏱ {opt.dur}</span>
                                <span style={{ background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 5 }}>💰 {opt.cost}</span>
                                <span style={{ background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 5 }}>✨ {opt.vibe}</span>
                              </div>
                            </div>
                            {/* Vote count */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 36 }}>
                              <div style={{ fontSize: 22, fontWeight: 900, color: voters.length >= 3 ? "#7BA37B" : voters.length > 0 ? "#D4A574" : "#302D28", lineHeight: 1 }}>
                                {voters.length}
                              </div>
                              <div style={{ fontSize: 9, color: "#504B44", marginTop: 2 }}>/{VOTERS.length}</div>
                            </div>
                          </div>
                          {/* Voter avatars */}
                          {voters.length > 0 && (
                            <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                              {voters.map(v => (
                                <div key={v} style={{
                                  background: `${VOTER_COLORS[v]}20`, border: `1px solid ${VOTER_COLORS[v]}40`,
                                  borderRadius: 8, padding: "2px 7px", fontSize: 11,
                                  color: VOTER_COLORS[v], fontWeight: 600,
                                }}>{VOTER_EMOJI[v]} {v}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {tab === "result" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, margin: "0 0 16px", color: "#D4A574" }}>
              Het Plan tot nu toe
            </h2>
            {DAYS.map(day => (
              <div key={day.id} style={{ marginBottom: 20, background: "rgba(255,255,255,0.02)", borderRadius: 14, padding: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                  {day.emoji} {day.full}
                </div>
                {day.locked && (
                  <div style={{ fontSize: 13, color: "#DB6B5C", marginBottom: 8, paddingLeft: 8, borderLeft: "3px solid #DB6B5C" }}>
                    🔒 {day.locked}
                  </div>
                )}
                {day.slots.map(slot => {
                  const winner = getWinner(slot.id, slot.options);
                  const topOpt = winner || slot.options.reduce((best, o) => {
                    const c = getVoters(slot.id, o.id).length;
                    return c > (best.count || 0) ? { ...o, count: c } : best;
                  }, { count: 0 });
                  const voters = winner ? getVoters(slot.id, winner.id) : [];
                  const tc = TYPE_CFG[topOpt.type] || TYPE_CFG.culture;
                  return (
                    <div key={slot.id} style={{ padding: "8px 0 8px 8px", borderLeft: winner ? "3px solid #7BA37B" : "3px solid #302D28", marginBottom: 6, marginLeft: 4 }}>
                      <div style={{ fontSize: 11, color: "#5CB8B2", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{slot.time}</div>
                      {winner ? (
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#7BA37B", marginTop: 2 }}>
                            {tc.icon} {winner.title}
                          </div>
                          <div style={{ fontSize: 11, color: "#706B64", marginTop: 2 }}>
                            {voters.map(v => `${VOTER_EMOJI[v]} ${v}`).join("  ·  ")}
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: "#504B44", fontStyle: "italic", marginTop: 2 }}>
                          Nog niet beslist — meer stemmen nodig
                          {topOpt.title && <span style={{ color: "#706B64" }}> (leading: {topOpt.title})</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            <button onClick={resetAll} style={{
              display: "block", margin: "20px auto", background: "rgba(219,107,92,0.1)",
              border: "1px solid rgba(219,107,92,0.3)", borderRadius: 10, padding: "10px 20px",
              color: "#DB6B5C", fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
            }}>
              🗑 Reset alle stemmen
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#302D28", lineHeight: 1.8 }}>
          🥊 Muay Thai Sat 19:00 LOCKED<br />
          🏨 Checkout Mon 11:00 → Pattaya<br />
          Tap een optie om te stemmen · 3/5 = beslist
        </div>
      </div>
    </div>
  );
}
