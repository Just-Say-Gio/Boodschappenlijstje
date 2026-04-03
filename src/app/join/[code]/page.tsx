import { JoinListClient } from "./join-client";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <JoinListClient shareCode={code} />;
}
