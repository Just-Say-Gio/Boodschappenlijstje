import { NextResponse } from "next/server";
import {
  getBangkokVotes,
  castBangkokVote,
  resetBangkokVotes,
} from "@/lib/actions";

export async function GET() {
  try {
    const before = await getBangkokVotes();

    // Cast test vote
    await castBangkokVote("Gio", "thu-eve", "chinatown");
    const after1 = await getBangkokVotes();

    // Cast different vote (should update)
    await castBangkokVote("Gio", "thu-eve", "jodd-thu");
    const after2 = await getBangkokVotes();

    // Toggle off (same vote)
    await castBangkokVote("Gio", "thu-eve", "jodd-thu");
    const after3 = await getBangkokVotes();

    return NextResponse.json({
      ok: true,
      before,
      afterInsert: after1,
      afterUpdate: after2,
      afterToggleOff: after3,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await resetBangkokVotes();
  return NextResponse.json({ ok: true, reset: true });
}
