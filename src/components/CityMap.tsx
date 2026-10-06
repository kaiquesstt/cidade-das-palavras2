
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import cityMap from "../assets/city-map.webp";
import { districts } from "../data/districts";
import { useGameStore } from "../store/useGameStore";

export function CityMap() {
  const root = useRef<HTMLDivElement>(null);
  const [showLabels, setShowLabels] = useState(false);
  const selected = useGameStore((s) => s.selectedDistrict);
  const selectDistrict = useGameStore((s) => s.selectDistrict);
  const progress = useGameStore((s) => s.progress);
  const reducedMotion = useGameStore((s) => s.reducedMotion);
  const recentlyRestored = useGameStore((s) => s.recentlyRestored);
  const clearRecentlyRestored = useGameStore((s) => s.clearRecentlyRestored);

  useEffect(() => {
    if (!recentlyRestored) return;
    const timer = window.setTimeout(clearRecentlyRestored, 4200);
    return () => window.clearTimeout(timer);
  }, [recentlyRestored, clearRecentlyRestored]);

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const context = gsap.context(() => {
      gsap.from(".map-art", {
        opacity: 0,
        scale: 1.035,
        duration: 0.8,
        ease: "power2.out"
      });
      gsap.from(".district-pin", {
        opacity: 0,
        scale: 0.6,
        stagger: 0.045,
        duration: 0.35,
        delay: 0.25,
        ease: "back.out(1.7)"
      });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div className={`map-stage ${showLabels ? "show-labels" : ""}`} ref={root}>
      <img className="map-art" src={cityMap} alt="" />
      <button
        type="button"
        className="map-label-toggle"
        aria-pressed={showLabels}
        onClick={() => setShowLabels((value) => !value)}
      >
        <span aria-hidden="true">Aa</span>
        {showLabels ? "Ocultar nomes" : "Mostrar nomes"}
      </button>
      <div className="map-vignette" aria-hidden="true" />

      {districts.map((district) => {
        const isSelected = selected === district.key;
        const isRestored = progress[district.key] === 100;
        const isNewlyRestored = recentlyRestored === district.key;
        return (
          <button
            key={district.key}
            type="button"
            className={`district-pin ${isSelected ? "selected" : ""} ${isRestored ? "restored" : ""} ${isNewlyRestored ? "newly-restored" : ""}`}
            style={{
              left: `${district.x}%`,
              top: `${district.y}%`,
              "--district-color": district.color
            } as React.CSSProperties}
            aria-pressed={isSelected}
            aria-label={`${district.label}, ${progress[district.key]}% de domínio`}
            onClick={() => selectDistrict(district.key)}
          >
            <span className="pin-core" aria-hidden="true">
              <span>{district.icon}</span>
            </span>
            <span className="pin-label">
              <strong>{district.shortLabel}</strong>
              <small>{district.note}</small>
              <span className="pin-progress" aria-hidden="true">
                <i style={{ width: `${progress[district.key]}%` }} />
              </span>
              <em>{isRestored ? "RESTAURADO" : `${progress[district.key]}%`}</em>
            </span>
            {isRestored && <span className="restored-star" aria-hidden="true">★</span>}
          </button>
        );
      })}

      {recentlyRestored && (
        <div className="restoration-toast" role="status" aria-live="polite">
          <span>✨</span>
          <div>
            <b>{districts.find((item) => item.key === recentlyRestored)?.label} restaurado!</b>
            <small>Seu domínio completo devolveu luz a este distrito.</small>
          </div>
        </div>
      )}
    </div>
  );
}
