
import { useMemo, useState } from "react";
import teacherImage from "../assets/teacher-guide.webp";
import opinionImage from "../assets/opinion-district.webp";
import { useGameStore } from "../store/useGameStore";

type Stage =
  | "investigate"
  | "classify"
  | "justify"
  | "contrast"
  | "apply"
  | "produce"
  | "complete";

type LensKey =
  | "tema"
  | "tese"
  | "argumento"
  | "evidencia"
  | "contra"
  | "conclusao";

type Stance = "favor" | "contra";

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

const articleParagraphs = [
  {
    id: "p1",
    text:
      "A Biblioteca Central da Cidade das Palavras fecha às 17h. Esse horário deixa de fora justamente muitos estudantes que passam o dia em atividades escolares ou de trabalho. Por isso, a biblioteca deveria funcionar até as 20h em pelo menos três dias da semana."
  },
  {
    id: "p2",
    text:
      "Ampliar o horário aumentaria as oportunidades de estudo para quem não consegue utilizar o espaço durante a tarde. Em uma consulta simulada feita para esta missão com 180 jovens da cidade, 112 disseram que teriam mais condições de frequentar a biblioteca depois das 17h."
  },
  {
    id: "p3",
    text:
      "O benefício não se limita ao empréstimo de livros. A biblioteca oferece mesas, computadores e um ambiente silencioso que nem todos encontram em casa. Quando um equipamento público amplia o acesso a esses recursos, também amplia as condições de participação na vida escolar."
  },
  {
    id: "p4",
    text:
      "É verdade que manter o prédio aberto por mais tempo envolve custos de equipe, energia e segurança. No entanto, a cidade pode começar com um projeto-piloto em poucos dias da semana, registrar a procura e avaliar os resultados antes de decidir por uma expansão definitiva."
  },
  {
    id: "p5",
    text:
      "Tratar o horário ampliado como simples comodidade ignora uma questão de acesso. Se a biblioteca existe para aproximar pessoas do conhecimento, seu funcionamento precisa considerar quando essas pessoas realmente conseguem chegar até ela."
  }
];

const lenses: {
  id: LensKey;
  label: string;
  title: string;
  explanation: string;
  paragraph: string;
}[] = [
  {
    id: "tema",
    label: "Tema",
    title: "Horário de funcionamento da Biblioteca Central",
    explanation:
      "É o assunto em discussão. Tema não é ainda a posição defendida pelo autor.",
    paragraph: "p1"
  },
  {
    id: "tese",
    label: "Tese",
    title: "A biblioteca deveria ficar aberta até as 20h em pelo menos três dias da semana.",
    explanation:
      "A tese é a posição principal que o texto procura sustentar.",
    paragraph: "p1"
  },
  {
    id: "argumento",
    label: "Argumento",
    title: "O horário ampliado aumentaria oportunidades de estudo e acesso a recursos.",
    explanation:
      "Argumentos são razões usadas para sustentar a tese.",
    paragraph: "p2"
  },
  {
    id: "evidencia",
    label: "Evidência",
    title: "112 de 180 jovens da consulta simulada indicaram maior possibilidade de frequentar a biblioteca após as 17h.",
    explanation:
      "Uma evidência fortalece uma razão. Os dados desta missão são fictícios e estão identificados como simulados.",
    paragraph: "p2"
  },
  {
    id: "contra",
    label: "Contra-argumento",
    title: "Manter a biblioteca aberta por mais tempo gera custos de equipe, energia e segurança.",
    explanation:
      "O autor reconhece uma objeção e depois responde a ela com a proposta de projeto-piloto.",
    paragraph: "p4"
  },
  {
    id: "conclusao",
    label: "Conclusão",
    title: "O horário deve considerar quando as pessoas realmente conseguem acessar a biblioteca.",
    explanation:
      "A conclusão retoma a posição e reforça seu sentido sem apenas copiar a introdução.",
    paragraph: "p5"
  }
];

