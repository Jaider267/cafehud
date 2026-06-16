import { createServer } from "node:http";
import { mkdirSync, writeFileSync, appendFileSync, existsSync, rmSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const sessionId = "blank-screen-router";
const outdir = resolve(".dbg");
const host = "127.0.0.1";
const startPort = 7777;

mkdirSync(outdir, { recursive: true });

const logFile = resolve(outdir, `trae-debug-log-${sessionId}.ndjson`);
const envFile = resolve(outdir, `${sessionId}.env`);

if (existsSync(logFile)) {
  rmSync(logFile, { force: true });
}

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true, sessionId }));
    return;
  }

  if (req.method === "GET" && req.url === "/logs") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(existsSync(logFile) ? readSafe(logFile) : "");
    return;
  }

  if (req.method === "POST" && req.url === "/event") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const event = JSON.parse(body || "{}");
        if (!event.ts) {
          event.ts = Date.now();
        }
        appendFileSync(logFile, `${JSON.stringify(event)}\n`, "utf8");
        res.statusCode = 200;
        res.end("ok");
      } catch {
        res.statusCode = 400;
        res.end("bad json");
      }
    });
    return;
  }

  res.statusCode = 404;
  res.end("not found");
});

function readSafe(filePath) {
  try {
    return readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function listen(port, retries = 10) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && retries > 0) {
      listen(port + 1, retries - 1);
      return;
    }
    throw error;
  });

  server.listen(port, host, () => {
    const apiUrl = `http://${host}:${port}/event`;
    writeFileSync(envFile, `DEBUG_SERVER_URL=${apiUrl}\nDEBUG_SESSION_ID=${sessionId}\n`, "utf8");
    process.stdout.write("@@DEBUG_SERVER_INFO\n");
    process.stdout.write(
      `${JSON.stringify({ api_url: apiUrl, session_id: sessionId, log_dir: outdir, log_file: logFile, env_file: envFile }, null, 2)}\n`,
    );
    process.stdout.write("@@END_DEBUG_SERVER_INFO\n");
  });
}

listen(startPort);
