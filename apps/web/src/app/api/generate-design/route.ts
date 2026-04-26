import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;

  if (!FREEPIK_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Chave de API da Freepik não configurada. Adicione FREEPIK_API_KEY no arquivo .env.local.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "O campo 'prompt' é obrigatório." },
        { status: 400 }
      );
    }

    // Chamada à API da Freepik
    const response = await fetch("https://api.freepik.com/v1/ai/text-to-image", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-freepik-api-key": FREEPIK_API_KEY,
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        guidance_scale: 2,
        num_inference_steps: 4, // Configuração para geração rápida (estilo Flux)
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[generate-design] Freepik API error:", errorText);
      return NextResponse.json(
        { error: "Falha ao gerar imagem na Freepik. Tente novamente." },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // A Freepik retorna a imagem em base64 dentro do array 'data'
    const base64Image = data?.data?.[0]?.base64;

    if (!base64Image) {
      console.error("[generate-design] Resposta inesperada da Freepik:", JSON.stringify(data).slice(0, 200));
      return NextResponse.json(
        { error: "Nenhuma imagem retornada pela API da Freepik." },
        { status: 502 }
      );
    }

    // Formata o Data URL (Assumindo jpeg/png, freepik geralmente retorna jpeg/png em base64)
    // O prefixo pode ser ajustado para jpeg dependendo do que a API explicitamente retornar (geralmente jpeg/png)
    const dataUrlFinal = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({ imageUrl: dataUrlFinal });
  } catch (err: any) {
    console.error("[generate-design] Internal error:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar a requisição." },
      { status: 500 }
    );
  }
}