const classifications = [
  {
    id: "artigo",
    label: "Artigo de opinião",
    correct: true,
    feedback:
      "Correto. O texto apresenta uma tese explícita e a desenvolve com argumentos, evidência, resposta a uma objeção e conclusão."
  },
  {
    id: "carta",
    label: "Carta do leitor",
    correct: false,
    feedback:
      "A carta do leitor costuma responder diretamente a uma publicação anterior e assumir a voz de um leitor diante do veículo. Esse vínculo não organiza o texto lido."
  },
  {
    id: "noticia",
    label: "Notícia",
    correct: false,
    feedback:
      "A notícia prioriza informar sobre acontecimentos. Aqui existe uma posição explícita que o autor procura defender."
  },
  {
    id: "estatuto",
    label: "Estatuto",
    correct: false,
    feedback:
      "O estatuto estabelece normas, direitos e deveres. Este texto argumenta a favor de uma mudança, mas não cria uma regra normativa."
  }
];

const evidenceOptions = [
  {
    id: "tese",
    label: "Há uma posição central claramente defendida.",
    correct: true
  },
  {
    id: "argumentos",
    label: "O texto apresenta razões para sustentar a posição.",
    correct: true
  },
  {
    id: "evidencias",
    label: "Uma das razões é fortalecida por uma evidência identificada como simulada.",
    correct: true
  },
  {
    id: "objecao",
    label: "O autor reconhece uma objeção e responde a ela.",
    correct: true
  },
  {
    id: "saudacao",
    label: "O texto começa com uma saudação direta ao editor do jornal.",
    correct: false
  },
  {
    id: "neutralidade",
    label: "O autor evita apresentar qualquer posição para permanecer neutro.",
    correct: false
  }
];

const contrastOptions = [
  {
    id: "function",
    label:
      "Artigo de opinião defende uma tese para um público amplo; carta do leitor dialoga diretamente com uma publicação anterior; notícia prioriza informar sobre fatos.",
    correct: true
  },
  {
    id: "firstPerson",
    label:
      "Sempre que um texto usa primeira pessoa, ele é carta do leitor; artigos de opinião não podem usar primeira pessoa.",
    correct: false
  },
  {
    id: "facts",
    label:
      "Se houver dados ou fatos no texto, ele deixa de ser opinativo e passa a ser notícia.",
    correct: false
  }
];

const applicationTexts = [
  {
    id: "A",
    genre: "Artigo de opinião",
    title: "Mais árvores, menos ilhas de calor",
    text:
      "A cidade deveria ampliar a arborização das praças. Além de oferecer sombra, árvores ajudam a reduzir a temperatura dos espaços urbanos. Um plano gradual, com espécies adequadas e manutenção prevista, é mais útil do que tratar o plantio como ação apenas comemorativa.",
    correct: true,
    reason:
      "Há uma tese e razões organizadas para sustentá-la diante de um público amplo."
  },
  {
    id: "B",
    genre: "Carta do leitor",
    title: "Sobre a reportagem das praças",
    text:
      "Senhores editores, li a reportagem publicada ontem sobre a reforma das praças e gostaria de acrescentar uma preocupação: a matéria quase não discutiu a falta de árvores nos bairros mais quentes.",
    correct: false,
    reason:
      "O texto reage diretamente a uma publicação anterior e se dirige ao veículo, aproximando-se de uma carta do leitor."
  },
  {
    id: "C",
    genre: "Notícia",
    title: "Prefeitura inicia plantio em três praças",
    text:
      "A administração municipal iniciou nesta segunda-feira o plantio de 120 mudas em três praças. Segundo o cronograma divulgado, o trabalho deve terminar no próximo mês.",
    correct: false,
    reason:
      "O foco é informar sobre um acontecimento, não defender uma tese."
  }
];

