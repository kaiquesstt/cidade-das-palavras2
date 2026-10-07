import { Star, ChartColumn, Plus, Minus } from "lucide-react";
import { useMemo, useState } from "react";
import teacherImage from "../assets/teacher-guide.webp";
import { useGameStore } from "../store/useGameStore";
import { shuffle } from "../utils/shuffle";
import { SupportNote } from "../components/SupportNote";

/*
 * Missão Dados — Matemática + Língua Portuguesa.
 * Uma pesquisa simulada de opinião (30 respostas) sobre "Ciúme é prova de amor?".
 * O aluno organiza, calcula porcentagens com uma grade de 10 colunas × 3,
 * monta o gráfico, desmascara um gráfico enganoso e usa o dado como argumento.
 */

type Stage = "investigate" | "organize" | "calculate" | "represent" | "critique" | "produce" | "complete";
type Answer = "nao" | "asvezes" | "sim";

const stageOrder: Stage[] = ["investigate", "organize", "calculate", "represent", "critique", "produce"];

const stageLabels: Record<Stage, string> = {
  investigate: "Investigar",
  organize: "Organizar",
  calculate: "Calcular",
  represent: "Representar",
  critique: "Ler criticamente",
  produce: "Produzir",
  complete: "Concluir"
};

const QUESTION = "Ciúme é prova de amor?";
const TOTAL = 30;

const categories: Array<{ key: Answer; label: string; count: number; percent: number; color: string }> = [
  { key: "nao", label: "Não", count: 15, percent: 50, color: "#a3e635" },
  { key: "asvezes", label: "Às vezes", count: 9, percent: 30, color: "#ffd53d" },
  { key: "sim", label: "Sim", count: 6, percent: 20, color: "#ff8a8a" }
];
const categoryByKey = Object.fromEntries(categories.map((c) => [c.key, c])) as Record<
  Answer,
  (typeof categories)[number]
>;

const observations = [
  { q: "Quantas pessoas responderam?", a: "30 pessoas. Cada papelzinho é a resposta de uma pessoa." },
  { q: "Quais respostas eram possíveis?", a: "Três: “Sim”, “Não” e “Às vezes”." },
  {
    q: "Olhando os papéis assim, dá para saber qual resposta venceu?",
    a: "É difícil. Os papéis estão misturados. Para concluir alguma coisa, primeiro precisamos organizar e contar."
  },
  {
    q: "A pesquisa pergunta uma opinião ou algo que aconteceu com a pessoa?",
    a: "Uma opinião. Perguntar opiniões é mais seguro: ninguém precisa contar algo pessoal ou doloroso."
  }
];

const totalOptions = [28, 30, 32];

const percentOptions: Record<Answer, number[]> = {
  nao: [15, 50, 30],
  asvezes: [9, 30, 90],
  sim: [6, 20, 60]
};

const columnOptions = [
  {
    id: "ten",
    label: "Porque são 10 colunas iguais que, juntas, formam 100%. Então cada coluna é 100 ÷ 10 = 10%.",
    correct: true,
    feedback: "Isso mesmo. 30 pessoas em 10 colunas de 3: cada coluna é um décimo do total, ou seja, 10%."
  },
  {
    id: "three",
    label: "Porque cada coluna tem 3 pessoas, e 3 vezes 3 é 10.",
    correct: false,
    feedback: "3 × 3 = 9, não 10. Pense nas colunas: quantas são, e quanto elas valem juntas?"
  },
  {
    id: "thirty",
    label: "Porque 30 pessoas é o mesmo que 30%.",
    correct: false,
    feedback: "As 30 pessoas são o total, ou seja, 100%. Cada coluna é só uma parte desse total."
  }
];

