
import { CityMap } from "../components/CityMap";
import { MissionDock } from "../components/MissionDock";

export function MapScreen() {
  return (
    <main className="content-screen map-screen">
      <header className="screen-heading compact-heading">
        <span className="eyebrow">MAPA DA CIDADE</span>
        <h1>Explore sem esconder a paisagem</h1>
        <p>Os pontos permanecem discretos; detalhes aparecem apenas quando você seleciona um bairro.</p>
      </header>
      <CityMap />
      <MissionDock />
    </main>
  );
}
