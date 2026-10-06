
import { CityMap } from "../components/CityMap";
import { TeacherGuide } from "../components/TeacherGuide";
import { MissionDock } from "../components/MissionDock";

export function HomeScreen() {
  return (
    <>
      <main className="game-grid">
        <TeacherGuide />
        <section className="map-zone">
          <div className="map-heading">
            <div>
              <span className="eyebrow">MAPA INTERATIVO</span>
              <h1>Escolha seu destino</h1>
            </div>
            <div className="map-legend" aria-label="Legenda">
              <span>◉ Bairro clicável</span>
              <span>✦ Domínio restaura a cidade</span>
            </div>
          </div>
          <CityMap />
        </section>
      </main>
      <MissionDock />
    </>
  );
}
