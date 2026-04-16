"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  DAYS,
  VOTERS,
  VOTER_COLORS,
  VOTER_EMOJI,
  TYPE_CFG,
  TOTAL_SLOTS,
  type Voter,
  type DayOption,
} from "@/lib/bangkok-data";
import {
  getBangkokVotes,
  castBangkokVote,
  resetBangkokVotes,
} from "@/lib/actions";

type Votes = Record<string, Record<string, string>>;

const STORAGE_KEY = "bkk-active-voter";

export default function BangkokVotePage() {
  const [activeUser, setActiveUser] = useState<Voter | null>(null);
  const [votes, setVotes] = useState<Votes>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"plan" | "result">("plan");
  const [revealing, setRevealing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasTriggeredReveal = useRef(false);

  const loadVotes = useCallback(async () => {
    try {
      const v = await getBangkokVotes();
      setVotes(v);
    } catch {
      // DB unavailable, keep empty
    }
    setLoading(false);
  }, []);

  // Load votes + active user on mount
  useEffect(() => {
    loadVotes();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && VOTERS.includes(stored as Voter)) {
        setActiveUser(stored as Voter);
      }
    } catch {}
  }, [loadVotes]);

  // Poll for updates every 3s (live voting)
  useEffect(() => {
    const interval = setInterval(loadVotes, 3000);
    return () => clearInterval(interval);
  }, [loadVotes]);

  const getVoters = useCallback(
    (slotId: string, optionId: string) =>
      VOTERS.filter((v) => votes[slotId]?.[v] === optionId),
    [votes]
  );

  const getWinner = useCallback(
    (slotId: string, options: DayOption[]): DayOption | null => {
      let best: DayOption | null = null;
      let max = 0;
      for (const o of options) {
        const c = getVoters(slotId, o.id).length;
        if (c > max) {
          max = c;
          best = o;
        }
      }
      return max >= 3 ? best : null;
    },
    [getVoters]
  );

  const decidedSlots = DAYS.reduce(
    (s, d) => s + d.slots.filter((sl) => getWinner(sl.id, sl.options)).length,
    0
  );

  // Dramatic reveal when all slots decided
  useEffect(() => {
    if (decidedSlots === TOTAL_SLOTS && !hasTriggeredReveal.current && !loading) {
      hasTriggeredReveal.current = true;
      setRevealing(true);

      // Confetti blast
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const colors = ["#E8B84B", "#DB6B5C", "#5CB8B2", "#B07FDB", "#7BA37B", "#D4A574"];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors,
        });
        if (Date.now() < animationEnd) requestAnimationFrame(frame);
      })();

      setTimeout(() => {
        setRevealing(false);
        setRevealed(true);
        setTab("result");
      }, 2500);
    }
  }, [decidedSlots, loading]);

  const castVote = async (slotId: string, optionId: string) => {
    if (!activeUser) return;
    // Optimistic
    const next: Votes = { ...votes };
    if (!next[slotId]) next[slotId] = {};
    if (next[slotId][activeUser] === optionId) {
      delete next[slotId][activeUser];
    } else {
      next[slotId][activeUser] = optionId;
    }
    setVotes(next);
    try {
      const updated = await castBangkokVote(activeUser, slotId, optionId);
      setVotes(updated);
    } catch {
      // Revert on error
      loadVotes();
    }
  };

  const selectUser = (v: Voter) => {
    setActiveUser(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {}
  };

  const switchUser = () => {
    setActiveUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const resetAll = async () => {
    if (!confirm("Alle stemmen wissen? Dit kan niet ongedaan worden.")) return;
    await resetBangkokVotes();
    hasTriggeredReveal.current = false;
    setRevealed(false);
    loadVotes();
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100dvh",
          background: "#0A0908",
          color: "#706B64",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        Loading votes...
      </div>
    );

  // Dramatic reveal overlay
  if (revealing) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(135deg,#0A0908 0%,#1a1612 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          color: "#E8E4DF",
          fontFamily: "'DM Sans',sans-serif",
          padding: 24,
          textAlign: "center",
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap"
          rel="stylesheet"
        />
        <div
          style={{
            fontSize: 80,
            marginBottom: 16,
            animation: "bounce 1s ease-out",
          }}
        >
          🎉
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 40,
            fontWeight: 900,
            margin: "0 0 8px",
            background:
              "linear-gradient(135deg,#D4A574,#E8B84B,#DB6B5C,#B07FDB)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.1,
            animation: "fadeIn 1.5s ease-out",
          }}
        >
          HET PLAN IS KLAAR!
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#9A958E",
            marginTop: 20,
            animation: "fadeIn 2s ease-out",
          }}
        >
          Alle {TOTAL_SLOTS} tijdvakken zijn beslist 🇹🇭
        </div>
        <div style={{ fontSize: 14, color: "#706B64", marginTop: 8 }}>
          Onthulling volgt...
        </div>
        <style>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-30px); }
            60% { transform: translateY(-15px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // User select screen
  if (!activeUser)
    return (
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          background: "#0A0908",
          color: "#E8E4DF",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap"
          rel="stylesheet"
        />
        <Link
          href="/"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "#706B64",
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          ← Terug
        </Link>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🇹🇭</div>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 30,
            fontWeight: 900,
            margin: "0 0 4px",
            textAlign: "center",
            background: "linear-gradient(135deg,#D4A574,#E8B84B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Bangkok Planner
        </h1>
        <p
          style={{
            color: "#706B64",
            fontSize: 14,
            margin: "0 0 28px",
            textAlign: "center",
          }}
        >
          Thu 16 – Sun 19 Apr · Kies wie je bent
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "100%",
            maxWidth: 300,
          }}
        >
          {VOTERS.map((v) => {
            const hasVoted = Object.values(votes).some((sl) => sl[v]);
            const voteCount = Object.values(votes).filter((sl) => sl[v]).length;
            return (
              <button
                key={v}
                onClick={() => selectUser(v)}
                style={{
                  background: `${VOTER_COLORS[v]}15`,
                  border: `2px solid ${VOTER_COLORS[v]}40`,
                  borderRadius: 14,
                  padding: "14px 18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 0.15s",
                  color: VOTER_COLORS[v],
                  fontSize: 17,
                  fontWeight: 700,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                <span style={{ fontSize: 26 }}>{VOTER_EMOJI[v]}</span>
                <span style={{ flex: 1, textAlign: "left" }}>{v}</span>
                {hasVoted && (
                  <span
                    style={{
                      fontSize: 11,
                      opacity: 0.6,
                      fontWeight: 400,
                    }}
                  >
                    {voteCount}/{TOTAL_SLOTS}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );

  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        background: "#0A0908",
        color: "#E8E4DF",
        minHeight: "100dvh",
        padding: "0 0 100px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div
        style={{
          padding: "18px 16px 12px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10,9,8,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <span style={{ fontSize: 20 }}>🇹🇭</span>
            <span
              style={{
                fontFamily: "'Playfair Display',serif",
                fontWeight: 900,
                fontSize: 18,
                background: "linear-gradient(135deg,#D4A574,#E8B84B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BKK
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                background: `${VOTER_COLORS[activeUser]}20`,
                border: `1px solid ${VOTER_COLORS[activeUser]}50`,
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 13,
                color: VOTER_COLORS[activeUser],
                fontWeight: 600,
              }}
            >
              {VOTER_EMOJI[activeUser]} {activeUser}
            </div>
            <button
              onClick={switchUser}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
                color: "#706B64",
                fontSize: 11,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Wissel
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            maxWidth: 640,
            margin: "10px auto 0",
          }}
        >
          {[
            ["plan", "🗓 Stemmen"],
            ["result", "📊 Resultaat"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k as "plan" | "result")}
              style={{
                flex: 1,
                padding: "8px 0",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                fontWeight: 600,
                background:
                  tab === k ? "rgba(212,165,116,0.15)" : "rgba(255,255,255,0.04)",
                color: tab === k ? "#D4A574" : "#706B64",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 0" }}>
        {/* Reveal banner if all decided */}
        {revealed && decidedSlots === TOTAL_SLOTS && (
          <div
            style={{
              background:
                "linear-gradient(135deg,rgba(212,165,116,0.15),rgba(232,184,75,0.1))",
              border: "1px solid rgba(212,165,116,0.4)",
              borderRadius: 14,
              padding: 16,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 4 }}>🎉</div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 20,
                fontWeight: 900,
                color: "#E8B84B",
                marginBottom: 2,
              }}
            >
              Het plan is compleet!
            </div>
            <div style={{ fontSize: 12, color: "#9A958E" }}>
              Bekijk het resultaat hieronder 👇
            </div>
          </div>
        )}

        {/* Progress */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              gap: 4,
              justifyContent: "center",
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            {VOTERS.map((v) => {
              const c = Object.values(votes).filter((sl) => sl[v]).length;
              return (
                <div
                  key={v}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 12,
                    padding: "3px 8px",
                    fontSize: 11,
                  }}
                >
                  <span>{VOTER_EMOJI[v]}</span>
                  <span
                    style={{
                      color: c > 0 ? VOTER_COLORS[v] : "#504B44",
                      fontWeight: 600,
                    }}
                  >
                    {c}/{TOTAL_SLOTS}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: "#504B44" }}>
            {decidedSlots}/{TOTAL_SLOTS} beslist (3+ stemmen)
          </div>
        </div>

        {tab === "plan" &&
          DAYS.map((day) => (
            <div key={day.id} style={{ marginBottom: 24 }}>
              {/* Day header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 12,
                  borderLeft: "4px solid #D4A574",
                }}
              >
                <span style={{ fontSize: 22 }}>{day.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{day.full}</div>
                  <div style={{ fontSize: 12, color: "#706B64" }}>
                    {day.label}
                  </div>
                </div>
              </div>

              {day.locked && (
                <div
                  style={{
                    background: "rgba(219,107,92,0.08)",
                    border: "1px solid rgba(219,107,92,0.25)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginBottom: 10,
                    fontSize: 13,
                    color: "#DB6B5C",
                    fontWeight: 600,
                  }}
                >
                  🔒 {day.locked}
                </div>
              )}

              {day.slots.map((slot) => {
                const winner = getWinner(slot.id, slot.options);
                return (
                  <div key={slot.id} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 6,
                        paddingLeft: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#5CB8B2",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        {slot.time}
                      </span>
                      {winner && (
                        <span
                          style={{
                            fontSize: 10,
                            background: "rgba(123,163,123,0.15)",
                            color: "#7BA37B",
                            padding: "2px 8px",
                            borderRadius: 8,
                            fontWeight: 600,
                          }}
                        >
                          ✅ Beslist
                        </span>
                      )}
                    </div>

                    <div
                      style={{ display: "flex", flexDirection: "column", gap: 6 }}
                    >
                      {slot.options.map((opt) => {
                        const voters = getVoters(slot.id, opt.id);
                        const myVote =
                          votes[slot.id]?.[activeUser] === opt.id;
                        const isWinner = winner?.id === opt.id;
                        const tc = TYPE_CFG[opt.type];
                        return (
                          <div
                            key={opt.id}
                            onClick={() => castVote(slot.id, opt.id)}
                            style={{
                              background: isWinner
                                ? "rgba(123,163,123,0.08)"
                                : myVote
                                ? `${tc.color}10`
                                : "rgba(255,255,255,0.02)",
                              border: isWinner
                                ? "2px solid rgba(123,163,123,0.4)"
                                : myVote
                                ? `2px solid ${tc.color}50`
                                : "2px solid rgba(255,255,255,0.06)",
                              borderRadius: 12,
                              padding: "12px 14px",
                              cursor: "pointer",
                              transition: "all 0.15s",
                              position: "relative",
                            }}
                          >
                            {isWinner && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: -8,
                                  right: 10,
                                  background: "#7BA37B",
                                  color: "#000",
                                  borderRadius: 6,
                                  padding: "2px 8px",
                                  fontSize: 10,
                                  fontWeight: 700,
                                }}
                              >
                                WINNER
                              </div>
                            )}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 8,
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 700,
                                    fontSize: 14,
                                    color: myVote ? tc.color : "#E8E4DF",
                                    marginBottom: 3,
                                  }}
                                >
                                  {opt.title}
                                </div>
                                <p
                                  style={{
                                    fontSize: 12,
                                    color: "#9A958E",
                                    lineHeight: 1.45,
                                    margin: "0 0 8px",
                                  }}
                                >
                                  {opt.desc}
                                </p>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 6,
                                    fontSize: 10,
                                    color: "#706B64",
                                  }}
                                >
                                  <span
                                    style={{
                                      background: "rgba(255,255,255,0.05)",
                                      padding: "2px 7px",
                                      borderRadius: 5,
                                    }}
                                  >
                                    ⏱ {opt.dur}
                                  </span>
                                  <span
                                    style={{
                                      background: "rgba(255,255,255,0.05)",
                                      padding: "2px 7px",
                                      borderRadius: 5,
                                    }}
                                  >
                                    💰 {opt.cost}
                                  </span>
                                  <span
                                    style={{
                                      background: "rgba(255,255,255,0.05)",
                                      padding: "2px 7px",
                                      borderRadius: 5,
                                    }}
                                  >
                                    ✨ {opt.vibe}
                                  </span>
                                </div>
                              </div>
                              {/* Vote count */}
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  minWidth: 36,
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 22,
                                    fontWeight: 900,
                                    color:
                                      voters.length >= 3
                                        ? "#7BA37B"
                                        : voters.length > 0
                                        ? "#D4A574"
                                        : "#302D28",
                                    lineHeight: 1,
                                  }}
                                >
                                  {voters.length}
                                </div>
                                <div
                                  style={{
                                    fontSize: 9,
                                    color: "#504B44",
                                    marginTop: 2,
                                  }}
                                >
                                  /{VOTERS.length}
                                </div>
                              </div>
                            </div>
                            {/* Voter avatars */}
                            {voters.length > 0 && (
                              <div
                                style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}
                              >
                                {voters.map((v) => (
                                  <div
                                    key={v}
                                    style={{
                                      background: `${VOTER_COLORS[v]}20`,
                                      border: `1px solid ${VOTER_COLORS[v]}40`,
                                      borderRadius: 8,
                                      padding: "2px 7px",
                                      fontSize: 11,
                                      color: VOTER_COLORS[v],
                                      fontWeight: 600,
                                    }}
                                  >
                                    {VOTER_EMOJI[v]} {v}
                                  </div>
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
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 22,
                margin: "0 0 16px",
                color: "#D4A574",
              }}
            >
              Het Plan tot nu toe
            </h2>
            {DAYS.map((day) => (
              <div
                key={day.id}
                style={{
                  marginBottom: 20,
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 14,
                  padding: 16,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                  {day.emoji} {day.full}
                </div>
                {day.locked && (
                  <div
                    style={{
                      fontSize: 13,
                      color: "#DB6B5C",
                      marginBottom: 8,
                      paddingLeft: 8,
                      borderLeft: "3px solid #DB6B5C",
                    }}
                  >
                    🔒 {day.locked}
                  </div>
                )}
                {day.slots.map((slot) => {
                  const winner = getWinner(slot.id, slot.options);
                  const topOpt =
                    winner ||
                    slot.options.reduce<
                      DayOption & { count?: number }
                    >(
                      (best, o) => {
                        const c = getVoters(slot.id, o.id).length;
                        return c > (best.count || 0)
                          ? { ...o, count: c }
                          : best;
                      },
                      { ...slot.options[0], count: 0 }
                    );
                  const voters = winner ? getVoters(slot.id, winner.id) : [];
                  const tc = TYPE_CFG[topOpt.type] || TYPE_CFG.culture;
                  return (
                    <div
                      key={slot.id}
                      style={{
                        padding: "8px 0 8px 8px",
                        borderLeft: winner
                          ? "3px solid #7BA37B"
                          : "3px solid #302D28",
                        marginBottom: 6,
                        marginLeft: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: "#5CB8B2",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                        }}
                      >
                        {slot.time}
                      </div>
                      {winner ? (
                        <div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#7BA37B",
                              marginTop: 2,
                            }}
                          >
                            {tc.icon} {winner.title}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#706B64",
                              marginTop: 2,
                            }}
                          >
                            {voters
                              .map((v) => `${VOTER_EMOJI[v]} ${v}`)
                              .join("  ·  ")}
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: 13,
                            color: "#504B44",
                            fontStyle: "italic",
                            marginTop: 2,
                          }}
                        >
                          Nog niet beslist — meer stemmen nodig
                          {topOpt.title && (
                            <span style={{ color: "#706B64" }}>
                              {" "}
                              (leading: {topOpt.title})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            <button
              onClick={resetAll}
              style={{
                display: "block",
                margin: "20px auto",
                background: "rgba(219,107,92,0.1)",
                border: "1px solid rgba(219,107,92,0.3)",
                borderRadius: 10,
                padding: "10px 20px",
                color: "#DB6B5C",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              🗑 Reset alle stemmen
            </button>
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 11,
            color: "#302D28",
            lineHeight: 1.8,
          }}
        >
          🥊 Muay Thai Sat 19:00 LOCKED
          <br />
          🏨 Checkout Mon 11:00 → Pattaya
          <br />
          Tap een optie om te stemmen · 3/5 = beslist
        </div>
      </div>
    </div>
  );
}
