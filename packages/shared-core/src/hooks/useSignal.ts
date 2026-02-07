import { useEffect, useState } from "react";
import type { Subscriber } from "../signal";
import type { ScopeKey } from "../types";

type Signal = {
  subscribe(scope: ScopeKey, fn: Subscriber): () => void;
};

export function useSignal(scope: ScopeKey, signal: Signal) {
  const [_, setValue] = useState(Date.now());

  useEffect(() => {
    return signal.subscribe(scope, () => setValue(Date.now()));
  }, [scope, signal]);
}
