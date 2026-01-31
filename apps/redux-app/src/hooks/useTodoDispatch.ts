import { useDispatch } from "react-redux";
import type { TodoDispatch } from "../store/types";

export const useTodoDispatch = useDispatch.withTypes<TodoDispatch>();
