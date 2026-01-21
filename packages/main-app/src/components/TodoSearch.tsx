import { useRef, type ChangeEvent } from "react";

export type TodoSearchProps = {
  readonly?: boolean;
  onSearch?: (value: string) => void;
};

export function TodoSearch({ readonly, onSearch }: TodoSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (readonly) return;
    onSearch?.(e.target.value);
  };

  return (
    <form
      className="overflow-hidden relative mb-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="task-search-input" className="sr-only">
        Search for a task
      </label>
      <input
        type="text"
        id="task-search-input"
        name="task-search-input"
        onChange={handleSearch}
        placeholder="Search tasks..."
        disabled={readonly}
        className="py-2 pr-12 pl-3 rounded-md border border-gray-400 focus:border-purple-600"
        ref={inputRef}
      />
      <span className="flex absolute top-0 right-0 justify-center items-center w-8 h-8 bg-transparent">
        🔎
      </span>
    </form>
  );
}
