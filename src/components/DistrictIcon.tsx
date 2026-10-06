import {
  ChartColumn,
  Mail,
  Megaphone,
  MessageCircleHeart,
  MoonStar,
  Newspaper,
  RadioTower,
  Sailboat,
  Scale,
  Turtle,
  type LucideIcon
} from "lucide-react";
import type { DistrictKey } from "../types";

/** Cada ícone repete o símbolo do prédio correspondente no mapa. */
const icons: Record<DistrictKey, LucideIcon> = {
  charge: Newspaper, // prédio do jornal
  fabula: Turtle, // clareira da raposa e da tartaruga
  lenda: MoonStar, // vila na neblina
  estatuto: Scale, // balança no prédio público
  artigo: Megaphone, // tribuna com megafone
  carta: Mail, // correio
  miniconto: Sailboat, // barco-biblioteca
  figuras: MessageCircleHeart, // praça dos balões de fala
  rede: RadioTower, // torre central
  dados: ChartColumn // observatório dos gráficos
};

interface DistrictIconProps {
  district: DistrictKey;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function DistrictIcon({
  district,
  size = 20,
  strokeWidth = 2.2,
  className
}: DistrictIconProps) {
  const Icon = icons[district];
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
      focusable="false"
    />
  );
}
