import { type RefObject, useLayoutEffect, useRef } from "react";
import { highlightRenders } from "../todoOptions";

export function useHighlight(elRef: RefObject<HTMLElement | null>) {
  const cancelledRef = useRef(false);

  useLayoutEffect(() => {
    if (!elRef.current) return;
    if (!highlightRenders) return;
    cancelledRef.current = false;

    elRef.current.classList.add("highlight");
    const timeout = setTimeout(() => {
      if (cancelledRef.current) return;
      elRef.current?.classList.remove("highlight");
    }, 300);

    return () => {
      cancelledRef.current = true;
      clearTimeout(timeout);
    };
  });
}
