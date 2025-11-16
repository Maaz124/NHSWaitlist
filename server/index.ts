import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import createMemoryStore from "memorystore";
import path from "path";

const MemoryStore = createMemoryStore(session);
const app = express();

// --------------------
// Body parsers
// --------------------
app.use(express.json({
  verify: (req: any, _res, buf: Buffer) => {
    if (req.originalUrl.startsWith("/api/webhooks/stripe")) {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: false }));

// --------------------
// Session
// --------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
    store: new MemoryStore({ checkPeriod: 1000 * 60 * 60 }),
  })
);

// --------------------
// Logging middleware
// --------------------
app.use((req, res, next) => {
  const start = Date.now();
  const pathReq = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    if (pathReq.startsWith("/api")) {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${pathReq} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// --------------------
// Serve public files explicitly
// --------------------
const publicPath = path.join(process.cwd(), "server", "public");
app.use(express.static(publicPath));

// --------------------
// Routes & Error Handling
// --------------------
(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Ensure NODE_ENV is set correctly
  const nodeEnv = process.env.NODE_ENV || app.get("env");
  log(`Starting server in ${nodeEnv} mode`);
  log(`NODE_ENV environment variable: ${process.env.NODE_ENV}`);
  log(`app.get("env"): ${app.get("env")}`);
  
  if (nodeEnv === "development") {
    log("Using development mode (Vite)");
    await setupVite(app, server);
  } else {
    log("Using production mode (static files)");
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`Server running on port ${port}`);
  });
})();