const productionTopics = [
  {
    id: "celular",
    label: "Uso do celular nas aulas",
    question: "A escola deve reservar momentos pedagógicos específicos para o uso do celular?",
    favorThesis:
      "A escola deve reservar momentos pedagógicos específicos para o uso do celular, em vez de tratá-lo apenas como distração.",
    againstThesis:
      "A escola não deve reservar momentos pedagógicos específicos para o celular enquanto não houver condições claras de uso responsável.",
    favorArguments: [
      "o aparelho pode apoiar pesquisa, registro e produção quando há objetivo didático",
      "regras claras ajudam a diferenciar uso pedagógico de distração",
      "trabalhar o uso responsável também desenvolve educação digital"
    ],
    againstArguments: [
      "sem planejamento, notificações e redes sociais podem fragmentar a atenção",
      "nem todos os estudantes possuem acesso equivalente a aparelhos e internet",
      "a escola precisa garantir alternativas antes de depender do celular"
    ],
    objectionFavor:
      "Alguns defendem que qualquer uso do celular aumenta a distração.",
    rebuttalFavor:
      "Esse risco existe, mas pode ser reduzido quando a atividade define tempo, finalidade e regras de uso.",
    objectionAgainst:
      "Outros afirmam que proibir momentos pedagógicos impede o desenvolvimento de competências digitais.",
    rebuttalAgainst:
      "Essas competências podem ser trabalhadas com outros recursos enquanto a escola constrói condições mais equitativas e seguras."
  },
  {
    id: "projetos",
    label: "Projetos interdisciplinares",
    question: "Projetos interdisciplinares devem fazer parte do calendário regular?",
    favorThesis:
      "Projetos interdisciplinares devem integrar o calendário regular porque aproximam conteúdos e problemas reais.",
    againstThesis:
      "Projetos interdisciplinares não devem ocupar espaço fixo no calendário sem planejamento e objetivos de aprendizagem bem definidos.",
    favorArguments: [
      "um mesmo problema pode exigir conhecimentos de diferentes disciplinas",
      "a produção de um resultado concreto favorece aplicação do que foi estudado",
      "o trabalho integrado pode tornar mais visíveis relações entre conteúdos"
    ],
    againstArguments: [
      "projetos sem objetivos claros podem consumir tempo sem aprofundar conceitos",
      "a integração exige planejamento conjunto entre professores",
      "nem todo conteúdo precisa ser transformado em projeto para ser significativo"
    ],
    objectionFavor:
      "Há quem diga que projetos reduzem o tempo destinado aos conteúdos específicos.",
    rebuttalFavor:
      "A integração não precisa substituir o ensino disciplinar; pode ser planejada para aplicar conteúdos já trabalhados.",
    objectionAgainst:
      "Há quem argumente que a ausência de projetos torna o currículo fragmentado.",
    rebuttalAgainst:
      "A integração pode ocorrer de outras formas e deve ser usada quando realmente contribui para os objetivos de aprendizagem."
  },
  {
    id: "biblioteca",
    label: "Horário da biblioteca",
    question: "A biblioteca escolar deve oferecer horário ampliado em alguns dias?",
    favorThesis:
      "A biblioteca escolar deve oferecer horário ampliado em alguns dias para aumentar as possibilidades de acesso dos estudantes.",
    againstThesis:
      "A ampliação do horário da biblioteca só deve ocorrer depois de avaliar demanda, equipe e condições de segurança.",
    favorArguments: [
      "estudantes com horários diferentes teriam mais oportunidades de utilizar o espaço",
      "o acesso a computadores e ambiente de estudo pode reduzir desigualdades de recursos",
      "um projeto-piloto permitiria testar a demanda sem ampliar o horário todos os dias"
    ],
    againstArguments: [
      "horário maior exige equipe, energia e segurança",
      "a mudança pode ter pouco efeito se não houver demanda suficiente",
      "é necessário avaliar outras formas de ampliar o acesso antes de aumentar custos"
    ],
    objectionFavor:
      "A principal objeção é o aumento de custos para manter o espaço aberto.",
    rebuttalFavor:
      "Um projeto-piloto em poucos dias permite medir procura e custo antes de uma decisão permanente.",
    objectionAgainst:
      "Alguns estudantes só conseguem usar a biblioteca depois do horário regular.",
    rebuttalAgainst:
      "Essa necessidade deve ser medida e comparada com alternativas antes de definir uma expansão permanente."
  }
];

