
import { useMemo, useState } from "react";
import teacherImage from "../assets/teacher-guide.webp";
import cityMap from "../assets/city-map.webp";
import { useGameStore } from "../store/useGameStore";

type Stage =
  | "investigate"
  | "classify"
  | "justify"
  | "contrast"
  | "apply"
  | "produce"
  | "complete";

const stageOrder: Stage[] = [
  "investigate",
  "classify",
  "justify",
  "contrast",
  "apply",
  "produce"
];

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
  "Na Vila do Murici, às margens do Rio das Letras, existe uma pedra escura junto à ponte antiga. Os moradores mais velhos contam que, antes das grandes cheias, ela produz um som baixo, parecido com um canto vindo de dentro da água.",
  "Há muitas gerações, durante uma tempestade, algumas famílias ouviram o som e deixaram as casas próximas à margem. Pouco depois, o rio subiu e cobriu o caminho. Desde então, muita gente passou a chamar o rochedo de Pedra que Canta.",
  "Ninguém concorda sobre a origem do som. Alguns dizem que é apenas o vento atravessando uma fenda. Outros afirmam que o próprio rio avisa quando precisa de espaço.",
  "Com o tempo, surgiu um costume: quando as primeiras chuvas fortes chegam, moradores colocam uma pequena lanterna perto da ponte para lembrar que o rio deve ser respeitado.",
  "As crianças da vila escutam essa história dos avós e costumam procurar a pedra nas noites de chuva. Alguns juram já ter ouvido o canto. Outros dizem que não ouviram nada — mas todos conhecem a história."
];

const observations = [
  {
    q: "Por que o lugar é importante para a narrativa?",
    a: "A história está ligada à Vila do Murici, à ponte antiga e ao Rio das Letras. O espaço não é apenas cenário: ele faz parte da memória da comunidade."
  },
  {
    q: "Como a história chega às novas gerações?",
    a: "Ela é contada pelos moradores mais velhos, especialmente de avós para crianças. Essa transmissão entre gerações é uma pista importante."
  },
  {
    q: "Qual é o elemento extraordinário?",
    a: "A pedra parece cantar antes das cheias, e parte da comunidade acredita que o próprio rio produz o aviso."
  },
  {
    q: "A narrativa tenta provar cientificamente o que aconteceu?",
    a: "Não. Ela preserva versões diferentes e a crença da comunidade. A dúvida entre explicação natural e extraordinária faz parte do efeito da história."
  },
  {
    q: "O que a narrativa ajuda a explicar ou preservar?",
    a: "Ela explica culturalmente o costume das lanternas e preserva uma memória coletiva sobre a relação da vila com o rio."
  }
];

const classifications = [
  {
    id: "lenda",
    label: "Lenda",
    correct: true,
    feedback:
      "Correto. O texto articula lugar, memória coletiva, transmissão entre gerações e um acontecimento extraordinário ligado à cultura da comunidade."
  },
  {
    id: "fabula",
    label: "Fábula",
    correct: false,
    feedback:
      "A fábula costuma organizar um conflito simbólico para refletir sobre comportamentos. Aqui o centro está na tradição da comunidade e em sua relação com um lugar."
  },
  {
    id: "fantastico",
    label: "Conto fantástico",
    correct: false,
    feedback:
      "O extraordinário também pode aparecer em contos fantásticos, mas nesta narrativa ele está ligado à memória coletiva, ao lugar e à transmissão cultural."
  },
  {
    id: "historico",
    label: "Relato histórico",
    correct: false,
    feedback:
      "Um relato histórico busca reconstruir acontecimentos com base em registros e evidências. A narrativa da Pedra que Canta preserva crença, tradição e versões orais."
  }
];

