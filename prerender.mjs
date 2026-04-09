/**
 * 빌드 후 SSR 프리렌더링 스크립트
 * - Puppeteer 없이 react-dom/server + jsdom으로 정적 HTML 생성
 * - Vercel, CI 등 어떤 환경에서든 동작
 */
import { build } from "vite";
import { readFileSync, writeFileSync, rmSync } from "fs";
import { resolve, join } from "path";
import { pathToFileURL } from "url";
import { JSDOM } from "jsdom";

const DIST = resolve("dist");
const SERVER_DIR = resolve("dist-server");

async function prerender() {
  console.log("🔧 SSR 프리렌더링 시작...");

  // 1. SSR 번들 빌드
  console.log("  → 서버 번들 빌드...");
  await build({
    build: {
      ssr: resolve("src/entry-server.tsx"),
      outDir: SERVER_DIR,
      emptyOutDir: true,
    },
    logLevel: "warn",
  });

  // 2. jsdom으로 브라우저 환경 시뮬레이션
  setupBrowserEnvironment();

  // 3. SSR 번들 로드 & 렌더링
  console.log("  → / 렌더링...");
  const entryPath = pathToFileURL(join(SERVER_DIR, "entry-server.js")).href;
  const { render } = await import(entryPath);
  const appHtml = render("/");

  // 4. dist/index.html에 삽입
  const template = readFileSync(join(DIST, "index.html"), "utf-8");
  const finalHtml = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );
  writeFileSync(join(DIST, "index.html"), finalHtml, "utf-8");
  console.log("  ✅ dist/index.html (프리렌더링 완료)");

  // 5. 서버 번들 정리
  rmSync(SERVER_DIR, { recursive: true, force: true });

  console.log("🎉 SSR 프리렌더링 완료!");
}

function setupBrowserEnvironment() {
  const dom = new JSDOM(
    '<!DOCTYPE html><html lang="ko"><head></head><body></body></html>',
    { url: "https://www.modubills.com", pretendToBeVisual: true }
  );
  const win = dom.window;

  // 기본 DOM 전역 복사 (getter-only 속성은 defineProperty로 덮어쓰기)
  const globals = [
    "document", "navigator", "location", "history",
    "HTMLElement", "SVGElement", "Element", "Node", "Text",
    "DocumentFragment", "CustomEvent", "Event", "MouseEvent",
    "KeyboardEvent", "MutationObserver", "DOMParser",
    "getComputedStyle", "localStorage", "sessionStorage",
  ];
  for (const key of globals) {
    if (win[key] !== undefined) {
      Object.defineProperty(globalThis, key, {
        value: win[key],
        writable: true,
        configurable: true,
      });
    }
  }
  globalThis.window = globalThis;
  // globalThis에 이벤트 리스너 메서드 추가 (motion 라이브러리 등에서 필요)
  const noop = () => {};
  if (!globalThis.addEventListener) globalThis.addEventListener = noop;
  if (!globalThis.removeEventListener) globalThis.removeEventListener = noop;
  if (!globalThis.dispatchEvent) globalThis.dispatchEvent = noop;

  // jsdom에 없는 API 모킹
  globalThis.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  globalThis.ResizeObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  globalThis.matchMedia = () => ({
    matches: false,
    addEventListener: noop,
    removeEventListener: noop,
    addListener: noop,
    removeListener: noop,
    media: "",
  });
  globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  globalThis.cancelAnimationFrame = clearTimeout;
  globalThis.scrollTo = noop;
  globalThis.scroll = noop;
  globalThis.CSS = { supports: () => false };
  globalThis.screen = { width: 1920, height: 1080 };
  globalThis.innerWidth = 1920;
  globalThis.innerHeight = 1080;
  globalThis.devicePixelRatio = 1;
  globalThis.customElements = { define: noop, get: () => undefined };
}

prerender().catch((err) => {
  console.error("❌ 프리렌더링 실패:", err);
  process.exit(1);
});
