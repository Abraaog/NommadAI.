"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';

// Dados Mockados
const gData = {
  nodes: [
    { id: 'essencia', name: 'Sua Essência Sonora', group: 1, val: 25 },
    
    // Teses (Group 2)
    { id: 'tese1', name: 'A Guerra por Atenção', group: 2, val: 12 },
    { id: 'tese2', name: 'Basslines Saturados', group: 2, val: 12 },
    { id: 'tese3', name: 'Estética Dark/Tech', group: 2, val: 12 },

    // Hooks (Group 3)
    { id: 'hook1', name: 'O Segredo do Bassline', group: 3, val: 8 },
    { id: 'hook2', name: 'Workflow no Ableton', group: 3, val: 8 },
    { id: 'hook3', name: '3 Erros no Kick', group: 3, val: 8 },
    
    // Referências (Group 4)
    { id: 'ref1', name: 'Michael Bibi (Referência)', group: 4, val: 6 },
    { id: 'ref2', name: 'PAWSA (Referência)', group: 4, val: 6 },
    { id: 'ref3', name: 'Beatport Top 100', group: 4, val: 6 },
  ],
  links: [
    // Conectando teses à essência
    { source: 'tese1', target: 'essencia' },
    { source: 'tese2', target: 'essencia' },
    { source: 'tese3', target: 'essencia' },

    // Conectando hooks às teses
    { source: 'hook1', target: 'tese2' },
    { source: 'hook2', target: 'tese1' },
    { source: 'hook3', target: 'tese3' },
    
    // Conectando referências
    { source: 'ref1', target: 'tese2' },
    { source: 'ref2', target: 'tese2' },
    { source: 'ref3', target: 'tese1' },
    
    // Conexões cruzadas para formar teia
    { source: 'hook1', target: 'ref2' },
    { source: 'tese3', target: 'tese1' },
  ]
};

export default function BrainGraph() {
  const fgRef = useRef<ForceGraphMethods | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState<NodeObject | null>(null);
  const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dados reais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/brain/graph");
        const data = await res.json();
        if (data.nodes) setGraphData(data);
      } catch (error) {
        console.error("Erro ao carregar mapa mental:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-resize do canvas para ocupar 100% da tela
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    // Ajustes Avançados de Física (Efeito Mola e Flutuação)
    if (fgRef.current) {
      const chargeForce = fgRef.current.d3Force('charge');
      if (chargeForce) chargeForce.strength(-500); // Repulsão forte para espalhar
      
      const linkForce = fgRef.current.d3Force('link');
      if (linkForce) linkForce.distance(120); // Elástico longo
      
      const centerForce = fgRef.current.d3Force('center');
      if (centerForce) centerForce.strength(0.05); // Gravidade suave pro centro
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Customização de renderização dos nós (Estilo Obsidian)
  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name as string;
    const fontSize = 12 / globalScale;
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    
    // Cores baseadas no grupo
    let nodeColor = 'rgba(255, 255, 255, 0.7)'; // Padrão
    let glowColor = 'transparent';
    let radius = Math.sqrt(node.val || 10) * 1.5;

    if (node.group === 1) {
      nodeColor = '#FFD700'; // Amarelo Elétrico para a essência
      glowColor = 'rgba(255, 215, 0, 0.4)';
    } else if (node.group === 2) {
      nodeColor = '#E2E8F0'; // Branco/Cinza para teses
    } else if (node.group === 3) {
      nodeColor = '#94A3B8'; // Cinza mais escuro para hooks
    }

    const isHovered = node === hoverNode;

    if (isHovered) {
      nodeColor = '#FFD700';
      glowColor = 'rgba(255, 215, 0, 0.6)';
      radius += 2;
    }

    // Desenhar o glow
    if (glowColor !== 'transparent' || isHovered) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 2.5, 0, 2 * Math.PI, false);
      ctx.fillStyle = glowColor;
      ctx.fill();
    }

    // Desenhar o nó central
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeColor;
    ctx.fill();

    // Renderizar o texto ao lado
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    if (isHovered) {
      ctx.fillStyle = 'rgba(20, 20, 22, 0.9)'; // Fundo mais escuro no hover
    }
    
    // Fundo do texto (pílula)
    ctx.beginPath();
    ctx.roundRect(
      node.x + radius + 2 - fontSize * 0.1,
      node.y - bckgDimensions[1] / 2,
      bckgDimensions[0] + fontSize * 0.2,
      bckgDimensions[1],
      4 / globalScale // border radius
    );
    ctx.fill();

    // O texto em si
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isHovered ? '#FFD700' : 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(label, node.x + radius + 2, node.y);

  }, [hoverNode]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-[#FFD700] animate-spin" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 cursor-crosshair overflow-hidden">
      <ForceGraph2D
        ref={fgRef as any}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel={() => ''} // Desativando tooltip padrão HTML
        nodeColor={() => '#FFD700'}
        linkColor={() => 'rgba(255, 255, 255, 0.15)'}
        linkWidth={(link: any) => hoverNode && (link.source === hoverNode || link.target === hoverNode) ? 2 : 1}
        nodeCanvasObject={nodeCanvasObject}
        onNodeHover={(node) => {
          document.body.style.cursor = node ? 'grab' : 'crosshair';
          setHoverNode(node || null);
        }}
        onNodeDrag={(node) => {
          document.body.style.cursor = 'grabbing';
        }}
        onNodeDragEnd={(node) => {
          document.body.style.cursor = 'grab';
          node.fx = undefined;
          node.fy = undefined;
          fgRef.current?.d3ReheatSimulation();
        }}
        d3AlphaDecay={0.01}
        d3VelocityDecay={0.08}
        warmupTicks={100}
        backgroundColor="transparent"
      />
    </div>
  );
}