const evidenceOptions = [
  {
    id: "lugar",
    label: "A narrativa está ligada a um lugar reconhecido pela comunidade.",
    correct: true
  },
  {
    id: "geracoes",
    label: "A história é transmitida entre gerações.",
    correct: true
  },
  {
    id: "extraordinario",
    label: "Há um elemento extraordinário associado à memória e às crenças locais.",
    correct: true
  },
  {
    id: "costume",
    label: "A história ajuda a explicar ou preservar um costume da comunidade.",
    correct: true
  },
  {
    id: "moral",
    label: "Animais humanizados apresentam uma moral sobre comportamento.",
    correct: false
  },
  {
    id: "dados",
    label: "Datas, documentos e fontes comprovam objetivamente o acontecimento.",
    correct: false
  }
];

const contrastOptions = [
  {
    id: "purpose",
    label:
      "A lenda se liga à memória, ao lugar e às crenças de uma comunidade; a fábula enfatiza um ensinamento sobre comportamento; o conto fantástico não precisa nascer de uma tradição coletiva.",
    correct: true
  },
  {
    id: "supernatural",
    label:
      "Se existe algo sobrenatural, o texto é sempre uma lenda.",
    correct: false
  },
  {
    id: "truth",
    label:
      "A diferença é que lendas são fatos verdadeiros e contos fantásticos são sempre falsos.",
    correct: false
  }
];

const applicationTexts = [
  {
    id: "serra",
    title: "O Assobio da Serra",
    text:
      "Moradores de um povoado contam que, quando uma neblina muito forte cobre a serra, um assobio parece orientar os viajantes até a trilha antiga. A história é repetida nas festas da comunidade há décadas.",
    correct: true,
    reason:
      "A narrativa está ligada a um lugar, é transmitida pela comunidade e incorpora um elemento extraordinário à memória coletiva."
  },
  {
    id: "reino",
    title: "A Torre dos Sete Relógios",
    text:
      "Em um reino inventado, uma aprendiz de magia precisa atravessar sete salas e derrotar um feiticeiro para recuperar um relógio capaz de parar o tempo.",
    correct: false,
    reason:
      "Há fantasia, mas o texto não depende de tradição coletiva, memória de uma comunidade ou ligação cultural com um lugar."
  }
];

const places = [
  "uma ponte antiga sobre um rio",
  "uma praça com uma árvore centenária",
  "uma trilha perto de uma serra",
  "um poço no centro de uma vila"
];

const mysteries = [
  "uma luz aparece somente antes de grandes chuvas",
  "um assobio é ouvido quando alguém se perde",
  "a árvore parece sussurrar nomes de antigos moradores",
  "a água muda de cor em uma noite específica do ano"
];

const explanations = [
  "o fenômeno teria começado depois que a comunidade sobreviveu a uma grande enchente",
  "o lugar guardaria a lembrança de uma antiga viajante que ajudava pessoas perdidas",
  "o acontecimento explicaria por que os moradores realizam uma celebração anual",
  "o mistério seria uma forma de a natureza avisar que precisa ser respeitada"
];

const transmissions = [
  "a história é contada pelos avós às crianças",
  "os moradores repetem a narrativa durante uma festa local",
  "visitantes conhecem a história por meio dos moradores mais velhos",
  "a comunidade mantém um pequeno ritual para lembrar a narrativa"
];

