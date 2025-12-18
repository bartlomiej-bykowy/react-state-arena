import { useEffect, useState } from "react";
import type { Subscriber } from "../signal";

type Signal = {
  get(): number;
  subscribe(fn: Subscriber): () => void;
};

export function useSignal(signal: Signal) {
  const [value, setValue] = useState(signal.get());

  useEffect(() => {
    return signal.subscribe(setValue);
  }, [signal]);

  return value;
}
