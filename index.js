import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const PORT = Number(process.env.PORT || 4173);
const DIST_DIR = join(process.cwd(), "dist");

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

const resolvePath = (urlPath) => {
  const pathWithoutQuery = urlPath.split("?")[0];
  const safePath = normalize(pathWithoutQuery).replace(/^(\.\.[\/\\])+/, "");
  const filePath = join(DIST_DIR, safePath === "/" ? "index.html" : safePath);
  return existsSync(filePath) ? filePath : join(DIST_DIR, "index.html");
};

const server = createServer((req, res) => {
  const filePath = resolvePath(req.url || "/");
  const ext = extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

  res.writeHead(200, { "Content-Type": contentType });
  createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Serving dist on http://localhost:${PORT}`);
});
