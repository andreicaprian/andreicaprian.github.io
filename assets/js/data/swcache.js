const resource = [ /* --- CSS --- */ '/assets/css/style.css', /* --- JavaScripts --- */ '/assets/js/dist/home.min.js', '/assets/js/dist/page.min.js', '/assets/js/dist/post.min.js', '/assets/js/dist/categories.min.js', '/assets/js/data/search.json', '/app.js', '/sw.js', /* --- HTML --- */ '/index.html', '/404.html', '/categories/', '/tags/', '/archives/', '/about/', /* --- Favicons --- */ '/assets/img/favicons/android-chrome-192x192.png', '/assets/img/favicons/android-chrome-512x512.png', '/assets/img/favicons/apple-touch-icon.png', '/assets/img/favicons/favicon-16x16.png', '/assets/img/favicons/favicon-32x32.png', '/assets/img/favicons/favicon.ico', '/assets/img/favicons/mstile-150x150.png', '/assets/img/favicons/site.webmanifest', '/assets/img/favicons/browserconfig.xml' ]; /* The request url with below domain will be cached */ const allowedDomains = [ 'andreicaprian.github.io', 'fonts.gstatic.com', 'fonts.googleapis.com', 'cdn.jsdelivr.net', 'polyfill.io' ]; /* Requests that include the following path will be banned */ const denyUrls = [ ];
