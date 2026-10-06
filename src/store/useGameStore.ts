
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DistrictKey, MasteryStage, ViewKey } from "../types";

type ProgressMap = Record<DistrictKey, number>;
type MasteryMap = Record<DistrictKey, Record<MasteryStage, boolean>>;

interface GameState {
  playerName: string;
  xp: number;
  level: number;
  achievements: string[];
  activeView: ViewKey;
  selectedDistrict: DistrictKey | null;
  progress: ProgressMap;
  mastery: MasteryMap;
  reducedMotion: boolean;
  soundEnabled: boolean;
  fontScale: number;
  highContrast: boolean;
  recentlyRestored: DistrictKey | null;
  setActiveView: (view: ViewKey) => void;
  selectDistrict: (key: DistrictKey | null) => void;
  enterMissionBriefing: (key: DistrictKey) => void;
  setPlayerName: (name: string) => void;
  toggleReducedMotion: () => void;
  toggleSound: () => void;
  setFontScale: (value: number) => void;
  toggleHighContrast: () => void;
  clearRecentlyRestored: () => void;
  markStage: (district: DistrictKey, stage: MasteryStage) => void;
  addAchievement: (achievement: string) => void;
  resetDemo: () => void;
}

const initialProgress: ProgressMap = {
  charge: 0,
  fabula: 0,
  lenda: 0,
  estatuto: 0,
  artigo: 0,
  carta: 0,
  miniconto: 0,
  figuras: 0,
  rede: 0,
  dados: 0
};

