import { useCallback, useRef } from "react";

export function useRenderCounter() {
  const listRendersRef = useRef(0);
  const itemRendersRef = useRef(0);

  const incrementListRenders = useCallback(() => listRendersRef.current++, []);
  const incrementItemRenders = useCallback(() => {
    itemRendersRef.current++;
  }, []);
  const reset = useCallback(() => {
    listRendersRef.current = 0;
    itemRendersRef.current = 0;
  }, []);

  return {
    get listRenders() {
      return listRendersRef.current;
    },
    get itemRenders() {
      return itemRendersRef.current;
    },
    incrementListRenders,
    incrementItemRenders,
    reset
  };
}
