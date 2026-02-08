import {
  highlightRenders,
  measuringEnabled,
  setHighlightRenders,
  setMeasuringEnabled
} from "@packages/shared-core";

type TodoOptionsProps = {
  onStatsVisibilityChange: (val: boolean) => void;
  statsVisible: boolean;
  onCapEnabledChange: (val: boolean) => void;
  capEnabled: boolean;
};

export function TodoOptions({
  onStatsVisibilityChange,
  statsVisible,
  onCapEnabledChange,
  capEnabled
}: TodoOptionsProps) {
  return (
    <div className="flex gap-x-4 items-center mb-4 w-full">
      <div className="flex gap-x-2 items-center">
        <label htmlFor="enable-measurments">Enable measurments</label>
        <input
          type="checkbox"
          id="enable-measurments"
          defaultChecked={measuringEnabled}
          onChange={(e) => setMeasuringEnabled(e.target.checked)}
        />
      </div>
      <div className="flex gap-x-2 items-center">
        <label htmlFor="show-items-stats">Show per item stats</label>
        <input
          type="checkbox"
          id="show-items-stats"
          checked={statsVisible}
          onChange={(e) => onStatsVisibilityChange(e.target.checked)}
        />
      </div>
      <div className="flex gap-x-2 items-center">
        <label htmlFor="highlight-renders">Highlight rendered items</label>
        <input
          type="checkbox"
          id="highlight-renders"
          defaultChecked={highlightRenders}
          onChange={(e) => setHighlightRenders(e.target.checked)}
        />
      </div>
      <div className="flex gap-x-2 items-center">
        <label htmlFor="enable-tasks-cap">Set limit of rendered tasks</label>
        <input
          type="checkbox"
          id="enable-tasks-cap"
          defaultChecked={capEnabled}
          onChange={(e) => onCapEnabledChange(e.target.checked)}
        />
      </div>
    </div>
  );
}
