import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../dist/", import.meta.url)));
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
    const relativePath = pathname.replace(/^\/+/, "") || "index.html";
    const filePath = resolve(root, relativePath);

    if (!filePath.startsWith(root + sep)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    if (!(await stat(filePath)).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    response.end(await readFile(filePath));
  } catch {
    response.writeHead(404).end("Not found");
  }
});

const preferredPort = Number(process.env.PORT || 4173);
let port = preferredPort;
server.on("error", (error) => {
  if (error.code === "EADDRINUSE" && port < preferredPort + 10) {
    port += 1;
    server.listen(port, "127.0.0.1");
  } else {
    console.error(error);
    process.exitCode = 1;
  }
});
server.on("listening", () => {
  console.log(`DENTIN site: http://127.0.0.1:${server.address().port}/`);
});
server.listen(port, "127.0.0.1");
