export type Subscriber = (value: number) => void;

export function createSingal(initialValue: number) {
  let value = initialValue;
  const subscribers = new Set<Subscriber>();
  let subscribersHasRan = false;

  return {
    get() {
      return value;
    },

    set(newValue: number) {
      value = newValue;
      subscribers.forEach((fn) => fn(value));
    },

    increment() {
      value += 1;
      subscribers.forEach((fn) => fn(value));
    },

    subscribe(fn: Subscriber) {
      subscribers.add(fn);
      // for cases when subscribe() happens after increment() or set().
      // Typically on initial render
      if (!subscribersHasRan) {
        subscribers.forEach((fn) => fn(value));
        subscribersHasRan = true;
      }
      return () => subscribers.delete(fn);
    }
  };
}
