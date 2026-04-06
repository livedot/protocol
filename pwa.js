// ── Service Worker Registration ──────────────────────────────────────────
    if ('serviceWorker' in navigator) {
      const swCode = `
        const CACHE = 'protocol-v1';
        const ASSETS = [location.href];

        self.addEventListener('install', e => {
          e.waitUntil(
            caches.open(CACHE).then(cache => cache.addAll(ASSETS))
          );
          self.skipWaiting();
        });

        self.addEventListener('activate', e => {
          e.waitUntil(
            caches.keys().then(keys =>
              Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
            )
          );
          self.clients.claim();
        });

        self.addEventListener('fetch', e => {
          e.respondWith(
            caches.match(e.request).then(cached => {
              if (cached) return cached;
              return fetch(e.request).then(res => {
                const clone = res.clone();
                caches.open(CACHE).then(cache => cache.put(e.request, clone));
                return res;
              }).catch(() => cached || new Response('Offline', {status: 503}));
            })
          );
        });
      `;
      const blob = new Blob([swCode], {type: 'application/javascript'});
      const swUrl = URL.createObjectURL(blob);
      navigator.serviceWorker.register(swUrl).catch(() => {});
    }

    // ── PWA Install Prompt ────────────────────────────────────────────────────
    let deferredPrompt = null;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    const installBanner = document.getElementById('install-banner');
    const iosInstall = document.getElementById('ios-install');
    const installDismissed = localStorage.getItem('installDismissed');

    if (!isStandalone && !installDismissed) {
      if (isIOS) {
        // Show iOS instructions after a short delay
        setTimeout(() => {
          iosInstall.classList.add('show');
        }, 3000);
      } else {
        // Android/Desktop: listen for beforeinstallprompt
        window.addEventListener('beforeinstallprompt', e => {
          e.preventDefault();
          deferredPrompt = e;
          setTimeout(() => installBanner.classList.add('show'), 2000);
        });
      }
    }

    document.getElementById('install-btn')?.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          deferredPrompt = null;
          installBanner.classList.remove('show');
        });
      }
    });

    document.getElementById('install-dismiss')?.addEventListener('click', () => {
      installBanner.classList.remove('show');
      localStorage.setItem('installDismissed', '1');
    });

    document.getElementById('ios-install-close')?.addEventListener('click', () => {
      iosInstall.classList.remove('show');
      localStorage.setItem('installDismissed', '1');
    });