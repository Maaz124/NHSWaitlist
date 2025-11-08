import express, { Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// --------------------
// Development (Vite)
// --------------------
export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: { middlewareMode: true, hmr: { server }, allowedHosts: true },
    appType: "custom",
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
  });

  // Serve public folder first
  const publicPath = path.join(process.cwd(), "server", "public");
  app.use(express.static(publicPath));

  // Vite middleware
  app.use(vite.middlewares);

  // Catch-all SPA
  app.use("*", async (req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) return next();

    try {
      const indexHtmlPath = path.join(process.cwd(), "client", "index.html");
      let template = await fs.promises.readFile(indexHtmlPath, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// --------------------
// Production
// --------------------
export function serveStatic(app: Express) {
  const clientDistPath = path.join(process.cwd(), "client", "dist");
  const publicPath = path.join(process.cwd(), "server", "public");

  // Serve React SPA
  app.use(express.static(clientDistPath));

  // Serve public files
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }

  // Catch-all SPA
  app.use("*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}
