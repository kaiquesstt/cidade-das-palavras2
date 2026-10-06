
import { useMemo, useState } from "react";
import teacherImage from "../assets/teacher-guide.webp";
import chargeImage from "../assets/charge-pesquisando-juntos.webp";
import { useGameStore } from "../store/useGameStore";

type Stage = "investigate" | "classify" | "justify" | "contrast" | "apply" | "produce" | "complete";

const stageOrder: Stage[] = ["investigate", "classify", "justify", "contrast", "apply", "produce"];

const stageLabels: Record<Stage, string> = {
  investigate: "Investigar",
  classify: "Classificar",
  justify: "Justificar",
  contrast: "Contrastar",
  apply: "Aplicar",
  produce: "Produzir",
  complete: "Concluir"
};

const observationQuestions = [
  {
    q: "O que os personagens estão fazendo?",
    a: "Eles estão no mesmo trabalho, mas cada estudante usa o celular de forma individual, sem construir a pesquisa coletivamente."
  },
  {
    q: "Qual é a reação da professora?",
    a: "A professora demonstra preocupação e estranhamento, porque o grupo deveria estar colaborando, mas cada estudante está isolado."
  },
  {
    q: "Qual é a relação entre texto e imagem?",
    a: "O texto e a imagem se completam. A proposta é “trabalho em grupo”, mas a imagem mostra justamente a ausência dessa colaboração."
  },
  {
    q: "O que a charge critica?",
    a: "Ela critica o uso superficial do celular e das redes sociais em situações que exigem diálogo, pesquisa e participação real."
  },
  {
    q: "Onde está o humor ou a ironia?",
    a: "A ironia aparece no contraste entre a ideia de colaboração e o comportamento individual dos estudantes."
  }
];

const classifications = [
  {
    id: "charge",
    label: "Charge",
    correct: true,
    feedback: "Correto. A cena usa linguagem verbal e visual para construir humor e crítica sobre um comportamento atual."
  },
  {
    id: "tirinha",
    label: "Tirinha",
    correct: false,
    feedback: "A tirinha costuma desenvolver uma pequena narrativa em sequência de quadros. Aqui a crítica está concentrada em uma única cena."
  },
  {
    id: "cartaz",
    label: "Cartaz",
    correct: false,
    feedback: "O cartaz geralmente divulga, orienta ou persuade de modo direto. Aqui o objetivo principal é comentar criticamente a situação."
  },
  {
    id: "noticia",
    label: "Notícia",
    correct: false,
    feedback: "A notícia prioriza a informação sobre fatos. Nesta cena, o foco é a crítica e a reflexão."
  }
];

const evidenceOptions = [
  { id: "critica", label: "Critica um comportamento contemporâneo.", correct: true },
  { id: "visual", label: "O sentido depende da relação entre texto e imagem.", correct: true },
  { id: "ironia", label: "A ironia e o humor ajudam a construir a crítica.", correct: true },
  { id: "nome", label: "Há personagens com nomes próprios.", correct: false },
  { id: "sequencia", label: "Há vários quadros formando uma sequência narrativa.", correct: false }
];

const contrastOptions = [
  {
    id: "estrutura",
    label: "Aqui a crítica se concentra em uma única cena; não há uma sequência narrativa de quadros.",
    correct: true
  },
  {
    id: "cor",
    label: "Não é tirinha porque o desenho está colorido.",
    correct: false
  },
  {
    id: "politica",
    label: "Não é tirinha porque toda charge precisa falar de política.",
    correct: false
  }
];

const applicationOptions = [
  {
    id: "grupo",
    title: "Trabalho em grupo sem colaboração",
    text: "Quatro alunos sentam juntos, mas cada um procura apenas uma resposta pronta no próprio celular.",
    correct: true
  },
  {
    id: "receita",
    title: "Receita de bolo",
    text: "Um texto apresenta ingredientes, quantidades e o passo a passo de preparo.",
    correct: false
  },
  {
    id: "aviso",
    title: "Aviso da escola",
    text: "Um cartaz informa a data e o horário de uma reunião de pais.",
    correct: false
  }
];

const scenarios = ["Trabalho em grupo", "Fila da cantina", "Biblioteca"];
const targets = ["uso excessivo do celular", "querer apenas uma resposta pronta", "fingir participação sem colaborar"];
const ironicLines = [
  "“Que trabalho em equipe impressionante!”",
  "“Pesquisar juntos ficou muito mais fácil: ninguém precisa conversar.”",
  "“Excelente colaboração... cada um no seu próprio mundo.”"
];

