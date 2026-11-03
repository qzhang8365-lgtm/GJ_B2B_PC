/* News cover fallback for prototypes. Native links keep their normal navigation. */
(function () {
  'use strict';
  var selector = '.gj-news-thumb > img, img.gj-news-card-img';
  function update(image) {
    if (image.matches && image.matches(selector)) {
      image.classList.toggle('is-error', image.complete && image.naturalWidth === 0);
    }
  }
  // Capture also handles covers inserted by a subsequent render.
  document.addEventListener('error', function (event) { update(event.target); }, true);
  document.addEventListener('load', function (event) { update(event.target); }, true);
  function initAll(scope) {
    scope = scope || document;
    if (scope.matches && scope.matches(selector)) update(scope);
    scope.querySelectorAll(selector).forEach(update);
  }
  window.GjNews = { initAll: initAll };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initAll(); });
  else initAll();
})();
