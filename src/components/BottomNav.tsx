
import { ChartNoAxesColumn, House, ListChecks, Map as MapIcon, NotebookPen, Trophy, type LucideIcon } from "lucide-react";
import type { ViewKey } from "../types";
import { useGameStore } from "../store/useGameStore";

const items: Array<{ key: ViewKey; icon: LucideIcon; label: string }> = [
  { key: "home", icon: House, label: "Início" },
  { key: "map", icon: MapIcon, label: "Mapa" },
  { key: "missions", icon: ListChecks, label: "Missões" },
  { key: "achievements", icon: Trophy, label: "Conquistas" },
  { key: "notebook", icon: NotebookPen, label: "Caderno" },
  { key: "progress", icon: ChartNoAxesColumn, label: "Progresso" }
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
          <span className="nav-icon" aria-hidden="true">
            <item.icon size={22} strokeWidth={2.1} />
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
