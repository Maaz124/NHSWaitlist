import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { copyFileSync, existsSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Plugin to copy static files to build output
const copyStaticFiles = () => {
  return {
    name: "copy-static-files",
    writeBundle() {
      const clientDir = path.resolve(__dirname, "client");
      const publicDir = path.resolve(__dirname, "public");
      const outDir = path.resolve(__dirname, "dist/public");
      const staticFiles = ["favicon.svg", "og-image.png", "robots.txt", "sitemap.xml"];
      
      staticFiles.forEach((file) => {
        const dest = path.join(outDir, file);
        // Try client directory first, then public directory
        let src = path.join(clientDir, file);
        if (!existsSync(src)) {
          src = path.join(publicDir, file);
        }
        if (existsSync(src)) {
          copyFileSync(src, dest);
          console.log(`Copied ${file} to build output`);
        } else {
          console.warn(`Warning: ${file} not found in client/ or public/ directories`);
        }
      });
    },
  };
};

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    copyStaticFiles(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
