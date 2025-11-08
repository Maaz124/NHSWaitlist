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
  // Try multiple possible paths (works on both Windows and Linux)
  const possiblePaths = [
    path.resolve(__dirname, "../dist/public"), // Relative to compiled server file
    path.join(process.cwd(), "dist", "public"), // From current working directory
    path.resolve(process.cwd(), "dist", "public"), // Absolute from cwd
  ];

  let distPath: string | null = null;
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      distPath = testPath;
      log(`Found build directory at: ${distPath}`);
      break;
    } else {
      log(`Checked path (not found): ${testPath}`);
    }
  }

  if (!distPath) {
    // List what actually exists for debugging
    const cwd = process.cwd();
    const distDir = path.join(cwd, "dist");
    const parentDist = path.resolve(__dirname, "..", "dist");
    
    log(`Current working directory: ${cwd}`);
    log(`__dirname: ${__dirname}`);
    log(`Looking for dist/public in: ${distDir}`);
    
    if (fs.existsSync(distDir)) {
      const distContents = fs.readdirSync(distDir);
      log(`Contents of dist directory: ${distContents.join(", ")}`);
    } else {
      log(`dist directory does not exist at: ${distDir}`);
    }
    
    if (fs.existsSync(parentDist)) {
      const parentContents = fs.readdirSync(parentDist);
      log(`Contents of parent dist directory: ${parentContents.join(", ")}`);
    }
    
    const errorMsg = `Build directory not found. Checked paths: ${possiblePaths.join(", ")}. Make sure 'npm run build' completed successfully.`;
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
