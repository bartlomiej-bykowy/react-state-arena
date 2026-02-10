import { Button } from "@packages/shared-ui";
import { useState, type MouseEvent } from "react";

export function AboutProject() {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const handleClickCapture = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    const isModal = (e.target as HTMLElement).closest("#modal");

    if (isModal) return;

    setDetailsVisible(false);
  };

  return (
    <>
      <button
        onClick={() => setDetailsVisible(true)}
        className="text-sm cursor-pointer hover:underline"
      >
        About this project
      </button>
      {detailsVisible && (
        <div
          className="flex fixed top-0 left-0 z-10 justify-center items-center w-screen h-screen bg-black/25"
          onClickCapture={(e) => handleClickCapture(e)}
        >
          <div
            id="modal"
            className="rounded-xl bg-white h-[500px] max-h-[90%] max-w-[90%] w-[750px] flex flex-col overflow-hidden"
          >
            <div className="overflow-auto flex-1 p-4">
              <div className="space-y-6 text-sm leading-relaxed text-gray-700">
                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    ℹ️ What this project is
                  </h2>

                  <p>
                    This project is a{" "}
                    <strong>
                      side-by-side comparison of four different ways of managing
                      state in React
                    </strong>
                    :
                  </p>

                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      local component state (
                      <code className="px-1 py-0.5 bg-gray-100 rounded">
                        useState
                      </code>
                      )
                    </li>
                    <li>
                      Context +{" "}
                      <code className="px-1 py-0.5 bg-gray-100 rounded">
                        useReducer
                      </code>
                    </li>
                    <li>Redux (with Redux Toolkit)</li>
                    <li>Zustand</li>
                  </ul>

                  <p>
                    All implementations share the same UI, features, and user
                    interactions. The goal is to{" "}
                    <strong>observe behavioral differences</strong> - especially
                    render counts and update timings.
                  </p>
                </section>
                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    ⚠️ Important notes
                  </h2>

                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      This is <strong>not a benchmark</strong>
                    </li>
                    <li>
                      This is <strong>not a scientific performance test</strong>
                    </li>
                    <li>
                      Numbers should be treated as{" "}
                      <strong>informational only</strong>
                    </li>
                  </ul>

                  <p>
                    The purpose is learning and exploration - not choosing a
                    universal “winner”.
                  </p>
                </section>
                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    ▶️ How to use it
                  </h2>

                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      Use the <strong>Main app</strong> as the control panel
                    </li>
                    <li>
                      Enable <strong>“Enable measurements”</strong> before
                      testing
                    </li>
                    <li>
                      Trigger actions like add, toggle, filter, or bulk updates
                    </li>
                    <li>Each app shows its own render statistics</li>
                  </ul>

                  <p className="italic text-gray-600">
                    For best results, test one app at a time and reset metrics
                    between runs.
                  </p>
                </section>
                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    🧠 About the results
                  </h2>

                  <ul className="space-y-1 list-disc list-inside">
                    <li>Rendering multiple apps increases overall workload</li>
                    <li>
                      Lists are <strong>not virtualized</strong> - large counts
                      stress the DOM
                    </li>
                    <li>
                      Results are best compared <strong>relatively</strong>, not
                      absolutely
                    </li>
                  </ul>
                </section>
                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    🔥 Warm-up effect
                  </h2>

                  <p>
                    You may notice that each subsequent app often appears
                    faster.
                  </p>

                  <p>
                    This happens because the JavaScript engine and React
                    internals are already initialized and optimized - the system
                    is simply <strong>warmed up</strong>.
                  </p>

                  <p className="italic text-gray-600">
                    Earlier apps often pay the startup cost, later ones benefit
                    from it.
                  </p>
                </section>
                <section className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    🧾 Final note
                  </h2>

                  <p>
                    This project is meant to be educational, visual, and a bit
                    playful.
                  </p>

                  <p>
                    Real-world decisions should consider architecture, team
                    experience, and maintainability - not just numbers.
                  </p>

                  <p className="font-medium">Have fun exploring 🙂</p>
                </section>
              </div>
            </div>
            <div className="flex justify-end p-4 w-full border-t border-gray-700">
              <Button onClick={() => setDetailsVisible(false)}>Got it!</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
