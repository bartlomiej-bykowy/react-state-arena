import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dependencies } from "./package.json";

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    pluginReact({
      splitChunks: { react: false, router: false }
    })
  ],
  moduleFederation: {
    options: {
      name: "host_app",
      remotes: {
        // context_app: "context_app@http://localhost:3001/remoteEntry.js",
        // redux_app: "redux_app@http://localhost:3002/remoteEntry.js",
        // zustand_app: "zustand_app@http://localhost:3003/remoteEntry.js"
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
