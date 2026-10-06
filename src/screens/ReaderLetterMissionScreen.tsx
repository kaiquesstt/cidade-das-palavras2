
import { useMemo, useState } from "react";
import teacherImage from "../assets/teacher-guide.webp";
import letterImage from "../assets/reader-letter-district.webp";
import { useGameStore } from "../store/useGameStore";

type Stage =
  | "investigate"
  | "classify"
  | "justify"
  | "contrast"
  | "apply"
  | "produce"
  | "complete";

type TraceKey =
  | "publicacao"
  | "destinatario"
  | "posicao"
  | "argumento"
  | "proposta"
  | "assinatura";

type Stance = "concorda" | "discorda" | "acrescenta";

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

const publication = {
  title: "Praça Central terá reforma no próximo semestre",
  source: "Jornal da Cidade · edição fictícia",
  excerpt:
    "A reforma prevista para a Praça Central inclui novo piso, iluminação e reorganização dos bancos. O projeto divulgado ainda não detalha alterações na arborização nem novas áreas de sombra."
};

const letterParagraphs = [
  {
    id: "p1",
    text:
      "À equipe do Jornal da Cidade,"
  },
  {
    id: "p2",
    text:
      "Li a reportagem “Praça Central terá reforma no próximo semestre” e considero positiva a recuperação do espaço. No entanto, senti falta de uma discussão mais clara sobre a arborização."
  },
  {
    id: "p3",
    text:
      "Quem utiliza a praça no meio da tarde sabe que áreas sem sombra ficam pouco convidativas. Reformar o piso e a iluminação pode melhorar o espaço, mas o conforto de quem permanece ali também deveria fazer parte do planejamento."
  },
  {
    id: "p4",
    text:
      "Seria importante que o jornal acompanhasse esse ponto nas próximas matérias e perguntasse aos responsáveis pelo projeto se estão previstas novas árvores ou estruturas de sombra."
  },
  {
    id: "p5",
    text:
      "Atenciosamente,\nHelena, moradora do Bairro do Livro."
  }
];

const traces: {
  id: TraceKey;
  label: string;
  title: string;
  explanation: string;
  paragraph: string;
}[] = [
  {
    id: "publicacao",
    label: "Publicação anterior",
    title: "A carta menciona explicitamente a reportagem à qual responde.",
    explanation:
      "Essa referência cria o diálogo público que caracteriza a carta do leitor.",
    paragraph: "p2"
  },
  {
    id: "destinatario",
    label: "Destinatário",
    title: "A mensagem é dirigida à equipe do jornal.",
    explanation:
      "A carta participa de um espaço público de circulação, não de uma conversa privada.",
    paragraph: "p1"
  },
  {
    id: "posicao",
    label: "Posicionamento",
    title: "A leitora valoriza a reforma, mas questiona a ausência de discussão sobre arborização.",
    explanation:
      "A carta do leitor costuma expressar avaliação, concordância, discordância ou complementação.",
    paragraph: "p2"
  },
  {
    id: "argumento",
    label: "Argumento",
    title: "A falta de sombra reduz o conforto e o uso da praça em certos horários.",
    explanation:
      "A opinião ganha força quando vem acompanhada de uma razão compreensível.",
    paragraph: "p3"
  },
  {
    id: "proposta",
    label: "Pedido ou proposta",
    title: "A leitora sugere que o jornal acompanhe a questão em matérias futuras.",
    explanation:
      "Cartas do leitor podem solicitar esclarecimento, sugerir pauta, corrigir, elogiar ou questionar.",
    paragraph: "p4"
  },
  {
    id: "assinatura",
    label: "Identificação",
    title: "A carta termina com identificação da leitora.",
    explanation:
      "Em veículos reais, a forma de identificação depende das regras editoriais do meio de comunicação.",
    paragraph: "p5"
  }
];