export function LegendMissionScreen() {
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
  const [place, setPlace] = useState("");
  const [mystery, setMystery] = useState("");
  const [explanation, setExplanation] = useState("");
  const [transmission, setTransmission] = useState("");
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const stageIndex = stageOrder.indexOf(stage);

  const teacherText = useMemo(() => {
    switch (stage) {
      case "investigate":
        return "Na Vila das Lendas, o lugar e a memória importam tanto quanto o acontecimento misterioso. Leia procurando quem conta a história, onde ela acontece e por que a comunidade continua repetindo-a.";
      case "classify":
        return "Agora classifique a narrativa. Não use apenas a presença do sobrenatural como critério: fantasia também pode aparecer em outros gêneros.";
      case "justify":
        return "Uma boa classificação precisa de evidências. Procure a relação com o lugar, a memória coletiva, a transmissão entre gerações e o elemento extraordinário.";
      case "contrast":
        return "Lenda, fábula e conto fantástico podem conter imaginação. O segredo é descobrir para que cada narrativa usa esse elemento.";
      case "apply":
        return "Você vai comparar duas novas narrativas. Tente reconhecer qual delas depende de uma tradição coletiva.";
      case "produce":
        return "Agora construa o núcleo de uma lenda original da Cidade das Palavras: lugar, mistério, explicação cultural e forma de transmissão.";
      case "complete":
        return "Você restaurou a Vila das Lendas. A memória coletiva voltou a iluminar suas ruas.";
    }
  }, [stage]);

  const selectedClassification = classifications.find(
    (item) => item.id === classification
  );
  const classificationSuccess = selectedClassification?.correct ?? false;

  const correctEvidence = evidenceOptions
    .filter((item) => item.correct)
    .map((item) => item.id)
    .sort();

  const evidenceSuccess =
    evidenceChecked &&
    JSON.stringify([...evidence].sort()) === JSON.stringify(correctEvidence);

  const contrastSuccess =
    contrastOptions.find((item) => item.id === contrast)?.correct ?? false;

  const selectedApplication = applicationTexts.find(
    (item) => item.id === application
  );
  const applicationSuccess = selectedApplication?.correct ?? false;

  const productionReady = Boolean(
    place && mystery && explanation && transmission
  );

  function award(
    stageKey: "recognize" | "explain" | "apply" | "produce",
    label: string
  ) {
    if (mastery.lenda[stageKey]) return;
    markStage("lenda", stageKey);
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
    if (
      JSON.stringify([...evidence].sort()) === JSON.stringify(correctEvidence)
    ) {
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
    addAchievement("Guardião da memória");
    addAchievement("Autor da cidade");
    go("complete");
  }

  return (
    <main className="legend-page">
      {rewardMessage && (
        <div className="xp-toast" role="status" aria-live="polite">
          <span>★</span>
          <b>{rewardMessage}</b>
        </div>
      )}

      <header className="legend-header">
        <div className="legend-header-title">
          <span className="eyebrow">VILA DAS LENDAS</span>
          <h1>O mistério da Pedra que Canta</h1>
          <small>Lugar · memória · tradição · acontecimento extraordinário</small>
        </div>

        <div
          className="legend-progress"
          aria-label={`Etapa ${stage === "complete" ? 6 : stageIndex + 1} de 6`}
        >
          <span>
            ETAPA {stage === "complete" ? 6 : stageIndex + 1} DE 6
          </span>
          <div>
            {stageOrder.map((item, index) => (
              <i
                key={item}
                className={
                  index <= stageIndex || stage === "complete" ? "done" : ""
                }
              />
            ))}
          </div>
        </div>

        <div className="legend-accessibility" aria-label="Tamanho da interface">
          <button
            type="button"
            aria-label="Diminuir tamanho da interface"
            onClick={() =>
              setFontScale(Math.max(0.9, +(fontScale - 0.1).toFixed(2)))
            }
          >
            A−
          </button>
          <output aria-live="polite">
            {Math.round(fontScale * 100)}%
          </output>
          <button
            type="button"
            aria-label="Aumentar tamanho da interface"
            onClick={() =>
              setFontScale(Math.min(1.5, +(fontScale + 0.1).toFixed(2)))
            }
          >
            A+
          </button>
        </div>

        <button
          type="button"
          className="secondary-action"
          onClick={() => setActiveView("map")}
        >
          ← Voltar ao mapa
        </button>
      </header>

      <div className="legend-layout">
        <aside className="legend-side">
          <section className="legend-guide">
            <div className="legend-guide-image">
              <img src={teacherImage} alt="Professora Fabricia" />
            </div>
            <div className="legend-guide-copy">
              <span>PROFª FABRICIA</span>
              <p>{teacherText}</p>
            </div>
          </section>

          <section className="legend-stage-list">
            <strong>SUA JORNADA</strong>
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
          </section>
        </aside>

        <section className="legend-main">
          <section className="legend-village-banner">
            <img src={cityMap} alt="" />
            <div className="legend-village-overlay" />
            <div className="legend-moon" aria-hidden="true" />
            <div className="legend-fog fog-a" aria-hidden="true" />
            <div className="legend-fog fog-b" aria-hidden="true" />
            <div className="legend-village-copy">
              <span>ARQUIVO DA MEMÓRIA 03</span>
              <h2>As histórias da vila estão desaparecendo.</h2>
              <p>
                Descubra por que algumas narrativas sobrevivem por gerações e
                como lugar, crença e memória coletiva constroem uma lenda.
              </p>
            </div>
          </section>

          <section className="legend-story">
            <header>
              <div>
                <span className="eyebrow">LENDA ORIGINAL DO JOGO</span>
                <h2>A Pedra que Canta</h2>
              </div>
              <span className="legend-story-chip">
                Local fictício: Vila do Murici
              </span>
            </header>

            <div className="legend-story-grid">
              <article className="legend-parchment">
                <span className="legend-parchment-number">I</span>
                {storyParagraphs.slice(0, 3).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>

              <article className="legend-parchment">
                <span className="legend-parchment-number">II</span>
                {storyParagraphs.slice(3).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <blockquote>
                  “Alguns juram já ter ouvido o canto. Outros dizem que não
                  ouviram nada — mas todos conhecem a história.”
                </blockquote>
              </article>
            </div>
          </section>

          <section className="legend-task">
            {stage === "investigate" && (
              <>
                <div className="legend-task-heading">
                  <span>01</span>
                  <div>
                    <h2>Investigue a memória da vila</h2>
                    <p>
                      Abra as perguntas para perceber como lugar, comunidade,
                      tradição e mistério se relacionam.
                    </p>
                  </div>
                </div>

                <div className="legend-observation-list">
                  {observations.map((item, index) => (
                    <button
                      type="button"
                      key={item.q}
                      className={openObservation === index ? "open" : ""}
                      onClick={() =>
                        setOpenObservation(
                          openObservation === index ? null : index
                        )
                      }
                    >
                      <strong>{item.q}</strong>
                      <span>
                        {openObservation === index
                          ? item.a
                          : "Toque para investigar"}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="legend-insight">
                  <b>Pista central</b>
                  <p>
                    Uma lenda não precisa provar o acontecimento como um fato
                    histórico. Ela preserva uma narrativa significativa para
                    uma comunidade.
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-action legend-next"
                  onClick={() => go("classify")}
                >
                  Próxima etapa: Classificar →
                </button>
              </>
            )}

            {stage === "classify" && (
              <>
                <div className="legend-task-heading">
                  <span>02</span>
                  <div>
                    <h2>Que gênero é esse?</h2>
                    <p>
                      O sobrenatural, sozinho, não resolve a classificação.
                      Pense em lugar, memória e transmissão.
                    </p>
                  </div>
                </div>

                <div className="legend-options">
                  {classifications.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={
                        classification === item.id
                          ? item.correct
                            ? "correct"
                            : "wrong"
                          : ""
                      }
                      onClick={() => selectClassification(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {selectedClassification && (
                  <div
                    className={`legend-feedback ${
                      classificationSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {classificationSuccess
                        ? "Classificação consistente."
                        : "Por que não?"}
                    </b>
                    <p>{selectedClassification.feedback}</p>
                  </div>
                )}

                {classificationSuccess && (
                  <button
                    type="button"
                    className="primary-action legend-next"
                    onClick={() => go("justify")}
                  >
                    Próxima etapa: Justificar →
                  </button>
                )}
              </>
            )}

            {stage === "justify" && (
              <>
                <div className="legend-task-heading">
                  <span>03</span>
                  <div>
                    <h2>Quais pistas provam que é uma lenda?</h2>
                    <p>
                      Selecione somente as evidências relacionadas à construção
                      cultural desse gênero.
                    </p>
                  </div>
                </div>

                <div className="legend-evidence">
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

                <button
                  type="button"
                  className="secondary-action"
                  onClick={checkEvidence}
                >
                  Verificar evidências
                </button>

                {evidenceChecked && (
                  <div
                    className={`legend-feedback ${
                      evidenceSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {evidenceSuccess
                        ? "Justificativa consistente."
                        : "Revise suas evidências."}
                    </b>
                    <p>
                      {evidenceSuccess
                        ? "Lugar, transmissão entre gerações, elemento extraordinário e costume coletivo formam um conjunto forte de evidências."
                        : "Evite confundir lenda com fábula ou relato histórico. Procure as marcas de memória e tradição da comunidade."}
                    </p>
                  </div>
                )}

                {evidenceSuccess && (
                  <button
                    type="button"
                    className="primary-action legend-next"
                    onClick={() => go("contrast")}
                  >
                    Próxima etapa: Comparar gêneros →
                  </button>
                )}
              </>
            )}

            {stage === "contrast" && (
              <>
                <div className="legend-task-heading">
                  <span>04</span>
                  <div>
                    <h2>Lenda, fábula ou conto fantástico?</h2>
                    <p>
                      Os três podem usar imaginação. Compare a função que esse
                      elemento exerce em cada gênero.
                    </p>
                  </div>
                </div>

                <div className="legend-contrast-cards">
                  <article>
                    <span>LENDA</span>
                    <b>Memória coletiva</b>
                    <p>
                      Liga narrativa, lugar, crença e tradição de uma
                      comunidade.
                    </p>
                  </article>
                  <article>
                    <span>FÁBULA</span>
                    <b>Comportamento</b>
                    <p>
                      Constrói um ensinamento por meio de personagens e
                      consequências simbólicas.
                    </p>
                  </article>
                  <article>
                    <span>CONTO FANTÁSTICO</span>
                    <b>Experiência ficcional</b>
                    <p>
                      Pode explorar o extraordinário sem depender de uma
                      tradição coletiva real ou imaginada.
                    </p>
                  </article>
                </div>

                <div className="legend-options stacked">
                  {contrastOptions.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={
                        contrast === item.id
                          ? item.correct
                            ? "correct"
                            : "wrong"
                          : ""
                      }
                      onClick={() => {
                        setContrast(item.id);
                        if (item.correct)
                          addAchievement("Mestre dos contrastes");
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {contrast && (
                  <div
                    className={`legend-feedback ${
                      contrastSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {contrastSuccess
                        ? "Boa diferenciação."
                        : "Esse critério é insuficiente."}
                    </b>
                    <p>
                      {contrastSuccess
                        ? "Você diferenciou os gêneros pela função do imaginário e pela relação com memória, comportamento e tradição."
                        : "Apenas ter sobrenatural ou parecer verdadeiro não define o gênero."}
                    </p>
                  </div>
                )}

                {contrastSuccess && (
                  <button
                    type="button"
                    className="primary-action legend-next"
                    onClick={() => go("apply")}
                  >
                    Próxima etapa: Aplicar →
                  </button>
                )}
              </>
            )}

            {stage === "apply" && (
              <>
                <div className="legend-task-heading">
                  <span>05</span>
                  <div>
                    <h2>Use o critério em uma nova narrativa</h2>
                    <p>Qual dos textos abaixo funciona como lenda?</p>
                  </div>
                </div>

                <div className="legend-application-grid">
                  {applicationTexts.map((item, index) => (
                    <button
                      type="button"
                      key={item.id}
                      className={
                        application === item.id
                          ? item.correct
                            ? "correct"
                            : "wrong"
                          : ""
                      }
                      onClick={() => selectApplication(item.id)}
                    >
                      <span>TEXTO {index === 0 ? "A" : "B"}</span>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </button>
                  ))}
                </div>

                {selectedApplication && (
                  <div
                    className={`legend-feedback ${
                      applicationSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {applicationSuccess
                        ? "Aplicação correta."
                        : "Há fantasia, mas falta tradição coletiva."}
                    </b>
                    <p>{selectedApplication.reason}</p>
                  </div>
                )}

                {applicationSuccess && (
                  <button
                    type="button"
                    className="primary-action legend-next"
                    onClick={() => go("produce")}
                  >
                    Próxima etapa: Produzir →
                  </button>
                )}
              </>
            )}

            {stage === "produce" && (
              <>
                <div className="legend-task-heading">
                  <span>06</span>
                  <div>
                    <h2>Crie uma lenda para a Cidade das Palavras</h2>
                    <p>
                      Monte o núcleo da narrativa. O importante é relacionar
                      lugar, mistério e memória coletiva.
                    </p>
                  </div>
                </div>

                <div className="legend-builder">
                  <div>
                    <b>1. Lugar</b>
                    <div>
                      {places.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={place === item ? "selected" : ""}
                          onClick={() => setPlace(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <b>2. Acontecimento misterioso</b>
                    <div>
                      {mysteries.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={mystery === item ? "selected" : ""}
                          onClick={() => setMystery(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <b>3. Explicação cultural</b>
                    <div>
                      {explanations.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={explanation === item ? "selected" : ""}
                          onClick={() => setExplanation(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <b>4. Como a história é transmitida?</b>
                    <div className="vertical">
                      {transmissions.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={transmission === item ? "selected" : ""}
                          onClick={() => setTransmission(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {productionReady && (
                  <div className="legend-production-preview">
                    <span className="eyebrow">
                      ESBOÇO DA SUA LENDA
                    </span>
                    <h3>A Lenda do Lugar Misterioso</h3>
                    <p>
                      Em <b>{place}</b>, moradores contam que{" "}
                      <b>{mystery}</b>.
                    </p>
                    <p>
                      Segundo a tradição,{" "}
                      <b>{explanation}</b>.
                    </p>
                    <p>
                      Até hoje, <b>{transmission}</b>.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  className="primary-action legend-next"
                  disabled={!productionReady}
                  onClick={finishProduction}
                >
                  Concluir e restaurar a Vila →
                </button>
              </>
            )}

            {stage === "complete" && (
              <>
                <div className="legend-complete">
                  <div className="legend-complete-moon">☾</div>
                  <h2>Vila das Lendas restaurada</h2>
                  <p>
                    As histórias voltaram a circular entre as gerações da
                    Cidade das Palavras.
                  </p>
                  <strong>
                    +100 XP possíveis · XP atual: {xp}/400
                  </strong>
                </div>

                <div className="legend-mastery">
                  <article>
                    <b>Reconhecer</b>
                    <span>100%</span>
                    <p>
                      Identificou a lenda por sua ligação com memória, lugar e
                      tradição.
                    </p>
                  </article>
                  <article>
                    <b>Explicar</b>
                    <span>100%</span>
                    <p>
                      Justificou a classificação com evidências culturais e
                      narrativas.
                    </p>
                  </article>
                  <article>
                    <b>Aplicar</b>
                    <span>100%</span>
                    <p>
                      Diferenciou lenda, fábula e conto fantástico em novos
                      contextos.
                    </p>
                  </article>
                  <article>
                    <b>Produzir</b>
                    <span>100%</span>
                    <p>
                      Planejou uma lenda articulando lugar, mistério e
                      transmissão.
                    </p>
                  </article>
                </div>

                <div className="legend-final-actions">
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() => setActiveView("progress")}
                  >
                    Ver meu progresso
                  </button>
                  <button
                    type="button"
                    className="primary-action"
                    onClick={() => setActiveView("map")}
                  >
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
