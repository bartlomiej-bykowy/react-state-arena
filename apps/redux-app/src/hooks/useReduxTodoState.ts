import {
  selectFilteredTasks,
  selectItemStatsSetting,
  selectTodosStats
} from "../store/selectors";
import { useTodoSelector } from "./useTodoSelector";

export function useReduxTodoState() {
  const filteredTasks = useTodoSelector(selectFilteredTasks);
  const stats = useTodoSelector(selectTodosStats);
  const showStatsPerItem = useTodoSelector(selectItemStatsSetting);

  return {
    filteredTasks,
    stats,
    showStatsPerItem
  };
}
