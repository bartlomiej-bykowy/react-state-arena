import { useDispatch } from "react-redux";
import type { TodoDispatch } from "../store/types";

// export function useTodoDispatch() {
//   return useDispatch.withTypes<TodoDispatch>()();
// }

export const useTodoDispatch = useDispatch.withTypes<TodoDispatch>();
