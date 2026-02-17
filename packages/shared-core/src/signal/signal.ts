import type { ScopeKey } from "../types";

export type Subscriber = () => void;

const scopes: ScopeKey[] = ["main", "context", "redux", "zustand"];

export function createSignal() {
  const subscribersMap = new Map<ScopeKey, Set<Subscriber>>(
    scopes.map((scopes) => [scopes, new Set<Subscriber>()])
  );

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

      return () => subscribers.delete(fn);
    }
  };
}
