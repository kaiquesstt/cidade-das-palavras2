
import { useEffect, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { SettingsDialog } from "./SettingsDialog";

export function TopHUD() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  const playerName = useGameStore((s) => s.playerName);
  const xp = useGameStore((s) => s.xp);
  const level = useGameStore((s) => s.level);
  const achievements = useGameStore((s) => s.achievements);
  const setActiveView = useGameStore((s) => s.setActiveView);

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Alguns navegadores ou ambientes incorporados bloqueiam tela cheia.
      // O jogo continua funcionando normalmente sem ela.
    }
  }

  return (
    <>
      <header className="top-hud">
        <button
          type="button"
          className="brand-lockup"
          onClick={() => setActiveView("home")}
          aria-label="Voltar ao início"
        >
          <span className="brand-city">CIDADE</span>
          <span className="brand-words">DAS <b>PALAVRAS</b></span>
          <small>LER · PENSAR · ESCREVER · TRANSFORMAR</small>
        </button>

        <div className="player-hud" aria-label="Status do jogador">
          <div className="avatar" aria-hidden="true">✦</div>
          <div className="player-data">
            <span>{playerName.toUpperCase()}</span>
            <b>Nível {level}</b>
          </div>

          <div className="xp-meter" aria-label={`${xp} de 400 pontos de experiência`}>
            <i style={{ width: `${Math.min(100, (xp / 400) * 100)}%` }} />
            <span>{xp} / 400 XP</span>
          </div>

          <button
            type="button"
            className="hud-badge"
            title="Abrir conquistas"
            aria-label={`${achievements.length} conquistas desbloqueadas`}
            onClick={() => setActiveView("achievements")}
          >
            ★ {achievements.length}
          </button>

          <button
            type="button"
            className="hud-icon-button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia"}
            title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {isFullscreen ? "↙" : "⛶"}
          </button>

          <button
            type="button"
            className="hud-icon-button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Abrir configurações e acessibilidade"
            title="Configurações e acessibilidade"
          >
            ⚙
          </button>
        </div>
      </header>

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
