
import { useMemo, useState } from "react";
import teacherImage from "../assets/teacher-guide.webp";
import statuteImage from "../assets/statute-district.webp";
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

const documentArticles = [
  {
    article: "Art. 1º",
    text: "Este documento estabelece princípios de convivência aplicáveis aos espaços comuns da Cidade das Palavras."
  },
  {
    article: "Art. 2º",
    text: "São direitos de toda pessoa que frequenta a cidade:",
    items: [
      "I – acessar os espaços de leitura, estudo e participação;",
      "II – expressar opiniões com respeito às demais pessoas;",
      "III – solicitar orientação e mediação quando houver conflito."
    ]
  },
  {
    article: "Art. 3º",
    text: "São deveres de moradores e visitantes:",
    items: [
      "I – preservar livros, equipamentos e espaços coletivos;",
      "II – respeitar turnos de fala e diferentes pontos de vista;",
      "III – colaborar para que todas as pessoas possam participar das atividades."
    ]
  },
  {
    article: "Art. 4º",
    text: "É vedado:",
    items: [
      "I – impedir deliberadamente a participação de outra pessoa;",
      "II – divulgar mensagens ofensivas nos espaços físicos ou digitais da cidade;",
      "III – danificar o patrimônio comum."
    ]
  },
  {
    article: "Art. 5º",
    text: "Compete ao Conselho de Convivência orientar situações de conflito e priorizar medidas de diálogo, reparação e responsabilidade."
  }
];

const observations = [
  {
    q: "A quem essas regras se aplicam?",
    a: "Elas se dirigem de forma ampla às pessoas que frequentam a Cidade das Palavras: moradores e visitantes."
  },
  {
    q: "O documento apresenta apenas proibições?",
    a: "Não. Ele organiza direitos, deveres, proibições e também define uma responsabilidade do Conselho de Convivência."
  },
  {
    q: "Quais expressões indicam caráter normativo?",
    a: "Expressões como “são direitos”, “são deveres”, “é vedado” e “compete ao” indicam permissões, obrigações, proibições e competências."
  },
  {
    q: "Por que o texto usa artigos e incisos?",
    a: "Essa organização ajuda a localizar normas e separar diferentes conteúdos. Porém, a forma sozinha não define o gênero: outros textos normativos também podem usar artigos."
  },
  {
    q: "O autor tenta convencer o leitor de uma opinião pessoal?",
    a: "Não. A finalidade principal é estabelecer normas para a convivência, e não defender uma tese por meio de argumentos."
  }
];

const classifications = [
  {
    id: "estatuto",
    label: "Estatuto",
    correct: true,
    feedback:
      "Correto. O documento estabelece um conjunto amplo de princípios, direitos, deveres, proibições e responsabilidades para uma comunidade."
  },
  {
    id: "regulamento",
    label: "Regulamento",
    correct: false,
    feedback:
      "Regulamentos também estabelecem regras, mas costumam detalhar procedimentos e critérios de uma atividade ou situação mais específica. Aqui o alcance é mais amplo e organiza a convivência da comunidade."
  },
  {
    id: "opiniao",
    label: "Artigo de opinião",
    correct: false,
    feedback:
      "Um artigo de opinião defende uma tese com argumentos. O documento lido não busca persuadir sobre uma posição: ele estabelece normas."
  },
  {
    id: "noticia",
    label: "Notícia",
    correct: false,
    feedback:
      "Uma notícia informa sobre acontecimentos. Aqui predominam direitos, deveres, proibições e competências."
  }
];

const evidenceOptions = [
  {
    id: "comunidade",
    label: "As normas se aplicam de modo amplo a uma comunidade.",
    correct: true
  },
  {
    id: "direitos",
    label: "O documento organiza direitos e deveres.",
    correct: true
  },
  {
    id: "normativa",
    label: "A linguagem estabelece obrigações, proibições, permissões e competências.",
    correct: true
  },
  {
    id: "organizacao",
    label: "O texto define também uma responsabilidade institucional do Conselho de Convivência.",
    correct: true
  },
  {
    id: "tese",
    label: "O autor apresenta uma tese pessoal e tenta convencer o leitor.",
    correct: false
  },
  {
    id: "acontecimento",
    label: "O objetivo principal é narrar um acontecimento recente.",
    correct: false
  }
];

