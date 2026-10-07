import { Star, RadioTower, MessageCircleWarning, Forward, EyeOff, ShieldCheck } from "lucide-react";
import { useMemo, useState, type ReactElement } from "react";
import teacherImage from "../assets/teacher-guide.webp";
import { useGameStore } from "../store/useGameStore";
import { shuffle } from "../utils/shuffle";
import { SupportNote } from "../components/SupportNote";

/*
 * Missão A Rede — Matemática + Língua Portuguesa.
 * Uma mensagem que expõe uma colega fictícia (Bia) se espalha: cada pessoa
 * repassa para 3. O aluno prevê o padrão, decide o que fazer, compara soma com
 * multiplicação, aplica com outro fator e cria uma campanha.
 */

type Stage = "investigate" | "simulate" | "choose" | "represent" | "apply" | "produce" | "complete";

const stageOrder: Stage[] = ["investigate", "simulate", "choose", "represent", "apply", "produce"];

const stageLabels: Record<Stage, string> = {
  investigate: "Investigar",
  simulate: "Simular",
  choose: "Escolher",
  represent: "Representar",
  apply: "Aplicar",
  produce: "Produzir",
  complete: "Concluir"
};

const fmt = (value: number) => value.toLocaleString("pt-BR");

const observations = [
  {
    q: "Quem está sendo exposta?",
    a: "A Bia. Uma conversa particular dela virou piada no grupo."
  },
  {
    q: "A Bia autorizou que a conversa fosse mostrada?",
    a: "Não. Era uma conversa privada. Mostrar sem autorização expõe e humilha a pessoa."
  },
  {
    q: "O que a mensagem pede para quem lê?",
    a: "Pede para repassar. Assim, cada pessoa que lê vira parte da exposição."
  },
  {
    q: "Se cada pessoa repassar para 3 contatos, quantas vão receber?",
    a: "É isso que vamos descobrir na próxima etapa, rodada por rodada."
  }
];

/* Previsões da etapa Simular: rodada → opções (a certa é 3 elevado à rodada). */
const predictions: Array<{ round: number; from: number; options: number[] }> = [
  { round: 2, from: 3, options: [6, 9, 12] },
  { round: 3, from: 9, options: [12, 18, 27] },
  { round: 4, from: 27, options: [30, 54, 81] }
];

const explanationOptions = [
  {
    id: "senders",
    label:
      "Porque cada pessoa que recebe também repassa. O número de quem envia cresce a cada rodada. Na soma, o número aumenta sempre só 3.",
    correct: true,
    feedback: "Isso mesmo. Quem recebe vira quem envia. Por isso o crescimento acelera: é multiplicação, não soma."
  },
  {
    id: "funny",
    label: "Porque a mensagem vai ficando mais engraçada com o tempo.",
    correct: false,
    feedback: "O conteúdo não muda. O que muda é a quantidade de pessoas que repassam a cada rodada."
  },
  {
    id: "twice",
    label: "Porque na multiplicação a gente soma 3 duas vezes em cada rodada.",
    correct: false,
    feedback: "Não é somar duas vezes. A cada rodada, o total anterior é multiplicado por 3."
  }
];

const applyOptions = [
  {
    id: "r5",
    label: "Na 5ª rodada",
    correct: false,
    feedback: "Na 5ª rodada, 32 pessoas recebem (2⁵ = 32). Ainda está longe de mil. Use a calculadora."
  },
  {
    id: "r10",
    label: "Na 10ª rodada",
    correct: true,
    feedback: "Correto! 2¹⁰ = 1.024. Mesmo repassando para só 2 pessoas, a mensagem passa de mil em 10 rodadas."
  },
  {
    id: "r50",
    label: "Só depois da 50ª rodada",
    correct: false,
    feedback: "Bem antes disso. Multiplicar por 2 várias vezes cresce rápido. Use a calculadora para conferir."
  }
];

const campaignNumbers = [
  "Em 6 rodadas, uma mensagem chega a 729 pessoas.",
  "Mesmo repassando para só 2, passa de 1.000 pessoas em 10 rodadas.",
  "Quando você não repassa, 12 pessoas deixam de receber em só duas rodadas."
];
const campaignPhrases = [
  "Uma mensagem não para em você. Mas pode parar com você.",
  "Repassar também é expor.",
  "Antes de encaminhar, pense em quem está do outro lado."
];
const campaignActions = ["Não repasse.", "Apague e avise quem mandou.", "Denuncie e apoie quem foi exposta."];

