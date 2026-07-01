export function updateById<T extends { id: string }>(
  list: T[],
  id: string,
  patch: Record<string, unknown>,
): T[] {
  return list.map((item) =>
    item.id === id ? ({ ...item, ...patch } as T) : item,
  );
}

export function updateNested<T extends Record<string, unknown>>(
  obj: T,
  patch: Partial<T>,
): T {
  return { ...obj, ...patch };
}
