import { RankingView } from "./ranking-view";
import { getSession } from '@/lib/supabase/server';
import { getDb } from '@/lib/db/client';
import { missions, behavior } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { Zap, Star, Crown, TrendingUp } from "lucide-react";

async function getData(userId: string) {
  const db = getDb();
  const [beh] = await db.select().from(behavior).where(eq(behavior.userId, userId)).limit(1);
  const [{ value: publishedCount }] = await db
    .select({ value: count() })
    .from(missions)
    .where(and(eq(missions.userId, userId), eq(missions.status, 'completed')));
  return { beh, publishedCount: Number(publishedCount) };
}

export default async function RankingPage() {
  const session = await getSession();
  const userId = session?.user?.id;
  const isPreview = !userId || userId === '00000000-0000-0000-0000-000000000000';

  let beh: any = null;
  let publishedCount = 0;

  if (!isPreview) {
    try {
      const data = await getData(userId!);
      beh = data.beh;
      publishedCount = data.publishedCount;
    } catch (e) {
      console.error("Error fetching ranking data:", e);
    }
  }

  const stats = [
    { title: "Execução (25%)", value: publishedCount > 0 ? String(publishedCount * 10) : "850", icon: "Zap", highlight: false },
    { title: "Consistência", value: beh?.execStreak != null ? `${beh.execStreak} dias` : "0 dias", icon: "Crown", highlight: true },
    { title: "Score Global", value: beh?.consistenciaScore != null ? String(beh.consistenciaScore) : "900", icon: "Star", highlight: false },
    { title: "Evolução (15%)", value: "450", icon: "TrendingUp", highlight: false },
  ];

  const leaderboard = [
    { pos: 1, name: "Victor Lou", score: "4.500", isCurrentUser: false },
    { pos: 2, name: "Mochakk", score: "4.250", isCurrentUser: false },
    { pos: 3, name: "Vintage Culture", score: "4.100", isCurrentUser: false },
    { pos: 4, name: "Classmatic", score: "3.850", isCurrentUser: false },
    { pos: 5, name: "Gabe", score: "3.600", isCurrentUser: false },
  ];

  const currentUser = { 
    pos: 12, 
    name: session?.user?.user_metadata?.full_name || "Você (NOMMAD)", 
    score: beh?.consistenciaScore != null ? String(beh.consistenciaScore * 10) : "3.400", 
    isCurrentUser: true 
  };

  return <RankingView stats={stats} currentUser={currentUser} leaderboard={leaderboard} />;
}
