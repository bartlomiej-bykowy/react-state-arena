import { useRef, type FormEvent } from "react";

export type TodoAddItemProps = {
  onSave?: (content: string) => void;
};

export function TodoAddItem({ onSave }: TodoAddItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputValue = inputRef?.current?.value || "";
    if (inputValue.trim() === "") return;
    onSave?.(inputValue);
    form.reset();
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="text-xs">
      <label htmlFor="new-task-input" className="mb-2 text-gray-600 sr-only">
        Enter a new task
      </label>
      <div className="flex gap-x-6 items-center w-full">
        <input
          type="text"
          id="new-task-input"
          name="new-task-input"
          placeholder="Enter task name"
          className="flex-1 px-3 py-2 rounded-md border border-gray-400"
          ref={inputRef}
        />
        <button
          type="submit"
          className="px-3 py-2 text-white bg-blue-700 rounded-md cursor-pointer"
        >
          Add task
        </button>
      </div>
    </form>
  );
}
