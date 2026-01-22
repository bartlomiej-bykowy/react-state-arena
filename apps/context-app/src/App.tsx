import "@packages/shared-ui/src/styles.css";
import { TodoProvider } from "./store/context";
import { ContextTodoList } from "./components/ContextTodoList";
import { initialTasks } from "@packages/shared-core";

export default function App() {
  return (
    <div className="p-4 bg-red-100 rounded border">
      <TodoProvider initialTasks={initialTasks}>
        <ContextTodoList />
      </TodoProvider>
    </div>
  );
}
