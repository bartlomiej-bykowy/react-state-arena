import { type Registry, registry, type Stats } from "../data/registry";

export function ensureRecordInRegistry(
  records: keyof Registry,
  recordKey: string
): Stats {
  let record = registry[records].get(recordKey);

  if (!record) {
    record = {
      renders: 0,
      timing: { lastMs: 0, totalMs: 0 }
    };
    registry[records].set(recordKey, record);
  }

  return record;
}
