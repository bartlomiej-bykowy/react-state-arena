import { useLayoutEffect, type RefObject } from "react";
import { highlightRenders } from "../todoOptions";

export function useHighlight(elRef: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    if (!elRef.current) return;
    if (!highlightRenders) return;

    elRef.current.classList.add("highlight");
    setTimeout(() => {
      elRef.current?.classList.remove("highlight");
    }, 300);
  });
}
