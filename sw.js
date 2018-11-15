self.addEventListener('install', function(event){
	//service worker installed
	console.log(event);
});

self.addEventListener('activate', function(event){
    //service worker activated
    console.log(event);
});

self.addEventListener('fetch', function(event){
  console.log(event.request.url);
  // return something for each interception
});

// importScripts('js/cache-polyfill.js');

var CACHE_VERSION = 'app-v1';
var CACHE_FILES = [
	'/', 
	'/index.html/', 
	'css/styles.css', 
	'/js/', 
	'/restaurants.json', 
	'/restaurants.html/', 
	'/img/'
	// 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
    // '/',
    // 'images/background.jpeg',
    // 'js/app.js',
    // 'css/styles.css',
    // 'https://fonts.googleapis.com/css?family=Roboto:100'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(CACHE_FILES);
            })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function(response){
            if(response){
                return response;
            }
            requestBackend(event);
        })
    )
});

function requestBackend(event){
    var url = event.request.clone();
    return fetch(url).then(function(response){
        //if not a valid response send the error
        if(!response || response.status !== 200 || response.type !== 'basic'){
            return response;
        }

        var result = response.clone();

        caches.open(CACHE_VERSION).then(function(cache){
            cache.put(event.request, result);
        });

        return response;
    })
}

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function(keys){
            return Promise.all(keys.map(function(key, i){
                if(key !== CACHE_VERSION){
                    return caches.delete(keys[i]);
                }
            }))
        })
    )
});






// self.addEventListener('install', function(event) {
// 	event.waitUntil(caches.open('restaurantApp').then(function(cache) {
// 		return cache.addAll(['/', '/index.html/', '/styles.css', '/js/', '/restaurants.json', '/restaurants.html/', '/img/']);
// 	}));
// });




// self.addEventListener('fetch', function(event) {
// 	//do something
// 	console.log(event.request.url);
// 	event.respondWith(caches.match(event.request).then(function(response) {
// 		return response || fetch(event.request);
// 	}));
// });