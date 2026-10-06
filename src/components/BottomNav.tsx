
import type { ViewKey } from "../types";
import { useGameStore } from "../store/useGameStore";

const items: Array<{ key: ViewKey; icon: string; label: string }> = [
  { key: "home", icon: "⌂", label: "Início" },
  { key: "map", icon: "◇", label: "Mapa" },
  { key: "missions", icon: "✓", label: "Missões" },
  { key: "achievements", icon: "★", label: "Conquistas" },
  { key: "notebook", icon: "▣", label: "Caderno" },
  { key: "progress", icon: "▥", label: "Progresso" }
];

export function BottomNav() {
  const activeView = useGameStore((s) => s.activeView);
  const setActiveView = useGameStore((s) => s.setActiveView);

  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={activeView === item.key ? "active" : ""}
          onClick={() => setActiveView(item.key)}
        >
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
