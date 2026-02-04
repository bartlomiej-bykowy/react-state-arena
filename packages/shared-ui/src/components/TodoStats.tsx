import {
  refreshUISignal,
  useSignal,
  type ScopeKey
} from "@packages/shared-core";
import { registry } from "@packages/shared-core/src/registry";
import { useLayoutEffect } from "react";

export type TodoStatsProps = {
  total: number;
  active: number;
  completed: number;
  scope: ScopeKey;
  resetLastRenderTotalTime: () => void;
};

export function TodoStats({
  total,
  active,
  completed,
  scope,
  resetLastRenderTotalTime
}: TodoStatsProps) {
  useSignal(scope, refreshUISignal);
  const listStats = registry.lists.get(scope)!;
  const itemsStats = registry.itemsTotal.get(scope)!;

  useLayoutEffect(() => {
    resetLastRenderTotalTime();
  });

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
          <li>list = {listStats.renders}</li>
          <li>items = {itemsStats.renders}</li>
          {/* <li>list = {listRenders}</li>
          <li>items = {itemsRenders}</li> */}
        </ul>
      </div>

      <div className="flex flex-col gap-y-2">
        <span>List render time:</span>
        <ul>
          <li>last = {listStats.timing.lastMs.toFixed(2)}ms</li>
          <li>total = {listStats.timing.totalMs.toFixed(2)}ms</li>
          {/* <li>last = {listTimings.lastMs.toFixed(2)}ms</li>
          <li>total = {listTimings.totalMs.toFixed(2)}ms</li> */}
        </ul>
      </div>

      <div className="flex flex-col gap-y-2">
        <span>Items render time:</span>
        <ul>
          <li>last = {itemsStats.timing.lastMs.toFixed(2)}ms</li>
          <li>total = {itemsStats.timing.totalMs.toFixed(2)}ms</li>
          {/* <li>last = {itemsTimings.lastMs.toFixed(2)}ms</li>
          <li>total = {itemsTimings.totalMs.toFixed(2)}ms</li> */}
        </ul>
      </div>
    </div>
  );
}
