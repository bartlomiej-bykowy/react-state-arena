export type Subscriber<T> = (value: T) => void;

export function createSignal<T>(initialValue: T) {
  let value = initialValue;
  const subscribers = new Set<Subscriber<T>>();
  let subscribersHasRan = false;

  return {
    get() {
      return value;
    },

    set(newValue: T) {
      value = newValue;
      subscribers.forEach((fn) => {
        fn(value);
      });
    },

    subscribe(fn: Subscriber<T>) {
      subscribers.add(fn);
      // for cases when subscribe() happens after increment() or set().
      // Typically on initial render
      if (!subscribersHasRan) {
        subscribers.forEach((fn) => {
          fn(value);
        });
        subscribersHasRan = true;
      }
      return () => subscribers.delete(fn);
    }
  };
}
