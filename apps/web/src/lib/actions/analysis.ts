"use server";

import { requireSession } from "@/lib/supabase/server";

export async function analyzeNegotiation(text: string) {
  await requireSession();

  // Simulated latency
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const length = text.trim().length;

  if (length === 0) {
    return {
      status: "error",
      message: "Texto vazio. Por favor, cole uma conversa para analisar.",
    };
  }

  // Very simple heuristics for simulation
  const hasMoney = /R\$|cachê|valor|pagamento|reais/i.test(text);
  const hasDate = /dia|data|agosto|setembro|outubro|novembro|dezembro|janeiro|fevereiro|março|abril|maio|junho|julho/i.test(text);
  const isPolite = /por favor|obrigado|gentileza|grato/i.test(text);

  if (hasMoney && hasDate && isPolite) {
    return {
      status: "success",
      title: "Venceu",
      feedback: "Análise completa: Você manteve o profissionalismo e ancorou bem o valor. O contratante parece inclinado a fechar nos seus termos.",
      xp: 200,
    };
  } else if (hasMoney || hasDate) {
    return {
      status: "partial",
      title: "Vitória Parcial",
      feedback: "Análise completa: A negociação avançou, mas alguns pontos ficaram soltos. Cuidado para não ceder demais no valor em troca da data.",
      xp: 50,
    };
  } else {
    return {
      status: "failure",
      title: "Falhou",
      feedback: "Análise completa: A conversa parece ter esfriado. Falta clareza na proposta e um 'call to action' mais forte. O contratante pode perder o interesse.",
      xp: 0,
    };
  }
}
