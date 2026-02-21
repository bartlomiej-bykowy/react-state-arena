import { fileURLToPath } from "node:url";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dependencies } from "./package.json";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  server: {
    port: 3003
  },
  plugins: [pluginReact({ splitChunks: { react: false } })],
  tools: {
    postcss: (_opts, { addPlugins }) => {
      const tailwind = require("@tailwindcss/postcss");
      addPlugins(tailwind({ base: repoRoot }));
    }
  },
  output: {
    assetPrefix: process.env.RSA_ZUSTAND_URL
  },
  moduleFederation: {
    options: {
      name: "zustand_app",
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
