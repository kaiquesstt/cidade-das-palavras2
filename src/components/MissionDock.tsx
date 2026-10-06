
import { districtByKey } from "../data/districts";
import { useGameStore } from "../store/useGameStore";

export function MissionDock() {
  const selected = useGameStore((s) => s.selectedDistrict);
  const progress = useGameStore((s) => s.progress);
  const enterMissionBriefing = useGameStore((s) => s.enterMissionBriefing);
  const district = selected ? districtByKey[selected] : null;
  const districtProgress = district ? progress[district.key] : 0;
  const restored = Boolean(district && districtProgress === 100);

  return (
    <section className="mission-dock" aria-label="Missão atual">
      <div className="mission-icon" aria-hidden="true">
        {restored ? "★" : "✓"}
      </div>

      <div className="mission-copy">
        <span className="eyebrow">
          {restored ? "DISTRITO RESTAURADO" : "MISSÃO ATUAL"}
        </span>
        <b>
          {district
            ? `${restored ? "Revisar" : "Investigue"}: ${district.label}`
            : "Explore um bairro da cidade"}
        </b>
        <small>
          {district
            ? district.note
            : "Selecione um ponto colorido do mapa para conhecer a missão."}
        </small>
      </div>

      <div className="mission-state">
        <span>
          {district ? `${districtProgress}% de domínio` : "Aguardando seleção"}
        </span>
        {district && (
          <i className="mission-mini-progress" aria-hidden="true">
            <b style={{ width: `${districtProgress}%` }} />
          </i>
        )}
      </div>

      <button
        type="button"
        className="primary-action"
        disabled={!district}
        onClick={() => district && enterMissionBriefing(district.key)}
      >
        {district
          ? district.hasMission === false
            ? "VER O QUE VEM AÍ"
            : restored
              ? "REVISAR MISSÃO"
              : "ENTRAR NA MISSÃO"
          : "ESCOLHA UM DESTINO"}{" "}
        →
      </button>
    </section>
  );
}