export function OpinionMissionScreen() {
  const setActiveView = useGameStore((s) => s.setActiveView);
  const markStage = useGameStore((s) => s.markStage);
  const addAchievement = useGameStore((s) => s.addAchievement);
  const mastery = useGameStore((s) => s.mastery);
  const xp = useGameStore((s) => s.xp);
  const fontScale = useGameStore((s) => s.fontScale);
  const setFontScale = useGameStore((s) => s.setFontScale);

  const [stage, setStage] = useState<Stage>("investigate");
  const [activeLens, setActiveLens] = useState<LensKey | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [evidenceChecked, setEvidenceChecked] = useState(false);
  const [contrast, setContrast] = useState<string | null>(null);
  const [application, setApplication] = useState<string | null>(null);
  const [topicId, setTopicId] = useState("");
  const [stance, setStance] = useState<Stance>("favor");
  const [argumentsSelected, setArgumentsSelected] = useState<string[]>([]);
  const [conclusion, setConclusion] = useState("");
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const stageIndex = stageOrder.indexOf(stage);

  const teacherText = useMemo(() => {
    switch (stage) {
      case "investigate":
        return "Nesta redação, opinião não significa palpite. Use as lentes para descobrir como tema, tese, argumentos, evidência, objeção e conclusão trabalham juntos.";
      case "classify":
        return "Agora classifique o gênero. A presença de fatos ou dados não elimina a opinião: pergunte para que essas informações estão sendo usadas.";
      case "justify":
        return "Uma tese isolada ainda é frágil. Procure o conjunto de evidências que mostra uma argumentação desenvolvida.";
      case "contrast":
        return "Artigo de opinião, carta do leitor e notícia podem tratar do mesmo assunto. A diferença aparece na situação comunicativa e na finalidade.";
      case "apply":
        return "Leia três textos sobre um mesmo tema. O assunto é parecido; a função de cada texto é que muda.";
      case "produce":
        return "Agora você assume a mesa de articulista. Escolha uma posição, selecione argumentos coerentes, responda a uma objeção e escreva uma conclusão própria.";
      case "complete":
        return "A Redação Central foi restaurada. Sua voz agora aparece sustentada por razões, não apenas por afirmações.";
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

  const topic = productionTopics.find((item) => item.id === topicId);
  const thesis =
    topic && stance === "favor" ? topic.favorThesis : topic?.againstThesis ?? "";
  const argumentPool =
    topic && stance === "favor"
      ? topic.favorArguments
      : topic?.againstArguments ?? [];
  const objection =
    topic && stance === "favor"
      ? topic.objectionFavor
      : topic?.objectionAgainst ?? "";
  const rebuttal =
    topic && stance === "favor"
      ? topic.rebuttalFavor
      : topic?.rebuttalAgainst ?? "";

  const productionReady =
    Boolean(topic) &&
    argumentsSelected.length === 2 &&
    conclusion.trim().length >= 70;

  function award(
    stageKey: "recognize" | "explain" | "apply" | "produce",
    label: string
  ) {
    if (mastery.artigo[stageKey]) return;
    markStage("artigo", stageKey);
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

  function changeTopic(id: string) {
    setTopicId(id);
    setArgumentsSelected([]);
    setConclusion("");
  }

  function changeStance(value: Stance) {
    setStance(value);
    setArgumentsSelected([]);
    setConclusion("");
  }

  function toggleArgument(argument: string) {
    setArgumentsSelected((current) => {
      if (current.includes(argument)) {
        return current.filter((item) => item !== argument);
      }

      if (current.length >= 2) return current;
      return [...current, argument];
    });
  }

  function finishProduction() {
    if (!productionReady) return;
    award("produce", "Produzir concluído");
    addAchievement("Voz argumentativa");
    addAchievement("Autor da cidade");
    go("complete");
  }

  return (
    <main className="opinion-page">
      {rewardMessage && (
        <div className="xp-toast" role="status" aria-live="polite">
          <span>★</span>
          <b>{rewardMessage}</b>
        </div>
      )}

      <header className="opinion-header">
        <div className="opinion-header-title">
          <span className="eyebrow">REDAÇÃO CENTRAL</span>
          <h1>Uma opinião precisa de sustentação</h1>
          <small>Tema · tese · argumentos · evidências · objeções</small>
        </div>

        <div
          className="opinion-progress"
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
          className="opinion-accessibility"
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

      <div className="opinion-layout">
        <aside className="opinion-side">
          <section className="opinion-guide">
            <div className="opinion-guide-image">
              <img src={teacherImage} alt="Professora Fabricia" />
            </div>
            <div className="opinion-guide-copy">
              <span>PROFª FABRICIA</span>
              <p>{teacherText}</p>
            </div>
          </section>

          <section className="opinion-stage-list">
            <strong>PAUTA DA MISSÃO</strong>
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

        <section className="opinion-main">
          <section className="opinion-newsroom-banner">
            <img src={opinionImage} alt="" />
            <div className="opinion-newsroom-overlay" />
            <div className="opinion-newsroom-copy">
              <span>ARQUIVO ARGUMENTATIVO 05</span>
              <h2>A Redação perdeu a diferença entre opinar e argumentar.</h2>
              <p>
                Recupere a estrutura de um artigo capaz de defender uma posição
                com razões, evidências e resposta a objeções.
              </p>
            </div>
            <div className="opinion-megaphone" aria-hidden="true">✦</div>
          </section>

          <section className="opinion-article">
            <header>
              <div>
                <span className="eyebrow">ARTIGO ORIGINAL DO JOGO</span>
                <h2>Mais tempo para ler</h2>
              </div>
              <span className="opinion-article-chip">
                Dados estatísticos: simulados
              </span>
            </header>

            <div className="opinion-paper">
              <h3>
                Por que a Biblioteca Central deveria ampliar seu horário?
              </h3>
              <p className="opinion-byline">
                Texto de opinião produzido para a Cidade das Palavras
              </p>

              {articleParagraphs.map((paragraph) => {
                const highlighted =
                  activeLens &&
                  lenses.find((lens) => lens.id === activeLens)?.paragraph ===
                    paragraph.id;

                return (
                  <p
                    key={paragraph.id}
                    className={highlighted ? "highlighted" : ""}
                  >
                    {paragraph.text}
                  </p>
                );
              })}

              <div className="opinion-data-note">
                <b>Nota do jogo</b>
                <span>
                  A consulta com 180 jovens é um dado fictício criado para esta
                  atividade. Ela serve para mostrar como evidências podem ser
                  usadas em uma argumentação.
                </span>
              </div>
            </div>
          </section>

          <section className="opinion-task">
            {stage === "investigate" && (
              <>
                <div className="opinion-task-heading">
                  <span>01</span>
                  <div>
                    <h2>Use as lentes da argumentação</h2>
                    <p>
                      Clique em cada lente. O texto destacará onde aquela peça
                      aparece e explicará sua função.
                    </p>
                  </div>
                </div>

                <div className="opinion-lens-grid">
                  {lenses.map((lens) => (
                    <button
                      type="button"
                      key={lens.id}
                      className={activeLens === lens.id ? "active" : ""}
                      onClick={() =>
                        setActiveLens(activeLens === lens.id ? null : lens.id)
                      }
                    >
                      <span>{lens.label}</span>
                      <b>{lens.title}</b>
                    </button>
                  ))}
                </div>

                {activeLens && (
                  <div className="opinion-lens-explanation">
                    <span>
                      {
                        lenses.find((lens) => lens.id === activeLens)?.label
                      }
                    </span>
                    <p>
                      {
                        lenses.find((lens) => lens.id === activeLens)
                          ?.explanation
                      }
                    </p>
                  </div>
                )}

                <div className="opinion-insight">
                  <b>Regra de ouro</b>
                  <p>
                    Opinião é a posição; argumentação é o trabalho de
                    sustentá-la. Um bom artigo precisa fazer o leitor entender
                    não só <i>o que</i> o autor pensa, mas <i>por quê</i>.
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-action opinion-next"
                  onClick={() => go("classify")}
                >
                  Próxima etapa: Classificar →
                </button>
              </>
            )}

            {stage === "classify" && (
              <>
                <div className="opinion-task-heading">
                  <span>02</span>
                  <div>
                    <h2>Que gênero é esse?</h2>
                    <p>
                      Observe a finalidade do texto e como o autor organiza sua
                      posição.
                    </p>
                  </div>
                </div>

                <div className="opinion-options">
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
                    className={`opinion-feedback ${
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
                    className="primary-action opinion-next"
                    onClick={() => go("justify")}
                  >
                    Próxima etapa: Justificar →
                  </button>
                )}
              </>
            )}

            {stage === "justify" && (
              <>
                <div className="opinion-task-heading">
                  <span>03</span>
                  <div>
                    <h2>Quais evidências provam a classificação?</h2>
                    <p>
                      Selecione somente as características que mostram uma
                      argumentação desenvolvida.
                    </p>
                  </div>
                </div>

                <div className="opinion-evidence">
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
                    className={`opinion-feedback ${
                      evidenceSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {evidenceSuccess
                        ? "Justificativa consistente."
                        : "Há pistas inadequadas na seleção."}
                    </b>
                    <p>
                      {evidenceSuccess
                        ? "Tese, argumentos, evidência e resposta a uma objeção mostram que a posição foi desenvolvida e sustentada."
                        : "Uma carta não é definida apenas por opinião, e um artigo de opinião não busca neutralidade. Volte à situação comunicativa do texto."}
                    </p>
                  </div>
                )}

                {evidenceSuccess && (
                  <button
                    type="button"
                    className="primary-action opinion-next"
                    onClick={() => go("contrast")}
                  >
                    Próxima etapa: Comparar gêneros →
                  </button>
                )}
              </>
            )}

            {stage === "contrast" && (
              <>
                <div className="opinion-task-heading">
                  <span>04</span>
                  <div>
                    <h2>
                      Artigo de opinião, carta do leitor ou notícia?
                    </h2>
                    <p>
                      O tema pode ser exatamente o mesmo. Compare quem fala,
                      para quem e com qual finalidade.
                    </p>
                  </div>
                </div>

                <div className="opinion-contrast-cards">
                  <article>
                    <span>ARTIGO DE OPINIÃO</span>
                    <b>Tese para um público amplo</b>
                    <p>
                      Desenvolve uma posição com argumentos e evidências.
                    </p>
                  </article>
                  <article>
                    <span>CARTA DO LEITOR</span>
                    <b>Resposta em diálogo</b>
                    <p>
                      O leitor reage a algo publicado e se dirige ao veículo ou
                      aos demais leitores.
                    </p>
                  </article>
                  <article>
                    <span>NOTÍCIA</span>
                    <b>Informação em primeiro plano</b>
                    <p>
                      Prioriza relatar e contextualizar acontecimentos.
                    </p>
                  </article>
                </div>

                <div className="opinion-options stacked">
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
                    className={`opinion-feedback ${
                      contrastSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {contrastSuccess
                        ? "Boa diferenciação."
                        : "Esse critério não é confiável."}
                    </b>
                    <p>
                      {contrastSuccess
                        ? "Você diferenciou os gêneros pela situação comunicativa e pela finalidade."
                        : "Primeira pessoa, dados e fatos podem aparecer em mais de um gênero. Eles não definem sozinhos a classificação."}
                    </p>
                  </div>
                )}

                {contrastSuccess && (
                  <button
                    type="button"
                    className="primary-action opinion-next"
                    onClick={() => go("apply")}
                  >
                    Próxima etapa: Aplicar →
                  </button>
                )}
              </>
            )}

            {stage === "apply" && (
              <>
                <div className="opinion-task-heading">
                  <span>05</span>
                  <div>
                    <h2>Mesmo tema, três funções diferentes</h2>
                    <p>
                      Qual dos textos abaixo funciona como artigo de opinião?
                    </p>
                  </div>
                </div>

                <div className="opinion-application-grid">
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
                    className={`opinion-feedback ${
                      applicationSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {applicationSuccess
                        ? "Aplicação correta."
                        : `Este exemplo funciona melhor como ${selectedApplication.genre.toLowerCase()}.`}
                    </b>
                    <p>{selectedApplication.reason}</p>
                  </div>
                )}

                {applicationSuccess && (
                  <button
                    type="button"
                    className="primary-action opinion-next"
                    onClick={() => go("produce")}
                  >
                    Próxima etapa: Produzir →
                  </button>
                )}
              </>
            )}

            {stage === "produce" && (
              <>
                <div className="opinion-task-heading">
                  <span>06</span>
                  <div>
                    <h2>Assuma a mesa de articulista</h2>
                    <p>
                      Monte a estrutura e escreva uma conclusão própria. Não há
                      uma única posição obrigatória.
                    </p>
                  </div>
                </div>

                <div className="opinion-builder">
                  <div>
                    <b>1. Escolha a pauta</b>
                    <div>
                      {productionTopics.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={topicId === item.id ? "selected" : ""}
                          onClick={() => changeTopic(item.id)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {topic && (
                    <>
                      <div className="opinion-question-card">
                        <span>QUESTÃO EM DEBATE</span>
                        <p>{topic.question}</p>
                      </div>

                      <div>
                        <b>2. Defina sua posição</b>
                        <div>
                          <button
                            type="button"
                            className={
                              stance === "favor" ? "selected" : ""
                            }
                            onClick={() => changeStance("favor")}
                          >
                            Defender a proposta
                          </button>
                          <button
                            type="button"
                            className={
                              stance === "contra" ? "selected" : ""
                            }
                            onClick={() => changeStance("contra")}
                          >
                            Questionar a proposta
                          </button>
                        </div>
                      </div>

                      <div className="opinion-thesis-card">
                        <span>SUA TESE</span>
                        <p>{thesis}</p>
                      </div>

                      <div>
                        <b>
                          3. Selecione exatamente dois argumentos (
                          {argumentsSelected.length}/2)
                        </b>
                        <div>
                          {argumentPool.map((argument) => (
                            <button
                              type="button"
                              key={argument}
                              className={
                                argumentsSelected.includes(argument)
                                  ? "selected"
                                  : ""
                              }
                              onClick={() => toggleArgument(argument)}
                            >
                              {argument}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="opinion-objection-card">
                        <span>4. OBJECÃO E RESPOSTA</span>
                        <p>
                          <b>Objeção:</b> {objection}
                        </p>
                        <p>
                          <b>Resposta:</b> {rebuttal}
                        </p>
                      </div>

                      <div className="opinion-editor">
                        <label htmlFor="opinionConclusion">
                          <b>5. Escreva sua conclusão</b>
                          <span>
                            Retome a tese e mostre por que sua posição importa.
                            Evite apenas repetir a primeira frase.
                          </span>
                        </label>
                        <textarea
                          id="opinionConclusion"
                          rows={5}
                          value={conclusion}
                          onChange={(event) =>
                            setConclusion(event.target.value)
                          }
                          placeholder="Conclua sua argumentação com suas próprias palavras..."
                        />
                        <div className="opinion-editor-status">
                          <span
                            className={
                              conclusion.trim().length >= 70 ? "ok" : ""
                            }
                          >
                            {conclusion.trim().length}/70 caracteres mínimos
                          </span>
                        </div>
                      </div>

                      {argumentsSelected.length === 2 && (
                        <div className="opinion-draft-preview">
                          <span className="eyebrow">
                            MAPA DO SEU ARTIGO
                          </span>
                          <p>
                            <b>Tese:</b> {thesis}
                          </p>
                          <p>
                            <b>Argumento 1:</b> {argumentsSelected[0]}
                          </p>
                          <p>
                            <b>Argumento 2:</b> {argumentsSelected[1]}
                          </p>
                          <p>
                            <b>Contra-argumento:</b> {objection}
                          </p>
                          <p>
                            <b>Resposta:</b> {rebuttal}
                          </p>
                          {conclusion && (
                            <p>
                              <b>Conclusão:</b> {conclusion}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  className="primary-action opinion-next"
                  disabled={!productionReady}
                  onClick={finishProduction}
                >
                  Publicar artigo e restaurar a Redação →
                </button>
              </>
            )}

            {stage === "complete" && (
              <>
                <div className="opinion-complete">
                  <div className="opinion-complete-mark">✦</div>
                  <h2>Redação Central restaurada</h2>
                  <p>
                    A cidade voltou a distinguir opinião de argumentação bem
                    sustentada.
                  </p>
                  <strong>
                    +100 XP possíveis · XP atual: {xp}/400
                  </strong>
                </div>

                <div className="opinion-published">
                  <span>ARTIGO PUBLICADO · ESTRUTURA</span>
                  <h3>{topic?.label}</h3>
                  <p>
                    <b>Tese:</b> {thesis}
                  </p>
                  {argumentsSelected.map((argument, index) => (
                    <p key={argument}>
                      <b>Argumento {index + 1}:</b> {argument}
                    </p>
                  ))}
                  <p>
                    <b>Resposta a objeção:</b> {rebuttal}
                  </p>
                  <p>
                    <b>Conclusão:</b> {conclusion}
                  </p>
                </div>

                <div className="opinion-mastery">
                  <article>
                    <b>Reconhecer</b>
                    <span>100%</span>
                    <p>
                      Identificou o gênero pela presença de tese e
                      argumentação.
                    </p>
                  </article>
                  <article>
                    <b>Explicar</b>
                    <span>100%</span>
                    <p>
                      Justificou com tese, razões, evidência e resposta a uma
                      objeção.
                    </p>
                  </article>
                  <article>
                    <b>Aplicar</b>
                    <span>100%</span>
                    <p>
                      Diferenciou artigo de opinião, carta do leitor e notícia
                      em novos textos.
                    </p>
                  </article>
                  <article>
                    <b>Produzir</b>
                    <span>100%</span>
                    <p>
                      Planejou uma argumentação e escreveu uma conclusão
                      própria.
                    </p>
                  </article>
                </div>

                <div className="opinion-final-actions">
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