const critiqueOptions = [
  {
    id: "axis",
    label: "O eixo do gráfico B começa em 15%, e não em 0. Isso faz a barra do “Sim” parecer quase nada.",
    correct: true,
    feedback:
      "Exatamente. Os números são os mesmos. Mudar onde o eixo começa engana o olho e exagera a diferença entre as barras."
  },
  {
    id: "other-data",
    label: "O gráfico B usa outra pesquisa, com outros números.",
    correct: false,
    feedback: "Confira os valores: são os mesmos 50%, 30% e 20%. O que muda é o desenho do gráfico."
  },
  {
    id: "bigger",
    label: "O gráfico B está mais certo porque as barras são mais fáceis de ver.",
    correct: false,
    feedback: "Barras mais visíveis não deixam o gráfico mais correto. Observe o número onde o eixo começa."
  }
];

const sampleOptions = [
  {
    id: "no",
    label: "Não. Foram ouvidas só 30 pessoas de uma turma. Não dá para falar por todos os brasileiros.",
    correct: true,
    feedback: "Isso. Antes de usar um dado, pergunte sempre: quem foi ouvido, e quantas pessoas?"
  },
  {
    id: "yes",
    label: "Sim. Se 50% da turma disse isso, então 50% do Brasil também pensa assim.",
    correct: false,
    feedback: "Uma turma não representa o país inteiro. Pessoas de outros lugares e idades podem pensar diferente."
  }
];

const sentenceOptions = [
  {
    id: "good",
    label: "Na nossa turma, metade das pessoas (50%) disse que ciúme não é prova de amor.",
    correct: true,
    feedback: "Correto: diz quem foi ouvido, usa o número certo e não exagera."
  },
  {
    id: "all",
    label: "Todo mundo na turma acha que ciúme não é prova de amor.",
    correct: false,
    feedback: "Exagero: foram 50%, não todo mundo. 9 pessoas responderam “às vezes” e 6 responderam “sim”."
  },
  {
    id: "brazil",
    label: "50% dos brasileiros acham que ciúme não é prova de amor.",
    correct: false,
    feedback: "Generalização: a pesquisa ouviu só a turma, não o Brasil."
  },
  {
    id: "nobody",
    label: "Só 6 pessoas responderam “sim”, então ninguém concorda com a ideia.",
    correct: false,
    feedback: "6 pessoas não é “ninguém”. São 20% da turma, e esse número também importa."
  }
];

const conclusions = [
  "Mas 30% responderam “às vezes”: ainda vale conversar sobre o tema.",
  "Por isso, controle e vigilância não devem ser confundidos com cuidado.",
  "Ainda assim, 1 em cada 5 pessoas pensa diferente, e isso merece diálogo."
];

/** Risquinhos de contagem agrupados de 5 em 5, como no papel. */
function tallyMarks(count: number) {
  const groups = Array.from({ length: Math.floor(count / 5) }, () => "|||||");
  const rest = "|".repeat(count % 5);
  return [...groups, rest].filter(Boolean).join("  ");
}

/** Gera os 30 papéis da pesquisa, embaralhados uma vez. */
function buildBallots(): Answer[] {
  const list: Answer[] = [];
  categories.forEach((c) => {
    for (let i = 0; i < c.count; i += 1) list.push(c.key);
  });
  return shuffle(list);
}

/* ---------- Grade 10 colunas × 3 ---------- */

function PeopleGrid({ highlight }: { highlight: Answer | null }) {
  // Pinta as pessoas em ordem: Não, Às vezes, Sim (coluna por coluna)
  const people: Answer[] = [];
  categories.forEach((c) => {
    for (let i = 0; i < c.count; i += 1) people.push(c.key);
  });

  return (
    <div className="dados-grid" role="img" aria-label="Grade com 30 pessoas em 10 colunas de 3">
      {Array.from({ length: 10 }, (_, col) => (
        <div key={col} className="dados-col">
          {[0, 1, 2].map((row) => {
            const answer = people[col * 3 + row];
            const active = highlight === null || highlight === answer;
            return (
              <span
                key={row}
                className={`dados-person ${active ? "on" : "off"}`}
                style={{ background: active ? categoryByKey[answer].color : undefined }}
              />
            );
          })}
          <small>10%</small>
        </div>
      ))}
    </div>
  );
}

