
import { districts } from "../data/districts";
import { useGameStore } from "../store/useGameStore";

export function MissionsScreen() {
  const progress = useGameStore((s) => s.progress);
  const selectDistrict = useGameStore((s) => s.selectDistrict);
  const enterMissionBriefing = useGameStore((s) => s.enterMissionBriefing);

  return (
    <main className="content-screen">
      <header className="screen-heading">
        <span className="eyebrow">MISSÕES</span>
        <h1>Arquivos da Cidade</h1>
        <p>Escolha uma missão pelo conteúdo. O mapa continua sendo o modo mais imersivo de navegar.</p>
      </header>

      <div className="district-grid">
        {districts.map((district) => (
          <article
            className="district-card"
            key={district.key}
            style={{ "--district-color": district.color } as React.CSSProperties}
          >
            <div className="district-card-icon">{district.icon}</div>
            <div>
              <span className="card-kicker">
                {district.hasMission === false
                  ? "Em construção"
                  : `${progress[district.key]}% de domínio`}
              </span>
              <h2>{district.label}</h2>
              <p>{district.note}</p>
              <div className="card-progress">
                <i style={{ width: `${progress[district.key]}%` }} />
              </div>
            </div>
            <div className="card-actions">
              <button
                type="button"
                className="secondary-action"
                onClick={() => {
                  selectDistrict(district.key);
                  useGameStore.getState().setActiveView("map");
                }}
              >
                Ver no mapa
              </button>
              <button
                type="button"
                className="primary-action compact"
                onClick={() => enterMissionBriefing(district.key)}
              >
                Abrir briefing
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
