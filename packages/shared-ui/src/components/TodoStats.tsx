import {
  itemRendersSignal,
  listRendersSignal,
  useSignal
} from "@packages/shared-core";

export type TodoStatsProps = {
  total: number;
  active: number;
  completed: number;
  timing?: {
    lastMs: number;
    avgMs: number;
  };
};

export function TodoStats({
  total,
  active,
  completed,
  timing
}: TodoStatsProps) {
  const listRenders = useSignal(listRendersSignal);
  const itemRenders = useSignal(itemRendersSignal);

  return (
    <div className="flex justify-between items-center px-4 py-3 space-y-1 font-mono text-xs text-gray-600 border border-red-500">
      <div>
        Number of tasks: {total} total • {active} active • {completed} done
      </div>

      <div>
        Number of renders: list = {listRenders} • items = {itemRenders}
      </div>

      {timing && (
        <div>
          Render time: last = {timing.lastMs.toFixed(2)}ms • avg =
          {timing.avgMs.toFixed(2)}ms
        </div>
      )}
    </div>
  );
}