export function ChargeMissionScreen() {
  const setActiveView = useGameStore((s) => s.setActiveView);
  const markStage = useGameStore((s) => s.markStage);
  const addAchievement = useGameStore((s) => s.addAchievement);
  const fontScale = useGameStore((s) => s.fontScale);
  const setFontScale = useGameStore((s) => s.setFontScale);
  const mastery = useGameStore((s) => s.mastery);
  const xp = useGameStore((s) => s.xp);

  const [stage, setStage] = useState<Stage>("investigate");
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [openObservation, setOpenObservation] = useState<number | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [evidenceChecked, setEvidenceChecked] = useState(false);
  const [contrast, setContrast] = useState<string | null>(null);
  const [application, setApplication] = useState<string | null>(null);
  const [scenario, setScenario] = useState("");
  const [target, setTarget] = useState("");
  const [line, setLine] = useState("");

  const stageIndex = stageOrder.indexOf(stage);

  const teacherText = useMemo(() => {
    switch (stage) {
      case "investigate":
        return "Observe primeiro. Uma charge não deve ser reconhecida apenas pelo desenho. Descubra o que a cena critica e como texto e imagem trabalham juntos.";
      case "classify":
        return "Agora use as pistas que você encontrou para classificar o gênero. Pense na finalidade do texto, não apenas na aparência.";
      case "justify":
        return "Acertar o nome é só o começo. Escolha as evidências que realmente provam por que esta cena é uma charge.";
      case "contrast":
        return "Vamos comparar charge e tirinha. A melhor diferença está na finalidade e na estrutura, não em detalhes superficiais.";
      case "apply":
        return "Se o critério ficou claro, você conseguirá reconhecê-lo em outra situação.";
      case "produce":
        return "Agora construa o núcleo de uma charge: uma situação, um alvo de crítica e uma fala irônica.";
      case "complete":
        return "Missão concluída. Você reconheceu, explicou, aplicou e produziu. Esse é o percurso que queremos repetir nos outros distritos.";
    }
  }, [stage]);

  const selectedClassification = classifications.find((item) => item.id === classification);
  const correctClassification = selectedClassification?.correct ?? false;

  const correctEvidenceIds = evidenceOptions.filter((item) => item.correct).map((item) => item.id).sort();
  const evidenceSuccess =
    evidenceChecked &&
    JSON.stringify([...evidence].sort()) === JSON.stringify(correctEvidenceIds);

  const contrastSuccess = contrastOptions.find((item) => item.id === contrast)?.correct ?? false;
  const applicationSuccess = applicationOptions.find((item) => item.id === application)?.correct ?? false;
  const productionReady = Boolean(scenario && target && line);

  function go(next: Stage) {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function awardMastery(stageKey: "recognize" | "explain" | "apply" | "produce", label: string) {
    if (mastery.charge[stageKey]) return;
    markStage("charge", stageKey);
    setRewardMessage(`+25 XP · ${label}`);
    window.setTimeout(() => setRewardMessage(null), 2200);
  }

  function selectClassification(id: string) {
    setClassification(id);
    const item = classifications.find((option) => option.id === id);
    if (item?.correct) awardMastery("recognize", "Reconhecer concluído");
  }

  function checkEvidence() {
    setEvidenceChecked(true);
    if (JSON.stringify([...evidence].sort()) === JSON.stringify(correctEvidenceIds)) {
      awardMastery("explain", "Explicar concluído");
    }
  }

  function selectContrast(id: string) {
    setContrast(id);
    const item = contrastOptions.find((option) => option.id === id);
    if (item?.correct) addAchievement("Mestre dos contrastes");
  }

  function selectApplication(id: string) {
    setApplication(id);
    const item = applicationOptions.find((option) => option.id === id);
    if (item?.correct) awardMastery("apply", "Aplicar concluído");
  }

  function completeProduction() {
    if (!productionReady) return;
    awardMastery("produce", "Produzir concluído");
    addAchievement("Cronista da crítica");
    addAchievement("Autor da cidade");
    go("complete");
  }

  return (
    <main className="charge-v6-page">
      {rewardMessage && <div className="xp-toast" role="status" aria-live="polite"><span>★</span><b>{rewardMessage}</b></div>}
      <header className="charge-v6-header">
        <div className="charge-v6-title">
          <span className="eyebrow">DISTRITO DA CHARGE</span>
          <h1>Missão: “Pesquisando juntos?”</h1>
          <small>Celular, redes sociais e vida escolar</small>
        </div>

        <div className="charge-v6-stage-progress" aria-label={`Etapa ${stage === "complete" ? 6 : stageIndex + 1} de 6`}>
          <span>ETAPA {stage === "complete" ? 6 : stageIndex + 1} DE 6</span>
          <div>
            {stageOrder.map((item, index) => (
              <i key={item} className={index <= stageIndex || stage === "complete" ? "done" : ""} />
            ))}
          </div>
        </div>

        <div className="charge-v6-accessibility" aria-label="Tamanho do texto">
          <button
            type="button"
            aria-label="Diminuir tamanho do texto"
            onClick={() => setFontScale(Math.max(0.9, +(fontScale - 0.1).toFixed(2)))}
          >
            A−
          </button>
          <output aria-live="polite">{Math.round(fontScale * 100)}%</output>
          <button
            type="button"
            aria-label="Aumentar tamanho do texto"
            onClick={() => setFontScale(Math.min(1.5, +(fontScale + 0.1).toFixed(2)))}
          >
            A+
          </button>
          <button
            type="button"
            className="text-reset"
            onClick={() => setFontScale(1)}
          >
            Padrão
          </button>
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
                  className={`${index === stageIndex ? "current" : ""} ${index < stageIndex || stage === "complete" ? "finished" : ""}`}
                >
                  <b>{index + 1}</b>
                  <span>{stageLabels[item]}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="charge-v6-main">
          <section className="charge-v6-image-panel">
            <div className="charge-v6-image-heading">
              <div>
                <span className="eyebrow">CHARGE ORIGINAL DO JOGO</span>
                <h2>Observe a cena com atenção</h2>
              </div>
              <div className="charge-v6-zoom">
                <button type="button" onClick={() => setZoom((value) => Math.max(0.8, +(value - 0.1).toFixed(1)))}>−</button>
                <span>{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => setZoom((value) => Math.min(1.4, +(value + 0.1).toFixed(1)))}>+</button>
              </div>
            </div>

            <div className="charge-v6-image-frame">
              <img
                src={chargeImage}
                alt="Charge sobre trabalho em grupo, celulares e redes sociais"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
          </section>

          <section className="charge-v6-task">
            {stage === "investigate" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>01</span>
                  <div>
                    <h2>O que você percebe?</h2>
                    <p>Abra as perguntas abaixo para orientar sua leitura da charge.</p>
                  </div>
                </div>

                <div className="charge-v6-observation-list">
                  {observationQuestions.map((item, index) => (
                    <button
                      type="button"
                      key={item.q}
                      className={openObservation === index ? "open" : ""}
                      onClick={() => setOpenObservation(openObservation === index ? null : index)}
                    >
                      <strong>{item.q}</strong>
                      <span>{openObservation === index ? item.a : "Toque para analisar"}</span>
                    </button>
                  ))}
                </div>

                <div className="charge-v6-tip">
                  <b>Dica da professora</b>
                  <p>Observe a contradição entre “trabalho em grupo” e o comportamento individual dos estudantes.</p>
                </div>

                <button type="button" className="primary-action charge-v6-next" onClick={() => go("classify")}>
                  Próxima etapa: Classificar →
                </button>
              </>
            )}

            {stage === "classify" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>02</span>
                  <div>
                    <h2>Que gênero é esse?</h2>
                    <p>Escolha uma opção com base na finalidade da cena e nas pistas que você observou.</p>
                  </div>
                </div>

                <div className="charge-v6-options">
                  {classifications.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={classification === item.id ? (item.correct ? "correct" : "wrong") : ""}
                      onClick={() => selectClassification(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {selectedClassification && (
                  <div className={correctClassification ? "charge-v6-feedback success" : "charge-v6-feedback warning"}>
                    <b>{correctClassification ? "Classificação correta." : "Por que não?"}</b>
                    <p>{selectedClassification.feedback}</p>
                  </div>
                )}

                {correctClassification && (
                  <button type="button" className="primary-action charge-v6-next" onClick={() => go("justify")}>
                    Próxima etapa: Justificar →
                  </button>
                )}
              </>
            )}

            {stage === "justify" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>03</span>
                  <div>
                    <h2>Prove sua classificação</h2>
                    <p>Selecione somente as evidências que realmente sustentam a classificação como charge.</p>
                  </div>
                </div>

                <div className="charge-v6-evidence">
                  {evidenceOptions.map((item) => (
                    <label key={item.id}>
                      <input
                        type="checkbox"
                        checked={evidence.includes(item.id)}
                        onChange={() =>
                          setEvidence((current) =>
                            current.includes(item.id)
                              ? current.filter((id) => id !== item.id)
                              : [...current, item.id]
                          )
                        }
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>

                <button type="button" className="secondary-action" onClick={checkEvidence}>
                  Verificar evidências
                </button>

                {evidenceChecked && (
                  <div className={`charge-v6-feedback ${evidenceSuccess ? "success" : "warning"}`}>
                    <b>{evidenceSuccess ? "Justificativa consistente." : "Ainda há evidências inadequadas."}</b>
                    <p>
                      {evidenceSuccess
                        ? "Você mostrou que a crítica, a relação texto–imagem e a ironia sustentam a classificação."
                        : "Evite características acidentais. Procure evidências ligadas à finalidade e à construção de sentido."}
                    </p>
                  </div>
                )}

                {evidenceSuccess && (
                  <button type="button" className="primary-action charge-v6-next" onClick={() => go("contrast")}>
                    Próxima etapa: Contrastar →
                  </button>
                )}
              </>
            )}

            {stage === "contrast" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>04</span>
                  <div>
                    <h2>Por que não é tirinha?</h2>
                    <p>Escolha a diferença que realmente separa os dois gêneros neste caso.</p>
                  </div>
                </div>

                <div className="charge-v6-options stacked">
                  {contrastOptions.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={contrast === item.id ? (item.correct ? "correct" : "wrong") : ""}
                      onClick={() => selectContrast(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {contrast && (
                  <div className={`charge-v6-feedback ${contrastSuccess ? "success" : "warning"}`}>
                    <b>{contrastSuccess ? "Boa diferenciação." : "Essa diferença é superficial."}</b>
                    <p>
                      {contrastSuccess
                        ? "A estrutura e a finalidade ajudam a diferenciar os gêneros com muito mais segurança."
                        : "Cor e tema político não definem sozinhos charge ou tirinha."}
                    </p>
                  </div>
                )}

                {contrastSuccess && (
                  <button type="button" className="primary-action charge-v6-next" onClick={() => go("apply")}>
                    Próxima etapa: Aplicar →
                  </button>
                )}
              </>
            )}

            {stage === "apply" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>05</span>
                  <div>
                    <h2>Aplique o critério</h2>
                    <p>Qual situação abaixo poderia gerar uma charge usando crítica e ironia?</p>
                  </div>
                </div>

                <div className="charge-v6-applications">
                  {applicationOptions.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={application === item.id ? (item.correct ? "correct" : "wrong") : ""}
                      onClick={() => selectApplication(item.id)}
                    >
                      <b>{item.title}</b>
                      <span>{item.text}</span>
                    </button>
                  ))}
                </div>

                {application && (
                  <div className={`charge-v6-feedback ${applicationSuccess ? "success" : "warning"}`}>
                    <b>{applicationSuccess ? "Você transferiu o critério." : "Reveja a finalidade."}</b>
                    <p>
                      {applicationSuccess
                        ? "Essa situação permite comentar criticamente um comportamento atual por meio do humor."
                        : "Procure uma situação social que possa ser criticada, e não apenas um texto informativo ou instrucional."}
                    </p>
                  </div>
                )}

                {applicationSuccess && (
                  <button type="button" className="primary-action charge-v6-next" onClick={() => go("produce")}>
                    Próxima etapa: Produzir →
                  </button>
                )}
              </>
            )}

            {stage === "produce" && (
              <>
                <div className="charge-v6-task-heading">
                  <span>06</span>
                  <div>
                    <h2>Monte sua própria ideia</h2>
                    <p>Combine cenário, alvo da crítica e fala irônica.</p>
                  </div>
                </div>

                <div className="charge-v6-builder">
                  <div>
                    <b>Cenário</b>
                    <div>
                      {scenarios.map((item) => (
                        <button type="button" key={item} className={scenario === item ? "selected" : ""} onClick={() => setScenario(item)}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <b>Alvo da crítica</b>
                    <div>
                      {targets.map((item) => (
                        <button type="button" key={item} className={target === item ? "selected" : ""} onClick={() => setTarget(item)}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <b>Fala irônica</b>
                    <div className="vertical">
                      {ironicLines.map((item) => (
                        <button type="button" key={item} className={line === item ? "selected" : ""} onClick={() => setLine(item)}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {productionReady && (
                  <div className="charge-v6-production-preview">
                    <span>Cenário: <b>{scenario}</b></span>
                    <span>Crítica: <b>{target}</b></span>
                    <span>Fala: <b>{line}</b></span>
                  </div>
                )}

                <button type="button" className="primary-action charge-v6-next" disabled={!productionReady} onClick={completeProduction}>
                  Concluir missão →
                </button>
              </>
            )}

            {stage === "complete" && (
              <>
                <div className="charge-v6-complete">
                  <span>✓</span>
                  <h2>Distrito da Charge restaurado</h2>
                  <p>Você completou os quatro níveis de domínio desta missão.</p>
                  <strong className="charge-v8-xp-summary">Missão concluída · XP atual: {xp}/400</strong>
                </div>

                <div className="charge-v6-mastery">
                  <article><b>Reconhecer</b><span>100%</span><p>Identificou o gênero usando pistas relevantes.</p></article>
                  <article><b>Explicar</b><span>100%</span><p>Justificou a classificação com evidências.</p></article>
                  <article><b>Aplicar</b><span>100%</span><p>Transferiu o critério para uma nova situação.</p></article>
                  <article><b>Produzir</b><span>100%</span><p>Construiu o núcleo de uma nova charge.</p></article>
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
