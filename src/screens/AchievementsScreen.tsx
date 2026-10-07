
import {
  ArrowLeftRight,
  Building2,
  Compass,
  Eye,
  HandHelping,
  PenLine,
  ScanEye,
  Search,
  type LucideIcon
} from "lucide-react";
import { useGameStore } from "../store/useGameStore";
import { DistrictIcon } from "../components/DistrictIcon";
import type { DistrictKey } from "../types";

type BadgeIcon = { district: DistrictKey } | { icon: LucideIcon };

// Selos de bairro usam o mesmo ícone do bairro; os gerais têm ícone próprio.
const badges: Array<{ name: string; desc: string } & BadgeIcon> = [
  { name: "Primeira pista", desc: "Encontrou a primeira evidência relevante.", icon: Search },
  { name: "Leitor atento", desc: "Explicou uma classificação usando pistas do texto.", icon: Eye },
  { name: "Investigador", desc: "Visitou diferentes bairros da Cidade das Palavras.", icon: Compass },
  { name: "Cronista da crítica", desc: "Concluiu o Caso 1 da Charge, “Pesquisando juntos?”, dominando leitura crítica e produção.", district: "charge" },
  { name: "Quebra-silêncio", desc: "Concluiu o Caso 2 da Charge, “Ninguém mete a colher”, reconhecendo a crítica à omissão diante da violência.", icon: HandHelping },
  { name: "Olhar atento", desc: "Concluiu o Caso 3 da Charge, “Ele só é cuidadoso”, reconhecendo o controle disfarçado de cuidado.", icon: ScanEye },
  { name: "Leitor de entrelinhas", desc: "Concluiu a Floresta das Fábulas inferindo moral, justificando o gênero e produzindo uma nova fábula.", district: "fabula" },
  { name: "Guardião da memória", desc: "Restaurou a Vila das Lendas compreendendo tradição, memória coletiva e transmissão cultural.", district: "lenda" },
  { name: "Guardião da convivência", desc: "Restaurou a Câmara da Cidade compreendendo como normas organizam direitos, deveres e responsabilidades.", district: "estatuto" },
  { name: "Voz argumentativa", desc: "Restaurou a Redação Central defendendo uma tese com argumentos, evidências e resposta a objeções.", district: "artigo" },
  { name: "Voz do leitor", desc: "Restaurou a Central do Leitor dialogando com uma publicação de forma pública, argumentada e respeitosa.", district: "carta" },
  { name: "Mestre da entrelinha", desc: "Restaurou a Estação Miniconto produzindo narrativa concisa, com movimento e espaço para inferência.", district: "miniconto" },
  { name: "Mestre das lentes", desc: "Restaurou o Laboratório das Lentes reconhecendo e produzindo diferentes efeitos de sentido.", district: "figuras" },
  { name: "Cidade restaurada", desc: "Concluiu todos os distritos abertos da Cidade das Palavras.", icon: Building2 },
  { name: "Mestre dos contrastes", desc: "Diferenciou conceitos próximos sem depender apenas de memorização.", icon: ArrowLeftRight },
  { name: "Autor da cidade", desc: "Complete uma produção própria.", icon: PenLine },
];

export function AchievementsScreen() {
  const unlocked = useGameStore((s) => s.achievements);

  return (
    <main className="content-screen">
      <header className="screen-heading">
        <span className="eyebrow">CONQUISTAS</span>
        <h1>Selos da jornada</h1>
        <p>As conquistas celebram habilidades desenvolvidas, não apenas quantidade de respostas.</p>
      </header>

      <div className="achievement-grid">
        {badges.map((badge) => {
          const isUnlocked = unlocked.includes(badge.name);
          return (
            <article className={`achievement-card ${isUnlocked ? "unlocked" : "locked"}`} key={badge.name}>
              <div className="achievement-icon" aria-hidden="true">
                {"district" in badge ? (
                  <DistrictIcon district={badge.district} size={26} />
                ) : (
                  <badge.icon size={26} strokeWidth={2.1} />
                )}
              </div>
              <div>
                <span className="card-kicker">{isUnlocked ? "DESBLOQUEADO" : "AINDA BLOQUEADO"}</span>
                <h2>{badge.name}</h2>
                <p>{badge.desc}</p>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
