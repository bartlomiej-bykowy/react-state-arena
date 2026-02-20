# React State Arena

## 🎯 Project Summary

React State Arena is a project designed to compare four state management approaches in React under identical
architectural conditions.

It combines:

-   Microfrontend architecture (Module Federation)
-   Multiple independent React trees
-   Synchronized cross-app communication via CustomEvents
-   Custom signals 
-   Runtime render measurement system
-   Unit + E2E testing
-   Controlled performance experimentation

The project focuses not on declaring a "winner", but on understanding
trade-offs, rendering behavior, and architectural implications of
different state management strategies.

------------------------------------------------------------------------

## 🧠 What is this?

React State Arena compares four approaches to state management:

1.  Local state (`useState`) -- Main app
2.  Context + useReducer
3.  Redux Toolkit
4.  Zustand

All implementations (2, 3, and 4) render the same synchronized Todo application and
receive identical events from a shared host (1).

The goal is to observe:

-   Render counts
-   Render timings (JS phase only)
-   Behavior under bulk updates
-   Architectural trade-offs
-   Developer ergonomics

------------------------------------------------------------------------

## ❗ What this project is NOT

-   Not a scientific benchmark
-   Not proof that one state manager is "better"
-   Not measuring browser paint or layout

Measurements include:

-   State updates
-   React render work
-   Reconciliation

Measurements do NOT include:

-   Paint
-   GPU work
-   Layout / reflow

------------------------------------------------------------------------

## 🏗 Architecture Overview

This project uses a microfrontend-style setup (Module Federation).

### Structure

    apps/
      host-app
      context-app
      redux-app
      zustand-app

    packages/
      main-app
      shared-core
      shared-ui

### Why Microfrontends?

-   Isolates each implementation in its own React tree
-   Prevents cross-app coupling
-   Simulates real enterprise architecture constraints
-   Enables mounting/unmounting and order shuffling
-   Keeps the comparison clean and realistic

------------------------------------------------------------------------

## 🔄 State Synchronization

The host acts as the event source.

When a user performs an action:

1.  Main app updates its state
2.  Host dispatches a CustomEvent
3.  All remotes listen and apply the same action

Remotes are read-only reflections of Main.

Snapshot handshake is used on remount to synchronize latest state.

------------------------------------------------------------------------

## 🚫 Why No Global Store?

A shared global store would:

-   Remove isolation between implementations
-   Make all apps share the same write path
-   Turn the comparison into "different UI subscribers of one store"
-   Hide real architectural differences

Each app must manage its own state to keep the comparison meaningful.

------------------------------------------------------------------------

## 🔥 Warm-Up Effect

Later apps often appear faster.

Why?

-   V8 JIT warm-up
-   React internals already initialized
-   Modules already evaluated
-   Runtime already "hot"

To get cleaner numbers:

-   Test one app at a time
-   Reload between runs
-   Enable measurements manually

------------------------------------------------------------------------

## 📊 Performance Notes

### What is actually measured?

Operation time measures:

User Action → State Update → React Render → Commit

It does NOT measure browser paint, layout, or GPU work.

### Why list time ≠ sum of item times

List render timing includes:

-   Container components
-   Reconciliation overhead
-   React internal work

Item timing measures only individual component updates.

They are related but not additive.

### DOM as bottleneck

With large datasets (1k+ items), DOM creation and reconciliation become
the dominant cost. Differences between state managers may become less
visible.

This project intentionally avoids virtualization to keep the focus on
state update cost.

### Running multiple apps simultaneously

Rendering all implementations at once increases:

-   Main thread contention
-   Memory pressure
-   Scheduling variance

For cleaner measurements, mount a single app.

### Development vs Production

This project does NOT use React StrictMode by default, because
StrictMode in development intentionally double-invokes certain lifecycle
paths and can distort measurements.

To enable StrictMode, uncomment:

\<React.StrictMode\>

in:

apps/host-app/src/index.tsx

Production builds provide more stable timing results than development
mode.

------------------------------------------------------------------------

## 🎛 Features

-   Enable / disable measurements
-   Shuffle app order
-   Mount / unmount remotes
-   Typical todo actions - add/remove/edit taks, mark as done
-   Filtering and search
-   Bulk actions
-   Optional item-level metrics
-   Render highlighting
-   Optional cap on visible items

------------------------------------------------------------------------

## ⚖️ Some Architectural Trade-offs

Microfrontends: + Isolation, realism\
− More configuration and runtime complexity

Event-based synchronization: + Loose coupling\
− Requires handshake and ordering guarantees

Fair comparison constraints: + Apples-to-apples comparison\
− Less idiomatic usage per library

No virtualization: + Clear state-update cost visibility\
− DOM becomes bottleneck at scale

------------------------------------------------------------------------

## 🚀 How to Run

Install dependencies:

```bash
pnpm install
```

Run all apps:

```bash
pnpm dev:all
```

Host runs at `http://localhost:3000`

------------------------------------------------------------------------

## 🧪 Testing

Unit tests:

```bash
pnpm test
```

E2E tests (Playwright):

```bash
pnpm e2e
```

------------------------------------------------------------------------

## 📌 Final Note

This project is a learning playground and architectural experiment.

It demonstrates how different state management approaches behave under
identical conditions in a microfrontend environment.

The most important takeaway is not "which one is faster", but
understanding what is being measured --- and why.


------------------------------------------------------------------------

## 🏁 Final **Final** Note

Some architectural and tooling decisions in this project - such as using Rsbuild, communication through CustomEvents or implementing custom signals - were made intentionally to explore and experiment with different approaches.

They are not necessarily the optimal or production-recommended solutions in every context.

The goal of this project was learning, experimentation and architectural exploration - not strict optimization or framework advocacy.
