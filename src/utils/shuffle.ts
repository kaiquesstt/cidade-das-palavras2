/**
 * Devolve uma cópia embaralhada (Fisher–Yates), sem alterar o original.
 * Usado para que a resposta certa não fique sempre na mesma posição.
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
