/** Keeps Ivan Uzunov first wherever an expert list is rendered. */
export function ivanFirst<T extends { id: string }>(
  baseComparator?: (a: T, b: T) => number,
) {
  return (a: T, b: T) => {
    if (a.id === 'ivan-uzunov') return -1;
    if (b.id === 'ivan-uzunov') return 1;
    return baseComparator ? baseComparator(a, b) : 0;
  };
}
