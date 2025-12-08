import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dependencies } from "./package.json";

export default defineConfig({
  server: {
    port: 3002
  },
  plugins: [pluginReact({ splitChunks: { react: false } })],
  moduleFederation: {
    options: {
      name: "redux_app",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx"
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
        "shared-ui": { singleton: true },
        "shared-core": { singleton: true }
      }
    }
  }
});
