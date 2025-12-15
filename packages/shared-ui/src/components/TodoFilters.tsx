import type { ChangeEvent } from "react";
import type { Filter } from "../..";

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
    <div className="flex ml-6 text-white item-center">
      <label htmlFor="task-type-select" className="flex items-center">
        Show tasks:
      </label>
      <select
        name="task-type-select"
        id="task-type-select"
        disabled={readonly}
        onChange={(e) => handleChange(e)}
        value={activeFilter}
        className="px-3 py-2 ml-2 rounded-md border border-white"
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
