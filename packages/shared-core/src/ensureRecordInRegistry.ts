import { registry, type Stats, type Registry } from "./registry";

export function ensureRecordInRegistry(
  records: keyof Registry,
  recordKey: string
): Stats {
  const record = registry[records].get(recordKey) ?? {
    renders: 0,
    timing: { lastMs: 0, totalMs: 0 }
  };
  registry[records].set(recordKey, record);

  return record;
}
