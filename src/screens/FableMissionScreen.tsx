
import { useMemo, useState } from "react";
import teacherImage from "../assets/teacher-guide.webp";
import forestImage from "../assets/fable-district.webp";
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

const storyParagraphs = [
  "Durante uma noite de neblina, uma onça atravessava a mata convencida de que nenhum animal pequeno poderia lhe ser útil. Ao ver um vagalume, riu: “Sua luz mal ilumina uma folha.”",
  "Horas depois, a trilha desapareceu na neblina. A onça tentou seguir pelo cheiro, mas se aproximava de um barranco. O vagalume surgiu e começou a iluminar pequenas marcas no chão.",
  "“Uma luz tão pequena não deve servir para muita coisa”, murmurou a onça, já sem tanta certeza.",
  "“Talvez uma só não. Mas várias pequenas luzes podem mostrar um caminho”, respondeu o vagalume, chamando outros.",
  "A onça chegou em segurança à clareira. Desde aquela noite, nunca mais mediu o valor de alguém pelo tamanho."
];

const observations = [
  {
    q: "Como a onça e o vagalume se comportam?",
    a: "Eles falam, julgam, tomam decisões e refletem como seres humanos. Essa humanização dos animais é uma pista importante."
  },
  {
    q: "Qual comportamento da onça é colocado em discussão?",
    a: "A onça despreza uma contribuição apenas porque ela parece pequena. O enredo questiona esse modo de julgar."
  },
  {
    q: "O que muda depois do conflito?",
    a: "A onça percebe que aquilo que considerava insignificante pode ser decisivo em outra situação."
  },
  {
    q: "A moral precisa estar escrita em uma frase final?",
    a: "Não. A moral pode aparecer explicitamente ou ficar implícita, sendo inferida pelas ações, consequências e transformação das personagens."
  },
  {
    q: "Que ensinamento pode ser inferido?",
    a: "Uma possibilidade é: o valor de uma contribuição não depende de seu tamanho ou aparência."
  }
];

const classifications = [
  {
    id: "fabula",
    label: "Fábula",
    correct: true,
    feedback: "Correto. A narrativa usa animais humanizados e um conflito simbólico para provocar uma reflexão sobre comportamento."
  },
  {
    id: "lenda",
    label: "Lenda",
    correct: false,
    feedback: "A lenda costuma se ligar à tradição coletiva, a lugares, crenças ou explicações transmitidas por uma comunidade. Esse não é o centro do texto."
  },
  {
    id: "conto",
    label: "Conto fantástico",
    correct: false,
    feedback: "Animais falando podem aparecer em narrativas fantásticas, mas aqui o elemento decisivo é o ensinamento construído pelo comportamento simbólico das personagens."
  },
  {
    id: "noticia",
    label: "Notícia",
    correct: false,
    feedback: "A notícia relata acontecimentos com finalidade informativa. O texto lido é uma narrativa ficcional com valor moral."
  }
];

const evidenceOptions = [
  { id: "humanizacao", label: "Os animais apresentam atitudes e falas humanas.", correct: true },
  { id: "moral", label: "O conflito conduz a uma reflexão sobre comportamento.", correct: true },
  { id: "consequencia", label: "As ações das personagens produzem uma consequência que sustenta o ensinamento.", correct: true },
  { id: "local", label: "O texto explica a origem de um lugar conhecido pela comunidade.", correct: false },
  { id: "registro", label: "O texto registra fatos verificáveis e dados objetivos.", correct: false }
];

const contrastOptions = [
  {
    id: "purpose",
    label: "Na fábula, o conflito simbólico conduz a um ensinamento sobre comportamento; na lenda, a narrativa costuma se ligar à tradição, crença ou memória coletiva.",
    correct: true
  },
  {
    id: "animals",
    label: "É fábula porque tem animais; se tivesse seres humanos, seria obrigatoriamente lenda.",
    correct: false
  },
  {
    id: "real",
    label: "É fábula porque é inventada; toda lenda relata acontecimentos comprovados historicamente.",
    correct: false
  }
];

