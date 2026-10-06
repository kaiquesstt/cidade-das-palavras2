
import { useMemo, useState } from "react";
import teacherImage from "../assets/teacher-guide.webp";
import minicontoImage from "../assets/miniconto-district.webp";
import { useGameStore } from "../store/useGameStore";

type Stage =
  | "investigate"
  | "classify"
  | "justify"
  | "contrast"
  | "apply"
  | "produce"
  | "complete";

type LayerKey = "cena" | "movimento" | "lacuna" | "efeito";
type IngredientKey = "objeto" | "lugar" | "mudanca";

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

const miniconto = {
  title: "De volta",
  text:
    "Helena encontrou no sebo um livro com seu nome escrito na primeira página. A letra era da mãe. Comprou sem perguntar o preço. Em casa, descobriu a dedicatória: “Para Helena, quando você souber voltar.”"
};

const layers: {
  id: LayerKey;
  label: string;
  title: string;
  explanation: string;
}[] = [
  {
    id: "cena",
    label: "Recorte",
    title: "O texto escolhe poucos momentos: encontro, compra e descoberta.",
    explanation:
      "O miniconto não tenta contar toda a história de Helena. Ele seleciona uma cena decisiva e deixa o restante fora do enquadramento."
  },
  {
    id: "movimento",
    label: "Movimento narrativo",
    title: "Algo muda entre o início e o fim.",
    explanation:
      "Primeiro há um livro encontrado por acaso; depois surge a letra da mãe; por fim, a dedicatória altera o significado de tudo que veio antes."
  },
  {
    id: "lacuna",
    label: "Lacuna",
    title: "O texto não explica por que Helena precisava “voltar”.",
    explanation:
      "A ausência é intencional. O leitor precisa imaginar relações, afastamentos e sentidos possíveis sem receber uma explicação completa."
  },
  {
    id: "efeito",
    label: "Efeito final",
    title: "A última frase reabre o texto em vez de simplesmente encerrá-lo.",
    explanation:
      "O final produz impacto porque acrescenta uma informação que faz o leitor reinterpretar o livro, a mãe e a atitude de Helena."
  }
];

const inferenceOptions = [
  {
    id: "literal",
    label:
      "A mãe de Helena escreveu a dedicatória no livro em algum momento anterior.",
    kind: "explicit",
    feedback:
      "É uma inferência muito próxima do que o texto afirma: a letra é reconhecida como sendo da mãe e a dedicatória está no mesmo livro."
  },
  {
    id: "distance",
    label:
      "A palavra “voltar” sugere algum afastamento anterior, físico ou afetivo.",
    kind: "inference",
    feedback:
      "Boa leitura. O texto não explica o afastamento, mas a dedicatória abre esse espaço de interpretação."
  },
  {
    id: "death",
    label:
      "A mãe de Helena morreu antes de a história começar.",
    kind: "unsupported",
    feedback:
      "O texto não permite concluir isso. Pode ser uma hipótese de leitor, mas não é uma inferência sustentada por pistas suficientes."
  }
];

const classifications = [
  {
    id: "miniconto",
    label: "Miniconto",
    correct: true,
    feedback:
      "Correto. Apesar da extensão reduzida, há personagem, acontecimentos, mudança de sentido e lacunas que pedem participação do leitor."
  },
  {
    id: "frase",
    label: "Frase de efeito",
    correct: false,
    feedback:
      "Uma frase de efeito pode ser breve e impactante, mas não precisa construir uma situação narrativa com acontecimentos."
  },
  {
    id: "resumo",
    label: "Resumo de uma história",
    correct: false,
    feedback:
      "Um resumo comprime uma narrativa maior já existente. Aqui o próprio texto curto é a obra narrativa completa."
  },
  {
    id: "descricao",
    label: "Descrição",
    correct: false,
    feedback:
      "Há elementos descritivos, mas o centro do texto está no que acontece e na mudança produzida pela descoberta final."
  }
];

