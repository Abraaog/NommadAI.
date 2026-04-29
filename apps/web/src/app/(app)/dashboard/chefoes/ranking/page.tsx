import { RankingView } from "./ranking-view";
import { getSession } from '@/lib/supabase/server';
import { db } from '@/lib/db/client';
import { leaderboardScores, profiles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

async function getData(userId: string) {
  // 1. Buscar score atual do usuário
  const [score] = await db.select()
    .from(leaderboardScores)
    .where(eq(leaderboardScores.userId, userId))
    .limit(1);

  // 2. Buscar Top 5 Global
  const topPlayers = await db.select({
    name: profiles.artistName,
    realName: profiles.name,
    score: leaderboardScores.score,
    userId: leaderboardScores.userId
  })
    .from(leaderboardScores)
    .innerJoin(profiles, eq(leaderboardScores.userId, profiles.id))
    .orderBy(desc(leaderboardScores.score))
    .limit(5);

  return { score, topPlayers };
}

export default async function RankingPage() {
  const session = await getSession();
  const userId = session?.user?.id;
  
  // Dados de fallback para preview ou erro
  let userScore: any = { score: 1200, executionScore: 300, bossScore: 400, impactScore: 200, evolutionScore: 300 };
  let leaderboard: any[] = [
    { pos: 1, name: "VICTOR LOU", score: 4500 },
    { pos: 2, name: "MOCHAKK", score: 4250 },
    { pos: 3, name: "VINTAGE CULTURE", score: 4100 },
    { pos: 4, name: "CLASSMATIC", score: 3850 },
    { pos: 5, name: "GABE", score: 3600 },
  ];

  if (userId) {
    try {
      const data = await getData(userId);
      if (data.score) userScore = data.score;
      if (data.topPlayers.length > 0) {
        leaderboard = data.topPlayers.map((p, i) => ({
          pos: i + 1,
          name: (p.name || p.realName || 'Artista Anônimo').toUpperCase(),
          score: p.score
        }));
      }
    } catch (e) {
      console.error("Error fetching ranking data:", e);
    }
  }

  const stats = [
    { title: "Execução (30%)", value: String(userScore.executionScore), icon: "Zap", highlight: false },
    { title: "Chefões (40%)", value: String(userScore.bossScore), icon: "Sword", highlight: true },
    { title: "Impacto (20%)", value: String(userScore.impactScore), icon: "Target", highlight: false },
    { title: "Evolução (10%)", value: String(userScore.evolutionScore), icon: "TrendingUp", highlight: false },
  ];

  const currentUser = {
    pos: 12, // Simplificação - em produção calcularíamos o RANK real via SQL
    name: session?.user?.user_metadata?.full_name || "Você",
    score: userScore.score
  };

  return <RankingView stats={stats} currentUser={currentUser} leaderboard={leaderboard} />;
}
