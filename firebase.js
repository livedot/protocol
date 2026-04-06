// ── Always initialize these globals first so app never crashes ──────────
    window._fbUid     = null;
    window._fbReady   = false;
    window._fbOnReady = [];
    window._fbSet     = function() {};  // no-op until Firebase loads
    window._fbPull    = async function() {};  // no-op until Firebase loads

    function _fbEmitReady() {
      window._fbReady = true;
      (window._fbOnReady || []).forEach(fn => { try { fn(); } catch(e){} });
      window._fbOnReady = [];
    }

    try {
      if (typeof firebase === 'undefined') throw new Error('Firebase SDK not loaded');

      const _fbConfig = {
        apiKey: "AIzaSyB_7gBbtMjRmW5O-X6_5PMxYjuRmE5ZUkk",
        authDomain: "protocol-pwa.firebaseapp.com",
        projectId: "protocol-pwa",
        storageBucket: "protocol-pwa.firebasestorage.app",
        messagingSenderId: "1029218717235",
        appId: "1:1029218717235:web:3b0277f7467bc090cfdd46"
      };
      firebase.initializeApp(_fbConfig);
      const _auth = firebase.auth();
      const _db   = firebase.firestore();

      window._fbSet = function(key, value) {
        if (!window._fbUid) return;
        const isChk = key.startsWith('chk-');
        const col   = isChk ? 'checklist' : 'data';
        const docId = isChk ? key.replace('chk-', '') : key;
        _db.collection('users').doc(window._fbUid)
           .collection(col).doc(docId)
           .set({ v: value })
           .catch(function() {});
      };

      window._fbPull = async function(uid) {
        try {
          const [dataSnap, chkSnap] = await Promise.all([
            _db.collection('users').doc(uid).collection('data').get(),
            _db.collection('users').doc(uid).collection('checklist').get(),
          ]);
          dataSnap.forEach(function(doc) {
            try { localStorage.setItem(doc.id, JSON.stringify(doc.data().v)); } catch(e) {}
          });
          chkSnap.forEach(function(doc) {
            try { localStorage.setItem('chk-' + doc.id, JSON.stringify(doc.data().v)); } catch(e) {}
          });
        } catch(e) { console.warn('Firebase pull failed:', e); }
      };

      // Anonymous sign-in
      _auth.signInAnonymously().then(async function(cred) {
        window._fbUid = cred.user.uid;
        try { localStorage.setItem('_fbUid', cred.user.uid); } catch(e) {}
        await window._fbPull(window._fbUid);
        _fbEmitReady();
      }).catch(function() {
        console.warn('Firebase auth failed — running offline');
        _fbEmitReady();
      });

    } catch(e) {
      console.warn('Firebase unavailable:', e.message, '— running offline with localStorage only');
      _fbEmitReady();  // unblock the app
    }