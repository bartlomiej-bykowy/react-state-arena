import { useRef } from "react";

export function useItemRenderCount() {
  const renders = useRef(0);

  renders.current++;

  return renders.current;
}