const initialMastery: MasteryMap = {
  charge: { recognize: false, explain: false, apply: false, produce: false },
  fabula: { recognize: false, explain: false, apply: false, produce: false },
  lenda: { recognize: false, explain: false, apply: false, produce: false },
  estatuto: { recognize: false, explain: false, apply: false, produce: false },
  artigo: { recognize: false, explain: false, apply: false, produce: false },
  carta: { recognize: false, explain: false, apply: false, produce: false },
  miniconto: { recognize: false, explain: false, apply: false, produce: false },
  figuras: { recognize: false, explain: false, apply: false, produce: false },
  rede: { recognize: false, explain: false, apply: false, produce: false },
  dados: { recognize: false, explain: false, apply: false, produce: false }
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      playerName: "Explorador(a)",
      xp: 0,
      level: 1,
      achievements: [],
      activeView: "home",
      selectedDistrict: null,
      progress: initialProgress,
      mastery: initialMastery,
      reducedMotion: false,
      soundEnabled: true,
      fontScale: 1,
      highContrast: false,
      recentlyRestored: null,

      setActiveView: (activeView) => set({ activeView }),
      selectDistrict: (selectedDistrict) => set({ selectedDistrict }),
      enterMissionBriefing: (selectedDistrict) =>
        set({ selectedDistrict, activeView: "mission" }),
      setPlayerName: (playerName) => set({ playerName }),
      toggleReducedMotion: () =>
        set((state) => ({ reducedMotion: !state.reducedMotion })),
      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),

      setFontScale: (value) =>
        set({ fontScale: Math.max(0.9, Math.min(1.5, value)) }),

      toggleHighContrast: () =>
        set((state) => ({ highContrast: !state.highContrast })),

      clearRecentlyRestored: () => set({ recentlyRestored: null }),

      markStage: (district, stage) => {
        const current = get().mastery;
        if (current[district][stage]) return;

        const updated = {
          ...current,
          [district]: { ...current[district], [stage]: true }
        };

        const stageOrder: MasteryStage[] = [
          "recognize",
          "explain",
          "apply",
          "produce"
        ];
        const count = stageOrder.filter((item) => updated[district][item]).length;

        set((state) => {
          const nextProgress = {
            ...state.progress,
            [district]: count * 25
          };

          const rawXP = state.xp + 25;
          const leveledUp = rawXP >= 400;
          const nextAchievements = [...state.achievements];

          const unlock = (name: string) => {
            if (!nextAchievements.includes(name)) {
              nextAchievements.push(name);
            }
          };

          if (stage === "recognize") unlock("Primeira pista");
          if (stage === "explain") unlock("Leitor atento");

          const startedDistricts = Object.values(nextProgress).filter(
            (value) => value > 0
          ).length;
          if (startedDistricts >= 2) unlock("Investigador");

          return {
            mastery: updated,
            progress: nextProgress,
            achievements: nextAchievements,
            xp: leveledUp ? rawXP - 400 : rawXP,
            level: leveledUp ? state.level + 1 : state.level,
            recentlyRestored:
              count === 4 ? district : state.recentlyRestored
          };
        });
      },

      addAchievement: (achievement) =>
        set((state) => ({
          achievements: state.achievements.includes(achievement)
            ? state.achievements
            : [...state.achievements, achievement]
        })),

      resetDemo: () =>
        set((state) => ({
          playerName: "Explorador(a)",
          xp: 0,
          level: 1,
          achievements: [],
          activeView: "home",
          selectedDistrict: null,
          progress: initialProgress,
          mastery: initialMastery,
          reducedMotion: state.reducedMotion,
          soundEnabled: state.soundEnabled,
          fontScale: state.fontScale,
          highContrast: state.highContrast,
          recentlyRestored: null
        }))
    }),
    {
      // Nome próprio: a versão antiga (mesmo domínio github.io) usa "cidade-das-palavras-v9".
      // Nomes diferentes evitam que as duas versões misturem o progresso salvo.
      name: "cidade-das-palavras-v2",
      // V17 acrescenta os bairros Rede e Dados. Eles entram em 0% porque
      // initialProgress/initialMastery são espalhados antes do estado salvo.
      version: 17,
      migrate: (persistedState: unknown, version) => {
        const state = persistedState as Partial<GameState>;
        const progress = {
          ...initialProgress,
          ...(state.progress ?? {})
        };
        const mastery = {
          ...initialMastery,
          ...(state.mastery ?? {})
        };

        if (version < 10) {
          progress.lenda = 0;
          mastery.lenda = initialMastery.lenda;
        }

        if (version < 11) {
          progress.estatuto = 0;
          mastery.estatuto = initialMastery.estatuto;
        }

        if (version < 12) {
          progress.artigo = 0;
          mastery.artigo = initialMastery.artigo;
        }

        if (version < 13) {
          progress.carta = 0;
          mastery.carta = initialMastery.carta;
        }

        if (version < 14) {
          progress.miniconto = 0;
          mastery.miniconto = initialMastery.miniconto;
        }

        // V15 introduz a missão real de Figuras de Linguagem.
        // O antigo 50% era apenas progresso demonstrativo.
        if (version < 15) {
          progress.figuras = 0;
          mastery.figuras = initialMastery.figuras;
        }


        // V16 transforma o protótipo em versão de aplicação.
        // Se o navegador ainda tiver exatamente o estado inicial de
        // demonstração (sem nenhuma habilidade concluída), remove XP,
        // nível e selos fictícios. Progresso real é preservado.
        const noRealMastery = Object.values(mastery).every((districtStages) =>
          Object.values(districtStages).every((done) => !done)
        );

        const hadDemoIdentity =
          version < 16 &&
          noRealMastery &&
          state.xp === 220 &&
          state.level === 3;

        const normalizedXP = hadDemoIdentity ? 0 : (state.xp ?? 0);
        const normalizedLevel = hadDemoIdentity ? 1 : (state.level ?? 1);
        const normalizedAchievements = hadDemoIdentity
          ? []
          : (state.achievements ?? []);

        const clearRestored =
          (version < 10 && state.recentlyRestored === "lenda") ||
          (version < 11 && state.recentlyRestored === "estatuto") ||
          (version < 12 && state.recentlyRestored === "artigo") ||
          (version < 13 && state.recentlyRestored === "carta") ||
          (version < 14 && state.recentlyRestored === "miniconto") ||
          (version < 15 && state.recentlyRestored === "figuras");

        return {
          ...state,
          xp: normalizedXP,
          level: normalizedLevel,
          achievements: normalizedAchievements,
          progress,
          mastery,
          recentlyRestored: clearRestored
            ? null
            : (state.recentlyRestored ?? null)
        } as GameState;
      }
    }
  )
);
