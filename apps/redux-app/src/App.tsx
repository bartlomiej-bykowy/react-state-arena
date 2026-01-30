import "@packages/shared-ui/src/styles.css";
import { Provider } from "react-redux";
import { ReduxTodoList } from "./components/ReduxTodoList";
import { store } from "./store/store";

export default function App() {
  return (
    <Provider store={store}>
      <ReduxTodoList />
    </Provider>
  );
}