const applicationTexts = [
  {
    id: "formiga",
    title: "A Formiga e o Sino",
    text: "Uma formiga zombava de outra por carregar apenas um grão de cada vez. Quando a chuva chegou, descobriu que o pequeno trabalho repetido havia protegido todo o formigueiro.",
    correct: true,
    reason: "Há personagens simbólicas, comportamento humanizado, conflito e consequência que permitem inferir um ensinamento."
  },
  {
    id: "pedra",
    title: "A Pedra que Canta",
    text: "Moradores contam que, em noites de lua cheia, uma pedra próxima ao rio canta para avisar quando as águas vão subir. A história é transmitida há muitas gerações.",
    correct: false,
    reason: "A ligação com lugar, crença e transmissão entre gerações aproxima o texto de uma lenda."
  }
];

const characters = [
  "uma arara orgulhosa e uma formiga paciente",
  "um macaco apressado e uma tartaruga observadora",
  "uma coruja vaidosa e um pequeno besouro",
  "um peixe forte e um cardume de peixes menores"
];

const behaviors = [
  "julgar alguém pela aparência",
  "querer fazer tudo sozinho",
  "desprezar uma contribuição pequena",
  "confundir rapidez com qualidade"
];

const consequences = [
  "o personagem precisa justamente da ajuda que desprezou",
  "a pressa provoca um erro que poderia ter sido evitado",
  "a cooperação resolve um problema que a força não resolveu",
  "uma pequena ação repetida produz o melhor resultado"
];

const morals = [
  "O valor de uma ajuda não depende do tamanho de quem a oferece.",
  "Cooperar pode ser mais eficiente do que tentar vencer sozinho.",
  "A pressa não substitui atenção e responsabilidade.",
  "Não é seguro julgar a capacidade de alguém pela aparência."
];