const evidenceOptions = [
  {
    id: "concisao",
    label: "O texto é muito conciso e seleciona apenas informações decisivas.",
    correct: true
  },
  {
    id: "movimento",
    label: "Há acontecimentos e mudança entre início e fim.",
    correct: true
  },
  {
    id: "inferencia",
    label: "Parte importante do sentido depende de inferência do leitor.",
    correct: true
  },
  {
    id: "efeito",
    label: "O final altera ou amplia a leitura do que veio antes.",
    correct: true
  },
  {
    id: "curto",
    label: "Qualquer texto curto pode ser considerado miniconto.",
    correct: false
  },
  {
    id: "explica",
    label: "O texto explica todo o passado das personagens para evitar dúvidas.",
    correct: false
  }
];

const contrastOptions = [
  {
    id: "function",
    label:
      "Miniconto é uma narrativa completa em escala reduzida; frase de efeito pode apenas condensar uma ideia; resumo conta de forma abreviada uma história maior.",
    correct: true
  },
  {
    id: "words",
    label:
      "Todo texto com menos de 50 palavras é miniconto, independentemente de haver narrativa.",
    correct: false
  },
  {
    id: "ending",
    label:
      "Minicontos obrigatoriamente terminam com surpresa; sem reviravolta, deixam de ser minicontos.",
    correct: false
  }
];

const applicationTexts = [
  {
    id: "A",
    title: "Chave",
    text:
      "A porta abriu na primeira tentativa. Pedro entrou sorrindo. Só depois percebeu que aquela não era mais a sua casa.",
    genre: "Miniconto",
    correct: true,
    reason:
      "Há cena, acontecimento, mudança e um final que obriga o leitor a reconstruir o que aconteceu antes."
  },
  {
    id: "B",
    title: "Pressa",
    text:
      "Quem corre demais pode chegar cedo ao lugar errado.",
    genre: "Frase de efeito",
    correct: false,
    reason:
      "O texto condensa uma ideia, mas não apresenta uma sequência de acontecimentos vivida por personagens."
  },
  {
    id: "C",
    title: "Resumo",
    text:
      "O romance acompanha uma jovem que deixa sua cidade, enfrenta dificuldades e retorna anos depois para reencontrar a família.",
    genre: "Resumo",
    correct: false,
    reason:
      "O texto apresenta de forma abreviada uma narrativa maior; ele não funciona como uma cena narrativa autônoma."
  }
];