const classifications = [
  {
    id: "carta",
    label: "Carta do leitor",
    correct: true,
    feedback:
      "Correto. A mensagem responde explicitamente a uma reportagem, dirige-se ao jornal e apresenta uma posição argumentada da leitora."
  },
  {
    id: "artigo",
    label: "Artigo de opinião",
    correct: false,
    feedback:
      "O texto também argumenta, mas sua organização depende diretamente de uma publicação anterior e do diálogo com o veículo."
  },
  {
    id: "pessoal",
    label: "Carta pessoal",
    correct: false,
    feedback:
      "Uma carta pessoal circula em contexto privado e estabelece relação pessoal entre remetente e destinatário. Aqui a intenção é participar de um debate público."
  },
  {
    id: "noticia",
    label: "Notícia",
    correct: false,
    feedback:
      "A carta comenta uma notícia, mas não tem como finalidade principal relatar um acontecimento de forma informativa."
  }
];

const evidenceOptions = [
  {
    id: "referencia",
    label: "Há referência explícita a uma publicação anterior.",
    correct: true
  },
  {
    id: "veiculo",
    label: "A mensagem se dirige ao veículo de comunicação.",
    correct: true
  },
  {
    id: "posicionamento",
    label: "A leitora apresenta avaliação e argumentos sobre o que foi publicado.",
    correct: true
  },
  {
    id: "publica",
    label: "A finalidade é participar publicamente da discussão provocada pela matéria.",
    correct: true
  },
  {
    id: "privada",
    label: "A mensagem trata de um assunto íntimo entre pessoas próximas.",
    correct: false
  },
  {
    id: "neutralidade",
    label: "A autora evita qualquer posicionamento para manter neutralidade jornalística.",
    correct: false
  }
];

const contrastOptions = [
  {
    id: "function",
    label:
      "Carta do leitor responde publicamente a algo publicado; artigo de opinião desenvolve uma tese sem precisar responder a um texto específico; carta pessoal se dirige a alguém em contexto privado.",
    correct: true
  },
  {
    id: "size",
    label:
      "Carta do leitor é sempre curta, artigo de opinião é sempre longo e carta pessoal não pode ter opinião.",
    correct: false
  },
  {
    id: "signature",
    label:
      "Qualquer texto assinado é carta do leitor; textos sem assinatura são artigos de opinião.",
    correct: false
  }
];

const applicationTexts = [
  {
    id: "A",
    title: "Depois da matéria sobre o transporte",
    genre: "Carta do leitor",
    text:
      "À redação, li a matéria publicada ontem sobre os novos horários de ônibus. A mudança pode ajudar parte dos estudantes, mas o texto não explicou como ficam os bairros mais afastados. Sugiro que o jornal ouça moradores dessas regiões.",
    correct: true,
    reason:
      "O texto menciona uma matéria anterior, dirige-se à redação e participa do debate gerado pela publicação."
  },
  {
    id: "B",
    title: "Mobilidade também é acesso",
    genre: "Artigo de opinião",
    text:
      "Uma cidade que pretende ampliar o acesso à educação precisa discutir mobilidade. Horários de transporte devem considerar também estudantes do turno noturno e moradores de regiões distantes.",
    correct: false,
    reason:
      "Há tese e argumentos, mas não existe resposta direta a uma publicação específica."
  },
  {
    id: "C",
    title: "Mensagem para Lucas",
    genre: "Carta pessoal",
    text:
      "Lucas, vi que você começou a estudar à noite. Se o ônibus atrasar de novo, me avise para combinarmos outra forma de voltar para casa.",
    correct: false,
    reason:
      "É uma comunicação privada entre pessoas que mantêm relação pessoal."
  }
];

