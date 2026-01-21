import {
  highlightRenders,
  toggleHighlightRenders
} from "@packages/shared-core";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

type TodoOptionsProps = {
  onChange: Dispatch<SetStateAction<boolean>>;
  value: boolean;
};

export function TodoOptions({ onChange, value }: TodoOptionsProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex gap-x-4 items-center mb-4">
      <div className="flex gap-x-2 items-center">
        <label htmlFor="show-items-stats">Show per item stats</label>
        <input
          type="checkbox"
          id="show-items-stats"
          checked={value}
          onChange={handleChange}
        />
      </div>
      <div className="flex gap-x-2 items-center">
        <label htmlFor="highlight-renders">Highlight rendered items</label>
        <input
          type="checkbox"
          id="highlight-renders"
          defaultChecked={highlightRenders}
          onChange={(e) => toggleHighlightRenders(e.target.checked)}
        />
      </div>
    </div>
  );
}
