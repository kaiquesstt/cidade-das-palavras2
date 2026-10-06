
import teacherImage from "../assets/teacher-guide.webp";
import { districtByKey } from "../data/districts";
import { useGameStore } from "../store/useGameStore";

const genericMessage =
  "Cada bairro guarda um tipo de texto ou um poder da linguagem. Escolha um destino e eu vou acompanhar sua investigação.";

export function TeacherGuide() {
  const selectedDistrict = useGameStore((s) => s.selectedDistrict);
  const activeView = useGameStore((s) => s.activeView);
  const setActiveView = useGameStore((s) => s.setActiveView);
  const progress = useGameStore((s) => s.progress);
  const district = selectedDistrict ? districtByKey[selectedDistrict] : null;
  const restored = selectedDistrict ? progress[selectedDistrict] === 100 : false;

  const title =
    restored && district
      ? `${district.label} restaurado!`
      : activeView === "mission" && district
        ? `Missão: ${district.label}`
        : district
          ? `Antes de entrar em ${district.label}...`
          : "Olá, explorador(a) das palavras!";

  const message =
    restored && district
      ? "Você completou reconhecer, explicar, aplicar e produzir. O mapa agora registra visualmente esse domínio."
      : activeView === "mission" && district
        ? district.purpose
        : district
          ? district.clue
          : genericMessage;

  return (
    <aside className="teacher-zone" aria-label="Professora-guia">
      <div className="teacher-image-wrap">
        <img
          src={teacherImage}
          alt="Professora-guia sorrindo e segurando um caderno"
          className="teacher-image"
        />
      </div>

      <div className="speech-card">
        <span className="speaker">PROFª FABRICIA · GUIA DA CIDADE</span>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="teacher-actions">
          <button
            type="button"
            onClick={() => {
              if (district) {
                useGameStore.getState().selectDistrict(district.key);
              }
            }}
          >
            💡 Dica
          </button>
          <button type="button" onClick={() => setActiveView("notebook")}>
            📓 Caderno
          </button>
        </div>
      </div>
    </aside>
  );
}