const productionSources = [
  {
    id: "biblioteca",
    title: "Biblioteca testa empréstimo de tablets",
    excerpt:
      "O Jornal da Cidade informou que a biblioteca iniciará um projeto-piloto de empréstimo de tablets para atividades de leitura e pesquisa.",
    stances: {
      concorda: "A iniciativa pode ampliar o acesso a recursos digitais.",
      discorda: "O projeto não deveria começar antes de esclarecer critérios de acesso e responsabilidade.",
      acrescenta: "A matéria precisa discutir também formação para uso responsável e alternativas para quem prefere materiais impressos."
    },
    reasons: [
      "recursos digitais podem ampliar formas de leitura e pesquisa",
      "critérios transparentes ajudam a tornar o acesso mais justo",
      "equipamentos precisam de orientação de uso e manutenção",
      "materiais impressos e digitais podem coexistir"
    ],
    actions: [
      "pedir que o jornal explique os critérios do projeto",
      "sugerir que a redação ouça estudantes e bibliotecários",
      "propor uma matéria de acompanhamento após o período de teste"
    ]
  },
  {
    id: "intervalo",
    title: "Escola avalia ampliar o intervalo em dez minutos",
    excerpt:
      "Uma notícia informou que a escola estuda aumentar a duração do intervalo, mas ainda não explicou como a mudança afetaria os horários das aulas.",
    stances: {
      concorda: "Um intervalo um pouco maior pode favorecer descanso e convivência.",
      discorda: "A mudança não deveria ser feita sem avaliar seu impacto no tempo das aulas.",
      acrescenta: "O debate deveria considerar a opinião de estudantes, professores e equipe escolar."
    },
    reasons: [
      "o descanso pode ajudar na retomada da atenção",
      "a mudança interfere na organização de toda a rotina escolar",
      "decisões de convivência funcionam melhor quando diferentes grupos são ouvidos",
      "é importante avaliar efeitos antes de tornar a mudança permanente"
    ],
    actions: [
      "pedir que a reportagem apresente como os horários seriam reorganizados",
      "sugerir que o jornal escolar faça uma consulta com a comunidade",
      "propor acompanhamento após um período de teste"
    ]
  },
  {
    id: "praca",
    title: "Praça ganhará área de estudos ao ar livre",
    excerpt:
      "A prefeitura fictícia da Cidade das Palavras anunciou mesas e pontos de energia em uma área da praça destinada a estudo e leitura.",
    stances: {
      concorda: "Criar espaços públicos de estudo pode ampliar oportunidades de uso da praça.",
      discorda: "O projeto precisa resolver questões de sombra, segurança e conservação antes de instalar equipamentos.",
      acrescenta: "A matéria deveria discutir acessibilidade, iluminação e manutenção do novo espaço."
    },
    reasons: [
      "espaços públicos de estudo podem atender quem tem poucos recursos em casa",
      "sombra e conforto influenciam o uso do espaço",
      "equipamentos públicos precisam de manutenção planejada",
      "acessibilidade deve fazer parte do projeto desde o início"
    ],
    actions: [
      "pedir detalhes sobre acessibilidade e manutenção",
      "sugerir entrevistas com futuros usuários do espaço",
      "propor uma nova matéria depois da inauguração"
    ]
  }
];

