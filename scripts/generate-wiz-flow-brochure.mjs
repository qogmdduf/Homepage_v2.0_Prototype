/**
 * WIZ-Flow 소개 PDF (16:9) — 실제 앱 UI(`/brochure/wiz-flow`)를 섹션별로 캡처해 이미지 PDF로 합칩니다.
 *
 * 사전 준비:
 *   1) pnpm exec playwright install chromium
 *   2) 터미널에서 `pnpm dev` 로 개발 서버 실행 (기본 http://127.0.0.1:5173)
 *
 * BROCHURE_BASE_URL — 기본 http://127.0.0.1:5173 (`pnpm dev` 또는 `vite preview`)
 * BROCHURE_LANG — `ko`(기본) 또는 `en`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'brochures');
const OUT_FILE = path.join(OUT_DIR, 'wiz-flow-intro-16x9.pdf');

const BASE_URL = (process.env.BROCHURE_BASE_URL ?? 'http://127.0.0.1:5173').replace(/\/$/, '');
const BROCHURE_LANG = process.env.BROCHURE_LANG === 'en' ? 'en' : 'ko';
const PDF_W = 1920;
const PDF_H = 1080;

async function ensureDevServer() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(String(res.status));
  } catch (e) {
    console.error(
      `\n개발 서버에 연결할 수 없습니다: ${BASE_URL}\n` +
        '먼저 `pnpm dev`를 실행한 뒤 다시 시도하세요.\n' +
        '(다른 포트면 BROCHURE_BASE_URL을 설정하세요.)\n',
      e.message
    );
    process.exit(1);
  }
}

async function addPngPage(pdfDoc, pngBytes) {
  const img = await pdfDoc.embedPng(pngBytes);
  const iw = img.width;
  const ih = img.height;
  const scale = Math.min(PDF_W / iw, PDF_H / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const x = (PDF_W - dw) / 2;
  const y = (PDF_H - dh) / 2;
  const page = pdfDoc.addPage([PDF_W, PDF_H]);
  page.drawImage(img, { x, y, width: dw, height: dh });
}

async function main() {
  await ensureDevServer();

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.error(
      'Playwright Chromium을 찾을 수 없습니다. 다음을 실행하세요:\n  pnpm exec playwright install chromium\n',
      e.message
    );
    process.exit(1);
  }

  const pdfDoc = await PDFDocument.create();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  try {
    await page.addInitScript((lang) => {
      try {
        localStorage.setItem('wiz-lang', lang);
      } catch {
        /* ignore */
      }
    }, BROCHURE_LANG);
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto(`${BASE_URL}/brochure/wiz-flow`, {
      waitUntil: 'networkidle',
      timeout: 120_000,
    });

    await page.addStyleTag({
      content: `
        .wizflow-brochure-capture, .wizflow-brochure-capture * {
          animation: none !important;
          transition: none !important;
        }
      `,
    });

    await page.waitForSelector('[data-brochure-slide]', { timeout: 60_000 });
    await new Promise((r) => setTimeout(r, 1200));

    const ids = await page.evaluate(() =>
      [...document.querySelectorAll('[data-brochure-slide]')]
        .map((el) => Number(el.getAttribute('data-brochure-slide')))
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b),
    );

    if (!ids.length) {
      throw new Error('data-brochure-slide 요소가 없습니다. /brochure/wiz-flow 페이지를 확인하세요.');
    }

    for (const id of ids) {
      const handle = await page.$(`[data-brochure-slide="${id}"]`);
      if (!handle) continue;
      await handle.scrollIntoViewIfNeeded();
      await new Promise((r) => setTimeout(r, 400));
      const png = await handle.screenshot({ type: 'png' });
      await addPngPage(pdfDoc, png);
      await handle.dispose();
    }
  } finally {
    await browser.close();
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = await pdfDoc.save();
  const pages = pdfDoc.getPageCount();
  fs.writeFileSync(OUT_FILE, out);
  console.log('Wrote', OUT_FILE, `(${(out.length / 1024).toFixed(1)} KB), pages: ${pages}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
