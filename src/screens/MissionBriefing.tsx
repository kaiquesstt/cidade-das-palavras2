
import { TeacherGuide } from "../components/TeacherGuide";
import { districts, districtByKey } from "../data/districts";
import { useGameStore } from "../store/useGameStore";
import type { DistrictKey, ViewKey } from "../types";
import { DistrictIcon } from "../components/DistrictIcon";

const missionInfo: Record<
  DistrictKey,
  { view: ViewKey | null; action: string; focus: string }
> = {
  charge: {
    view: "chargeMission",
    action: "Iniciar investigação da Charge",
    focus:
      "Observar linguagem verbal e visual, reconhecer crítica e ironia, justificar com evidências, contrastar Charge × Tirinha e produzir uma nova situação."
  },
  fabula: {
    view: "fableMission",
    action: "Entrar na Floresta das Fábulas",
    focus:
      "Compreender personagens, conflito e reflexão moral; diferenciar Fábula × Lenda e produzir uma narrativa curta com consequência significativa."
  },
  lenda: {
    view: "legendMission",
    action: "Entrar na Vila das Lendas",
    focus:
      "Relacionar narrativa, lugar, memória coletiva, transmissão cultural e elemento extraordinário; contrastar Lenda × Fábula × Conto fantástico."
  },
  estatuto: {
    view: "statuteMission",
    action: "Entrar na Câmara da Cidade",
    focus:
      "Reconhecer finalidade normativa, direitos, deveres e responsabilidades; diferenciar Estatuto × Regulamento × Artigo de opinião e produzir um artigo normativo."
  },
  artigo: {
    view: "opinionMission",
    action: "Entrar na Redação Central",
    focus:
      "Localizar tema, tese, argumentos, evidência, contra-argumento e conclusão; diferenciar Artigo de opinião × Carta do leitor × Notícia."
  },
  carta: {
    view: "readerLetterMission",
    action: "Abrir a Central do Leitor",
    focus:
      "Identificar a publicação que provoca a resposta, destinatário, posicionamento, argumentos e proposta; contrastar Carta do leitor × Artigo de opinião × Carta pessoal."
  },
  miniconto: {
    view: "minicontoMission",
    action: "Entrar na Estação Miniconto",
    focus:
      "Perceber concisão, movimento narrativo, lacunas e inferência; diferenciar Miniconto × Frase de efeito × Resumo e produzir uma narrativa breve."
  },
  figuras: {
    view: "figuresMission",
    action: "Entrar no Laboratório das Lentes",
    focus:
      "Compreender anáfora, eufemismo, metáfora, comparação e personificação pelo efeito de sentido, justificar classificações e criar exemplos autorais."
  },
  rede: {
    view: "redeMission",
    action: "Entrar na Torre da Rede",
    focus:
      "Simular como uma mensagem se espalha, comparar repassar, ignorar e denunciar, e representar o alcance com potências e gráficos."
  },
  dados: {
    view: null,
    action: "Em construção",
    focus:
      "Planejar uma pesquisa, tabular respostas, calcular porcentagens, construir gráficos e usar os resultados como evidência em textos argumentativos."
  }
};

export function MissionBriefing() {
  const selected = useGameStore((s) => s.selectedDistrict);
  const setActiveView = useGameStore((s) => s.setActiveView);
  const mastery = useGameStore((s) => s.mastery);
  const progress = useGameStore((s) => s.progress);

  if (!selected) {
    return (
      <main className="content-screen">
        <h1>Nenhuma missão selecionada.</h1>
        <button
          type="button"
          className="primary-action"
          onClick={() => setActiveView("map")}
        >
          Voltar ao mapa
        </button>
      </main>
    );
  }

  const district = districtByKey[selected];
  const status = mastery[selected];
  const info = missionInfo[selected];
  const routeNumber =
    districts.findIndex((item) => item.key === selected) + 1;
  const completedStages = Object.values(status).filter(Boolean).length;
  const restored = progress[selected] === 100;

  return (
    <main className="mission-briefing-layout">
      <TeacherGuide />

      <section
        className="briefing-panel"
        style={
          { "--district-color": district.color } as React.CSSProperties
        }
      >
        <button
          type="button"
          className="back-link"
          onClick={() => setActiveView("map")}
        >
          ← Voltar ao mapa
        </button>

        <div className="briefing-route">
          <span>ROTA {routeNumber} DE {districts.length}</span>
          <strong>
            {restored
              ? "DISTRITO RESTAURADO"
              : `${completedStages}/4 habilidades concluídas`}
          </strong>
        </div>

        <span className="briefing-icon">
          <DistrictIcon district={district.key} size={30} />
        </span>
        <span className="eyebrow">BRIEFING DA MISSÃO</span>
        <h1>{district.label}</h1>
        <p className="briefing-lead">{district.purpose}</p>

        <div className="briefing-objectives">
          <article>
            <span>01</span>
            <div>
              <b>Descobrir</b>
              <p>Observe primeiro a situação antes de receber uma definição.</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <b>Justificar</b>
              <p>Use evidências que realmente provem a classificação.</p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <b>Aplicar</b>
              <p>Transfira o critério para um caso novo.</p>
            </div>
          </article>
          <article>
            <span>04</span>
            <div>
              <b>Produzir</b>
              <p>Crie algo usando conscientemente o que aprendeu.</p>
            </div>
          </article>
        </div>

        <div className="briefing-status" aria-label="Habilidades da missão">
          <span className={status.recognize ? "done" : ""}>
            {status.recognize ? "✓" : "○"} Reconhecer
          </span>
          <span className={status.explain ? "done" : ""}>
            {status.explain ? "✓" : "○"} Explicar
          </span>
          <span className={status.apply ? "done" : ""}>
            {status.apply ? "✓" : "○"} Aplicar
          </span>
          <span className={status.produce ? "done" : ""}>
            {status.produce ? "✓" : "○"} Produzir
          </span>
        </div>

        <div className="briefing-focus">
          <span className="eyebrow">O QUE VOCÊ VAI TREINAR</span>
          <p>{info.focus}</p>
        </div>

        {info.view ? (
          <button
            type="button"
            className="primary-action briefing-start"
            onClick={() => info.view && setActiveView(info.view)}
          >
            {restored ? "Revisar missão" : info.action} →
          </button>
        ) : (
          <button
            type="button"
            className="primary-action briefing-start is-building"
            aria-disabled="true"
            disabled
          >
            🚧 {info.action}
          </button>
        )}
      </section>
    </main>
  );
}
