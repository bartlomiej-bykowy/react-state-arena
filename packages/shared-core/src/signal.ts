// import type { ScopeKey } from "./types";

// export type Subscriber<T> = (value: T) => void;

// const scopes: ScopeKey[] = ["main", "context", "redux", "zustand"];

// export function createSignal<T>(initialValue: T) {
//   const valueMap = new Map<ScopeKey, T>(
//     scopes.map((scope) => [scope, initialValue])
//   );
//   const subscribersMap = new Map<ScopeKey, Set<Subscriber<T>>>(
//     scopes.map((scopes) => [scopes, new Set<Subscriber<T>>()])
//   );

//   const subscribersForScopeHasRan: { [K in ScopeKey]: boolean } = {
//     main: false,
//     context: false,
//     redux: false,
//     zustand: false
//   };

//   return {
//     get(scope: ScopeKey) {
//       return valueMap.get(scope)!;
//     },

//     set(scope: ScopeKey, newValue: T) {
//       const value = valueMap.get(scope)!;
//       if (Object.is(value, newValue)) return;

//       valueMap.set(scope, newValue);
//       const subscribers = subscribersMap.get(scope)!;
//       subscribers.forEach((fn) => {
//         fn(newValue);
//       });
//     },

//     delete(scope: ScopeKey) {
//       valueMap.delete(scope);
//       subscribersMap.delete(scope);
//     },

//     subscribe(scope: ScopeKey, fn: Subscriber<T>) {
//       const subscribers = subscribersMap.get(scope)!;
//       subscribers.add(fn);
//       // for cases when subscribe() happens after set().
//       // Typically on initial render.
//       if (!subscribersForScopeHasRan[scope]) {
//         const value = valueMap.get(scope)!;
//         subscribers.forEach((fn) => {
//           fn(value);
//         });
//         subscribersForScopeHasRan[scope] = true;
//       }
//       return () => subscribers.delete(fn);
//     }
//   };
// }

import type { ScopeKey } from "./types";

export type Subscriber = () => void;

const scopes: ScopeKey[] = ["main", "context", "redux", "zustand"];

export function createSignal() {
  const subscribersMap = new Map<ScopeKey, Set<Subscriber>>(
    scopes.map((scopes) => [scopes, new Set<Subscriber>()])
  );

  const subscribersForScopeHasRan: { [K in ScopeKey]: boolean } = {
    main: false,
    context: false,
    redux: false,
    zustand: false
  };

  return {
    runSubscribers(scope: ScopeKey) {
      const subscribers = subscribersMap.get(scope)!;
      subscribers.forEach((fn) => {
        fn();
      });
    },

    delete(scope: ScopeKey) {
      subscribersMap.delete(scope);
    },

    subscribe(scope: ScopeKey, fn: Subscriber) {
      const subscribers = subscribersMap.get(scope)!;
      subscribers.add(fn);
      // for cases when subscribe() happens after set().
      // Typically on initial render.
      if (!subscribersForScopeHasRan[scope]) {
        subscribers.forEach((fn) => {
          fn();
        });
        subscribersForScopeHasRan[scope] = true;
      }
      return () => subscribers.delete(fn);
    }
  };
}
