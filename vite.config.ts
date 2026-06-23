import { defineConfig, loadEnv } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig(async ({ command, mode }) => {
  const plugins = [
    tanstackRouter({
      target: "react",
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      routeFileIgnorePattern: "^(api|sitemap\\[\\.\\]xml\\.ts)$",
    }),
    viteReact(),
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
  ];

  // Load client env variables for define
  const envDefine: Record<string, string> = {};
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    appType: "spa" as const,
    define: envDefine,
    css: { transformer: "lightningcss" as const },
    build: {
      rollupOptions: {
        input: path.resolve(process.cwd(), "index.html"),
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "./src"),
        "entities/lib/decode.js": path.resolve(
          process.cwd(),
          "node_modules/entities/lib/decode.js",
        ),
        "entities/lib/encode.js": path.resolve(
          process.cwd(),
          "node_modules/entities/lib/encode.js",
        ),
        entities: path.resolve(process.cwd(), "node_modules/entities"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core"
      ]
    },
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
  };
});
