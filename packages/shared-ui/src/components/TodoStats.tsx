export type TodoStatsProps = {
  total: number;
  active: number;
  completed: number;
  renders?: {
    list: number;
    items: number;
  };
  timing?: {
    lastMs: number;
    avgMs: number;
  };
};

export function TodoStats({
  total,
  active,
  completed,
  renders,
  timing
}: TodoStatsProps) {
  return (
    <div className="flex justify-between items-center px-4 py-3 space-y-1 font-mono text-xs text-gray-600 border border-red-500">
      <div>
        Number of tasks: {total} total • {active} active • {completed} done
      </div>

      {renders && (
        <div>
          Number of renders: list = {renders.list} • items = {renders.items}
        </div>
      )}

      {timing && (
        <div>
          Render time: last = {timing.lastMs.toFixed(2)}ms • avg =
          {timing.avgMs.toFixed(2)}ms
        </div>
      )}
    </div>
  );
}
