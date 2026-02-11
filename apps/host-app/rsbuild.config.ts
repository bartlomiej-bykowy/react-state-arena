import { fileURLToPath } from "node:url";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dependencies } from "./package.json";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    pluginReact({
      splitChunks: { react: false, router: false }
    })
  ],
  tools: {
    postcss: (_opts, { addPlugins }) => {
      const tailwind = require("@tailwindcss/postcss");
      addPlugins(tailwind({ base: repoRoot }));
    }
  },
  moduleFederation: {
    options: {
      name: "host_app",
      remotes: {
        context_app: "context_app@http://localhost:3001/remoteEntry.js",
        redux_app: "redux_app@http://localhost:3002/remoteEntry.js",
        zustand_app: "zustand_app@http://localhost:3003/remoteEntry.js"
      },
      shared: {
        ...dependencies,
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
        "@packages/shared-ui": {
          singleton: true,
          eager: true,
          strictVersion: false
        },
        "@packages/shared-core": {
          singleton: true,
          eager: true,
          strictVersion: false
        }
      }
    }
  }
});
