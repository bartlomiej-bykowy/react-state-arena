export type Subscriber<T> = (value: T) => void;

export function createSingal<T>(initialValue: T) {
  let value = initialValue;
  const subscribers = new Set<Subscriber<T>>();

  return {
    get() {
      return value;
    },

    set(newValue: T) {
      value = newValue;
      subscribers.forEach((sb) => sb(value));
    },

    subscribe(fn: Subscriber<T>) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    }
  };
}
