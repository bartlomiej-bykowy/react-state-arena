import { lazy, Suspense, useState, type ChangeEvent } from "react";
import MainApp from "@packages/main-app/src/App";

const ContextRemote = lazy(() => import("context_app/App"));
const ReduxRemote = lazy(() => import("redux_app/App"));
const ZustandRemote = lazy(() => import("zustand_app/App"));

const shuffle = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

type ToggleType =
  | "app-toggle-context"
  | "app-toggle-redux"
  | "add-toggle-zustand";

export default function App() {
  const [showContext, setShowContext] = useState(true);
  const [showRedux, setShowRedux] = useState(true);
  const [showZustand, setShowZustand] = useState(true);
  const [apps, setApps] = useState([
    { app: ContextRemote, name: "Context", show: showContext },
    { app: ReduxRemote, name: "Redux", show: showRedux },
    { app: ZustandRemote, name: "Zustand", show: showZustand }
  ]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name: ToggleType = e.target.name as ToggleType;

    if (name === "app-toggle-context") {
      setShowContext(e.target.checked);
    } else if (name === "app-toggle-redux") {
      setShowRedux(e.target.checked);
    } else {
      setShowZustand(e.target.checked);
    }
  };

  const handleShuffle = () => {
    setApps([...shuffle(apps)]);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">React State Arena 🤼‍♂️</h1>

      <section className="flex gap-x-4 items-center">
        <span>Show:</span>
        <div className="flex gap-x-2 items-center">
          <label htmlFor="contextToggle">Context app</label>
          <input
            type="checkbox"
            name="app-toggle-context"
            id="contextToggle"
            checked={showContext}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="flex gap-x-2 items-center">
          <label htmlFor="reduxToggle">Redux app</label>
          <input
            type="checkbox"
            name="app-toggle-redux"
            id="reduxToggle"
            checked={showRedux}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="flex gap-x-2 items-center">
          <label htmlFor="zustandToggle">Zustand app</label>
          <input
            type="checkbox"
            name="app-toggle-zustand"
            id="zustandToggle"
            checked={showZustand}
            onChange={(e) => handleChange(e)}
          />
        </div>
        {/* <button onClick={handleShuffle}>Shuffle apps</button> */}
      </section>

      <section className="p-4 border">
        <h2 className="mb-4 font-semibold">Main App</h2>
        <MainApp />
      </section>

      {/* {apps.map((app) => {
        return (
          app.show && (
            <section className="p-4 bg-gray-100 border" key={app.name}>
              <h2 className="font-semibold">{app.name} Remote</h2>
              <Suspense fallback={`Loading ${app.name} Remote...`}>
                <ContextRemote />
              </Suspense>
            </section>
          )
        );
      })} */}

      {showContext && (
        <section className="p-4 bg-gray-100 border">
          <h2 className="font-semibold">Context Remote</h2>
          <Suspense fallback="Loading Context Remote...">
            <ContextRemote />
          </Suspense>
        </section>
      )}

      {showRedux && (
        <section className="p-4 bg-gray-100 border">
          <h2 className="font-semibold">Redux Remote</h2>
          <Suspense fallback="Loading Redux Remote...">
            <ReduxRemote />
          </Suspense>
        </section>
      )}

      {showZustand && (
        <section className="p-4 bg-gray-100 border">
          <h2 className="font-semibold">Zustand Remote</h2>
          <Suspense fallback="Loading Zustand Remote...">
            <ZustandRemote />
          </Suspense>
        </section>
      )}
    </div>
  );
}
