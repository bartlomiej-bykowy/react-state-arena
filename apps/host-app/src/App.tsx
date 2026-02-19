import MainApp from "@packages/main-app/src/App";
import type { ScopeKey } from "@packages/shared-core";
import { Button } from "@packages/shared-ui";
import { type ChangeEvent, lazy, Suspense, useMemo, useState } from "react";
import { AboutProject } from "./components/AboutProject";
import { GithubLink } from "./components/GithubLink";

const ContextRemote = lazy(() => import("context_app/App"));
const ReduxRemote = lazy(() => import("redux_app/App"));
const ZustandRemote = lazy(() => import("zustand_app/App"));

function shuffle<T>(array: T[]): T[] {
  const arrCopy = array.slice();
  for (let i = arrCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
  }
  return arrCopy;
}

type ToggleType =
  | "app-toggle-context"
  | "app-toggle-redux"
  | "add-toggle-zustand";

export default function App() {
  const [showContext, setShowContext] = useState(true);
  const [showRedux, setShowRedux] = useState(true);
  const [showZustand, setShowZustand] = useState(true);

  const defaultOrder = useMemo<Capitalize<ScopeKey>[]>(
    () => ["Context", "Redux", "Zustand"],
    []
  );

  const [apps, setApps] = useState(defaultOrder);

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

  const getApp = (name: Capitalize<ScopeKey>) => {
    if (name === "Context") {
      return {
        app: ContextRemote,
        show: showContext
      };
    }
    if (name === "Redux") {
      return {
        app: ReduxRemote,
        show: showRedux
      };
    }
    return {
      app: ZustandRemote,
      show: showZustand
    };
  };

  const handleShuffle = () => {
    setApps(shuffle(apps));
  };

  const handleRestoreOrder = () => {
    setApps(defaultOrder);
  };

  return (
    <div className="p-4 space-y-4" data-testid="app-host">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">React State Arena 🤼‍♂️</h1>
        <div className="flex gap-x-2 items-center">
          <AboutProject />
          <GithubLink />
        </div>
      </div>

      <section className="flex gap-x-4 items-center">
        <span>Show:</span>
        {defaultOrder.map((appName) => {
          const lowercasedName = appName.toLowerCase();
          const id = `${lowercasedName}Toggle`;
          const name = `app-toggle-${lowercasedName}`;
          const value =
            appName === "Context"
              ? showContext
              : appName === "Redux"
                ? showRedux
                : showZustand;
          return (
            <div className="flex gap-x-2 items-center" key={appName}>
              <label htmlFor={id}>{`${appName} app`}</label>
              <input
                type="checkbox"
                name={name}
                id={id}
                checked={value}
                onChange={(e) => handleChange(e)}
                data-testid={`toggle-${lowercasedName}`}
              />
            </div>
          );
        })}
        <Button onClick={handleShuffle} data-testid="shuffle-apps-button">
          Shuffle apps
        </Button>
        <Button
          onClick={handleRestoreOrder}
          data-testid="restore-default-order-button"
        >
          Restore default order
        </Button>
      </section>

      <section className="p-4 border">
        <h2 className="mb-4 font-semibold">Main App</h2>
        <MainApp />
      </section>

      {apps.map((app) => {
        const { app: Remote, show } = getApp(app);
        return (
          show && (
            <section className="p-4 bg-gray-100 border" key={app}>
              <h2 className="mb-4 font-semibold">{app} Remote</h2>
              <Suspense fallback={`Loading ${app} Remote...`}>
                <Remote />
              </Suspense>
            </section>
          )
        );
      })}
    </div>
  );
}
