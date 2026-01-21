import { useEffect, useState } from "react";
import type { Subscriber } from "../signal";

type Signal<T> = {
  get(): T;
  subscribe(fn: Subscriber<T>): () => void;
};

export function useSignal<T>(signal: Signal<T>) {
  const [value, setValue] = useState(() => signal.get());

  useEffect(() => {
    return signal.subscribe(setValue);
  }, [signal]);

  return value;
}
