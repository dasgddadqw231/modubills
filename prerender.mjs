/**
 * 빌드 후 프리렌더링 스크립트
 * - dist/index.html을 Puppeteer로 렌더링하여 정적 HTML로 교체
 * - 네이버 Yeti, 구글봇 등 JS 미실행 크롤러가 콘텐츠를 인덱싱할 수 있도록 함
 */
import { createServer } from "http";
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { resolve, join, extname } from "path";
import puppeteer from "puppeteer";

const DIST = resolve("dist");
const PORT = 45678;
const ROUTES = ["/"];          // 프리렌더링할 경로 (대시보드는 SEO 불필요)

// ── 간이 정적 파일 서버 ──
const MIME = {
  ".html": "text/html",
  ".js":   "application/javascript",
  ".css":  "text/css",
  ".json": "application/json",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
  ".woff2":"font/woff2",
  ".woff": "font/woff",
  ".webmanifest": "application/manifest+json",
};

function startServer() {
  return new Promise((ok) => {
    const srv = createServer((req, res) => {
      let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);
      if (!existsSync(filePath)) filePath = join(DIST, "index.html"); // SPA fallback
      const ext = extname(filePath);
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      res.end(readFileSync(filePath));
    });
    srv.listen(PORT, () => ok(srv));
  });
}

// ── 프리렌더링 ──
async function prerender() {
  console.log("🔧 프리렌더링 시작...");
  const server = await startServer();

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const route of ROUTES) {
    console.log(`  → ${route} 렌더링 중...`);
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // 추가 대기: 애니메이션/동적 콘텐츠 로드
    await page.waitForSelector("#root > *", { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 1500));

    // 렌더링된 HTML 추출
    const html = await page.content();

    // 파일 경로 결정
    const outDir = route === "/" ? DIST : join(DIST, route);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    const outFile = join(outDir, "index.html");

    writeFileSync(outFile, html, "utf-8");
    console.log(`  ✅ ${outFile}`);

    await page.close();
  }

  await browser.close();
  server.close();

  // GitHub Pages SPA fallback: 404.html = index.html 복사
  // /dashboard 등 서브경로 직접 접근 시 404.html이 서빙되어 React Router가 처리
  const src404 = join(DIST, "index.html");
  const dst404 = join(DIST, "404.html");
  copyFileSync(src404, dst404);
  console.log(`  ✅ ${dst404} (SPA fallback)`);

  console.log("🎉 프리렌더링 완료!");
}

prerender().catch((err) => {
  console.error("❌ 프리렌더링 실패:", err);
  process.exit(1);
});
