import type { ChangeEvent, Dispatch, SetStateAction } from "react";

type TodoItemStatsToggleProps = {
  onChange: Dispatch<SetStateAction<boolean>>;
  value: boolean;
};

export function TodoItemStatsToggle({
  onChange,
  value
}: TodoItemStatsToggleProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex gap-x-2 items-center mb-4">
      <label htmlFor="show-items-stats">Show per item stats</label>
      <input
        type="checkbox"
        id="show-items-stats"
        checked={value}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
}
