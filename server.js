// 한 생애의 반려 — 배포용 정적 서버 (외부 패키지 없음, Node 18+)
// 실행: node server.js   (PORT 환경변수로 포트 변경 가능, 기본 3000)
// 게임은 전부 브라우저에서 돌아가고, 저장도 브라우저(localStorage)에 됩니다.
// 이 서버는 파일 전달 + 검색 등록(robots.txt, sitemap.xml, 소유 확인 태그)만 담당합니다.
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;

const STATIC = {
  '/game.js': 'game.js',
  '/i18n.js': 'i18n.js',
  '/style.css': 'style.css',
  '/favicon.svg': 'favicon.svg',
  '/og.png': 'og.png',
};
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};
const clean = s => String(s || '').replace(/[^A-Za-z0-9_\-.:]/g, '');

// 배포 주소: SITE_URL 환경변수 (예: https://hanpet.onrender.com), 없으면 접속한 주소 사용
function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '');
  const proto = req.headers['x-forwarded-proto'] || 'http';
  return `${proto}://${req.headers.host}`;
}

let indexCache = null;
function indexHtml(req) {
  if (!indexCache || process.env.NODE_ENV !== 'production') indexCache = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  let verify = '';
  if (process.env.GOOGLE_SITE_VERIFICATION) verify += `<meta name="google-site-verification" content="${clean(process.env.GOOGLE_SITE_VERIFICATION)}">\n`;
  if (process.env.NAVER_SITE_VERIFICATION) verify += `<meta name="naver-site-verification" content="${clean(process.env.NAVER_SITE_VERIFICATION)}">\n`;
  return indexCache.split('%SITE_URL%').join(siteUrl(req)).replace('<!--VERIFY-->', verify);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }

  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-cache' });
    return res.end(indexHtml(req));
  }
  if (url.pathname === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': TYPES['.txt'] });
    return res.end(`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl(req)}/sitemap.xml\n`);
  }
  if (url.pathname === '/sitemap.xml') {
    res.writeHead(200, { 'Content-Type': TYPES['.xml'] });
    return res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl(req)}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>\n`);
  }
  if (url.pathname === '/ping') { res.writeHead(200); return res.end('ok'); }

  if (STATIC[url.pathname]) {
    const f = STATIC[url.pathname];
    fs.readFile(path.join(__dirname, f), (err, buf) => {
      if (err) { res.writeHead(404); return res.end('not found'); }
      const ext = path.extname(f);
      res.writeHead(200, { 'Content-Type': TYPES[ext], 'Cache-Control': (ext === '.js' || ext === '.css') ? 'no-cache' : 'public, max-age=86400' });
      res.end(buf);
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': TYPES['.txt'] }); res.end('not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  한 생애의 반려 서버 실행 중 → http://localhost:${PORT}`);
  for (const list of Object.values(os.networkInterfaces()))
    for (const n of list || []) if (n.family === 'IPv4' && !n.internal) console.log(`  같은 네트워크에서 접속   → http://${n.address}:${PORT}`);
  console.log('');
});
