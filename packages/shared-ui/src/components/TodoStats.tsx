import {
  itemRendersSignal,
  itemTimingSignal,
  listRendersSignal,
  listTimingSignal,
  useSignal,
  type ScopeKey
} from "@packages/shared-core";

export type TodoStatsProps = {
  total: number;
  active: number;
  completed: number;
  scope: ScopeKey;
};

export function TodoStats({ total, active, completed, scope }: TodoStatsProps) {
  const listRenders = useSignal(scope, listRendersSignal);
  const listTiming = useSignal(scope, listTimingSignal);
  const itemRenders = useSignal(scope, itemRendersSignal);
  const itemTiming = useSignal(scope, itemTimingSignal);

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
          <li>list = {listRenders}</li>
          <li>items = {itemRenders}</li>
        </ul>
      </div>

      <div className="flex flex-col gap-y-2">
        <span>List render time:</span>
        <ul>
          <li>last = {listTiming.lastMs.toFixed(2)}ms</li>
          <li>total = {listTiming.totalMs.toFixed(2)}ms</li>
        </ul>
      </div>

      <div className="flex flex-col gap-y-2">
        <span>Items render time:</span>
        <ul>
          <li>last = {itemTiming.lastMs.toFixed(2)}ms</li>
          <li>total = {itemTiming.totalMs.toFixed(2)}ms</li>
        </ul>
      </div>
    </div>
  );
}
