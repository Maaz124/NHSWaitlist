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
  // Vite builds to dist/public (as configured in vite.config.ts)
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    const errorMsg = `Build directory not found: ${distPath}. Make sure to run 'npm run build' before starting the server.`;
    log(errorMsg);
    throw new Error(errorMsg);
  }

  log(`Serving static files from: ${distPath}`);

  // Serve static files from dist/public
  app.use(express.static(distPath, {
    index: false, // Don't serve index.html for directory requests
    setHeaders: (res, filePath) => {
      // Set proper content types
      if (filePath.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
      } else if (filePath.endsWith(".xml")) {
        res.setHeader("Content-Type", "application/xml");
      } else if (filePath.endsWith(".txt")) {
        res.setHeader("Content-Type", "text/plain");
      } else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
      } else if (filePath.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
      }
    },
  }));

  // Catch-all: serve index.html for SPA routing (skip API routes)
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api/")) {
      return next();
    }
    
    // Serve index.html for all non-API routes (SPA routing)
    const indexHtmlPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexHtmlPath)) {
      res.sendFile(indexHtmlPath);
    } else {
      log(`Error: index.html not found at ${indexHtmlPath}`);
      res.status(404).send("index.html not found. Make sure the build completed successfully.");
    }
  });
}
