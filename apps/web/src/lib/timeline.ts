import { addDays, subDays } from "date-fns";

export interface TimelinePhase {
  id: number;
  title: string;
  tag: string;
  description: string;
  date: Date;
}

export function calculateTimeline(releaseDate: Date): TimelinePhase[] {
  return [
    {
      id: 1,
      title: "Teaser",
      tag: "D-30",
      description: "Início da campanha, posts criando o universo visual.",
      date: subDays(releaseDate, 30),
    },
    {
      id: 2,
      title: "Pré-save",
      tag: "D-14",
      description: "Lançamento do link de pré-save e foco em conversão.",
      date: subDays(releaseDate, 14),
    },
    {
      id: 3,
      title: "Release",
      tag: "D-0",
      description: "O drop! Foco em compartilhamento e playlists.",
      date: releaseDate,
    },
    {
      id: 4,
      title: "Pós-lançamento",
      tag: "D+7",
      description: "Manutenção do hype, vídeos de bastidores e UGC.",
      date: addDays(releaseDate, 7),
    },
  ];
}
