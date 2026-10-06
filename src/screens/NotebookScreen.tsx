
import { districts } from "../data/districts";
import { useGameStore } from "../store/useGameStore";

export function NotebookScreen() {
  const progress = useGameStore((s) => s.progress);

  return (
    <main className="content-screen">
      <header className="screen-heading">
        <span className="eyebrow">CADERNO DO INVESTIGADOR</span>
        <h1>O conhecimento que você construiu</h1>
        <p>As fichas registram finalidade, pistas e contrastes. Quanto maior o domínio, mais completa fica a ficha.</p>
      </header>

      <div className="notebook-grid">
        {districts.map((district) => (
          <article className="notebook-card" key={district.key}>
            <div className="notebook-card-header">
              <span className="notebook-icon" style={{ color: district.color }}>{district.icon}</span>
              <div>
                <span className="card-kicker">{progress[district.key]}% DESCOBERTO</span>
                <h2>{district.label}</h2>
              </div>
            </div>
            <dl>
              <div><dt>Finalidade</dt><dd>{district.purpose}</dd></div>
              <div><dt>Pista-chave</dt><dd>{district.clue}</dd></div>
              <div><dt>Por que não confundir?</dt><dd>{district.contrast}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </main>
  );
}
