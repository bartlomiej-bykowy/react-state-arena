import "@packages/shared-ui/src/styles.css";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root")!);
// App is not running in the StrictMode because it messes up the measurements.
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
