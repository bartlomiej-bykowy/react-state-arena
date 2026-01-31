import "@packages/shared-ui/src/styles.css";
import { ZustandTodoList } from "./components/ZustandTodoList";

export default function App() {
  return (
    <div className="p-4 bg-red-100 rounded border">
      <ZustandTodoList />
    </div>
  );
}
