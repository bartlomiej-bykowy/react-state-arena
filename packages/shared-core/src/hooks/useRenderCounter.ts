import { useCallback, useRef } from "react";
import { itemRendersSignal, listRendersSignal } from "../metrics";

export function useRenderCounter() {
  const listRendersRef = useRef(listRendersSignal.get());
  const itemRendersRef = useRef<Map<string, number>>(new Map());

  const incrementListRenders = useCallback(() => {
    listRendersRef.current++;
    listRendersSignal.set(listRendersRef.current);
  }, []);

  const incrementItemRenders = useCallback((id: string) => {
    const map = itemRendersRef.current;
    const currVal = map.get(id) ?? 0;
    map.set(id, currVal + 1);

    let total = 0;
    for (const count of map.values()) {
      total += count;
    }

    itemRendersSignal.set(total);
  }, []);

  const reset = useCallback(() => {
    listRendersRef.current = 0;
    itemRendersRef.current.clear();
    listRendersSignal.set(0);
    itemRendersSignal.set(0);
  }, []);

  return {
    incrementListRenders,
    incrementItemRenders,
    reset
  };
}
