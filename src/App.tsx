
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { BottomNav } from "./components/BottomNav";
import { TopHUD } from "./components/TopHUD";
import { AchievementsScreen } from "./screens/AchievementsScreen";
import { ChargeMissionScreen } from "./screens/ChargeMissionScreen";
import { FableMissionScreen } from "./screens/FableMissionScreen";
import { LegendMissionScreen } from "./screens/LegendMissionScreen";
import { StatuteMissionScreen } from "./screens/StatuteMissionScreen";
import { OpinionMissionScreen } from "./screens/OpinionMissionScreen";
import { ReaderLetterMissionScreen } from "./screens/ReaderLetterMissionScreen";
import { MinicontoMissionScreen } from "./screens/MinicontoMissionScreen";
import { FiguresMissionScreen } from "./screens/FiguresMissionScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { MapScreen } from "./screens/MapScreen";
import { MissionBriefing } from "./screens/MissionBriefing";
import { MissionsScreen } from "./screens/MissionsScreen";
import { NotebookScreen } from "./screens/NotebookScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { useGameStore } from "./store/useGameStore";

function CurrentScreen() {
  const activeView = useGameStore((s) => s.activeView);

  switch (activeView) {
    case "map":
      return <MapScreen />;
    case "missions":
      return <MissionsScreen />;
    case "achievements":
      return <AchievementsScreen />;
    case "notebook":
      return <NotebookScreen />;
    case "progress":
      return <ProgressScreen />;
    case "mission":
      return <MissionBriefing />;
    case "chargeMission":
      return <ChargeMissionScreen />;
    case "fableMission":
      return <FableMissionScreen />;
    case "legendMission":
      return <LegendMissionScreen />;
    case "statuteMission":
      return <StatuteMissionScreen />;
    case "opinionMission":
      return <OpinionMissionScreen />;
    case "readerLetterMission":
      return <ReaderLetterMissionScreen />;
    case "minicontoMission":
      return <MinicontoMissionScreen />;
    case "figuresMission":
      return <FiguresMissionScreen />;
    case "home":
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const activeView = useGameStore((s) => s.activeView);
  const reducedMotion = useGameStore((s) => s.reducedMotion);
  const fontScale = useGameStore((s) => s.fontScale);
  const highContrast = useGameStore((s) => s.highContrast);

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const context = gsap.context(() => {
      gsap.from(".app-view", {
        opacity: 0,
        y: 14,
        duration: 0.34,
        ease: "power2.out"
      });
    }, root);
    return () => context.revert();
  }, [activeView, reducedMotion]);

  return (
    <div
      className={`app-shell ${highContrast ? "high-contrast" : ""} ${reducedMotion ? "reduce-motion" : ""}`}
      ref={root}
      style={{ zoom: fontScale, width: `calc(100% / ${fontScale})` }}
    >
      <a className="skip-link" href="#game-content">
        Pular para o conteúdo
      </a>
      <TopHUD />
      <div id="game-content" className="app-view" key={activeView} tabIndex={-1}>
        <CurrentScreen />
      </div>
      {activeView !== "mission" && activeView !== "chargeMission" && activeView !== "fableMission" && activeView !== "legendMission" && activeView !== "statuteMission" && activeView !== "opinionMission" && activeView !== "readerLetterMission" && activeView !== "minicontoMission" && activeView !== "figuresMission" && <BottomNav />}
    </div>
  );
}
