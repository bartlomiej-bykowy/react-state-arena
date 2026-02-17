import {
  refreshUISignal,
  type ScopeKey,
  type Stats,
  useSignal
} from "@packages/shared-core";

export type TodoStatsProps = {
  total: number;
  active: number;
  completed: number;
  scope: ScopeKey;
  stats: { listStats?: Stats; itemsStats?: Stats };
};

export function TodoStats({
  total,
  active,
  completed,
  scope,
  stats
}: TodoStatsProps) {
  useSignal(scope, refreshUISignal);
  const { listStats, itemsStats } = stats;

  return (
    <div className="flex justify-between px-4 py-3 space-y-1 font-mono text-xs text-gray-600 border border-red-500">
      <div className="flex flex-col gap-y-2">
        <span>Number of tasks:</span>
        <ul>
          <li>total = {total}</li>
          <li>active = {active}</li>
          <li>done = {completed}</li>
        </ul>
      </div>

      <div className="flex flex-col gap-y-2">
        <span>Number of renders:</span>
        <ul>
          <li>list = {listStats?.renders}</li>
          <li>items = {itemsStats?.renders}</li>
        </ul>
      </div>

      <div className="flex flex-col gap-y-2">
        <span>List render time:</span>
        <ul>
          <li>last = {listStats?.timing.lastMs.toFixed(2)}ms</li>
          <li>total = {listStats?.timing.totalMs.toFixed(2)}ms</li>
        </ul>
      </div>

      <div className="flex flex-col gap-y-2">
        <span>Items render time:</span>
        <ul>
          <li>last = {itemsStats?.timing.lastMs.toFixed(2)}ms</li>
          <li>total = {itemsStats?.timing.totalMs.toFixed(2)}ms</li>
        </ul>
      </div>
    </div>
  );
}