const ingredients: Record<IngredientKey, string[]> = {
  objeto: [
    "uma fotografia rasgada",
    "um bilhete sem assinatura",
    "uma chave antiga",
    "um guarda-chuva esquecido"
  ],
  lugar: [
    "um ponto de ônibus vazio",
    "a biblioteca minutos antes de fechar",
    "uma praça depois da chuva",
    "um corredor de escola já sem alunos"
  ],
  mudanca: [
    "alguém reconhece algo que não esperava",
    "uma mensagem muda o sentido da cena",
    "um objeto revela uma ligação com o passado",
    "a personagem percebe que estava no lugar errado"
  ]
};

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function MinicontoMissionScreen() {
  const setActiveView = useGameStore((s) => s.setActiveView);
  const markStage = useGameStore((s) => s.markStage);
  const addAchievement = useGameStore((s) => s.addAchievement);
  const mastery = useGameStore((s) => s.mastery);
  const xp = useGameStore((s) => s.xp);
  const fontScale = useGameStore((s) => s.fontScale);
  const setFontScale = useGameStore((s) => s.setFontScale);

  const [stage, setStage] = useState<Stage>("investigate");
  const [layer, setLayer] = useState<LayerKey | null>(null);
  const [inference, setInference] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [evidenceChecked, setEvidenceChecked] = useState(false);
  const [contrast, setContrast] = useState<string | null>(null);
  const [application, setApplication] = useState<string | null>(null);
  const [object, setObject] = useState("");
  const [place, setPlace] = useState("");
  const [change, setChange] = useState("");
  const [title, setTitle] = useState("");
  const [draft, setDraft] = useState("");
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const stageIndex = stageOrder.indexOf(stage);
  const words = countWords(draft);

  const teacherText = useMemo(() => {
    switch (stage) {
      case "investigate":
        return "Miniconto não é apenas texto pequeno. Observe o que ele mostra, o que deixa de explicar e como poucas frases conseguem fazer a história se mover.";
      case "classify":
        return "Agora classifique. O tamanho ajuda, mas não basta: procure acontecimentos, mudança e participação do leitor.";
      case "justify":
        return "Uma boa justificativa precisa explicar por que a brevidade ainda funciona como narrativa.";
      case "contrast":
        return "Textos curtos podem cumprir funções muito diferentes. Compare miniconto, frase de efeito e resumo.";
      case "apply":
        return "Leia três textos breves. O desafio é encontrar qual deles realmente cria uma pequena experiência narrativa.";
      case "produce":
        return "Na oficina de corte, cada palavra precisa trabalhar. Crie uma cena com mudança e deixe alguma coisa para o leitor completar.";
      case "complete":
        return "A Estação Miniconto foi restaurada. Poucas palavras voltaram a abrir grandes espaços de imaginação.";
    }
  }, [stage]);

  const selectedInference = inferenceOptions.find((item) => item.id === inference);
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

  const productionReady =
    Boolean(object && place && change) &&
    words >= 12 &&
    words <= 50 &&
    draft.trim().length >= 65;

  function award(
    stageKey: "recognize" | "explain" | "apply" | "produce",
    label: string
  ) {
    if (mastery.miniconto[stageKey]) return;
    markStage("miniconto", stageKey);
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

  function buildStarter() {
    if (!object || !place || !change) return;
    setDraft(
      `Em ${place}, alguém encontrou ${object}. Parecia não significar nada, até que ${change}.`
    );
  }

  function finishProduction() {
    if (!productionReady) return;
    award("produce", "Produzir concluído");
    addAchievement("Mestre da entrelinha");
    addAchievement("Autor da cidade");
    go("complete");
  }

  return (
    <main className="miniconto-page">
      {rewardMessage && (
        <div className="xp-toast" role="status" aria-live="polite">
          <span>★</span>
          <b>{rewardMessage}</b>
        </div>
      )}

      <header className="miniconto-header">
        <div className="miniconto-header-title">
          <span className="eyebrow">ESTAÇÃO MINICONTO</span>
          <h1>Poucas palavras. Muito fora do quadro.</h1>
          <small>Recorte · movimento · inferência · impacto</small>
        </div>

        <div
          className="miniconto-progress"
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

        <div className="miniconto-accessibility" aria-label="Tamanho da interface">
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

      <div className="miniconto-layout">
        <aside className="miniconto-side">
          <section className="miniconto-guide">
            <div className="miniconto-guide-image">
              <img src={teacherImage} alt="Professora Fabricia" />
            </div>
            <div className="miniconto-guide-copy">
              <span>PROFª FABRICIA</span>
              <p>{teacherText}</p>
            </div>
          </section>

          <section className="miniconto-stage-list">
            <strong>LINHA DA MISSÃO</strong>
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

        <section className="miniconto-main">
          <section className="miniconto-banner">
            <img src={minicontoImage} alt="" />
            <div className="miniconto-banner-overlay" />
            <div className="miniconto-rain" aria-hidden="true" />
            <div className="miniconto-banner-copy">
              <span>ARQUIVO NARRATIVO 07</span>
              <h2>A estação está cheia de histórias que perderam palavras.</h2>
              <p>
                Sua missão é descobrir quanto pode ser retirado sem apagar o
                movimento, a lacuna e o efeito da narrativa.
              </p>
            </div>
            <div className="miniconto-ticket" aria-hidden="true">07</div>
          </section>

          <section className="miniconto-reading">
            <header>
              <div>
                <span className="eyebrow">MINICONTO ORIGINAL DO JOGO</span>
                <h2>{miniconto.title}</h2>
              </div>
              <span className="miniconto-chip">{countWords(miniconto.text)} palavras</span>
            </header>

            <article className="miniconto-card">
              <span className="miniconto-quote">“</span>
              <p>{miniconto.text}</p>
              <span className="miniconto-quote end">”</span>
            </article>
          </section>

          <section className="miniconto-task">
            {stage === "investigate" && (
              <>
                <div className="miniconto-task-heading">
                  <span>01</span>
                  <div>
                    <h2>Leia o que está dentro — e fora — do quadro</h2>
                    <p>
                      Abra as quatro camadas para perceber como o texto cria
                      narrativa sem explicar tudo.
                    </p>
                  </div>
                </div>

                <div className="miniconto-layer-grid">
                  {layers.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={layer === item.id ? "active" : ""}
                      onClick={() => setLayer(layer === item.id ? null : item.id)}
                    >
                      <span>{item.label}</span>
                      <b>{item.title}</b>
                    </button>
                  ))}
                </div>

                {layer && (
                  <div className="miniconto-layer-explanation">
                    <span>{layers.find((item) => item.id === layer)?.label}</span>
                    <p>
                      {layers.find((item) => item.id === layer)?.explanation}
                    </p>
                  </div>
                )}

                <div className="miniconto-inference">
                  <h3>Teste de inferência</h3>
                  <p>
                    Qual leitura é possível sem inventar informações que o
                    texto não sustenta?
                  </p>
                  <div>
                    {inferenceOptions.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className={
                          inference === item.id
                            ? item.kind === "unsupported"
                              ? "wrong"
                              : "selected"
                            : ""
                        }
                        onClick={() => setInference(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedInference && (
                  <div
                    className={`miniconto-feedback ${
                      selectedInference.kind === "unsupported"
                        ? "warning"
                        : "success"
                    }`}
                  >
                    <b>
                      {selectedInference.kind === "unsupported"
                        ? "Cuidado: isso vai além das pistas."
                        : selectedInference.kind === "inference"
                          ? "Inferência sustentada."
                          : "Leitura compatível com o texto."}
                    </b>
                    <p>{selectedInference.feedback}</p>
                  </div>
                )}

                <button
                  type="button"
                  className="primary-action miniconto-next"
                  onClick={() => go("classify")}
                >
                  Próxima etapa: Classificar →
                </button>
              </>
            )}

            {stage === "classify" && (
              <>
                <div className="miniconto-task-heading">
                  <span>02</span>
                  <div>
                    <h2>Que gênero é esse?</h2>
                    <p>
                      Não escolha apenas porque o texto é curto. Procure
                      movimento narrativo e construção de sentido.
                    </p>
                  </div>
                </div>

                <div className="miniconto-options">
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
                    className={`miniconto-feedback ${
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
                    className="primary-action miniconto-next"
                    onClick={() => go("justify")}
                  >
                    Próxima etapa: Justificar →
                  </button>
                )}
              </>
            )}

            {stage === "justify" && (
              <>
                <div className="miniconto-task-heading">
                  <span>03</span>
                  <div>
                    <h2>O que faz a brevidade funcionar como narrativa?</h2>
                    <p>
                      Selecione apenas as evidências que realmente sustentam a
                      classificação.
                    </p>
                  </div>
                </div>

                <div className="miniconto-evidence">
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
                    className={`miniconto-feedback ${
                      evidenceSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {evidenceSuccess
                        ? "Justificativa consistente."
                        : "Há uma ideia inadequada na seleção."}
                    </b>
                    <p>
                      {evidenceSuccess
                        ? "Concisão, acontecimentos, inferência e efeito final trabalham juntos. O texto é curto, mas continua sendo narrativa."
                        : "Brevidade sozinha não define miniconto, e explicar tudo reduziria justamente o espaço de participação do leitor."}
                    </p>
                  </div>
                )}

                {evidenceSuccess && (
                  <button
                    type="button"
                    className="primary-action miniconto-next"
                    onClick={() => go("contrast")}
                  >
                    Próxima etapa: Comparar textos curtos →
                  </button>
                )}
              </>
            )}

            {stage === "contrast" && (
              <>
                <div className="miniconto-task-heading">
                  <span>04</span>
                  <div>
                    <h2>Curto não é sinônimo de miniconto</h2>
                    <p>
                      Compare três maneiras diferentes de usar poucas palavras.
                    </p>
                  </div>
                </div>

                <div className="miniconto-contrast-cards">
                  <article>
                    <span>MINICONTO</span>
                    <b>Narrativa concentrada</b>
                    <p>
                      Uma cena curta ainda contém acontecimento, transformação
                      e espaço para inferência.
                    </p>
                  </article>
                  <article>
                    <span>FRASE DE EFEITO</span>
                    <b>Ideia condensada</b>
                    <p>
                      Pode provocar reflexão sem apresentar personagens ou uma
                      sequência narrativa.
                    </p>
                  </article>
                  <article>
                    <span>RESUMO</span>
                    <b>Redução de outra história</b>
                    <p>
                      Reconta de modo abreviado uma narrativa maior que existe
                      além daquele texto.
                    </p>
                  </article>
                </div>

                <div className="miniconto-options stacked">
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
                    className={`miniconto-feedback ${
                      contrastSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {contrastSuccess
                        ? "Boa diferenciação."
                        : "Esse critério é rígido demais."}
                    </b>
                    <p>
                      {contrastSuccess
                        ? "Você diferenciou os textos pela função, e não por uma contagem mecânica de palavras."
                        : "Não existe uma quantidade mágica de palavras nem obrigação de terminar com surpresa. O essencial é o funcionamento narrativo."}
                    </p>
                  </div>
                )}

                {contrastSuccess && (
                  <button
                    type="button"
                    className="primary-action miniconto-next"
                    onClick={() => go("apply")}
                  >
                    Próxima etapa: Aplicar →
                  </button>
                )}
              </>
            )}

            {stage === "apply" && (
              <>
                <div className="miniconto-task-heading">
                  <span>05</span>
                  <div>
                    <h2>Qual texto abre uma história em miniatura?</h2>
                    <p>
                      Todos são curtos. Só um funciona como narrativa autônoma.
                    </p>
                  </div>
                </div>

                <div className="miniconto-application-grid">
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
                    className={`miniconto-feedback ${
                      applicationSuccess ? "success" : "warning"
                    }`}
                  >
                    <b>
                      {applicationSuccess
                        ? "Aplicação correta."
                        : `Este texto funciona melhor como ${selectedApplication.genre.toLowerCase()}.`}
                    </b>
                    <p>{selectedApplication.reason}</p>
                  </div>
                )}

                {applicationSuccess && (
                  <button
                    type="button"
                    className="primary-action miniconto-next"
                    onClick={() => go("produce")}
                  >
                    Próxima etapa: Oficina de corte →
                  </button>
                )}
              </>
            )}

            {stage === "produce" && (
              <>
                <div className="miniconto-task-heading">
                  <span>06</span>
                  <div>
                    <h2>Oficina de corte</h2>
                    <p>
                      Escolha três ingredientes, gere apenas um ponto de partida
                      e reescreva até que cada palavra tenha uma função.
                    </p>
                  </div>
                </div>

                <div className="miniconto-builder">
                  <div>
                    <b>1. Objeto</b>
                    <div>
                      {ingredients.objeto.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={object === item ? "selected" : ""}
                          onClick={() => {
                            setObject(item);
                            setDraft("");
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <b>2. Lugar</b>
                    <div>
                      {ingredients.lugar.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={place === item ? "selected" : ""}
                          onClick={() => {
                            setPlace(item);
                            setDraft("");
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <b>3. Mudança</b>
                    <div>
                      {ingredients.mudanca.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={change === item ? "selected" : ""}
                          onClick={() => {
                            setChange(item);
                            setDraft("");
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {object && place && change && (
                  <div className="miniconto-starter">
                    <span>RASCUNHO DE PARTIDA</span>
                    <p>
                      Em {place}, alguém encontrou {object}. Parecia não
                      significar nada, até que {change}.
                    </p>
                    <button
                      type="button"
                      className="secondary-action"
                      onClick={buildStarter}
                    >
                      Levar para o editor
                    </button>
                  </div>
                )}

                <div className="miniconto-editor">
                  <label htmlFor="miniTitle">
                    <b>4. Título</b>
                    <span>Opcional, mas ele pode acrescentar uma nova camada.</span>
                  </label>
                  <input
                    id="miniTitle"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Título do miniconto"
                  />

                  <label htmlFor="miniDraft">
                    <b>5. Seu miniconto</b>
                    <span>
                      Meta do jogo: entre 12 e 50 palavras. O limite é didático,
                      não uma definição universal do gênero.
                    </span>
                  </label>
                  <textarea
                    id="miniDraft"
                    rows={6}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Escreva, corte, releia e deixe espaço para o leitor..."
                  />

                  <div className="miniconto-cut-meter">
                    <div>
                      <span
                        className={
                          words >= 12 && words <= 50 ? "ok" : words > 50 ? "over" : ""
                        }
                      >
                        {words}/50 palavras
                      </span>
                      <small>
                        {words > 50
                          ? `Corte pelo menos ${words - 50} palavra(s).`
                          : words < 12
                            ? "Ainda falta movimento narrativo."
                            : "Faixa da oficina atingida."}
                      </small>
                    </div>
                    <div className="miniconto-meter-track">
                      <i style={{ width: `${Math.min(100, (words / 50) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="miniconto-checklist">
                    <span className={object && place ? "ok" : ""}>✓ há uma situação concreta</span>
                    <span className={change ? "ok" : ""}>✓ existe mudança ou descoberta</span>
                    <span className={words >= 12 && words <= 50 ? "ok" : ""}>
                      ✓ texto conciso para esta oficina
                    </span>
                    <span className={draft.trim().length >= 65 ? "ok" : ""}>
                      ✓ desenvolvimento mínimo
                    </span>
                  </div>
                </div>

                <div className="miniconto-reflection">
                  <b>Antes de publicar, pergunte:</b>
                  <p>
                    Há alguma frase que explica o que o leitor conseguiria
                    descobrir sozinho? Se houver, talvez seja a próxima palavra
                    a cortar.
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-action miniconto-next"
                  disabled={!productionReady}
                  onClick={finishProduction}
                >
                  Publicar miniconto e restaurar a Estação →
                </button>
              </>
            )}

            {stage === "complete" && (
              <>
                <div className="miniconto-complete">
                  <div className="miniconto-complete-mark">▣</div>
                  <h2>Estação Miniconto restaurada</h2>
                  <p>
                    As histórias voltaram a caber em poucas linhas sem perder
                    aquilo que acontece entre elas.
                  </p>
                  <strong>+100 XP possíveis · XP atual: {xp}/400</strong>
                </div>

                <article className="miniconto-published">
                  <span>PUBLICADO NA PLATAFORMA 07</span>
                  {title && <h3>{title}</h3>}
                  <p>{draft}</p>
                  <small>{words} palavras</small>
                </article>

                <div className="miniconto-mastery">
                  <article>
                    <b>Reconhecer</b>
                    <span>100%</span>
                    <p>
                      Identificou o gênero para além da simples brevidade.
                    </p>
                  </article>
                  <article>
                    <b>Explicar</b>
                    <span>100%</span>
                    <p>
                      Justificou por concisão, movimento, inferência e efeito.
                    </p>
                  </article>
                  <article>
                    <b>Aplicar</b>
                    <span>100%</span>
                    <p>
                      Diferenciou miniconto, frase de efeito e resumo.
                    </p>
                  </article>
                  <article>
                    <b>Produzir</b>
                    <span>100%</span>
                    <p>
                      Criou uma narrativa curta e revisou o peso das palavras.
                    </p>
                  </article>
                </div>

                <div className="miniconto-final-actions">
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
