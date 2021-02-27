/*
 Modified from a source copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 For more, see https://googlechrome.github.io/samples/service-worker/basic/
*/

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v2';
const RUNTIME = 'runtime';

const urlsToCache = [
  'index.html',
  'components/dice/dice-roller.js',
  'components/dice/glsl-canvas.js',
  'components/dice/holdable-die.js',
  'components/dice/rollable-die.js',
  'components/dice/roller-style.js',
  'components/dice/shader.js',
  'components/scoreboard/names-row.js',
  'components/scoreboard/row-base.js',
  'components/scoreboard/row-style.js',
  'components/scoreboard/scoreboard-row.js',
  'components/scoreboard/scoreboard-style.js',
  'components/scoreboard/section-rules.js',
  'components/scoreboard/total-row.js',
  'components/scoreboard/yahtzee-scoreboard.js',
  'components/button-options.js',
  'components/done-button.js',
  'components/toast.js',
  'util/dom.js',
  'util/events.js',
  'main.js',
  './', // Alias for index.html
  'styles.css',
];

// The install handler takes care of precaching the resources we always need.
async function preCache() {
  const cache = await caches.open(PRECACHE);
  await cache.addAll(urlsToCache);
  await self.skipWaiting();
}
self.addEventListener('install', event => event.waitUntil(preCache()));

// The activate handler takes care of cleaning up old caches.
async function cleanUpOldCaches() {
  const currentCaches = [PRECACHE, RUNTIME];
  for (const cacheName of await caches.keys())
    if (!currentCaches.includes(cacheName))
      await caches.delete(cacheName);
  await self.clients.claim();
}
self.addEventListener('activate', event => event.waitUntil(cleanUpOldCaches()));

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
async function getContent(request) {
  // Skip cross-origin requests, like those for Google Analytics.
  if (!request.url.startsWith(self.location.origin))
    return fetch(request);
  const cachedResponse = await caches.match(request);
  if (cachedResponse)
    return cachedResponse;
  const cache = await caches.open(RUNTIME),
    response = await fetch(request);
  await cache.put(request, response.clone());
  return response;
}
self.addEventListener('fetch', event => event.respondWith(getContent(event.request)));
