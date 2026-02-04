// import { useEffect, useState } from "react";
// import type { Subscriber } from "../signal";
// import type { ScopeKey } from "../types";

// type Signal<T> = {
//   get(scope: ScopeKey): T;
//   subscribe(scope: ScopeKey, fn: Subscriber<T>): () => void;
// };

// export function useSignal<T>(scope: ScopeKey, signal: Signal<T>) {
//   const [value, setValue] = useState(() => signal.get(scope));

//   useEffect(() => {
//     return signal.subscribe(scope, setValue);
//   }, [scope, signal]);

//   return value;
// }
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
