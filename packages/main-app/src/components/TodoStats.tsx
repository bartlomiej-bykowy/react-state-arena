import {
  itemRendersSignal,
  itemTimingSignal,
  listRendersSignal,
  listTimingSignal,
  useSignal
} from "@packages/shared-core";

export type TodoStatsProps = {
  total: number;
  active: number;
  completed: number;
};

export function TodoStats({ total, active, completed }: TodoStatsProps) {
  const listRenders = useSignal(listRendersSignal);
  const listTiming = useSignal(listTimingSignal);
  const itemRenders = useSignal(itemRendersSignal);
  const itemTiming = useSignal(itemTimingSignal);

  return (
    <div className="flex justify-between items-center px-4 py-3 space-y-1 font-mono text-xs text-gray-600 border border-red-500">
      <div>
        Number of tasks: total = {total} • active = {active} • done ={" "}
        {completed}
      </div>

      <div>
        Number of renders: list = {listRenders} • items = {itemRenders}
      </div>

      <div>
        List render time: last = {listTiming.lastMs.toFixed(2)}ms • total ={" "}
        {listTiming.totalMs.toFixed(2)}ms
      </div>

      <div>
        Items render time: last = {itemTiming.lastMs.toFixed(2)}ms • total ={" "}
        {itemTiming.totalMs.toFixed(2)}ms
      </div>
      {/* {timing && (
        <div>
          Render time: last = {timing.lastMs.toFixed(2)}ms • avg =
          {timing.avgMs.toFixed(2)}ms
        </div>
      )} */}
    </div>
  );
}
