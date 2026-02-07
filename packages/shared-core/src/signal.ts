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
