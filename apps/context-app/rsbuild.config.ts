import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dependencies } from "./package.json";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  server: {
    port: 3001
  },
  plugins: [pluginReact({ splitChunks: { react: false } })],
  tools: {
    postcss: (_opts, { addPlugins }) => {
      const tailwind = require("@tailwindcss/postcss");
      addPlugins(tailwind({ base: repoRoot }));
    }
  },
  moduleFederation: {
    options: {
      name: "context_app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx"
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: dependencies.react,
          eager: true
        },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
          eager: true
        },
        "@packages/shared-ui": { singleton: true },
        "@packages/shared-core": { singleton: true }
      }
    }
  }
});
