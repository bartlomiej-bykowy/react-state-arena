export function generateUUID() {
  return crypto?.randomUUID?.() ?? String(Date.now()) + Math.random();
}
