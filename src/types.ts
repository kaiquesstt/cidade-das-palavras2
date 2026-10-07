export type DistrictKey =
  | "charge"
  | "fabula"
  | "lenda"
  | "estatuto"
  | "artigo"
  | "carta"
  | "miniconto"
  | "figuras"
  | "rede"
  | "dados";

export type ViewKey =
  | "home"
  | "map"
  | "missions"
  | "achievements"
  | "notebook"
  | "progress"
  | "mission"
  | "chargeMission"
  | "fableMission"
  | "legendMission"
  | "statuteMission"
  | "opinionMission"
  | "readerLetterMission"
  | "minicontoMission"
  | "figuresMission"
  | "redeMission"
  | "dadosMission";

export type MasteryStage = "recognize" | "explain" | "apply" | "produce";

export interface District {
  key: DistrictKey;
  label: string;
  shortLabel: string;
  color: string;
  x: number;
  y: number;
  note: string;
  purpose: string;
  clue: string;
  contrast: string;
  icon: string;
  /** false enquanto o bairro ainda não tem missão jogável. */
  hasMission?: boolean;
}