const contrastOptions = [
  {
    id: "scope",
    label:
      "O estatuto estabelece bases amplas de organização, direitos e deveres de uma comunidade; o regulamento detalha regras e procedimentos de uma atividade específica; o artigo de opinião defende uma tese com argumentos.",
    correct: true
  },
  {
    id: "articles",
    label:
      "Todo texto com artigos numerados é estatuto; regulamentos e outros textos nunca usam artigos.",
    correct: false
  },
  {
    id: "orders",
    label:
      "A diferença é que o estatuto dá ordens, enquanto o regulamento apenas apresenta sugestões.",
    correct: false
  }
];

const applicationCases = [
  {
    id: "club",
    title: "Clube de Leitura",
    text:
      "Um novo clube precisa definir sua finalidade, quem pode participar, direitos e deveres dos membros e responsabilidades da coordenação.",
    genre: "Estatuto",
    correct: true,
    reason:
      "O documento precisa organizar de forma ampla a existência e o funcionamento de uma comunidade, incluindo direitos, deveres e responsabilidades."
  },
  {
    id: "tournament",
    title: "Torneio Interbairros",
    text:
      "A organização precisa definir duração das partidas, número de jogadores, critérios de desempate e situações de punição.",
    genre: "Regulamento",
    correct: false,
    reason:
      "Essas são regras operacionais de uma atividade específica. O gênero mais adequado é um regulamento."
  },
  {
    id: "newspaper",
    title: "Jornal da Cidade",
    text:
      "Uma estudante quer defender que a biblioteca deveria ficar aberta por mais tempo, apresentando razões e exemplos.",
    genre: "Artigo de opinião",
    correct: false,
    reason:
      "Aqui a intenção é defender uma posição com argumentos, característica de um artigo de opinião."
  }
];

type NormKind = "direito" | "dever" | "vedacao" | "competencia";

const normKinds: { id: NormKind; label: string }[] = [
  { id: "direito", label: "Direito" },
  { id: "dever", label: "Dever" },
  { id: "vedacao", label: "Proibição" },
  { id: "competencia", label: "Competência" }
];

const themes = [
  { id: "biblioteca", label: "Biblioteca e espaços de estudo" },
  { id: "participacao", label: "Participação nas atividades" },
  { id: "patrimonio", label: "Cuidado com o patrimônio" },
  { id: "digital", label: "Convivência no ambiente digital" }
];

const scopes = [
  "nos espaços comuns da Cidade das Palavras",
  "durante atividades coletivas",
  "nos espaços de leitura e estudo",
  "nos ambientes digitais vinculados à cidade"
];

const clauses: Record<NormKind, Record<string, string>> = {
  direito: {
    biblioteca: "toda pessoa acessar materiais e espaços de leitura em condições de igualdade",
    participacao: "toda pessoa participar das atividades e expressar suas ideias com respeito",
    patrimonio: "toda pessoa utilizar o patrimônio comum conforme sua finalidade",
    digital: "toda pessoa participar dos ambientes digitais com segurança e respeito"
  },
  dever: {
    biblioteca: "toda pessoa preservar o silêncio necessário e compartilhar os espaços de estudo de forma responsável",
    participacao: "toda pessoa respeitar turnos de fala e colaborar para a participação dos demais",
    patrimonio: "toda pessoa preservar materiais, equipamentos e espaços de uso coletivo",
    digital: "toda pessoa utilizar os ambientes digitais sem ofender, constranger ou excluir participantes"
  },
  vedacao: {
    biblioteca: "impedir injustificadamente o acesso de outra pessoa aos espaços de leitura",
    participacao: "interromper deliberadamente ou impedir a participação de outra pessoa",
    patrimonio: "danificar ou utilizar de forma indevida materiais e equipamentos de uso coletivo",
    digital: "publicar mensagens ofensivas ou expor outra pessoa sem autorização"
  },
  competencia: {
    biblioteca: "ao Conselho de Convivência acompanhar o uso coletivo dos espaços de leitura",
    participacao: "ao Conselho de Convivência mediar situações que prejudiquem a participação",
    patrimonio: "ao Conselho de Convivência orientar medidas de cuidado e reparação do patrimônio",
    digital: "ao Conselho de Convivência orientar situações de conflito nos ambientes digitais"
  }
};

function buildDraft(kind: NormKind, themeId: string, scope: string) {
  if (!themeId || !scope) return "";

  const clause = clauses[kind][themeId];
  const start =
    kind === "direito"
      ? "É direito de"
      : kind === "dever"
        ? "É dever de"
        : kind === "vedacao"
          ? "É vedado"
          : "Compete";

  return `Art. 6º ${start} ${clause} ${scope}.`;
}