/* ---------- Gráfico de barras (montagem e leitura crítica) ---------- */

function BarChart({
  values,
  axisStart = 0,
  title
}: {
  values: Record<Answer, number>;
  axisStart?: number;
  title?: string;
}) {
  const W = 340;
  const H = 230;
  const pad = { l: 42, r: 10, t: 14, b: 32 };
  const max = 60;
  const y = (v: number) => H - pad.b - ((Math.max(v, axisStart) - axisStart) / (max - axisStart)) * (H - pad.t - pad.b);
  const ticks = axisStart === 0 ? [0, 20, 40, 60] : [axisStart, 30, 45, 60];
  const slot = (W - pad.l - pad.r) / 3;

  return (
    <figure className="dados-chart">
      {title && <figcaption>{title}</figcaption>}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title ?? "Gráfico de barras"}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="dados-gridline" />
            <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" className="dados-axis">
              {t}%
            </text>
          </g>
        ))}
        {categories.map((c, i) => {
          const top = y(values[c.key]);
          const x = pad.l + i * slot + slot * 0.2;
          return (
            <g key={c.key}>
              <rect x={x} y={top} width={slot * 0.6} height={H - pad.b - top} rx={6} fill={c.color} className="dados-bar" />
              <text x={x + slot * 0.3} y={top - 6} textAnchor="middle" className="dados-value">
                {values[c.key]}%
              </text>
              <text x={x + slot * 0.3} y={H - 10} textAnchor="middle" className="dados-axis label">
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

/* ---------- Tela ---------- */

export function DadosMissionScreen() {
  const setActiveView = useGameStore((s) => s.setActiveView);
  const markStage = useGameStore((s) => s.markStage);
  const addAchievement = useGameStore((s) => s.addAchievement);
  const mastery = useGameStore((s) => s.mastery);
  const xp = useGameStore((s) => s.xp);

  const [stage, setStage] = useState<Stage>("investigate");
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  const [openObservation, setOpenObservation] = useState<number | null>(null);

  // Organizar
  const ballots = useMemo(buildBallots, []);
  const [counted, setCounted] = useState<boolean[]>(() => Array(TOTAL).fill(false));
  const [totalChoice, setTotalChoice] = useState<number | null>(null);

  // Calcular
  const [percentChoice, setPercentChoice] = useState<Record<Answer, number | null>>({
    nao: null,
    asvezes: null,
    sim: null
  });
  const [columnChoice, setColumnChoice] = useState<string | null>(null);

  // Representar
  const [bars, setBars] = useState<Record<Answer, number>>({ nao: 0, asvezes: 0, sim: 0 });

  // Ler criticamente
  const [critiqueChoice, setCritiqueChoice] = useState<string | null>(null);
  const [sampleChoice, setSampleChoice] = useState<string | null>(null);

  // Produzir
  const [sentenceChoice, setSentenceChoice] = useState<string | null>(null);
  const [conclusion, setConclusion] = useState("");

  const shuffledPercents = useMemo(
    () => ({
      nao: shuffle(percentOptions.nao),
      asvezes: shuffle(percentOptions.asvezes),
      sim: shuffle(percentOptions.sim)
    }),
    []
  );
  const shuffledColumns = useMemo(() => shuffle(columnOptions), []);
  const shuffledCritique = useMemo(() => shuffle(critiqueOptions), []);
  const shuffledSample = useMemo(() => shuffle(sampleOptions), []);
  const shuffledSentences = useMemo(() => shuffle(sentenceOptions), []);

  const stageIndex = stageOrder.indexOf(stage);

  const tally: Record<Answer, number> = { nao: 0, asvezes: 0, sim: 0 };
  ballots.forEach((answer, i) => {
    if (counted[i]) tally[answer] += 1;
  });
  const countedTotal = counted.filter(Boolean).length;
  const allCounted = countedTotal === TOTAL;

  const percentsDone = categories.every((c) => percentChoice[c.key] === c.percent);
  const currentPercent = categories.find((c) => percentChoice[c.key] !== c.percent) ?? null;
  const barsCorrect = categories.every((c) => bars[c.key] === c.percent);

  const selectedColumn = columnOptions.find((o) => o.id === columnChoice);
  const selectedCritique = critiqueOptions.find((o) => o.id === critiqueChoice);
  const selectedSample = sampleOptions.find((o) => o.id === sampleChoice);
  const selectedSentence = sentenceOptions.find((o) => o.id === sentenceChoice);

  const teacherText = useMemo(() => {
    switch (stage) {
      case "investigate":
        return "Uma pesquisa começa com uma boa pergunta. Veja quem respondeu, o que foi perguntado e se dá para concluir algo só olhando os papéis.";
      case "organize":
        return "Clique em cada papel para contar. Ele vai para a coluna certa. Contar com cuidado é o primeiro passo de qualquer pesquisa.";
      case "calculate":
        return "As 30 pessoas estão numa grade de 10 colunas. Cada coluna tem 3 pessoas e vale 10%. Conte as colunas para achar a porcentagem.";
      case "represent":
        return "Agora transforme as porcentagens em um gráfico. Ajuste a altura de cada barra até ficar igual ao que você calculou.";
      case "critique":
        return "Gráficos também podem enganar. Compare os dois com atenção: os números são os mesmos?";
      case "produce":
        return "Um dado bem usado fortalece um argumento. Escolha a frase que usa o número sem exagerar e complete com uma conclusão.";
      case "complete":
        return "Você organizou, calculou, representou e questionou dados. Agora você sabe usar números a favor de um bom argumento.";
    }
  }, [stage]);

  function go(next: Stage) {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function awardMastery(key: "recognize" | "explain" | "apply" | "produce", label: string) {
    if (mastery.dados[key]) return;
    markStage("dados", key);
    setRewardMessage(`+25 XP · ${label}`);
    window.setTimeout(() => setRewardMessage(null), 2200);
  }

  function countBallot(index: number) {
    setCounted((current) => current.map((value, i) => (i === index ? true : value)));
  }

  function countAll() {
    setCounted(Array(TOTAL).fill(true));
  }

  function adjustBar(key: Answer, delta: number) {
    setBars((current) => ({ ...current, [key]: Math.min(60, Math.max(0, current[key] + delta)) }));
  }

  function completeMission() {
    if (!selectedSentence?.correct || !conclusion) return;
    awardMastery("produce", "Produzir concluído");
    addAchievement("Leitor de números");
    addAchievement("Autor da cidade");
    go("complete");
  }

  return (
    <main className="charge-v6-page dados-page">
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
          <span className="eyebrow">OBSERVATÓRIO DOS DADOS</span>
          <h1>Missão: “O que a turma pensa?”</h1>
          <small>Pesquisa, porcentagem e gráficos</small>
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
                    <h2>A turma respondeu uma pergunta</h2>
                    <p>Observe os papéis da pesquisa e abra as perguntas abaixo.</p>
                  </div>
                </div>

                <div className="dados-survey-card">
                  <span className="dados-tag">DADOS SIMULADOS · criados para esta missão</span>
                  <h3>Pergunta da pesquisa: “{QUESTION}”</h3>
                  <div className="dados-ballots static">
                    {ballots.map((answer, i) => (
                      <span key={i} className="dados-ballot">
                        {categoryByKey[answer].label}
                      </span>
                    ))}
                  </div>
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

                <button type="button" className="primary-action charge-v6-next" onClick={() => go("organize")}>
                  Próxima etapa: Organizar →
                </button>
              </>
            )}

            {/* 2. ORGANIZAR */}
            {stage === "organize" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>02</span>
                  <div>
                    <h2>Conte as respostas</h2>
                    <p>Clique em cada papel. Ele vai para a coluna da resposta. Contados: {countedTotal} de {TOTAL}.</p>
                  </div>
                </div>

                <div className="dados-ballots">
                  {ballots.map((answer, i) => (
                    <button
                      type="button"
                      key={i}
                      className={`dados-ballot ${counted[i] ? "counted" : ""}`}
                      onClick={() => countBallot(i)}
                      disabled={counted[i]}
                      aria-label={counted[i] ? `Resposta ${categoryByKey[answer].label} já contada` : `Contar resposta ${categoryByKey[answer].label}`}
                    >
                      {categoryByKey[answer].label}
                    </button>
                  ))}
                </div>

                {countedTotal >= 6 && !allCounted && (
                  <button type="button" className="dados-skip" onClick={countAll}>
                    Já entendi como funciona: contar o resto de uma vez
                  </button>
                )}

                <table className="dados-freq">
                  <thead>
                    <tr>
                      <th>Resposta</th>
                      <th>Contagem</th>
                      <th>Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.key}>
                        <td>
                          <i style={{ background: c.color }} /> {c.label}
                        </td>
                        <td className="tally" aria-hidden="true">
                          {tallyMarks(tally[c.key])}
                        </td>
                        <td>
                          <b>{tally[c.key]}</b>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {allCounted && (
                  <>
                    <p className="dados-question">Somando as três quantidades, quanto dá o total?</p>
                    <div className="dados-choices">
                      {totalOptions.map((value) => (
                        <button
                          type="button"
                          key={value}
                          className={totalChoice === value ? (value === TOTAL ? "correct" : "wrong") : ""}
                          onClick={() => {
                            setTotalChoice(value);
                            if (value === TOTAL) awardMastery("recognize", "Reconhecer concluído");
                          }}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    {totalChoice !== null && (
                      <div className={`charge-v6-feedback ${totalChoice === TOTAL ? "success" : "warning"}`}>
                        <b>{totalChoice === TOTAL ? "Conta certa." : "Confira a soma."}</b>
                        <p>
                          {totalChoice === TOTAL
                            ? "15 + 9 + 6 = 30. O total bate com o número de pessoas que responderam: nenhuma resposta ficou de fora."
                            : "Some a coluna Quantidade: 15 + 9 + 6. O total deve ser igual ao número de pessoas que responderam."}
                        </p>
                      </div>
                    )}
                    {totalChoice === TOTAL && (
                      <button type="button" className="primary-action charge-v6-next" onClick={() => go("calculate")}>
                        Próxima etapa: Calcular →
                      </button>
                    )}
                  </>
                )}
              </>
            )}

            {/* 3. CALCULAR */}
            {stage === "calculate" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>03</span>
                  <div>
                    <h2>De quantidade para porcentagem</h2>
                    <p>As 30 pessoas estão em 10 colunas de 3. Cada coluna vale 10%.</p>
                  </div>
                </div>

                <PeopleGrid highlight={currentPercent ? currentPercent.key : null} />

                {currentPercent ? (
                  <div className="dados-percent-step">
                    <b>
                      “{currentPercent.label}”: {currentPercent.count} pessoas, ou seja,{" "}
                      {currentPercent.count / 3} colunas acesas. Quanto é isso em porcentagem?
                    </b>
                    <div className="dados-choices">
                      {shuffledPercents[currentPercent.key].map((value) => {
                        const chosen = percentChoice[currentPercent.key] === value;
                        return (
                          <button
                            type="button"
                            key={value}
                            className={chosen ? (value === currentPercent.percent ? "correct" : "wrong") : ""}
                            onClick={() => setPercentChoice((cur) => ({ ...cur, [currentPercent.key]: value }))}
                          >
                            {value}%
                          </button>
                        );
                      })}
                    </div>
                    {percentChoice[currentPercent.key] !== null && (
                      <p className="dados-hint">
                        Ainda não. Conte as colunas acesas: são {currentPercent.count / 3}. Cada uma vale 10%.
                      </p>
                    )}
                  </div>
                ) : null}

                <div className="dados-percent-summary">
                  {categories.map((c) => (
                    <span key={c.key} className={percentChoice[c.key] === c.percent ? "done" : ""}>
                      <i style={{ background: c.color }} />
                      {c.label}: {percentChoice[c.key] === c.percent ? `${c.percent}%` : "?"}
                    </span>
                  ))}
                </div>

                {percentsDone && (
                  <>
                    <p className="dados-question">Por que cada coluna vale 10%?</p>
                    <div className="charge-v6-options stacked">
                      {shuffledColumns.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={columnChoice === item.id ? (item.correct ? "correct" : "wrong") : ""}
                          onClick={() => {
                            setColumnChoice(item.id);
                            if (item.correct) awardMastery("explain", "Explicar concluído");
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    {selectedColumn && (
                      <div className={`charge-v6-feedback ${selectedColumn.correct ? "success" : "warning"}`}>
                        <b>{selectedColumn.correct ? "Explicação correta." : "Ainda não."}</b>
                        <p>{selectedColumn.feedback}</p>
                      </div>
                    )}
                    {selectedColumn?.correct && (
                      <button type="button" className="primary-action charge-v6-next" onClick={() => go("represent")}>
                        Próxima etapa: Representar →
                      </button>
                    )}
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
                    <h2>Monte o gráfico de barras</h2>
                    <p>Use os botões para deixar cada barra com a porcentagem que você calculou.</p>
                  </div>
                </div>

                <div className="dados-build">
                  <BarChart values={bars} title={`“${QUESTION}” — respostas da turma`} />
                  <div className="dados-controls">
                    {categories.map((c) => (
                      <div key={c.key} className={`dados-control ${bars[c.key] === c.percent ? "ok" : ""}`}>
                        <span>
                          <i style={{ background: c.color }} /> {c.label}
                          <small>calculado: {c.percent}%</small>
                        </span>
                        <div>
                          <button type="button" aria-label={`Diminuir barra ${c.label}`} onClick={() => adjustBar(c.key, -10)}>
                            <Minus size={18} aria-hidden="true" />
                          </button>
                          <b>{bars[c.key]}%</b>
                          <button type="button" aria-label={`Aumentar barra ${c.label}`} onClick={() => adjustBar(c.key, 10)}>
                            <Plus size={18} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {barsCorrect && (
                  <>
                    <div className="charge-v6-feedback success">
                      <b>Gráfico pronto.</b>
                      <p>
                        Agora dá para ver de longe: a barra do “Não” é a maior, com metade da turma. Um bom gráfico
                        mostra em segundos o que a lista de papéis escondia.
                      </p>
                    </div>
                    <button type="button" className="primary-action charge-v6-next" onClick={() => go("critique")}>
                      Próxima etapa: Ler criticamente →
                    </button>
                  </>
                )}
              </>
            )}

            {/* 5. LER CRITICAMENTE */}
            {stage === "critique" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>05</span>
                  <div>
                    <h2>Um gráfico pode enganar?</h2>
                    <p>Os dois gráficos foram feitos com a mesma pesquisa. Compare com atenção.</p>
                  </div>
                </div>

                <div className="dados-compare">
                  <BarChart values={{ nao: 50, asvezes: 30, sim: 20 }} title="Gráfico A" />
                  <BarChart values={{ nao: 50, asvezes: 30, sim: 20 }} axisStart={15} title="Gráfico B" />
                </div>

                <p className="dados-question">
                  No gráfico B, parece que quase ninguém respondeu “Sim”. O que o gráfico B está fazendo?
                </p>
                <div className="charge-v6-options stacked">
                  {shuffledCritique.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={critiqueChoice === item.id ? (item.correct ? "correct" : "wrong") : ""}
                      onClick={() => {
                        setCritiqueChoice(item.id);
                        if (item.correct) awardMastery("apply", "Aplicar concluído");
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {selectedCritique && (
                  <div className={`charge-v6-feedback ${selectedCritique.correct ? "success" : "warning"}`}>
                    <b>{selectedCritique.correct ? "Você pegou o truque." : "Olhe de novo."}</b>
                    <p>{selectedCritique.feedback}</p>
                  </div>
                )}

                {selectedCritique?.correct && (
                  <>
                    <p className="dados-question">
                      Um site publicou: “Pesquisa mostra que 50% dos brasileiros acham que ciúme não é prova de amor”,
                      usando a pesquisa da nossa turma. Está certo?
                    </p>
                    <div className="charge-v6-options stacked">
                      {shuffledSample.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={sampleChoice === item.id ? (item.correct ? "correct" : "wrong") : ""}
                          onClick={() => setSampleChoice(item.id)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    {selectedSample && (
                      <div className={`charge-v6-feedback ${selectedSample.correct ? "success" : "warning"}`}>
                        <b>{selectedSample.correct ? "Leitura crítica." : "Cuidado com a generalização."}</b>
                        <p>{selectedSample.feedback}</p>
                      </div>
                    )}
                    {selectedSample?.correct && (
                      <button type="button" className="primary-action charge-v6-next" onClick={() => go("produce")}>
                        Próxima etapa: Produzir →
                      </button>
                    )}
                  </>
                )}
              </>
            )}

            {/* 6. PRODUZIR */}
            {stage === "produce" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>06</span>
                  <div>
                    <h2>Use o dado como argumento</h2>
                    <p>Escolha a frase que usa o número corretamente. Depois, escolha uma conclusão.</p>
                  </div>
                </div>

                <div className="charge-v6-options stacked">
                  {shuffledSentences.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={sentenceChoice === item.id ? (item.correct ? "correct" : "wrong") : ""}
                      onClick={() => setSentenceChoice(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {selectedSentence && (
                  <div className={`charge-v6-feedback ${selectedSentence.correct ? "success" : "warning"}`}>
                    <b>{selectedSentence.correct ? "Dado bem usado." : "Esse uso do dado tem um problema."}</b>
                    <p>{selectedSentence.feedback}</p>
                  </div>
                )}

                {selectedSentence?.correct && (
                  <>
                    <div className="charge-v6-builder">
                      <div>
                        <b>Conclusão</b>
                        <div className="vertical">
                          {conclusions.map((item) => (
                            <button
                              type="button"
                              key={item}
                              className={conclusion === item ? "selected" : ""}
                              onClick={() => setConclusion(item)}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {conclusion && (
                      <div className="dados-mural" aria-label="Prévia do mural de dados">
                        <ChartColumn size={30} aria-hidden="true" />
                        <span>MURAL DE DADOS DA TURMA</span>
                        <p className="dados-mural-main">{selectedSentence.label}</p>
                        <p className="dados-mural-conclusion">{conclusion}</p>
                        <small>Fonte: pesquisa simulada com 30 pessoas da turma.</small>
                      </div>
                    )}

                    <button
                      type="button"
                      className="primary-action charge-v6-next"
                      disabled={!conclusion}
                      onClick={completeMission}
                    >
                      Concluir missão →
                    </button>
                  </>
                )}
              </>
            )}

            {/* CONCLUSÃO */}
            {stage === "complete" && (
              <>
                <div className="charge-v6-complete">
                  <span>✓</span>
                  <h2>Observatório dos Dados restaurado</h2>
                  <p>Você transformou uma pilha de papéis em informação clara e soube usá-la sem exagerar.</p>
                  <strong className="charge-v8-xp-summary">Missão concluída · XP atual: {xp}/400</strong>
                </div>

                <div className="charge-v6-mastery">
                  <article>
                    <b>Reconhecer</b>
                    <span>100%</span>
                    <p>Organizou as respostas e conferiu o total.</p>
                  </article>
                  <article>
                    <b>Explicar</b>
                    <span>100%</span>
                    <p>Calculou porcentagens e explicou de onde vêm os 10%.</p>
                  </article>
                  <article>
                    <b>Aplicar</b>
                    <span>100%</span>
                    <p>Descobriu o truque de um gráfico enganoso.</p>
                  </article>
                  <article>
                    <b>Produzir</b>
                    <span>100%</span>
                    <p>Usou um dado como argumento sem exagerar.</p>
                  </article>
                </div>

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
