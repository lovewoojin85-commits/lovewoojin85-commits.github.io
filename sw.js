/* 멍멍 톡톡 서비스 워커: 게임 파일을 저장해 두고 오프라인에서도 실행
   게임을 업데이트할 때마다 아래 버전 숫자를 1씩 올려 주세요. */
const VERSION='mungmung-v24';
const FILES=['./','./index.html','./manifest.webmanifest','./privacy.html','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;          // Firebase·글꼴 등 외부 요청은 그대로
  if(e.request.mode==='navigate'){                                          // 게임 화면: 최신 버전 우선, 안 되면 저장본
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put('./index.html',cp));return r}).catch(()=>caches.match('./index.html')));return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
