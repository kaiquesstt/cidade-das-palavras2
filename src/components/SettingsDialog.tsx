
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useGameStore } from "../store/useGameStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  const playerName = useGameStore((s) => s.playerName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const reducedMotion = useGameStore((s) => s.reducedMotion);
  const toggleReducedMotion = useGameStore((s) => s.toggleReducedMotion);
  const fontScale = useGameStore((s) => s.fontScale);
  const setFontScale = useGameStore((s) => s.setFontScale);
  const highContrast = useGameStore((s) => s.highContrast);
  const toggleHighContrast = useGameStore((s) => s.toggleHighContrast);
  const resetDemo = useGameStore((s) => s.resetDemo);

  useEffect(() => {
    if (!open) {
      setConfirmReset(false);
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">SESSÃO E ACESSIBILIDADE</span>
            <h2 id="settings-title">Configurações</h2>
          </div>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Fechar configurações"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <label className="setting-row setting-name">
          <span>
            <b>Nome do explorador</b>
            <small>Ajuda a identificar o progresso neste computador.</small>
          </span>
          <input
            type="text"
            value={playerName === "Explorador(a)" ? "" : playerName}
            maxLength={28}
            placeholder="Digite o nome"
            onChange={(event) =>
              setPlayerName(event.target.value.trimStart() || "Explorador(a)")
            }
          />
        </label>

        <div className="setting-row setting-font-size">
          <span>
            <b>Tamanho da interface</b>
            <small>Amplia textos, botões e áreas clicáveis em todo o jogo.</small>
          </span>
          <div className="settings-font-controls">
            <button
              type="button"
              aria-label="Diminuir interface"
              onClick={() =>
                setFontScale(Math.max(0.9, +(fontScale - 0.1).toFixed(2)))
              }
            >
              A−
            </button>
            <output aria-live="polite">
              {Math.round(fontScale * 100)}%
            </output>
            <button
              type="button"
              aria-label="Aumentar interface"
              onClick={() =>
                setFontScale(Math.min(1.5, +(fontScale + 0.1).toFixed(2)))
              }
            >
              A+
            </button>
          </div>
        </div>

        <label className="setting-row">
          <span>
            <b>Alto contraste</b>
            <small>Reforça textos, bordas e indicação de foco.</small>
          </span>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={toggleHighContrast}
          />
        </label>

        <label className="setting-row">
          <span>
            <b>Reduzir animações</b>
            <small>Desativa transições e movimentos decorativos do jogo.</small>
          </span>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={toggleReducedMotion}
          />
        </label>

        <div className="settings-save-note" role="note">
          <span aria-hidden="true"><Check size={18} strokeWidth={3} /></span>
          <div>
            <b>Progresso salvo automaticamente</b>
            <small>
              O progresso fica neste navegador e neste dispositivo.
            </small>
          </div>
        </div>

        {!confirmReset ? (
          <button
            type="button"
            className="secondary-action danger-action"
            onClick={() => setConfirmReset(true)}
          >
            Iniciar uma nova sessão de aluno
          </button>
        ) : (
          <div className="reset-confirmation" role="alert">
            <p>
              Isso apagará XP, conquistas e progresso de todos os distritos neste
              navegador. As configurações de acessibilidade serão mantidas.
            </p>
            <div>
              <button
                type="button"
                className="secondary-action"
                onClick={() => setConfirmReset(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="secondary-action danger-action"
                onClick={() => {
                  resetDemo();
                  onClose();
                }}
              >
                Sim, iniciar nova sessão
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
