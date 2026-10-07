
import { ArrowLeftRight, Feather, Repeat, Smile, Sparkles, Star, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import teacherImage from "../assets/teacher-guide.webp";
import figuresImage from "../assets/figures-district.webp";
import { useGameStore } from "../store/useGameStore";
import { shuffle } from "../utils/shuffle";
import { playableDistricts } from "../data/districts";

type Stage =
  | "discover"
  | "classify"
  | "explain"
  | "contrast"
  | "apply"
  | "produce"
  | "complete";

type FigureKey =
  | "anafora"
  | "eufemismo"
  | "metafora"
  | "comparacao"
  | "personificacao";

type CreationCard = {
  figure: FigureKey | "";
  text: string;
  reviewed: boolean;
};

const stageOrder: Stage[] = [
  "discover",
  "classify",
  "explain",
  "contrast",
  "apply",
  "produce"
];

const stageLabels: Record<Stage, string> = {
  discover: "Desbloquear",
  classify: "Nomear",
  explain: "Justificar",
  contrast: "Contrastar",
  apply: "Aplicar",
  produce: "Criar",
  complete: "Concluir"
};

const figures: Record<
  FigureKey,
  {
    name: string;
    power: string;
    icon: LucideIcon;
    color: string;
    effect: string;
    example: string;
    why: string;
    selfCheck: string;
  }
> = {
  anafora: {
    name: "Anáfora",
    power: "Eco",
    icon: Repeat,
    color: "#79ddff",
    effect: "Criar ritmo e ênfase por repetição intencional no início de segmentos sucessivos.",
    example:
      "Aqui se aprende com perguntas. Aqui se aprende com tentativas. Aqui se aprende com descobertas.",
    why:
      "A expressão “Aqui se aprende” reaparece no início de três segmentos. A repetição é organizada e produz ênfase.",
    selfCheck:
      "Repeti intencionalmente a mesma palavra ou expressão no início de dois ou mais segmentos."
  },
  eufemismo: {
    name: "Eufemismo",
    power: "Véu",
    icon: Feather,
    color: "#d6b8ff",
    effect: "Suavizar uma ideia potencialmente dura, desagradável ou delicada.",
    example:
      "Depois de muitos anos entre nós, o velho professor nos deixou.",
    why:
      "“Nos deixou” suaviza a referência à morte. O sentido depende do contexto, não apenas da expressão isolada.",
    selfCheck:
      "Substituí uma expressão mais dura por outra mais suave sem mudar o sentido principal."
  },
  metafora: {
    name: "Metáfora",
    power: "Portal",
    icon: Sparkles,
    color: "#ff9f70",
    effect: "Construir uma imagem ao compreender uma realidade em termos de outra, sem comparação explícita.",
    example:
      "No intervalo, a escola virou um formigueiro.",
    why:
      "A escola não se transforma literalmente em formigueiro. A imagem transfere a ideia de movimento e agitação sem usar um conector comparativo.",
    selfCheck:
      "Criei uma relação figurada implícita, sem usar conectores como “como” ou “tal qual”."
  },
  comparacao: {
    name: "Comparação",
    power: "Ponte",
    icon: ArrowLeftRight,
    color: "#ffd65c",
    effect: "Aproximar explicitamente dois elementos para destacar uma semelhança.",
    example:
      "No intervalo, a escola se agitava como um formigueiro.",
    why:
      "A semelhança entre escola e formigueiro aparece de modo explícito por meio de “como”.",
    selfCheck:
      "Aproximei dois elementos de maneira explícita, usando um marcador comparativo adequado."
  },
  personificacao: {
    name: "Personificação",
    power: "Sopro",
    icon: Smile,
    color: "#8ef0a9",
    effect: "Atribuir ação, comportamento ou característica humana a seres não humanos.",
    example:
      "O relógio da sala gritava que a prova estava acabando.",
    why:
      "“Gritar” é apresentado como ação do relógio. O objeto ganha comportamento humano para intensificar o efeito da cena.",
    selfCheck:
      "Atribuí a algo não humano uma ação, sentimento ou comportamento reconhecidamente humano."
  }
};

const figureKeys = Object.keys(figures) as FigureKey[];

const classifyCases: {
  id: string;
  text: string;
  answer: FigureKey;
  note: string;
}[] = [
  {
    id: "c1",
    text: "Sem você, a praça perdeu a voz; sem você, a rua perdeu a pressa; sem você, a cidade perdeu a cor.",
    answer: "anafora",
    note:
      "“Sem você” é repetido no início de segmentos sucessivos, criando ritmo e insistência."
  },
  {
    id: "c2",
    text: "A empresa informou que fará um ajuste no quadro de funcionários.",
    answer: "eufemismo",
    note:
      "“Ajuste no quadro” pode suavizar uma referência a demissões, dependendo do contexto."
  },
  {
    id: "c3",
    text: "A memória é uma gaveta que nunca fecha direito.",
    answer: "metafora",
    note:
      "Memória e gaveta são aproximadas por uma imagem implícita; não se afirma uma semelhança com conector comparativo."
  },
  {
    id: "c4",
    text: "As nuvens avançavam como navios escuros.",
    answer: "comparacao",
    note:
      "O conector “como” torna explícita a semelhança entre nuvens e navios."
  },
  {
    id: "c5",
    text: "A janela curiosa espiava a rua a noite inteira.",
    answer: "personificacao",
    note:
      "A janela recebe comportamento humano: curiosidade e a ação de espiar."
  }
];

const whyCases: {
  id: string;
  figure: FigureKey;
  text: string;
  options: { id: string; label: string; correct: boolean }[];
}[] = [
  {
    id: "w1",
    figure: "anafora",
    text:
      "“Hoje eu quero silêncio, hoje eu quero tempo, hoje eu quero coragem.”",
    options: [
      {
        id: "a",
        label:
          "Porque “hoje eu quero” se repete intencionalmente no início de estruturas sucessivas, produzindo ritmo e ênfase.",
        correct: true
      },
      {
        id: "b",
        label:
          "Porque qualquer palavra repetida duas vezes em um texto já constitui anáfora.",
        correct: false
      }
    ]
  },
  {
    id: "w2",
    figure: "eufemismo",
    text: "“O paciente não resistiu ao procedimento.”",
    options: [
      {
        id: "a",
        label:
          "Porque a expressão suaviza a comunicação de um acontecimento delicado, sem transformar o sentido em comparação.",
        correct: true
      },
      {
        id: "b",
        label:
          "Porque toda frase que evita uma palavra específica é obrigatoriamente uma metáfora.",
        correct: false
      }
    ]
  },
  {
    id: "w3",
    figure: "metafora",
    text: "“Seus argumentos eram muralhas.”",
    options: [
      {
        id: "a",
        label:
          "Porque “argumentos” e “muralhas” são aproximados figurativamente sem um marcador explícito de comparação.",
        correct: true
      },
      {
        id: "b",
        label:
          "Porque a frase usa o verbo “ser”; toda construção com esse verbo é metáfora.",
        correct: false
      }
    ]
  },
  {
    id: "w4",
    figure: "comparacao",
    text: "“A explicação ficou clara como água.”",
    options: [
      {
        id: "a",
        label:
          "Porque a semelhança é apresentada explicitamente pelo conector “como”.",
        correct: true
      },
      {
        id: "b",
        label:
          "Porque comparação e metáfora são exatamente a mesma figura e sempre podem ser trocadas sem alterar o efeito.",
        correct: false
      }
    ]
  },
  {
    id: "w5",
    figure: "personificacao",
    text: "“A cidade acordou impaciente.”",
    options: [
      {
        id: "a",
        label:
          "Porque a cidade recebe uma ação e um estado associados a seres humanos.",
        correct: true
      },
      {
        id: "b",
        label:
          "Porque qualquer frase sobre uma cidade é personificação.",
        correct: false
      }
    ]
  }
];

const contrastCases: {
  id: string;
  title: string;
  left: string;
  right: string;
  question: string;
  options: { id: string; label: string; correct: boolean }[];
}[] = [
  {
    id: "met-comp",
    title: "Metáfora × Comparação",
    left: "A escola era um formigueiro.",
    right: "A escola parecia um formigueiro.",
    question: "Qual diferença explica melhor o efeito das duas frases?",
    options: [
      {
        id: "a",
        label:
          "Na primeira, a relação é construída de modo implícito; na segunda, “parecia” explicita a comparação.",
        correct: true
      },
      {
        id: "b",
        label:
          "A primeira é literal; a segunda é figurada.",
        correct: false
      }
    ]
  },
  {
    id: "euf-met",
    title: "Eufemismo × Metáfora",
    left: "Ele partiu desta vida.",
    right: "A vida é uma viagem curta.",
    question: "Por que a primeira não deve ser classificada simplesmente como metáfora?",
    options: [
      {
        id: "a",
        label:
          "Porque, naquele contexto, o efeito principal é suavizar a referência à morte; na segunda, a imagem organiza uma compreensão figurada da vida.",
        correct: true
      },
      {
        id: "b",
        label:
          "Porque eufemismos nunca podem empregar linguagem figurada.",
        correct: false
      }
    ]
  },
  {
    id: "ana-rep",
    title: "Anáfora × Repetição qualquer",
    left: "Eu quero tempo. Eu quero silêncio. Eu quero resposta.",
    right: "Eu quero tempo porque o tempo hoje está curto.",
    question: "O que torna a repetição da primeira frase especialmente anafórica?",
    options: [
      {
        id: "a",
        label:
          "A repetição aparece de forma organizada no início de estruturas sucessivas e cria um padrão perceptível.",
        correct: true
      },
      {
        id: "b",
        label:
          "A primeira tem mais palavras repetidas; a posição delas não importa.",
        correct: false
      }
    ]
  },
  {
    id: "pers-lit",
    title: "Personificação × Ação literal",
    left: "O vento empurrou a janela.",
    right: "O vento ficou zangado e socou a janela.",
    question: "Qual frase constrói personificação de modo mais claro?",
    options: [
      {
        id: "a",
        label:
          "A segunda, porque atribui ao vento estado emocional e ação humanizada.",
        correct: true
      },
      {
        id: "b",
        label:
          "As duas, porque todo verbo de ação transforma automaticamente um fenômeno natural em pessoa.",
        correct: false
      }
    ]
  }
];

const applyCases: {
  id: string;
  mission: string;
  target: FigureKey;
  context: string;
}[] = [
  {
    id: "a1",
    mission: "Dar ritmo e insistência a um discurso de formatura.",
    target: "anafora",
    context:
      "Você quer repetir uma estrutura no início de frases sucessivas para marcar uma ideia."
  },
  {
    id: "a2",
    mission: "Comunicar uma situação delicada com menos dureza.",
    target: "eufemismo",
    context:
      "O objetivo é suavizar a forma de dizer sem apagar o sentido principal."
  },
  {
    id: "a3",
    mission: "Criar uma imagem forte sem usar “como”.",
    target: "metafora",
    context:
      "Você quer compreender uma situação por meio de outra imagem, de maneira implícita."
  },
  {
    id: "a4",
    mission: "Explicitar uma semelhança entre duas cenas.",
    target: "comparacao",
    context:
      "A relação entre os dois elementos precisa aparecer claramente marcada."
  },
  {
    id: "a5",
    mission: "Fazer a própria cidade parecer viva.",
    target: "personificacao",
    context:
      "Você quer atribuir comportamento humano a ruas, prédios, objetos ou fenômenos."
  }
];

const prompts: Record<FigureKey, string[]> = {
  anafora: [
    "Escreva três segmentos que comecem pela mesma expressão para enfatizar uma ideia.",
    "Crie uma pequena fala de incentivo com repetição no início das frases."
  ],
  eufemismo: [
    "Reescreva uma notícia delicada de modo mais suave, sem apagar seu sentido.",
    "Crie uma frase que trate com delicadeza uma perda ou situação difícil."
  ],
  metafora: [
    "Transforme uma emoção em uma imagem, sem usar “como”.",
    "Descreva a escola, a memória ou o tempo por meio de uma imagem implícita."
  ],
  comparacao: [
    "Compare explicitamente uma emoção a outra coisa usando um marcador comparativo.",
    "Crie uma comparação para explicar o ritmo de uma aula, cidade ou viagem."
  ],
  personificacao: [
    "Faça um objeto da sala realizar uma ação humana.",
    "Dê sentimento ou intenção a um elemento da cidade."
  ]
};

function blankCard(): CreationCard {
  return { figure: "", text: "", reviewed: false };
}

export function FiguresMissionScreen() {
  // Embaralha as opções de cada pergunta a cada vez que a missão abre.
  const shuffledWhyCases = useMemo(
    () => whyCases.map((item) => ({ ...item, options: shuffle(item.options) })),
    []
  );
  const shuffledContrastCases = useMemo(
    () => contrastCases.map((item) => ({ ...item, options: shuffle(item.options) })),
    []
  );
  const setActiveView = useGameStore((s) => s.setActiveView);
  const markStage = useGameStore((s) => s.markStage);
  const addAchievement = useGameStore((s) => s.addAchievement);
  const mastery = useGameStore((s) => s.mastery);
  const progress = useGameStore((s) => s.progress);
  const xp = useGameStore((s) => s.xp);
  const fontScale = useGameStore((s) => s.fontScale);
  const setFontScale = useGameStore((s) => s.setFontScale);

  const [stage, setStage] = useState<Stage>("discover");
  const [activeFigure, setActiveFigure] = useState<FigureKey>("metafora");
  const [classAnswers, setClassAnswers] = useState<Record<string, FigureKey | "">>({});
  const [whyAnswers, setWhyAnswers] = useState<Record<string, string>>({});
  const [contrastAnswers, setContrastAnswers] = useState<Record<string, string>>({});
  const [applyAnswers, setApplyAnswers] = useState<Record<string, FigureKey | "">>({});
  const [cards, setCards] = useState<CreationCard[]>([
    blankCard(),
    blankCard(),
    blankCard()
  ]);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const stageIndex = stageOrder.indexOf(stage);

  const teacherText = useMemo(() => {
    switch (stage) {
      case "discover":
        return "Antes de decorar nomes, descubra o efeito de cada lente. A mesma linguagem pode ganhar ritmo, suavidade, imagem, comparação explícita ou vida.";
      case "classify":
        return "Agora dê nome ao efeito. Leia cada frase inteira: uma palavra isolada quase nunca basta para classificar uma figura.";
      case "explain":
        return "Acertar o nome é só metade do trabalho. Escolha a explicação que mostra exatamente onde o efeito foi construído.";
      case "contrast":
        return "As figuras podem se aproximar. Nos duelos, procure o critério que realmente separa os efeitos — especialmente metáfora e comparação.";
      case "apply":
        return "Agora o problema vem antes da figura. Escolha a lente que melhor atende ao efeito que a situação pede.";
      case "produce":
        return "Chegou a hora de controlar as lentes. Crie três exemplos diferentes e use a revisão para verificar se o efeito que você planejou realmente aparece.";
      case "complete":
        return "O Laboratório foi restaurado. Agora as figuras deixaram de ser apenas nomes e voltaram a funcionar como escolhas de sentido.";
    }
  }, [stage]);

  const classCorrect = classifyCases.filter(
    (item) => classAnswers[item.id] === item.answer
  ).length;

  const explainCorrect = whyCases.filter((item) => {
    const chosen = item.options.find((option) => option.id === whyAnswers[item.id]);
    return chosen?.correct;
  }).length;

  const contrastCorrect = contrastCases.filter((item) => {
    const chosen = item.options.find(
      (option) => option.id === contrastAnswers[item.id]
    );
    return chosen?.correct;
  }).length;

  const applyCorrect = applyCases.filter(
    (item) => applyAnswers[item.id] === item.target
  ).length;

  const selectedFigures = cards
    .map((card) => card.figure)
    .filter(Boolean) as FigureKey[];

  const uniqueFigures = new Set(selectedFigures);
  const hasMetaphorPair = selectedFigures.some(
    (item) => item === "metafora" || item === "comparacao"
  );
  const productionReady =
    cards.every(
      (card) =>
        Boolean(card.figure) &&
        card.text.trim().length >= 28 &&
        card.reviewed
    ) &&
    uniqueFigures.size === 3 &&
    hasMetaphorPair;

  function award(
    stageKey: "recognize" | "explain" | "apply" | "produce",
    label: string
  ) {
    if (mastery.figuras[stageKey]) return;
    markStage("figuras", stageKey);
    setRewardMessage(`+25 XP · ${label}`);
    window.setTimeout(() => setRewardMessage(null), 2200);
  }

  function go(next: Stage) {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseClass(caseId: string, figure: FigureKey) {
    setClassAnswers((current) => ({ ...current, [caseId]: figure }));
    const next = { ...classAnswers, [caseId]: figure };
    const correct = classifyCases.every((item) => next[item.id] === item.answer);
    if (correct) award("recognize", "Reconhecer concluído");
  }

  function chooseWhy(caseId: string, optionId: string) {
    setWhyAnswers((current) => ({ ...current, [caseId]: optionId }));
    const next = { ...whyAnswers, [caseId]: optionId };
    const correct = whyCases.every((item) => {
      const chosen = item.options.find((option) => option.id === next[item.id]);
      return chosen?.correct;
    });
    if (correct) award("explain", "Explicar concluído");
  }

  function chooseApply(caseId: string, figure: FigureKey) {
    setApplyAnswers((current) => ({ ...current, [caseId]: figure }));
    const next = { ...applyAnswers, [caseId]: figure };
    const correct = applyCases.every((item) => next[item.id] === item.target);
    if (correct) award("apply", "Aplicar concluído");
  }

  function updateCard(index: number, changes: Partial<CreationCard>) {
    setCards((current) =>
      current.map((card, cardIndex) =>
        cardIndex === index ? { ...card, ...changes } : card
      )
    );
  }

  function finishProduction() {
    if (!productionReady) return;
    award("produce", "Produzir concluído");
    addAchievement("Mestre das lentes");
    addAchievement("Autor da cidade");

    const otherDistrictsComplete = playableDistricts
      .filter((district) => district.key !== "figuras")
      .every((district) => progress[district.key] === 100);

    if (otherDistrictsComplete) {
      addAchievement("Cidade restaurada");
    }

    go("complete");
  }

  return (
    <main className="figures-page">
      {rewardMessage && (
        <div className="xp-toast" role="status" aria-live="polite">
          <span><Star size={18} fill="currentColor" aria-hidden="true" /></span>
          <b>{rewardMessage}</b>
        </div>
      )}

      <header className="figures-header">
        <div className="figures-header-title">
          <span className="eyebrow">LABORATÓRIO DAS LENTES</span>
          <h1>Figuras de linguagem: efeitos em ação</h1>
          <small>Anáfora · eufemismo · metáfora · comparação · personificação</small>
        </div>

        <div className="figures-progress">
          <span>ETAPA {stage === "complete" ? 6 : stageIndex + 1} DE 6</span>
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

        <div className="figures-accessibility" aria-label="Tamanho da interface">
          <button
            type="button"
            aria-label="Diminuir tamanho da interface"
            onClick={() =>
              setFontScale(Math.max(0.9, +(fontScale - 0.1).toFixed(2)))
            }
          >
            A−
          </button>
          <output>{Math.round(fontScale * 100)}%</output>
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

      <div className="figures-layout">
        <aside className="figures-side">
          <section className="figures-guide">
            <div className="figures-guide-image">
              <img src={teacherImage} alt="Professora Fabricia" />
            </div>
            <div className="figures-guide-copy">
              <span>PROFª FABRICIA</span>
              <p>{teacherText}</p>
            </div>
          </section>

          <section className="figures-stage-list">
            <strong>CALIBRAÇÃO FINAL</strong>
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

        <section className="figures-main">
          <section className="figures-banner">
            <img src={figuresImage} alt="" />
            <div className="figures-banner-overlay" />
            <div className="figures-particles" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="figures-banner-copy">
              <span>ARQUIVO DE SENTIDO 08</span>
              <h2>As cinco lentes perderam a calibração.</h2>
              <p>
                Restaure cada efeito de linguagem e prove que você sabe escolher
                uma figura pelo que ela faz — não apenas pelo nome.
              </p>
            </div>
          </section>

          <section className="figures-task">
            {stage === "discover" && (
              <>
                <div className="figures-task-heading">
                  <span>01</span>
                  <div>
                    <h2>Desbloqueie as cinco lentes</h2>
                    <p>
                      Escolha uma lente para observar seu efeito, um exemplo e
                      a explicação do mecanismo.
                    </p>
                  </div>
                </div>

                <div className="figures-lens-deck">
                  {figureKeys.map((key) => {
                    const item = figures[key];
                    return (
                      <button
                        type="button"
                        key={key}
                        className={activeFigure === key ? "active" : ""}
                        style={{ "--lens-color": item.color } as React.CSSProperties}
                        onClick={() => setActiveFigure(key)}
                      >
                        <span className="figures-lens-icon"><FigIcon icon={item.icon} size={24} /></span>
                        <small>{item.power.toUpperCase()}</small>
                        <b>{item.name}</b>
                        <p>{item.effect}</p>
                      </button>
                    );
                  })}
                </div>

                <article
                  className="figures-lens-focus"
                  style={
                    {
                      "--lens-color": figures[activeFigure].color
                    } as React.CSSProperties
                  }
                >
                  <div className="figures-lens-focus-icon">
                    <FigIcon icon={figures[activeFigure].icon} size={34} />
                  </div>
                  <div>
                    <span>
                      LENTE {figures[activeFigure].power.toUpperCase()}
                    </span>
                    <h3>{figures[activeFigure].name}</h3>
                    <blockquote>“{figures[activeFigure].example}”</blockquote>
                    <p>{figures[activeFigure].why}</p>
                  </div>
                </article>

                <div className="figures-insight">
                  <b>Princípio do laboratório</b>
                  <p>
                    Uma figura é reconhecida pelo efeito construído no contexto.
                    Palavras como “como” são pistas úteis para comparação, por
                    exemplo, mas a leitura precisa considerar a relação completa
                    entre os elementos.
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-action figures-next"
                  onClick={() => go("classify")}
                >
                  Entrar no painel de identificação →
                </button>
              </>
            )}

            {stage === "classify" && (
              <>
                <div className="figures-task-heading">
                  <span>02</span>
                  <div>
                    <h2>Nomeie cada efeito</h2>
                    <p>
                      São cinco sinais corrompidos. Selecione a figura de
                      linguagem predominante em cada um.
                    </p>
                  </div>
                </div>

                <div className="figures-case-stack">
                  {classifyCases.map((item, index) => {
                    const selected = classAnswers[item.id];
                    const isCorrect = selected === item.answer;
                    return (
                      <article key={item.id} className="figures-case">
                        <header>
                          <span>SINAL {index + 1}</span>
                          <b>{item.text}</b>
                        </header>

                        <div className="figures-choice-row">
                          {figureKeys.map((key) => (
                            <button
                              type="button"
                              key={key}
                              className={
                                selected === key
                                  ? key === item.answer
                                    ? "correct"
                                    : "wrong"
                                  : ""
                              }
                              onClick={() => chooseClass(item.id, key)}
                            >
                              {figures[key].name}
                            </button>
                          ))}
                        </div>

                        {selected && (
                          <div
                            className={`figures-inline-feedback ${
                              isCorrect ? "success" : "warning"
                            }`}
                          >
                            <b>
                              {isCorrect
                                ? "Calibração correta."
                                : `Ainda não. Observe o efeito de ${figures[item.answer].name.toLowerCase()}.`}
                            </b>
                            <p>{item.note}</p>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>

                <div className="figures-scoreline">
                  <span>{classCorrect}/5 lentes identificadas</span>
                  <i>
                    <b style={{ width: `${(classCorrect / 5) * 100}%` }} />
                  </i>
                </div>

                {classCorrect === 5 && (
                  <button
                    type="button"
                    className="primary-action figures-next"
                    onClick={() => go("explain")}
                  >
                    Próxima etapa: provar o porquê →
                  </button>
                )}
              </>
            )}

            {stage === "explain" && (
              <>
                <div className="figures-task-heading">
                  <span>03</span>
                  <div>
                    <h2>Acertar o nome não basta</h2>
                    <p>
                      Em cada cartão, escolha a justificativa que realmente
                      explica a classificação.
                    </p>
                  </div>
                </div>

                <div className="figures-why-grid">
                  {shuffledWhyCases.map((item) => {
                    const selected = whyAnswers[item.id];
                    const chosen = item.options.find(
                      (option) => option.id === selected
                    );
                    return (
                      <article key={item.id}>
                        <div className="figures-why-label">
                          <span><FigIcon icon={figures[item.figure].icon} /></span>
                          <b>{figures[item.figure].name}</b>
                        </div>
                        <blockquote>{item.text}</blockquote>
                        <div>
                          {item.options.map((option) => (
                            <button
                              type="button"
                              key={option.id}
                              className={
                                selected === option.id
                                  ? option.correct
                                    ? "correct"
                                    : "wrong"
                                  : ""
                              }
                              onClick={() => chooseWhy(item.id, option.id)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        {chosen && !chosen.correct && (
                          <p className="figures-why-warning">
                            Essa explicação usa uma regra absoluta que não
                            funciona para classificar a figura.
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>

                <div className="figures-scoreline">
                  <span>{explainCorrect}/5 justificativas consistentes</span>
                  <i>
                    <b style={{ width: `${(explainCorrect / 5) * 100}%` }} />
                  </i>
                </div>

                {explainCorrect === 5 && (
                  <button
                    type="button"
                    className="primary-action figures-next"
                    onClick={() => go("contrast")}
                  >
                    Abrir os duelos de contraste →
                  </button>
                )}
              </>
            )}

            {stage === "contrast" && (
              <>
                <div className="figures-task-heading">
                  <span>04</span>
                  <div>
                    <h2>Duelos de lentes</h2>
                    <p>
                      Figuras próximas podem confundir. Escolha o critério que
                      realmente separa os efeitos.
                    </p>
                  </div>
                </div>

                <div className="figures-duel-stack">
                  {shuffledContrastCases.map((item) => {
                    const selected = contrastAnswers[item.id];
                    const chosen = item.options.find(
                      (option) => option.id === selected
                    );
                    return (
                      <article key={item.id}>
                        <span className="figures-duel-title">{item.title}</span>
                        <div className="figures-duel-lines">
                          <blockquote>{item.left}</blockquote>
                          <span>VS</span>
                          <blockquote>{item.right}</blockquote>
                        </div>
                        <h3>{item.question}</h3>
                        <div className="figures-duel-options">
                          {item.options.map((option) => (
                            <button
                              type="button"
                              key={option.id}
                              className={
                                selected === option.id
                                  ? option.correct
                                    ? "correct"
                                    : "wrong"
                                  : ""
                              }
                              onClick={() => {
                                setContrastAnswers((current) => ({
                                  ...current,
                                  [item.id]: option.id
                                }));
                                if (option.correct) {
                                  addAchievement("Mestre dos contrastes");
                                }
                              }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        {chosen && (
                          <p
                            className={
                              chosen.correct
                                ? "figures-duel-ok"
                                : "figures-duel-warning"
                            }
                          >
                            {chosen.correct
                              ? "Critério consistente: você comparou o funcionamento, não apenas palavras isoladas."
                              : "Revise: esse critério generaliza demais e pode produzir classificações erradas."}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>

                <div className="figures-scoreline">
                  <span>{contrastCorrect}/4 duelos resolvidos</span>
                  <i>
                    <b style={{ width: `${(contrastCorrect / 4) * 100}%` }} />
                  </i>
                </div>

                {contrastCorrect === 4 && (
                  <button
                    type="button"
                    className="primary-action figures-next"
                    onClick={() => go("apply")}
                  >
                    Próxima etapa: escolher a lente certa →
                  </button>
                )}
              </>
            )}

            {stage === "apply" && (
              <>
                <div className="figures-task-heading">
                  <span>05</span>
                  <div>
                    <h2>O efeito vem antes do nome</h2>
                    <p>
                      Cada setor da cidade precisa de um efeito específico.
                      Escolha a lente mais adequada para cumprir a missão.
                    </p>
                  </div>
                </div>

                <div className="figures-apply-grid">
                  {applyCases.map((item) => {
                    const selected = applyAnswers[item.id];
                    const isCorrect = selected === item.target;
                    return (
                      <article key={item.id}>
                        <span>MISSÃO</span>
                        <h3>{item.mission}</h3>
                        <p>{item.context}</p>
                        <div>
                          {figureKeys.map((key) => (
                            <button
                              type="button"
                              key={key}
                              className={
                                selected === key
                                  ? key === item.target
                                    ? "correct"
                                    : "wrong"
                                  : ""
                              }
                              onClick={() => chooseApply(item.id, key)}
                            >
                              <FigIcon icon={figures[key].icon} /> {figures[key].name}
                            </button>
                          ))}
                        </div>
                        {selected && (
                          <small className={isCorrect ? "ok" : "warn"}>
                            {isCorrect
                              ? `Lente correta: ${figures[item.target].power}.`
                              : `Pense no efeito pedido antes de olhar para o nome da figura.`}
                          </small>
                        )}
                      </article>
                    );
                  })}
                </div>

                <div className="figures-scoreline">
                  <span>{applyCorrect}/5 lentes aplicadas</span>
                  <i>
                    <b style={{ width: `${(applyCorrect / 5) * 100}%` }} />
                  </i>
                </div>

                {applyCorrect === 5 && (
                  <button
                    type="button"
                    className="primary-action figures-next"
                    onClick={() => go("produce")}
                  >
                    Entrar no ateliê de criação →
                  </button>
                )}
              </>
            )}

            {stage === "produce" && (
              <>
                <div className="figures-task-heading">
                  <span>06</span>
                  <div>
                    <h2>Ateliê das três lentes</h2>
                    <p>
                      Produza três exemplos com figuras diferentes. Pelo menos
                      um deles deve usar metáfora ou comparação.
                    </p>
                  </div>
                </div>

                <div className="figures-creation-stack">
                  {cards.map((card, index) => {
                    const selectedFigure =
                      card.figure && figures[card.figure];

                    return (
                      <article key={index}>
                        <header>
                          <span>CRIAÇÃO {index + 1}</span>
                          <b>
                            {selectedFigure
                              ? `Lente ${selectedFigure.power}`
                              : "Escolha uma lente"}
                          </b>
                        </header>

                        <div className="figures-creation-picker">
                          {figureKeys.map((key) => {
                            const usedElsewhere = cards.some(
                              (other, otherIndex) =>
                                otherIndex !== index && other.figure === key
                            );
                            return (
                              <button
                                type="button"
                                key={key}
                                disabled={usedElsewhere}
                                className={card.figure === key ? "selected" : ""}
                                onClick={() =>
                                  updateCard(index, {
                                    figure: key,
                                    text: "",
                                    reviewed: false
                                  })
                                }
                              >
                                <FigIcon icon={figures[key].icon} /> {figures[key].name}
                              </button>
                            );
                          })}
                        </div>

                        {selectedFigure && (
                          <>
                            <div className="figures-creation-prompt">
                              <span>MISSÃO DE ESCRITA</span>
                              <p>{prompts[card.figure as FigureKey][index % 2]}</p>
                            </div>

                            <textarea
                              rows={4}
                              value={card.text}
                              onChange={(event) =>
                                updateCard(index, {
                                  text: event.target.value,
                                  reviewed: false
                                })
                              }
                              placeholder={`Crie um exemplo de ${selectedFigure.name.toLowerCase()}...`}
                            />

                            <label className="figures-selfcheck">
                              <input
                                type="checkbox"
                                checked={card.reviewed}
                                onChange={(event) =>
                                  updateCard(index, {
                                    reviewed: event.target.checked
                                  })
                                }
                              />
                              <span>
                                <b>Autorrevisão:</b> {selectedFigure.selfCheck}
                              </span>
                            </label>

                            <div className="figures-creation-status">
                              <span
                                className={
                                  card.text.trim().length >= 28 ? "ok" : ""
                                }
                              >
                                {card.text.trim().length >= 28
                                  ? "Texto desenvolvido"
                                  : "Desenvolva um pouco mais"}
                              </span>
                              <span className={card.reviewed ? "ok" : ""}>
                                {card.reviewed
                                  ? "Revisão confirmada"
                                  : "Revisão pendente"}
                              </span>
                            </div>
                          </>
                        )}
                      </article>
                    );
                  })}
                </div>

                <div className="figures-production-rules">
                  <b>Condições da restauração</b>
                  <p>
                    3 figuras diferentes · 3 textos autorais · revisão
                    consciente em todos · pelo menos uma criação com Metáfora
                    ou Comparação.
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-action figures-next"
                  disabled={!productionReady}
                  onClick={finishProduction}
                >
                  Ativar as três criações e restaurar o Laboratório →
                </button>
              </>
            )}

            {stage === "complete" && (
              <>
                <div className="figures-complete">
                  <div className="figures-complete-mark">✺</div>
                  <h2>Laboratório das Lentes restaurado</h2>
                  <p>
                    Anáfora, eufemismo, metáfora, comparação e personificação
                    voltaram a funcionar como escolhas conscientes de efeito e
                    sentido.
                  </p>
                  <strong>+100 XP possíveis · XP atual: {xp}/400</strong>
                </div>

                <div className="figures-gallery">
                  {cards.map((card, index) => {
                    if (!card.figure) return null;
                    const item = figures[card.figure];
                    return (
                      <article
                        key={index}
                        style={{ "--lens-color": item.color } as React.CSSProperties}
                      >
                        <span><FigIcon icon={item.icon} /></span>
                        <small>{item.name}</small>
                        <p>“{card.text}”</p>
                      </article>
                    );
                  })}
                </div>

                <div className="figures-mastery">
                  <article>
                    <b>Reconhecer</b>
                    <span>100%</span>
                    <p>
                      Identificou as cinco figuras pelo efeito predominante no
                      contexto.
                    </p>
                  </article>
                  <article>
                    <b>Explicar</b>
                    <span>100%</span>
                    <p>
                      Justificou as classificações com critérios específicos.
                    </p>
                  </article>
                  <article>
                    <b>Aplicar</b>
                    <span>100%</span>
                    <p>
                      Escolheu figuras a partir do efeito comunicativo desejado.
                    </p>
                  </article>
                  <article>
                    <b>Produzir</b>
                    <span>100%</span>
                    <p>
                      Criou exemplos autorais e realizou autorrevisão do efeito.
                    </p>
                  </article>
                </div>

                <div className="figures-final-message">
                  <span>ARQUIVOS PRINCIPAIS DA CIDADE</span>
                  <h3>8 distritos agora possuem missões completas.</h3>
                  <p>
                    O próximo ciclo do projeto pode deixar de ser “construir
                    conteúdo” e passar para <b>polimento, testes com alunos,
                    acessibilidade e balanceamento da experiência</b>.
                  </p>
                </div>

                <div className="figures-final-actions">
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() => setActiveView("progress")}
                  >
                    Ver relatório final
                  </button>
                  <button
                    type="button"
                    className="primary-action"
                    onClick={() => setActiveView("map")}
                  >
                    Voltar à Cidade das Palavras →
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

/** Ícone de uma figura de linguagem (Lucide). */
function FigIcon({ icon: Icon, size = 18 }: { icon: LucideIcon; size?: number }) {
  return <Icon size={size} strokeWidth={2.2} aria-hidden="true" style={{ verticalAlign: "-3px" }} />;
}