export function FableMissionScreen() {
  const setActiveView = useGameStore((s) => s.setActiveView);
  const markStage = useGameStore((s) => s.markStage);
  const addAchievement = useGameStore((s) => s.addAchievement);
  const mastery = useGameStore((s) => s.mastery);
  const xp = useGameStore((s) => s.xp);
  const fontScale = useGameStore((s) => s.fontScale);
  const setFontScale = useGameStore((s) => s.setFontScale);

  const [stage, setStage] = useState<Stage>("investigate");
  const [openObservation, setOpenObservation] = useState<number | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [evidenceChecked, setEvidenceChecked] = useState(false);
  const [contrast, setContrast] = useState<string | null>(null);
  const [application, setApplication] = useState<string | null>(null);
  const [character, setCharacter] = useState("");
  const [behavior, setBehavior] = useState("");
  const [consequence, setConsequence] = useState("");
  const [moral, setMoral] = useState("");
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const stageIndex = stageOrder.indexOf(stage);

  const teacherText = useMemo(() => {
    switch (stage) {
      case "investigate":
        return "Leia a narrativa antes de procurar um rótulo. Observe personagens, conflito, consequências e o que o texto nos faz pensar sobre comportamentos humanos.";
      case "classify":
        return "Agora classifique. Animais falando são uma pista, mas não bastam sozinhos. Pense na finalidade construída pelo enredo.";
      case "justify":
        return "Uma classificação forte precisa de evidências. Escolha somente características que ajudam a provar que o texto funciona como fábula.";
      case "contrast":
        return "Fábula e lenda podem parecer próximas porque ambas são narrativas. O que realmente as diferencia é a forma como constroem sentido e sua ligação com tradição ou ensinamento.";
      case "apply":
        return "Você vai comparar dois textos curtos. Use o critério aprendido, não apenas a presença de animais ou elementos extraordinários.";
      case "produce":
        return "Agora planeje uma fábula própria. Você não precisa escrever um texto longo: construa personagens, comportamento, consequência e moral.";
      case "complete":
        return "Muito bem. Você saiu da identificação superficial e chegou à produção consciente. A Floresta das Fábulas está restaurada.";
    }
  }, [stage]);

  const selectedClassification = classifications.find((item) => item.id === classification);
  const classificationSuccess = selectedClassification?.correct ?? false;

  const correctEvidence = evidenceOptions.filter((item) => item.correct).map((item) => item.id).sort();
  const evidenceSuccess =
    evidenceChecked &&
    JSON.stringify([...evidence].sort()) === JSON.stringify(correctEvidence);

  const contrastSuccess = contrastOptions.find((item) => item.id === contrast)?.correct ?? false;
  const selectedApplication = applicationTexts.find((item) => item.id === application);
  const applicationSuccess = selectedApplication?.correct ?? false;
  const productionReady = Boolean(character && behavior && consequence && moral);

  function award(stageKey: "recognize" | "explain" | "apply" | "produce", label: string) {
    if (mastery.fabula[stageKey]) return;
    markStage("fabula", stageKey);
    setRewardMessage(`+25 XP · ${label}`);
    window.setTimeout(() => setRewardMessage(null), 2200);
  }

  function go(next: Stage) {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectClassification(id: string) {
    setClassification(id);
    const item = classifications.find((option) => option.id === id);
    if (item?.correct) award("recognize", "Reconhecer concluído");
  }

  function checkEvidence() {
    setEvidenceChecked(true);
    if (JSON.stringify([...evidence].sort()) === JSON.stringify(correctEvidence)) {
      award("explain", "Explicar concluído");
    }
  }

  function selectApplication(id: string) {
    setApplication(id);
    const item = applicationTexts.find((option) => option.id === id);
    if (item?.correct) award("apply", "Aplicar concluído");
  }

  function finishProduction() {
    if (!productionReady) return;
    award("produce", "Produzir concluído");
    addAchievement("Leitor de entrelinhas");
    addAchievement("Autor da cidade");
    go("complete");
  }

  return (
    <main className="fable-page">
      {rewardMessage && (
        <div className="xp-toast" role="status" aria-live="polite">
          <span>★</span>
          <b>{rewardMessage}</b>
        </div>
      )}

      <header className="fable-header">
        <div className="fable-header-title">
          <span className="eyebrow">FLORESTA DAS FÁBULAS</span>
          <h1>O caso da Onça e do Vagalume</h1>
          <small>Personagens · conflito · consequência · moral</small>
        </div>

        <div className="fable-progress" aria-label={`Etapa ${stage === "complete" ? 6 : stageIndex + 1} de 6`}>
          <span>ETAPA {stage === "complete" ? 6 : stageIndex + 1} DE 6</span>
          <div>
            {stageOrder.map((item, index) => (
              <i key={item} className={index <= stageIndex || stage === "complete" ? "done" : ""} />
            ))}
          </div>
        </div>

        <div className="fable-accessibility" aria-label="Tamanho da interface">
          <button type="button" onClick={() => setFontScale(Math.max(.9, +(fontScale - .1).toFixed(2)))}>A−</button>
          <output aria-live="polite">{Math.round(fontScale * 100)}%</output>
          <button type="button" onClick={() => setFontScale(Math.min(1.5, +(fontScale + .1).toFixed(2)))}>A+</button>
        </div>

        <button type="button" className="secondary-action" onClick={() => setActiveView("map")}>
          ← Voltar ao mapa
        </button>
      </header>

      <div className="fable-layout">
        <aside className="fable-side">
          <section className="fable-guide">
            <div className="fable-guide-image">
              <img src={teacherImage} alt="Professora Fabricia" />
            </div>
            <div className="fable-guide-copy">
              <span>PROFª FABRICIA</span>
              <p>{teacherText}</p>
            </div>
          </section>

          <section className="fable-stage-list">
            <strong>SUA JORNADA</strong>
            {stageOrder.map((item, index) => (
              <div
                key={item}
                className={`${index === stageIndex ? "current" : ""} ${index < stageIndex || stage === "complete" ? "finished" : ""}`}
              >
                <b>{index + 1}</b>
                <span>{stageLabels[item]}</span>
              </div>
            ))}
          </section>
        </aside>

        <section className="fable-main">
          <section className="fable-forest-banner">
            <img src={forestImage} alt="" />
            <div className="fable-forest-overlay" />
            <div className="fable-forest-copy">
              <span>ARQUIVO NARRATIVO 02</span>
              <h2>A Floresta perdeu o ensinamento de suas histórias.</h2>
              <p>Recupere as pistas da narrativa e descubra como uma fábula transforma um conflito simples em reflexão.</p>
            </div>
            <span className="firefly f1" />
            <span className="firefly f2" />
            <span className="firefly f3" />
            <span className="firefly f4" />
          </section>

          <section className="fable-story">
            <header>
              <div>
                <span className="eyebrow">TEXTO ORIGINAL DO JOGO</span>
                <h2>A Onça e o Vagalume</h2>
              </div>
              <span className="story-chip">Moral ainda escondida</span>
            </header>

            <div className="fable-book">
              <div className="book-page">
                <span className="page-number">01</span>
                {storyParagraphs.slice(0, 3).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="book-page">
                <span className="page-number">02</span>
                {storyParagraphs.slice(3).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <blockquote>“Várias pequenas luzes podem mostrar um caminho.”</blockquote>
              </div>
            </div>
          </section>

          <section className="fable-task">
            {stage === "investigate" && (
              <>
                <div className="fable-task-heading">
                  <span>01</span>
                  <div>
                    <h2>Leia como investigador</h2>
                    <p>Abra as perguntas para encontrar pistas sobre personagens, conflito, transformação e ensinamento.</p>
                  </div>
                </div>

                <div className="fable-observation-list">
                  {observations.map((item, index) => (
                    <button
                      type="button"
                      key={item.q}
                      className={openObservation === index ? "open" : ""}
                      onClick={() => setOpenObservation(openObservation === index ? null : index)}
                    >
                      <strong>{item.q}</strong>
                      <span>{openObservation === index ? item.a : "Toque para investigar"}</span>
                    </button>
                  ))}
                </div>

                <div className="fable-insight">
                  <b>Descoberta importante</b>
                  <p>A moral de uma fábula pode ser explícita ou implícita. Neste texto, o leitor precisa inferi-la pelas ações e consequências.</p>
                </div>

                <button type="button" className="primary-action fable-next" onClick={() => go("classify")}>
                  Próxima etapa: Classificar →
                </button>
              </>
            )}

            {stage === "classify" && (
              <>
                <div className="fable-task-heading">
                  <span>02</span>
                  <div>
                    <h2>Que gênero é esse?</h2>
                    <p>Não escolha apenas porque há animais. Use a finalidade e a construção do enredo.</p>
                  </div>
                </div>

                <div className="fable-options">
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
                  <div className={`fable-feedback ${classificationSuccess ? "success" : "warning"}`}>
                    <b>{classificationSuccess ? "Classificação consistente." : "Por que não?"}</b>
                    <p>{selectedClassification.feedback}</p>
                  </div>
                )}

                {classificationSuccess && (
                  <button type="button" className="primary-action fable-next" onClick={() => go("justify")}>
                    Próxima etapa: Justificar →
                  </button>
                )}
              </>
            )}

            {stage === "justify" && (
              <>
                <div className="fable-task-heading">
                  <span>03</span>
                  <div>
                    <h2>Quais pistas provam que é uma fábula?</h2>
                    <p>Selecione somente as características que sustentam a classificação.</p>
                  </div>
                </div>

                <div className="fable-evidence">
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
                  <div className={`fable-feedback ${evidenceSuccess ? "success" : "warning"}`}>
                    <b>{evidenceSuccess ? "Justificativa consistente." : "Revise suas evidências."}</b>
                    <p>
                      {evidenceSuccess
                        ? "Humanização, conflito moral e consequência formam um conjunto forte de evidências."
                        : "Local tradicional e fatos verificáveis apontam para outras finalidades. Foque no comportamento simbólico e no ensinamento."}
                    </p>
                  </div>
                )}

                {evidenceSuccess && (
                  <button type="button" className="primary-action fable-next" onClick={() => go("contrast")}>
                    Próxima etapa: Fábula × Lenda →
                  </button>
                )}
              </>
            )}

            {stage === "contrast" && (
              <>
                <div className="fable-task-heading">
                  <span>04</span>
                  <div>
                    <h2>Fábula ou lenda: qual é a diferença?</h2>
                    <p>Escolha a explicação que realmente diferencia os dois gêneros.</p>
                  </div>
                </div>

                <div className="fable-contrast-cards">
                  <article>
                    <span>FÁBULA</span>
                    <b>Comportamento em foco</b>
                    <p>Personagens simbólicas, conflito e consequência conduzem a um ensinamento.</p>
                  </article>
                  <article>
                    <span>LENDA</span>
                    <b>Tradição em foco</b>
                    <p>Narrativa ligada à memória coletiva, a lugares, crenças ou explicações transmitidas por uma comunidade.</p>
                  </article>
                </div>

                <div className="fable-options stacked">
                  {contrastOptions.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={contrast === item.id ? (item.correct ? "correct" : "wrong") : ""}
                      onClick={() => {
                        setContrast(item.id);
                        if (item.correct) addAchievement("Mestre dos contrastes");
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {contrast && (
                  <div className={`fable-feedback ${contrastSuccess ? "success" : "warning"}`}>
                    <b>{contrastSuccess ? "Boa diferenciação." : "Essa regra não é segura."}</b>
                    <p>
                      {contrastSuccess
                        ? "Você diferenciou os gêneros pela finalidade e pelo modo de construção do sentido."
                        : "Nem animais, nem ser inventado, nem ser 'real' são critérios suficientes sozinhos."}
                    </p>
                  </div>
                )}

                {contrastSuccess && (
                  <button type="button" className="primary-action fable-next" onClick={() => go("apply")}>
                    Próxima etapa: Aplicar →
                  </button>
                )}
              </>
            )}

            {stage === "apply" && (
              <>
                <div className="fable-task-heading">
                  <span>05</span>
                  <div>
                    <h2>Use o critério em textos novos</h2>
                    <p>Qual texto funciona como fábula?</p>
                  </div>
                </div>

                <div className="fable-application-grid">
                  {applicationTexts.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={application === item.id ? (item.correct ? "correct" : "wrong") : ""}
                      onClick={() => selectApplication(item.id)}
                    >
                      <span>{item.correct ? "TEXTO A" : "TEXTO B"}</span>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </button>
                  ))}
                </div>

                {selectedApplication && (
                  <div className={`fable-feedback ${applicationSuccess ? "success" : "warning"}`}>
                    <b>{applicationSuccess ? "Aplicação correta." : "Esse texto se aproxima mais de uma lenda."}</b>
                    <p>{selectedApplication.reason}</p>
                  </div>
                )}

                {applicationSuccess && (
                  <button type="button" className="primary-action fable-next" onClick={() => go("produce")}>
                    Próxima etapa: Produzir →
                  </button>
                )}
              </>
            )}

            {stage === "produce" && (
              <>
                <div className="fable-task-heading">
                  <span>06</span>
                  <div>
                    <h2>Planeje uma nova fábula</h2>
                    <p>Monte a estrutura narrativa antes de escrever. O objetivo é mostrar que você compreendeu como o gênero funciona.</p>
                  </div>
                </div>

                <div className="fable-builder">
                  <div>
                    <b>1. Personagens</b>
                    <div>
                      {characters.map((item) => (
                        <button type="button" key={item} className={character === item ? "selected" : ""} onClick={() => setCharacter(item)}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <b>2. Comportamento em discussão</b>
                    <div>
                      {behaviors.map((item) => (
                        <button type="button" key={item} className={behavior === item ? "selected" : ""} onClick={() => setBehavior(item)}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <b>3. Consequência</b>
                    <div>
                      {consequences.map((item) => (
                        <button type="button" key={item} className={consequence === item ? "selected" : ""} onClick={() => setConsequence(item)}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <b>4. Moral</b>
                    <div className="vertical">
                      {morals.map((item) => (
                        <button type="button" key={item} className={moral === item ? "selected" : ""} onClick={() => setMoral(item)}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {productionReady && (
                  <div className="fable-production-preview">
                    <span className="eyebrow">ESBOÇO DA SUA FÁBULA</span>
                    <p><b>Personagens:</b> {character}.</p>
                    <p><b>Problema:</b> a história discute {behavior}.</p>
                    <p><b>Virada:</b> {consequence}.</p>
                    <p><b>Moral:</b> “{moral}”</p>
                  </div>
                )}

                <button type="button" className="primary-action fable-next" disabled={!productionReady} onClick={finishProduction}>
                  Concluir e restaurar a Floresta →
                </button>
              </>
            )}

            {stage === "complete" && (
              <>
                <div className="fable-complete">
                  <div className="fable-complete-light">
                    <span>✦</span><span>✦</span><span>✦</span>
                  </div>
                  <h2>Floresta das Fábulas restaurada</h2>
                  <p>O ensinamento das histórias voltou a iluminar o distrito.</p>
                  <strong>+100 XP possíveis · XP atual: {xp}/400</strong>
                </div>

                <div className="fable-mastery">
                  <article><b>Reconhecer</b><span>100%</span><p>Classificou o gênero usando finalidade e pistas narrativas.</p></article>
                  <article><b>Explicar</b><span>100%</span><p>Justificou com humanização, conflito, consequência e reflexão.</p></article>
                  <article><b>Aplicar</b><span>100%</span><p>Diferenciou Fábula × Lenda e aplicou o critério em novo texto.</p></article>
                  <article><b>Produzir</b><span>100%</span><p>Planejou uma fábula com estrutura e moral coerentes.</p></article>
                </div>

                <div className="fable-final-actions">
                  <button type="button" className="secondary-action" onClick={() => setActiveView("progress")}>
                    Ver meu progresso
                  </button>
                  <button type="button" className="primary-action" onClick={() => setActiveView("map")}>
                    Voltar à cidade restaurada →
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