/* ---------- Árvore radial da Rede ---------- */

const RADII = [0, 62, 118, 170, 214];
const CENTER = 240;
/** "Você" é a 5ª das 9 pessoas da rodada 2. */
const YOU = { level: 2, index: 4 };

function nodePosition(level: number, index: number) {
  if (level === 0) return { x: CENTER, y: CENTER };
  const count = 3 ** level;
  const angle = ((index + 0.5) / count) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTER + RADII[level] * Math.cos(angle), y: CENTER + RADII[level] * Math.sin(angle) };
}

/** Um nó pertence ao galho de "você" se descende da posição YOU. */
function inYourBranch(level: number, index: number) {
  if (level < YOU.level) return false;
  const factor = 3 ** (level - YOU.level);
  return Math.floor(index / factor) === YOU.index;
}

function NetworkTree({
  shownLevels,
  highlightYou = false,
  cutBranch = false
}: {
  shownLevels: number;
  highlightYou?: boolean;
  cutBranch?: boolean;
}) {
  const lines: ReactElement[] = [];
  const nodes: ReactElement[] = [];

  for (let level = 0; level <= shownLevels; level += 1) {
    const count = 3 ** level;
    for (let index = 0; index < count; index += 1) {
      const pos = nodePosition(level, index);
      const faded = cutBranch && level > YOU.level && inYourBranch(level, index);
      const isYou = highlightYou && level === YOU.level && index === YOU.index;
      if (level > 0) {
        const parent = nodePosition(level - 1, Math.floor(index / 3));
        lines.push(
          <line
            key={`l-${level}-${index}`}
            x1={parent.x}
            y1={parent.y}
            x2={pos.x}
            y2={pos.y}
            className={`rede-link ${faded ? "faded" : ""} level-${level}`}
          />
        );
      }
      nodes.push(
        <circle
          key={`n-${level}-${index}`}
          cx={pos.x}
          cy={pos.y}
          r={level === 0 ? 13 : level === 1 ? 9 : level === 2 ? 7 : level === 3 ? 5 : 3.6}
          className={`rede-node ${level === 0 ? "origin" : ""} ${faded ? "faded" : ""} ${isYou ? "you" : ""} level-${level}`}
        />
      );
    }
  }

  const youPos = nodePosition(YOU.level, YOU.index);

  return (
    <svg
      className="rede-tree"
      viewBox="0 0 480 480"
      role="img"
      aria-label={`Rede de compartilhamento com ${shownLevels} rodadas`}
    >
      {[1, 2, 3, 4].map((level) => (
        <circle key={level} cx={CENTER} cy={CENTER} r={RADII[level]} className="rede-ring" />
      ))}
      {lines}
      {nodes}
      {highlightYou && (
        <text x={youPos.x} y={youPos.y - 14} textAnchor="middle" className="rede-you-label">
          VOCÊ
        </text>
      )}
    </svg>
  );
}

/* ---------- Gráfico soma × multiplicação ---------- */

function GrowthChart() {
  const rounds = [1, 2, 3, 4, 5, 6];
  const sum = rounds.map((r) => 3 * r);
  const mult = rounds.map((r) => 3 ** r);
  const max = 729;
  const W = 520;
  const H = 260;
  const pad = { l: 44, r: 16, t: 16, b: 34 };
  const x = (i: number) => pad.l + (i / (rounds.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - (v / max) * (H - pad.t - pad.b);
  const path = (values: number[]) => values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");

  return (
    <figure className="rede-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gráfico comparando somar 3 e multiplicar por 3 em 6 rodadas">
        {[0, 243, 486, 729].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="rede-grid" />
            <text x={pad.l - 8} y={y(v) + 4} textAnchor="end" className="rede-axis">
              {v}
            </text>
          </g>
        ))}
        {rounds.map((r, i) => (
          <text key={r} x={x(i)} y={H - 10} textAnchor="middle" className="rede-axis">
            {r}ª
          </text>
        ))}
        <path d={path(sum)} className="rede-line sum" />
        <path d={path(mult)} className="rede-line mult" />
        {mult.map((v, i) => (
          <circle key={`m${i}`} cx={x(i)} cy={y(v)} r={4} className="rede-dot mult" />
        ))}
        {sum.map((v, i) => (
          <circle key={`s${i}`} cx={x(i)} cy={y(v)} r={4} className="rede-dot sum" />
        ))}
      </svg>
      <figcaption>
        <span className="key sum">Somar 3 a cada rodada</span>
        <span className="key mult">Multiplicar por 3 a cada rodada</span>
      </figcaption>
    </figure>
  );
}

