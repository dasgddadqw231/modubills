# 모두빌스 — vite-ssg 로컬 마이그레이션 가이드

Figma Make 환경에서는 진입점(main.tsx / index.html)이 잠겨 있어
실제 SSG 빌드(pre-rendering)는 로컬 환경에서 완성해야 합니다.
아래 코드를 그대로 복붙하면 됩니다.

---

## 1. 패키지 설치

```bash
pnpm add -D vite-ssg
# 또는
npm install -D vite-ssg
```

---

## 2. index.html — vite-ssg 진입점 추가

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- SEOHead 컴포넌트가 동적으로 채워줌 (빌드 시 정적 삽입) -->
    <title>모두빌스 | 병원 의료기기 금융 전문</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 3. src/main.tsx — ViteSSG 진입점

```tsx
import { ViteSSG } from 'vite-ssg'
import App from './app/App'
import './styles/index.css'

// ViteSSG는 빌드 시 정적 HTML을 생성합니다.
// 런타임에는 일반 SPA처럼 동작합니다.
export const createApp = ViteSSG(App)
```

---

## 4. vite.config.ts — ssgOptions 추가

```ts
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // ✅ vite-ssg 옵션
  ssgOptions: {
    script: 'async',         // 스크립트 로딩 방식
    formatting: 'minify',    // HTML 최소화
    crittersOptions: {       // Critical CSS 인라인 (선택)
      reduceInlineStyles: false,
    },
    // 단일 페이지라면 routes 불필요.
    // 멀티 페이지 시 아래처럼 경로 추가:
    // includedRoutes: ['/', '/about', '/services'],
  },
})
```

---

## 5. package.json — 빌드 스크립트 변경

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite-ssg build",
    "preview": "vite preview"
  }
}
```

---

## 6. 빌드 & 배포

```bash
pnpm build
# dist/ 폴더에 정적 HTML 파일이 생성됩니다.

# 로컬 미리보기
pnpm preview
```

---

## 7. 이미 완성된 SEO 파일 목록

| 파일 | 위치 | 역할 |
|---|---|---|
| SEOHead.tsx | src/app/components/ | 메타태그, JSON-LD 구조화 데이터 |
| robots.txt | public/ | 검색 크롤러 허용 정책 |
| sitemap.xml | public/ | 페이지 색인 안내 |
| site.webmanifest | public/ | PWA / 모바일 홈 추가 |

---

## 8. 추가 권장 작업

### OG 이미지 제작
- 크기: 1200 × 630px
- 파일명: `public/og-image.jpg`
- SEOHead.tsx의 `OG_IMAGE` 상수를 실제 URL로 교체

### Favicon 세트 (public/ 에 추가)
- favicon.svg
- favicon-32x32.png
- favicon-16x16.png
- apple-touch-icon.png (180×180)
- favicon-192x192.png
- favicon-512x512.png

### 네이버 웹마스터 / Google Search Console 인증
SEOHead.tsx 내 주석 처리된 부분의 코드를 교체:
```tsx
<meta name="naver-site-verification" content="실제_인증코드" />
<meta name="google-site-verification" content="실제_인증코드" />
```

### 실제 도메인으로 교체
SEOHead.tsx 상단의 두 상수를 교체:
```ts
const SITE_URL = "https://www.modubills.com"; // ← 실제 도메인
const OG_IMAGE = "https://www.modubills.com/og-image.jpg"; // ← 실제 OG 이미지
```
