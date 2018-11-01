// importScripts('/cache-polyfill.js');

// self.addEventListener('install', function(event) {
//  event.waitUntil(
//    caches.open('restaurantApp').then(function(cache) {
//      return cache.addAll([
//        '/',
//        '/index.html/',
//        '/styles.css',
//        '/js/',
//        '/restaurants.json',
//        '/restaurants.html',
//        '/img/'
//      ]);
//    })
//  );
// });




self.addEventListener('fetch', function(event){
//do something
console.log(event.request.url);
event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});