/* ---------- Tela ---------- */

export function RedeMissionScreen() {
  const setActiveView = useGameStore((s) => s.setActiveView);
  const markStage = useGameStore((s) => s.markStage);
  const addAchievement = useGameStore((s) => s.addAchievement);
  const mastery = useGameStore((s) => s.mastery);
  const xp = useGameStore((s) => s.xp);

  const [stage, setStage] = useState<Stage>("investigate");
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  const [openObservation, setOpenObservation] = useState<number | null>(null);

  // Simular
  const [shownLevels, setShownLevels] = useState(1);
  const [predictionChoice, setPredictionChoice] = useState<number | null>(null);

  // Escolher
  const [decision, setDecision] = useState<"forward" | "ignore" | "report" | null>(null);
  const [factor, setFactor] = useState(3);

  // Representar
  const [explanation, setExplanation] = useState<string | null>(null);

  // Aplicar
  const [calcRounds, setCalcRounds] = useState(1);
  const [applyChoice, setApplyChoice] = useState<string | null>(null);

  // Produzir
  const [campaignNumber, setCampaignNumber] = useState("");
  const [campaignPhrase, setCampaignPhrase] = useState("");
  const [campaignAction, setCampaignAction] = useState("");

  const shuffledExplanations = useMemo(() => shuffle(explanationOptions), []);
  const shuffledApply = useMemo(() => shuffle(applyOptions), []);
  const shuffledPredictions = useMemo(
    () => predictions.map((p) => ({ ...p, options: shuffle(p.options) })),
    []
  );

  const stageIndex = stageOrder.indexOf(stage);
  const currentPrediction = shuffledPredictions.find((p) => p.round === shownLevels + 1) ?? null;
  const simulationDone = shownLevels >= 4;

  const teacherText = useMemo(() => {
    switch (stage) {
      case "investigate":
        return "Leia a mensagem com calma. Antes de fazer qualquer conta, pense: quem está sendo exposta e o que a mensagem pede para você fazer?";
      case "simulate":
        return "Cada pessoa repassa para 3 contatos. Antes de revelar cada rodada, tente prever quantas pessoas vão receber.";
      case "choose":
        return "Agora a mensagem chegou até você. A sua escolha muda o tamanho da rede. Veja o que acontece com cada opção.";
      case "represent":
        return "Vamos comparar dois jeitos de crescer: somar 3 por rodada ou multiplicar por 3. O gráfico mostra a diferença.";
      case "apply":
        return "Se cada pessoa repassar para só 2, a mensagem ainda chega a muita gente? Use a calculadora de rodadas para descobrir.";
      case "produce":
        return "Use o que você calculou para criar uma campanha. Um número bem escolhido convence mais do que muitas palavras.";
      case "complete":
        return "Você usou a matemática para entender uma escolha do dia a dia. Uma mensagem não para em você, mas pode parar com você.";
    }
  }, [stage]);

  function go(next: Stage) {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function awardMastery(key: "recognize" | "explain" | "apply" | "produce", label: string) {
    if (mastery.rede[key]) return;
    markStage("rede", key);
    setRewardMessage(`+25 XP · ${label}`);
    window.setTimeout(() => setRewardMessage(null), 2200);
  }

  function choosePrediction(value: number) {
    setPredictionChoice(value);
    if (!currentPrediction) return;
    if (value === currentPrediction.from * 3) {
      window.setTimeout(() => {
        setShownLevels((level) => level + 1);
        setPredictionChoice(null);
        if (currentPrediction.round === 4) awardMastery("recognize", "Reconhecer concluído");
      }, 700);
    }
  }

  const selectedExplanation = explanationOptions.find((item) => item.id === explanation);
  const selectedApply = applyOptions.find((item) => item.id === applyChoice);
  const campaignReady = Boolean(campaignNumber && campaignPhrase && campaignAction);

  // Escolher: alcance até a 5ª rodada para o fator escolhido
  const factorRounds = [1, 2, 3, 4, 5].map((r) => factor ** r);
  const factorTotal = factorRounds.reduce((sum, value) => sum + value, 0);

  // Aplicar: calculadora de rodadas (×2)
  const calcValues = Array.from({ length: calcRounds }, (_, i) => 2 ** (i + 1));

  function completeMission() {
    if (!campaignReady) return;
    awardMastery("produce", "Produzir concluído");
    addAchievement("Corrente quebrada");
    addAchievement("Autor da cidade");
    go("complete");
  }

  return (
    <main className="charge-v6-page rede-page">
      {rewardMessage && (
        <div className="xp-toast" role="status" aria-live="polite">
          <span>
            <Star size={18} fill="currentColor" aria-hidden="true" />
          </span>
          <b>{rewardMessage}</b>
        </div>
      )}

      <header className="charge-v6-header">
        <div className="charge-v6-title">
          <span className="eyebrow">TORRE DA REDE</span>
          <h1>Missão: “Repassa pra geral!”</h1>
          <small>Matemática e escolhas na internet</small>
        </div>

        <div
          className="charge-v6-stage-progress"
          aria-label={`Etapa ${stage === "complete" ? 6 : stageIndex + 1} de 6`}
        >
          <span>ETAPA {stage === "complete" ? 6 : stageIndex + 1} DE 6</span>
          <div>
            {stageOrder.map((item, index) => (
              <i key={item} className={index <= stageIndex || stage === "complete" ? "done" : ""} />
            ))}
          </div>
        </div>

        <button type="button" className="secondary-action" onClick={() => setActiveView("map")}>
          ← Voltar ao mapa
        </button>
      </header>

      <div className="charge-v6-grid">
        <aside className="charge-v6-left">
          <section className="charge-v6-teacher">
            <div className="charge-v6-teacher-image">
              <img src={teacherImage} alt="Professora Fabricia" />
            </div>
            <div className="charge-v6-teacher-copy">
              <span>PROFª FABRICIA</span>
              <p>{teacherText}</p>
            </div>
          </section>

          <section className="charge-v6-steps">
            <strong>SUA MISSÃO</strong>
            <div className="charge-v6-step-list">
              {stageOrder.map((item, index) => (
                <div
                  key={item}
                  className={`${index === stageIndex ? "current" : ""} ${
                    index < stageIndex || stage === "complete" ? "finished" : ""
                  }`}
                >
                  <b>{index + 1}</b>
                  <span>{stageLabels[item]}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="charge-v6-main">
          <section className="charge-v6-task">
            {/* 1. INVESTIGAR */}
            {stage === "investigate" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>01</span>
                  <div>
                    <h2>Chegou uma mensagem no grupo</h2>
                    <p>Leia a mensagem e abra as perguntas para pensar sobre ela.</p>
                  </div>
                </div>

                <div className="rede-phone" aria-label="Mensagem recebida no grupo da turma">
                  <div className="rede-phone-top">
                    <MessageCircleWarning size={18} aria-hidden="true" />
                    <b>Turma da noite</b>
                    <small>32 participantes</small>
                  </div>
                  <div className="rede-bubble">
                    <small>Contato desconhecido</small>
                    <p>
                      Vocês viram o print da conversa da Bia com o ex? 😂😂
                      <br />
                      <b>Repassa pra geral ver!</b>
                    </p>
                    <em>Encaminhada com frequência</em>
                  </div>
                  <p className="rede-fiction-note">A Bia e a mensagem são fictícias, criadas para esta missão.</p>
                </div>

                <div className="charge-v6-observation-list">
                  {observations.map((item, index) => (
                    <button
                      type="button"
                      key={item.q}
                      className={openObservation === index ? "open" : ""}
                      onClick={() => setOpenObservation(openObservation === index ? null : index)}
                    >
                      <strong>{item.q}</strong>
                      <span>{openObservation === index ? item.a : "Clique para analisar"}</span>
                    </button>
                  ))}
                </div>

                <SupportNote />

                <button type="button" className="primary-action charge-v6-next" onClick={() => go("simulate")}>
                  Próxima etapa: Simular →
                </button>
              </>
            )}

            {/* 2. SIMULAR */}
            {stage === "simulate" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>02</span>
                  <div>
                    <h2>Rodada por rodada</h2>
                    <p>
                      A pessoa do centro manda a mensagem para 3 contatos. Cada um repassa para mais 3. Preveja
                      quantas pessoas recebem em cada rodada.
                    </p>
                  </div>
                </div>

                <div className="rede-sim">
                  <NetworkTree shownLevels={shownLevels} />

                  <div className="rede-sim-side">
                    <table className="rede-table">
                      <thead>
                        <tr>
                          <th>Rodada</th>
                          <th>Recebem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4].map((round) => (
                          <tr key={round} className={round <= shownLevels ? "shown" : ""}>
                            <td>{round}ª</td>
                            <td>{round <= shownLevels ? fmt(3 ** round) : "?"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {currentPrediction && (
                      <div className="rede-predict">
                        <b>
                          {fmt(currentPrediction.from)} pessoas repassam para 3 cada. Quantas recebem na{" "}
                          {currentPrediction.round}ª rodada?
                        </b>
                        <div className="rede-predict-options">
                          {currentPrediction.options.map((value) => {
                            const correct = value === currentPrediction.from * 3;
                            const chosen = predictionChoice === value;
                            return (
                              <button
                                type="button"
                                key={value}
                                className={chosen ? (correct ? "correct" : "wrong") : ""}
                                onClick={() => choosePrediction(value)}
                              >
                                {fmt(value)}
                              </button>
                            );
                          })}
                        </div>
                        {predictionChoice !== null && predictionChoice !== currentPrediction.from * 3 && (
                          <p className="rede-hint">
                            Quase. Lembre: são {fmt(currentPrediction.from)} pessoas, e cada uma manda para 3.
                            Quanto é {fmt(currentPrediction.from)} × 3?
                          </p>
                        )}
                      </div>
                    )}

                    {simulationDone && (
                      <div className="charge-v6-feedback success">
                        <b>Você descobriu o padrão.</b>
                        <p>
                          A cada rodada, o número de pessoas é multiplicado por 3: 3, 9, 27, 81. Em só 4 rodadas,{" "}
                          {fmt(3 + 9 + 27 + 81)} pessoas já receberam a mensagem.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {simulationDone && (
                  <button type="button" className="primary-action charge-v6-next" onClick={() => go("choose")}>
                    Próxima etapa: Escolher →
                  </button>
                )}
              </>
            )}

            {/* 3. ESCOLHER */}
            {stage === "choose" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>03</span>
                  <div>
                    <h2>A mensagem chegou até você</h2>
                    <p>Você é uma das 9 pessoas da 2ª rodada. O que você faz?</p>
                  </div>
                </div>

                <div className="rede-sim">
                  <NetworkTree
                    shownLevels={4}
                    highlightYou
                    cutBranch={decision === "ignore" || decision === "report"}
                  />

                  <div className="rede-sim-side">
                    <div className="rede-decisions">
                      <button
                        type="button"
                        className={decision === "forward" ? "selected warn" : ""}
                        onClick={() => setDecision("forward")}
                      >
                        <Forward size={20} aria-hidden="true" /> Repassar
                      </button>
                      <button
                        type="button"
                        className={decision === "ignore" ? "selected" : ""}
                        onClick={() => setDecision("ignore")}
                      >
                        <EyeOff size={20} aria-hidden="true" /> Ignorar e apagar
                      </button>
                      <button
                        type="button"
                        className={decision === "report" ? "selected good" : ""}
                        onClick={() => setDecision("report")}
                      >
                        <ShieldCheck size={20} aria-hidden="true" /> Denunciar e apoiar a Bia
                      </button>
                    </div>

                    {decision === "forward" && (
                      <div className="charge-v6-feedback warning">
                        <b>A rede cresceu a partir de você.</b>
                        <p>
                          Do seu repasse saem mais 3 + 9 = <strong>12 pessoas</strong> até a 4ª rodada, e o seu galho
                          continua crescendo depois. Repassar faz de você parte da exposição da Bia. Você pode mudar sua
                          escolha.
                        </p>
                      </div>
                    )}
                    {decision === "ignore" && (
                      <div className="charge-v6-feedback success">
                        <b>O seu galho apagou.</b>
                        <p>
                          Por causa da sua escolha, 3 + 9 = <strong>12 pessoas</strong> deixaram de receber a mensagem
                          até a 4ª rodada. A corrente parou com você.
                        </p>
                      </div>
                    )}
                    {decision === "report" && (
                      <div className="charge-v6-feedback success">
                        <b>O seu galho apagou, e você foi além.</b>
                        <p>
                          3 + 9 = <strong>12 pessoas</strong> deixaram de receber até a 4ª rodada. Denunciar ajuda a
                          remover a mensagem, e apoiar a Bia mostra que ela não está sozinha.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {decision && decision !== "forward" && (
                  <>
                    <div className="rede-factor">
                      <b>E se a turma toda mudasse? Cada pessoa repassa para quantos contatos?</b>
                      <div className="rede-factor-buttons">
                        {[3, 2, 1, 0].map((value) => (
                          <button
                            type="button"
                            key={value}
                            className={factor === value ? "selected" : ""}
                            onClick={() => setFactor(value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                      <div className="rede-bars" aria-label="Pessoas que recebem em cada rodada">
                        {factorRounds.map((value, i) => (
                          <div key={i} className="rede-bar-row">
                            <span>{i + 1}ª rodada</span>
                            <div className="rede-bar-track">
                              <i style={{ width: `${Math.max(value > 0 ? 1.2 : 0, (value / 243) * 100)}%` }} />
                            </div>
                            <b>{fmt(value)}</b>
                          </div>
                        ))}
                      </div>
                      <p className="rede-factor-total">
                        Total em 5 rodadas: <strong>{fmt(factorTotal)} pessoas</strong>
                        {factor === 0 && " — ninguém repassou, e a Bia foi protegida."}
                      </p>
                    </div>

                    <button type="button" className="primary-action charge-v6-next" onClick={() => go("represent")}>
                      Próxima etapa: Representar →
                    </button>
                  </>
                )}
              </>
            )}

            {/* 4. REPRESENTAR */}
            {stage === "represent" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>04</span>
                  <div>
                    <h2>Somar ou multiplicar?</h2>
                    <p>
                      Compare as duas linhas. Na laranja, cada rodada tem 3 pessoas a mais que a anterior. Na azul,
                      cada rodada tem 3 vezes mais pessoas que a anterior.
                    </p>
                  </div>
                </div>

                <GrowthChart />

                <div className="rede-compare">
                  <div>
                    <span>Somando 3 a cada rodada, na 6ª:</span>
                    <b>3 + 3 + 3 + 3 + 3 + 3 = 18</b>
                  </div>
                  <div>
                    <span>Multiplicando por 3 a cada rodada, na 6ª:</span>
                    <b>
                      3 × 3 × 3 × 3 × 3 × 3 = 3<sup>6</sup> = 729
                    </b>
                  </div>
                </div>

                <p className="rede-question">Por que, na 6ª rodada, a diferença fica tão grande?</p>
                <div className="charge-v6-options stacked">
                  {shuffledExplanations.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={explanation === item.id ? (item.correct ? "correct" : "wrong") : ""}
                      onClick={() => {
                        setExplanation(item.id);
                        if (item.correct) awardMastery("explain", "Explicar concluído");
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {selectedExplanation && (
                  <div className={`charge-v6-feedback ${selectedExplanation.correct ? "success" : "warning"}`}>
                    <b>{selectedExplanation.correct ? "Explicação correta." : "Ainda não."}</b>
                    <p>{selectedExplanation.feedback}</p>
                  </div>
                )}

                {selectedExplanation?.correct && (
                  <>
                    <div className="charge-v6-tip">
                      <b>Um jeito curto de escrever</b>
                      <p>
                        Multiplicar o 3 por ele mesmo várias vezes se chama <strong>potência</strong>. 3 × 3 × 3 × 3
                        × 3 × 3 se escreve 3<sup>6</sup> (lê-se “três elevado a seis”). O número pequeno diz quantas
                        vezes o 3 aparece.
                      </p>
                    </div>
                    <button type="button" className="primary-action charge-v6-next" onClick={() => go("apply")}>
                      Próxima etapa: Aplicar →
                    </button>
                  </>
                )}
              </>
            )}

            {/* 5. APLICAR */}
            {stage === "apply" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>05</span>
                  <div>
                    <h2>E se cada um repassar para só 2?</h2>
                    <p>Em qual rodada o número de pessoas que recebem passa de 1.000?</p>
                  </div>
                </div>

                <div className="rede-calc">
                  <div className="rede-calc-head">
                    <b>Calculadora de rodadas (× 2)</b>
                    <div>
                      <button
                        type="button"
                        className="secondary-action"
                        onClick={() => setCalcRounds((value) => Math.max(1, value - 1))}
                        disabled={calcRounds <= 1}
                      >
                        − rodada
                      </button>
                      <button
                        type="button"
                        className="secondary-action"
                        onClick={() => setCalcRounds((value) => Math.min(12, value + 1))}
                        disabled={calcRounds >= 12}
                      >
                        + rodada
                      </button>
                    </div>
                  </div>
                  <ol className="rede-calc-list">
                    {calcValues.map((value, i) => (
                      <li key={i} className={value > 1000 ? "over" : ""}>
                        <span>{i + 1}ª rodada</span>
                        <b>{fmt(value)}</b>
                        {value > 1000 && <em>passou de mil!</em>}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="charge-v6-options">
                  {shuffledApply.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={applyChoice === item.id ? (item.correct ? "correct" : "wrong") : ""}
                      onClick={() => {
                        setApplyChoice(item.id);
                        if (item.correct) awardMastery("apply", "Aplicar concluído");
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {selectedApply && (
                  <div className={`charge-v6-feedback ${selectedApply.correct ? "success" : "warning"}`}>
                    <b>{selectedApply.correct ? "Você aplicou o padrão." : "Confira na calculadora."}</b>
                    <p>{selectedApply.feedback}</p>
                  </div>
                )}

                {selectedApply?.correct && (
                  <button type="button" className="primary-action charge-v6-next" onClick={() => go("produce")}>
                    Próxima etapa: Produzir →
                  </button>
                )}
              </>
            )}

            {/* 6. PRODUZIR */}
            {stage === "produce" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>06</span>
                  <div>
                    <h2>Crie uma campanha “Não repasse”</h2>
                    <p>Escolha um número que você calculou, uma frase e uma atitude.</p>
                  </div>
                </div>

                <div className="charge-v6-builder">
                  <div>
                    <b>O número</b>
                    <div className="vertical">
                      {campaignNumbers.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={campaignNumber === item ? "selected" : ""}
                          onClick={() => setCampaignNumber(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <b>A frase</b>
                    <div className="vertical">
                      {campaignPhrases.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={campaignPhrase === item ? "selected" : ""}
                          onClick={() => setCampaignPhrase(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <b>A atitude</b>
                    <div>
                      {campaignActions.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={campaignAction === item ? "selected" : ""}
                          onClick={() => setCampaignAction(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {campaignReady && (
                  <div className="rede-poster" aria-label="Prévia do cartaz da campanha">
                    <RadioTower size={34} aria-hidden="true" />
                    <p className="rede-poster-number">{campaignNumber}</p>
                    <p className="rede-poster-phrase">{campaignPhrase}</p>
                    <p className="rede-poster-action">{campaignAction}</p>
                  </div>
                )}

                <button
                  type="button"
                  className="primary-action charge-v6-next"
                  disabled={!campaignReady}
                  onClick={completeMission}
                >
                  Concluir missão →
                </button>
              </>
            )}

            {/* CONCLUSÃO */}
            {stage === "complete" && (
              <>
                <div className="charge-v6-complete">
                  <span>✓</span>
                  <h2>Torre da Rede restaurada</h2>
                  <p>Você usou potências para entender como uma escolha pequena muda o tamanho de uma rede.</p>
                  <strong className="charge-v8-xp-summary">Missão concluída · XP atual: {xp}/400</strong>
                </div>

                <div className="charge-v6-mastery">
                  <article>
                    <b>Reconhecer</b>
                    <span>100%</span>
                    <p>Descobriu o padrão de multiplicar por 3 a cada rodada.</p>
                  </article>
                  <article>
                    <b>Explicar</b>
                    <span>100%</span>
                    <p>Explicou por que multiplicar cresce mais rápido que somar.</p>
                  </article>
                  <article>
                    <b>Aplicar</b>
                    <span>100%</span>
                    <p>Usou o padrão com outro número de contatos.</p>
                  </article>
                  <article>
                    <b>Produzir</b>
                    <span>100%</span>
                    <p>Criou uma campanha usando um dado calculado.</p>
                  </article>
                </div>

                <SupportNote />

                <div className="charge-v6-final-actions">
                  <button type="button" className="secondary-action" onClick={() => setActiveView("progress")}>
                    Ver meu progresso
                  </button>
                  <button type="button" className="primary-action" onClick={() => setActiveView("map")}>
                    Voltar à cidade →
                  </button>
                </div>
              </>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