export function StatuteMissionScreen() {
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
  const [normKind, setNormKind] = useState<NormKind>("direito");
  const [theme, setTheme] = useState("");
  const [scope, setScope] = useState("");
  const [draft, setDraft] = useState("");
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const stageIndex = stageOrder.indexOf(stage);

  const teacherText = useMemo(() => {
    switch (stage) {
      case "investigate":
        return "Não procure apenas palavras como “Art.”. Leia para descobrir quem é regulado, quais direitos e deveres aparecem e que efeito essas normas produzem na comunidade.";
      case "classify":
        return "Agora classifique o documento pela finalidade. Estatuto e regulamento são normativos, então você precisará observar também o alcance das regras.";
      case "justify":
        return "Uma boa justificativa combina várias pistas: alcance amplo, direitos e deveres, linguagem normativa e organização de responsabilidades.";
      case "contrast":
        return "Estatuto, regulamento e artigo de opinião podem tratar do mesmo tema, mas fazem coisas diferentes com a linguagem.";
      case "apply":
        return "Escolha o gênero adequado para uma necessidade real. Pense primeiro no que o documento precisa fazer.";
      case "produce":
        return "Agora você entra no Conselho da Cidade. Crie um novo artigo e revise se ele realmente funciona como norma.";
      case "complete":
        return "A Câmara da Cidade foi restaurada. As regras voltaram a organizar direitos, deveres e responsabilidades sem substituir o diálogo.";
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

  const selectedApplication = applicationCases.find(
    (item) => item.id === application
  );
  const applicationSuccess = selectedApplication?.correct ?? false;

  const generatedDraft = buildDraft(normKind, theme, scope);
  const productionReady =
    Boolean(theme && scope) &&
    draft.trim().length >= 45 &&
    /^Art\.\s*6º/i.test(draft.trim());

  function award(
    stageKey: "recognize" | "explain" | "apply" | "produce",
    label: string
  ) {
    if (mastery.estatuto[stageKey]) return;
    markStage("estatuto", stageKey);
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
    const item = applicationCases.find((option) => option.id === id);
    if (item?.correct) award("apply", "Aplicar concluído");
  }

  function prepareDraft() {
    setDraft(generatedDraft);
  }

  function finishProduction() {
    if (!productionReady) return;
    award("produce", "Produzir concluído");
    addAchievement("Guardião da convivência");
    addAchievement("Autor da cidade");
    go("complete");
  }

  return (
    <main className="statute-page">
      {rewardMessage && (
        <div className="xp-toast" role="status" aria-live="polite">
          <span>★</span>
          <b>{rewardMessage}</b>
        </div>
      )}

      <header className="statute-header">
        <div className="statute-header-title">
          <span className="eyebrow">CÂMARA DA CIDADE</span>
          <h1>O documento que perdeu seu nome</h1>
          <small>Normas · direitos · deveres · responsabilidades</small>
        </div>

        <div
          className="statute-progress"
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

        <div
          className="statute-accessibility"
          aria-label="Tamanho da interface"
        >
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

      <div className="statute-layout">
        <aside className="statute-side">
          <section className="statute-guide">
            <div className="statute-guide-image">
              <img src={teacherImage} alt="Professora Fabricia" />
            </div>
            <div className="statute-guide-copy">
              <span>PROFª FABRICIA</span>
              <p>{teacherText}</p>
            </div>
          </section>

          <section className="statute-stage-list">
            <strong>SUA MISSÃO</strong>
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

        <section className="statute-main">
          <section className="statute-chamber-banner">
            <img src={statuteImage} alt="" />
            <div className="statute-chamber-overlay" />
            <div className="statute-chamber-copy">
              <span>ARQUIVO NORMATIVO 04</span>
              <h2>As regras da cidade foram embaralhadas.</h2>
              <p>
                Descubra que tipo de documento organiza direitos, deveres,
                proibições e responsabilidades de toda uma comunidade.
              </p>
            </div>
            <div className="statute-seal" aria-hidden="true">§</div>
          </section>

          <section className="statute-document">
            <header>
              <div>
                <span className="eyebrow">DOCUMENTO RECUPERADO</span>
                <h2>Convivência na Cidade das Palavras</h2>
              </div>
              <span className="statute-document-chip">
                Identidade do gênero: bloqueada
              </span>
            </header>

            <div className="statute-paper">
              <div className="statute-paper-heading">
                <span>DOCUMENTO Nº 04</span>
                <strong>DISPOSIÇÕES DE CONVIVÊNCIA</strong>
              </div>

              {documentArticles.map((item) => (
                <article key={item.article}>
                  <p>
                    <b>{item.article}</b> {item.text}
                  </p>
                  {item.items && (
                    <div className="statute-incisos">
                      {item.items.map((subitem) => (
                        <p key={subitem}>{subitem}</p>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="statute-task">
            {stage === "investigate" && (
              <>
                <div className="statute-task-heading">
                  <span>01</span>
                  <div>
                    <h2>Investigue antes de classificar</h2>
                    <p>
                      Abra as perguntas para perceber a função do documento e
                      como sua linguagem organiza a convivência.
                    </p>
                  </div>
                </div>

                <div className="statute-observation-list">
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

                <div className="statute-insight">
                  <b>Pista importante</b>
                  <p>
                    Artigos e incisos ajudam a reconhecer textos normativos,
                    mas não bastam para distinguir estatuto de regulamento.
                    Observe também o alcance e a finalidade.
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-action statute-next"
                  onClick={() => go("classify")}
                >
                  Próxima etapa: Classificar →
                </button>
              </>
            )}

            {stage === "classify" && (
              <>
                <div className="statute-task-heading">
                  <span>02</span>
                  <div>
                    <h2>Que gênero é esse?</h2>
                    <p>
                      Use a finalidade e o alcance das normas para escolher.
                    </p>
                  </div>
                </div>

                <div className="statute-options">
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
                    className={`statute-feedback ${
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
                  <div className="statute-reveal">
                    <span>IDENTIDADE RECUPERADA</span>
                    <strong>ESTATUTO DE CONVIVÊNCIA</strong>
                  </div>
                )}

                {classificationSuccess && (
                  <button
                    type="button"
                    className="primary-action statute-next"
                    onClick={() => go("justify")}
                  >
                    Próxima etapa: Justificar →
                  </button>
                )}
              </>
            )}

            {stage === "justify" && (
              <>
                <div className="statute-task-heading">
                  <span>03</span>
                  <div>
                    <h2>Quais evidências sustentam a classificação?</h2>
                    <p>
                      Selecione somente as pistas que realmente mostram a
                      função de um estatuto.
                    </p>
                  </div>
                </div>

                <div className="statute-evidence">
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
                    className={`statute-feedback ${
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
                        ? "Você combinou alcance comunitário, direitos e deveres, linguagem normativa e organização de responsabilidades."
                        : "Tese pessoal e relato de acontecimentos pertencem a outras finalidades. Concentre-se na função normativa."}
                    </p>
                  </div>
                )}

                {evidenceSuccess && (
                  <button
                    type="button"
                    className="primary-action statute-next"
                    onClick={() => go("contrast")}
                  >
                    Próxima etapa: Comparar gêneros →
                  </button>
                )}
              </>
            )}

            {stage === "contrast" && (
              <>
                <div className="statute-task-heading">
                  <span>04</span>
                  <div>
                    <h2>Estatuto, regulamento ou artigo de opinião?</h2>
                    <p>
                      Os três podem tratar de convivência. O que muda é o que
                      cada texto pretende fazer.
                    </p>
                  </div>
                </div>

                <div className="statute-contrast-cards">
                  <article>
                    <span>ESTATUTO</span>
                    <b>Base ampla</b>
                    <p>
                      Organiza princípios, direitos, deveres e responsabilidades
                      de uma comunidade ou instituição.
                    </p>
                  </article>
                  <article>
                    <span>REGULAMENTO</span>
                    <b>Regras operacionais</b>
                    <p>
                      Detalha critérios e procedimentos de uma atividade,
                      serviço, competição ou situação específica.
                    </p>
                  </article>
                  <article>
                    <span>ARTIGO DE OPINIÃO</span>
                    <b>Tese e argumentos</b>
                    <p>
                      Procura convencer o leitor sobre uma posição por meio de
                      argumentos.
                    </p>
                  </article>
                </div>

                <div className="statute-options stacked">
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
                    className={`statute-feedback ${
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
                        ? "Você diferenciou os gêneros pela função e pelo alcance, e não apenas pela aparência."
                        : "Regulamentos também podem usar artigos e também estabelecem obrigações. A finalidade é um critério mais seguro."}
                    </p>
                  </div>
                )}

                {contrastSuccess && (
                  <button
                    type="button"
                    className="primary-action statute-next"
                    onClick={() => go("apply")}
                  >
                    Próxima etapa: Aplicar →
                  </button>
                )}
              </>
            )}

            {stage === "apply" && (
              <>
                <div className="statute-task-heading">
                  <span>05</span>
                  <div>
                    <h2>Qual situação realmente pede um estatuto?</h2>
                    <p>
                      Leia as necessidades e escolha pela função do documento.
                    </p>
                  </div>
                </div>

                <div className="statute-application-grid">
                  {applicationCases.map((item) => (
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
                      <span>{item.genre.toUpperCase()}</span>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </button>
                  ))}
                </div>

                {selectedApplication && (
                  <div
                    className={`statute-feedback ${
                      applicationSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {applicationSuccess
                        ? "Aplicação correta."
                        : `Esse caso pede ${selectedApplication.genre.toLowerCase()}.`}
                    </b>
                    <p>{selectedApplication.reason}</p>
                  </div>
                )}

                {applicationSuccess && (
                  <button
                    type="button"
                    className="primary-action statute-next"
                    onClick={() => go("produce")}
                  >
                    Próxima etapa: Produzir →
                  </button>
                )}
              </>
            )}

            {stage === "produce" && (
              <>
                <div className="statute-task-heading">
                  <span>06</span>
                  <div>
                    <h2>Escreva um novo artigo para a cidade</h2>
                    <p>
                      Use o construtor como apoio e depois revise o texto com
                      suas próprias palavras.
                    </p>
                  </div>
                </div>

                <div className="statute-builder">
                  <div>
                    <b>1. Tipo de norma</b>
                    <div>
                      {normKinds.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={
                            normKind === item.id ? "selected" : ""
                          }
                          onClick={() => {
                            setNormKind(item.id);
                            setDraft("");
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <b>2. Tema</b>
                    <div>
                      {themes.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={theme === item.id ? "selected" : ""}
                          onClick={() => {
                            setTheme(item.id);
                            setDraft("");
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <b>3. Onde se aplica?</b>
                    <div>
                      {scopes.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={scope === item ? "selected" : ""}
                          onClick={() => {
                            setScope(item);
                            setDraft("");
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {theme && scope && (
                  <div className="statute-draft-helper">
                    <span className="eyebrow">RASCUNHO SUGERIDO</span>
                    <p>{generatedDraft}</p>
                    <button
                      type="button"
                      className="secondary-action"
                      onClick={prepareDraft}
                    >
                      Usar como ponto de partida
                    </button>
                  </div>
                )}

                <div className="statute-editor">
                  <label htmlFor="statuteDraft">
                    <b>4. Revise seu artigo</b>
                    <span>
                      Mantenha “Art. 6º” e deixe a norma clara e objetiva.
                    </span>
                  </label>
                  <textarea
                    id="statuteDraft"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Art. 6º ..."
                    rows={5}
                  />
                  <div className="statute-checklist">
                    <span className={/^Art\.\s*6º/i.test(draft.trim()) ? "ok" : ""}>
                      ✓ identificação do artigo
                    </span>
                    <span className={draft.trim().length >= 45 ? "ok" : ""}>
                      ✓ norma suficientemente clara
                    </span>
                    <span className={theme && scope ? "ok" : ""}>
                      ✓ tema e contexto definidos
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="primary-action statute-next"
                  disabled={!productionReady}
                  onClick={finishProduction}
                >
                  Aprovar artigo e restaurar a Câmara →
                </button>
              </>
            )}

            {stage === "complete" && (
              <>
                <div className="statute-complete">
                  <div className="statute-complete-seal">§</div>
                  <h2>Câmara da Cidade restaurada</h2>
                  <p>
                    O documento voltou a organizar direitos, deveres e
                    responsabilidades da comunidade.
                  </p>
                  <strong>
                    +100 XP possíveis · XP atual: {xp}/400
                  </strong>
                </div>

                <div className="statute-final-article">
                  <span>NOVO ARTIGO APROVADO</span>
                  <p>{draft}</p>
                </div>

                <div className="statute-mastery">
                  <article>
                    <b>Reconhecer</b>
                    <span>100%</span>
                    <p>
                      Identificou o estatuto pela finalidade normativa e pelo
                      alcance comunitário.
                    </p>
                  </article>
                  <article>
                    <b>Explicar</b>
                    <span>100%</span>
                    <p>
                      Justificou usando direitos, deveres, linguagem normativa
                      e responsabilidades.
                    </p>
                  </article>
                  <article>
                    <b>Aplicar</b>
                    <span>100%</span>
                    <p>
                      Diferenciou estatuto, regulamento e artigo de opinião em
                      situações novas.
                    </p>
                  </article>
                  <article>
                    <b>Produzir</b>
                    <span>100%</span>
                    <p>
                      Criou e revisou um artigo normativo para a Cidade das
                      Palavras.
                    </p>
                  </article>
                </div>

                <div className="statute-final-actions">
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
