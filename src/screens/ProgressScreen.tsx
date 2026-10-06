
import { districts, playableDistricts } from "../data/districts";
import { useGameStore } from "../store/useGameStore";
import type { MasteryStage } from "../types";
import { DistrictIcon } from "../components/DistrictIcon";

const stages: Array<{ key: MasteryStage; label: string }> = [
  { key: "recognize", label: "Reconhecer" },
  { key: "explain", label: "Explicar" },
  { key: "apply", label: "Aplicar" },
  { key: "produce", label: "Produzir" }
];

export function ProgressScreen() {
  const progress = useGameStore((s) => s.progress);
  const mastery = useGameStore((s) => s.mastery);
  const enterMissionBriefing = useGameStore((s) => s.enterMissionBriefing);

  const restored = playableDistricts.filter(
    (district) => progress[district.key] === 100
  ).length;

  const overall = Math.round(
    playableDistricts.reduce((sum, district) => sum + progress[district.key], 0) /
      playableDistricts.length
  );

  const skillsCompleted = playableDistricts.reduce(
    (sum, district) =>
      sum +
      stages.filter((stage) => mastery[district.key][stage.key]).length,
    0
  );

  const nextDistrict = playableDistricts.find(
    (district) => progress[district.key] < 100
  );

  return (
    <main className="content-screen">
      <header className="screen-heading">
        <span className="eyebrow">MEU PROGRESSO</span>
        <h1>Domínio por conteúdo</h1>
        <p>
          O jogo separa reconhecer, explicar, aplicar e produzir para não
          confundir acerto com aprendizagem completa.
        </p>
      </header>

      <section className="progress-overview" aria-label="Resumo geral">
        <article>
          <span>CIDADE RESTAURADA</span>
          <strong>{overall}%</strong>
          <div className="overall-meter" aria-hidden="true">
            <i style={{ width: `${overall}%` }} />
          </div>
        </article>
        <article>
          <span>DISTRITOS COMPLETOS</span>
          <strong>{restored}/{playableDistricts.length}</strong>
          <small>100% = quatro habilidades concluídas</small>
        </article>
        <article>
          <span>HABILIDADES CONCLUÍDAS</span>
          <strong>{skillsCompleted}/{playableDistricts.length * 4}</strong>
          <small>Reconhecer · Explicar · Aplicar · Produzir</small>
        </article>
      </section>

      {nextDistrict ? (
        <section className="next-mission-card">
          <div>
            <span className="eyebrow">ROTA SUGERIDA</span>
            <h2>Próximo passo: {nextDistrict.label}</h2>
            <p>
              Você pode seguir a ordem sugerida ou escolher qualquer outro
              distrito pelo mapa.
            </p>
          </div>
          <button
            type="button"
            className="primary-action"
            onClick={() => enterMissionBriefing(nextDistrict.key)}
          >
            Continuar jornada →
          </button>
        </section>
      ) : (
        <section className="next-mission-card complete-city">
          <div>
            <span className="eyebrow">CIDADE RESTAURADA</span>
            <h2>Todos os distritos abertos chegaram a 100%.</h2>
            <p>
              Use agora as missões para revisão ou consulte o Caderno do
              Investigador.
            </p>
          </div>
        </section>
      )}

      <div className="progress-list">
        {districts.map((district) => (
          <article className="progress-row" key={district.key}>
            <div className="progress-title">
              <span
                className="progress-symbol"
                style={{ background: district.color }}
              >
                <DistrictIcon district={district.key} size={20} />
              </span>
              <div>
                <h2>{district.label}</h2>
                <small>{district.note}</small>
              </div>
            </div>

            <div className="mastery-stages">
              {stages.map((stage) => (
                <span
                  key={stage.key}
                  className={
                    mastery[district.key][stage.key]
                      ? "mastery-stage complete"
                      : "mastery-stage"
                  }
                >
                  {mastery[district.key][stage.key] ? "✓" : "○"}{" "}
                  {stage.label}
                </span>
              ))}
            </div>

            <div className="progress-number">
              {district.hasMission === false
                ? "Em breve"
                : `${progress[district.key]}%`}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
