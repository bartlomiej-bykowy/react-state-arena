import "@packages/shared-ui/src/styles.css";
import { initialTasks } from "@packages/shared-core";
import { ContextTodoList } from "./components/ContextTodoList";
import { TodoProvider } from "./store/context";

export default function App() {
  return (
    <div className="p-4 bg-red-100 rounded border">
      <TodoProvider initialTasks={initialTasks}>
        <ContextTodoList />
      </TodoProvider>
    </div>
  );
}