export function ReaderLetterMissionScreen() {
  const setActiveView = useGameStore((s) => s.setActiveView);
  const markStage = useGameStore((s) => s.markStage);
  const addAchievement = useGameStore((s) => s.addAchievement);
  const mastery = useGameStore((s) => s.mastery);
  const xp = useGameStore((s) => s.xp);
  const fontScale = useGameStore((s) => s.fontScale);
  const setFontScale = useGameStore((s) => s.setFontScale);

  const [stage, setStage] = useState<Stage>("investigate");
  const [trace, setTrace] = useState<TraceKey | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [evidenceChecked, setEvidenceChecked] = useState(false);
  const [contrast, setContrast] = useState<string | null>(null);
  const [application, setApplication] = useState<string | null>(null);

  const [sourceId, setSourceId] = useState("");
  const [stance, setStance] = useState<Stance>("acrescenta");
  const [reasons, setReasons] = useState<string[]>([]);
  const [action, setAction] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const stageIndex = stageOrder.indexOf(stage);

  const teacherText = useMemo(() => {
    switch (stage) {
      case "investigate":
        return "Aqui existe uma conversa entre textos. Rastreie a reportagem que provocou a carta e veja como a leitora transforma leitura em participação pública.";
      case "classify":
        return "Não basta ter saudação e assinatura. Descubra qual relação comunicativa organiza o texto.";
      case "justify":
        return "Uma boa justificativa mostra o vínculo com a publicação, o destinatário, o posicionamento e a finalidade pública.";
      case "contrast":
        return "Carta do leitor e artigo de opinião podem argumentar. A diferença principal está no diálogo direto com algo que já foi publicado.";
      case "apply":
        return "Três textos falam sobre transporte. Identifique qual deles realmente nasce como resposta de um leitor.";
      case "produce":
        return "Agora sua leitura vira voz pública. Escolha uma matéria, uma posição e razões; depois escreva uma mensagem final com suas próprias palavras.";
      case "complete":
        return "A Central do Leitor foi restaurada. A cidade voltou a ouvir respostas argumentadas, respeitosas e ligadas ao que foi publicado.";
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

  const source = productionSources.find((item) => item.id === sourceId);
  const productionReady =
    Boolean(source) &&
    reasons.length === 2 &&
    Boolean(action) &&
    finalMessage.trim().length >= 90;

  function award(
    stageKey: "recognize" | "explain" | "apply" | "produce",
    label: string
  ) {
    if (mastery.carta[stageKey]) return;
    markStage("carta", stageKey);
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

  function changeSource(id: string) {
    setSourceId(id);
    setReasons([]);
    setAction("");
    setFinalMessage("");
  }

  function changeStance(value: Stance) {
    setStance(value);
    setReasons([]);
    setFinalMessage("");
  }

  function toggleReason(reason: string) {
    setReasons((current) => {
      if (current.includes(reason)) {
        return current.filter((item) => item !== reason);
      }
      if (current.length >= 2) return current;
      return [...current, reason];
    });
  }

  function finishProduction() {
    if (!productionReady) return;
    award("produce", "Produzir concluído");
    addAchievement("Voz do leitor");
    addAchievement("Autor da cidade");
    go("complete");
  }

  return (
    <main className="reader-letter-page">
      {rewardMessage && (
        <div className="xp-toast" role="status" aria-live="polite">
          <span>★</span>
          <b>{rewardMessage}</b>
        </div>
      )}

      <header className="reader-letter-header">
        <div className="reader-letter-header-title">
          <span className="eyebrow">CENTRAL DO LEITOR</span>
          <h1>Quando a leitura vira resposta</h1>
          <small>
            Publicação · destinatário · posicionamento · argumento · proposta
          </small>
        </div>

        <div
          className="reader-letter-progress"
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
          className="reader-letter-accessibility"
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

      <div className="reader-letter-layout">
        <aside className="reader-letter-side">
          <section className="reader-letter-guide">
            <div className="reader-letter-guide-image">
              <img src={teacherImage} alt="Professora Fabricia" />
            </div>
            <div className="reader-letter-guide-copy">
              <span>PROFª FABRICIA</span>
              <p>{teacherText}</p>
            </div>
          </section>

          <section className="reader-letter-stage-list">
            <strong>ROTA DA RESPOSTA</strong>
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

        <section className="reader-letter-main">
          <section className="reader-letter-banner">
            <img src={letterImage} alt="" />
            <div className="reader-letter-banner-overlay" />
            <div className="reader-letter-banner-copy">
              <span>ARQUIVO DE PARTICIPAÇÃO 06</span>
              <h2>A cidade recebe mensagens, mas perdeu o fio da conversa.</h2>
              <p>
                Reconecte publicação e resposta para descobrir como a carta do
                leitor transforma leitura em participação pública.
              </p>
            </div>
            <div className="reader-letter-envelope" aria-hidden="true">✉</div>
          </section>

          <section className="reader-letter-dialogue">
            <header>
              <div>
                <span className="eyebrow">ORIGEM DA CONVERSA</span>
                <h2>O que foi publicado primeiro?</h2>
              </div>
              <span className="reader-letter-chip">Material fictício do jogo</span>
            </header>

            <article className="reader-letter-publication">
              <span>{publication.source}</span>
              <h3>{publication.title}</h3>
              <p>{publication.excerpt}</p>
            </article>

            <div className="reader-letter-connection" aria-hidden="true">
              <span />
              <b>RESPOSTA DO LEITOR</b>
              <span />
            </div>

            <article className="reader-letter-paper">
              {letterParagraphs.map((paragraph) => {
                const highlighted =
                  trace &&
                  traces.find((item) => item.id === trace)?.paragraph ===
                    paragraph.id;

                return (
                  <p
                    key={paragraph.id}
                    className={highlighted ? "highlighted" : ""}
                  >
                    {paragraph.text.split("\n").map((line, index) => (
                      <span key={`${paragraph.id}-${index}`}>
                        {line}
                        {index < paragraph.text.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                );
              })}
            </article>
          </section>

          <section className="reader-letter-task">
            {stage === "investigate" && (
              <>
                <div className="reader-letter-task-heading">
                  <span>01</span>
                  <div>
                    <h2>Rastreie o fio da conversa</h2>
                    <p>
                      Clique nas pistas para ver como cada parte da carta se
                      conecta à publicação.
                    </p>
                  </div>
                </div>

                <div className="reader-letter-trace-grid">
                  {traces.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={trace === item.id ? "active" : ""}
                      onClick={() =>
                        setTrace(trace === item.id ? null : item.id)
                      }
                    >
                      <span>{item.label}</span>
                      <b>{item.title}</b>
                    </button>
                  ))}
                </div>

                {trace && (
                  <div className="reader-letter-trace-explanation">
                    <span>
                      {traces.find((item) => item.id === trace)?.label}
                    </span>
                    <p>
                      {traces.find((item) => item.id === trace)?.explanation}
                    </p>
                  </div>
                )}

                <div className="reader-letter-insight">
                  <b>Ideia central</b>
                  <p>
                    A carta do leitor não é apenas uma “carta com opinião”. Ela
                    nasce de uma situação pública de leitura e resposta.
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-action reader-letter-next"
                  onClick={() => go("classify")}
                >
                  Próxima etapa: Classificar →
                </button>
              </>
            )}

            {stage === "classify" && (
              <>
                <div className="reader-letter-task-heading">
                  <span>02</span>
                  <div>
                    <h2>Que gênero é esse?</h2>
                    <p>
                      Use a situação comunicativa, e não apenas a presença de
                      saudação e assinatura.
                    </p>
                  </div>
                </div>

                <div className="reader-letter-options">
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
                    className={`reader-letter-feedback ${
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
                    className="primary-action reader-letter-next"
                    onClick={() => go("justify")}
                  >
                    Próxima etapa: Justificar →
                  </button>
                )}
              </>
            )}

            {stage === "justify" && (
              <>
                <div className="reader-letter-task-heading">
                  <span>03</span>
                  <div>
                    <h2>Quais evidências provam a classificação?</h2>
                    <p>
                      Selecione somente as pistas que sustentam a função pública
                      da carta do leitor.
                    </p>
                  </div>
                </div>

                <div className="reader-letter-evidence">
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
                    className={`reader-letter-feedback ${
                      evidenceSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {evidenceSuccess
                        ? "Justificativa consistente."
                        : "Revise sua seleção."}
                    </b>
                    <p>
                      {evidenceSuccess
                        ? "Você reuniu vínculo com publicação, destinatário, posicionamento argumentado e finalidade pública."
                        : "Intimidade e neutralidade jornalística pertencem a outras situações comunicativas."}
                    </p>
                  </div>
                )}

                {evidenceSuccess && (
                  <button
                    type="button"
                    className="primary-action reader-letter-next"
                    onClick={() => go("contrast")}
                  >
                    Próxima etapa: Comparar gêneros →
                  </button>
                )}
              </>
            )}

            {stage === "contrast" && (
              <>
                <div className="reader-letter-task-heading">
                  <span>04</span>
                  <div>
                    <h2>Carta do leitor, artigo de opinião ou carta pessoal?</h2>
                    <p>
                      Compare o vínculo com o destinatário e com outros textos.
                    </p>
                  </div>
                </div>

                <div className="reader-letter-contrast-cards">
                  <article>
                    <span>CARTA DO LEITOR</span>
                    <b>Resposta pública</b>
                    <p>
                      Reage a algo publicado e dialoga com o veículo ou seus
                      leitores.
                    </p>
                  </article>
                  <article>
                    <span>ARTIGO DE OPINIÃO</span>
                    <b>Tese autônoma</b>
                    <p>
                      Desenvolve uma posição para público amplo sem depender de
                      uma publicação específica.
                    </p>
                  </article>
                  <article>
                    <span>CARTA PESSOAL</span>
                    <b>Relação privada</b>
                    <p>
                      Circula entre pessoas em uma situação de comunicação
                      pessoal.
                    </p>
                  </article>
                </div>

                <div className="reader-letter-options stacked">
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
                    className={`reader-letter-feedback ${
                      contrastSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {contrastSuccess
                        ? "Boa diferenciação."
                        : "Esse critério não é seguro."}
                    </b>
                    <p>
                      {contrastSuccess
                        ? "Você diferenciou os gêneros pela situação comunicativa e pela relação com outros textos."
                        : "Tamanho e assinatura variam. Eles não são critérios suficientes para definir o gênero."}
                    </p>
                  </div>
                )}

                {contrastSuccess && (
                  <button
                    type="button"
                    className="primary-action reader-letter-next"
                    onClick={() => go("apply")}
                  >
                    Próxima etapa: Aplicar →
                  </button>
                )}
              </>
            )}

            {stage === "apply" && (
              <>
                <div className="reader-letter-task-heading">
                  <span>05</span>
                  <div>
                    <h2>Mesmo assunto, relações diferentes</h2>
                    <p>
                      Qual texto funciona realmente como carta do leitor?
                    </p>
                  </div>
                </div>

                <div className="reader-letter-application-grid">
                  {applicationTexts.map((item) => (
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
                      <span>TEXTO {item.id}</span>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </button>
                  ))}
                </div>

                {selectedApplication && (
                  <div
                    className={`reader-letter-feedback ${
                      applicationSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {applicationSuccess
                        ? "Aplicação correta."
                        : `Este texto se aproxima mais de ${selectedApplication.genre.toLowerCase()}.`}
                    </b>
                    <p>{selectedApplication.reason}</p>
                  </div>
                )}

                {applicationSuccess && (
                  <button
                    type="button"
                    className="primary-action reader-letter-next"
                    onClick={() => go("produce")}
                  >
                    Próxima etapa: Produzir →
                  </button>
                )}
              </>
            )}

            {stage === "produce" && (
              <>
                <div className="reader-letter-task-heading">
                  <span>06</span>
                  <div>
                    <h2>Entre na caixa de entrada da redação</h2>
                    <p>
                      Escolha uma matéria e construa sua resposta. O jogo dá
                      apoio, mas a mensagem final precisa ser sua.
                    </p>
                  </div>
                </div>

                <div className="reader-letter-builder">
                  <div>
                    <b>1. Escolha a publicação</b>
                    <div>
                      {productionSources.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={sourceId === item.id ? "selected" : ""}
                          onClick={() => changeSource(item.id)}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {source && (
                    <>
                      <div className="reader-letter-source-card">
                        <span>PUBLICAÇÃO ESCOLHIDA</span>
                        <h3>{source.title}</h3>
                        <p>{source.excerpt}</p>
                      </div>

                      <div>
                        <b>2. Como você quer responder?</b>
                        <div>
                          <button
                            type="button"
                            className={
                              stance === "concorda" ? "selected" : ""
                            }
                            onClick={() => changeStance("concorda")}
                          >
                            Concordar e reforçar
                          </button>
                          <button
                            type="button"
                            className={
                              stance === "discorda" ? "selected" : ""
                            }
                            onClick={() => changeStance("discorda")}
                          >
                            Discordar ou questionar
                          </button>
                          <button
                            type="button"
                            className={
                              stance === "acrescenta" ? "selected" : ""
                            }
                            onClick={() => changeStance("acrescenta")}
                          >
                            Acrescentar um ponto
                          </button>
                        </div>
                      </div>

                      <div className="reader-letter-position-card">
                        <span>POSIÇÃO INICIAL</span>
                        <p>{source.stances[stance]}</p>
                      </div>

                      <div>
                        <b>
                          3. Escolha exatamente duas razões ({reasons.length}/2)
                        </b>
                        <div>
                          {source.reasons.map((reason) => (
                            <button
                              type="button"
                              key={reason}
                              className={
                                reasons.includes(reason) ? "selected" : ""
                              }
                              onClick={() => toggleReason(reason)}
                            >
                              {reason}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <b>4. O que você quer da redação?</b>
                        <div>
                          {source.actions.map((item) => (
                            <button
                              type="button"
                              key={item}
                              className={action === item ? "selected" : ""}
                              onClick={() => setAction(item)}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="reader-letter-editor">
                        <label htmlFor="readerLetterFinal">
                          <b>5. Escreva sua mensagem final</b>
                          <span>
                            Explique sua posição com suas palavras e mantenha um
                            tom respeitoso. Não copie apenas as sugestões.
                          </span>
                        </label>
                        <textarea
                          id="readerLetterFinal"
                          rows={6}
                          value={finalMessage}
                          onChange={(event) =>
                            setFinalMessage(event.target.value)
                          }
                          placeholder="Escreva aqui sua resposta à publicação..."
                        />
                        <div className="reader-letter-editor-status">
                          <span
                            className={
                              finalMessage.trim().length >= 90 ? "ok" : ""
                            }
                          >
                            {finalMessage.trim().length}/90 caracteres mínimos
                          </span>
                        </div>
                      </div>

                      {reasons.length === 2 && action && (
                        <div className="reader-letter-draft-preview">
                          <span className="eyebrow">
                            MAPA DA SUA CARTA
                          </span>
                          <p>
                            <b>Referência:</b> “{source.title}”
                          </p>
                          <p>
                            <b>Posição:</b> {source.stances[stance]}
                          </p>
                          <p>
                            <b>Razão 1:</b> {reasons[0]}
                          </p>
                          <p>
                            <b>Razão 2:</b> {reasons[1]}
                          </p>
                          <p>
                            <b>Pedido/proposta:</b> {action}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  className="primary-action reader-letter-next"
                  disabled={!productionReady}
                  onClick={finishProduction}
                >
                  Enviar carta e restaurar a Central →
                </button>
              </>
            )}

            {stage === "complete" && (
              <>
                <div className="reader-letter-complete">
                  <div className="reader-letter-complete-mark">✉</div>
                  <h2>Central do Leitor restaurada</h2>
                  <p>
                    As publicações da cidade voltaram a receber respostas que
                    dialogam, argumentam e propõem.
                  </p>
                  <strong>
                    +100 XP possíveis · XP atual: {xp}/400
                  </strong>
                </div>

                <div className="reader-letter-sent">
                  <span>CARTA ENVIADA · ESTRUTURA</span>
                  <h3>À equipe do Jornal da Cidade,</h3>
                  <p>
                    <b>Sobre:</b> {source?.title}
                  </p>
                  <p>
                    <b>Posição:</b> {source?.stances[stance]}
                  </p>
                  {reasons.map((reason, index) => (
                    <p key={reason}>
                      <b>Razão {index + 1}:</b> {reason}
                    </p>
                  ))}
                  <p>
                    <b>Pedido/proposta:</b> {action}
                  </p>
                  <p className="reader-letter-own-text">{finalMessage}</p>
                  <p>Atenciosamente,<br />Leitor(a) da Cidade das Palavras.</p>
                </div>

                <div className="reader-letter-mastery">
                  <article>
                    <b>Reconhecer</b>
                    <span>100%</span>
                    <p>
                      Identificou o gênero pela resposta a uma publicação.
                    </p>
                  </article>
                  <article>
                    <b>Explicar</b>
                    <span>100%</span>
                    <p>
                      Justificou usando destinatário, posicionamento e função
                      pública.
                    </p>
                  </article>
                  <article>
                    <b>Aplicar</b>
                    <span>100%</span>
                    <p>
                      Diferenciou carta do leitor, artigo de opinião e carta
                      pessoal.
                    </p>
                  </article>
                  <article>
                    <b>Produzir</b>
                    <span>100%</span>
                    <p>
                      Construiu uma resposta pública argumentada e respeitosa.
                    </p>
                  </article>
                </div>

                <div className="reader-letter-final-actions">
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
