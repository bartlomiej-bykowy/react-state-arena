import type { Filter } from "@packages/shared-core";
import type { ChangeEvent } from "react";

const filters: Filter[] = ["all", "active", "completed"];

export type TodoFiltersProps = {
  activeFilter: Filter;
  readonly?: boolean;
  onChange?: (filter: Filter) => void;
};

export function TodoFilters({
  activeFilter = "all",
  readonly,
  onChange
}: TodoFiltersProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (readonly) return;
    onChange?.(e.target.value as Filter);
  };

  return (
    <div className="flex items-center mb-4">
      <label
        htmlFor="task-type-select"
        className="flex items-center whitespace-nowrap"
      >
        Show tasks:
      </label>
      <select
        name="task-type-select"
        id="task-type-select"
        disabled={readonly}
        onChange={handleChange}
        value={activeFilter}
        className="px-3 py-2 ml-2 rounded-md border border-gray-400"
      >
        {filters.map((filter) => (
          <option value={filter} key={filter}>
            {filter}
          </option>
        ))}
      </select>
    </div>
  );
}
