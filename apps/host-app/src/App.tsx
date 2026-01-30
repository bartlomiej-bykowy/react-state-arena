import { lazy, Suspense } from "react";
import MainApp from "@packages/main-app/src/App";

const ContextRemote = lazy(() => import("context_app/App"));
const ReduxRemote = lazy(() => import("redux_app/App"));
// const ZustandRemote = React.lazy(() => import("zustand_app/App")) || null;

export default function App() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">React State Arena 🤼‍♂️</h1>

      <section className="p-4 border">
        <h2 className="mb-4 font-semibold">Main App</h2>
        <MainApp />
      </section>

      <section className="p-4 bg-gray-100 border">
        <h2 className="font-semibold">Context Remote</h2>
        <Suspense fallback="Loading Context Remote...">
          <ContextRemote />
        </Suspense>
      </section>

      <section className="p-4 bg-gray-100 border">
        <h2 className="font-semibold">Redux Remote</h2>
        <Suspense fallback="Loading Redux Remote...">
          <ReduxRemote />
        </Suspense>
      </section>

      {/* <section className="p-4 bg-gray-100 border">
        <h2 className="font-semibold">Zustand Remote</h2>
        <React.Suspense fallback="Loading Zustand Remote...">
          <ZustandRemote />
        </React.Suspense>
      </section> */}
    </div>
  );
}
