// Page-pattern shared behavior belongs here; component behavior stays in assets/scripts/.
(function () {
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var dots = [].slice.call(root.querySelectorAll('.gj-carousel-dot'));
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    var index = 0;
    function go(i) {
      index = (i + dots.length) % dots.length;
      root.style.setProperty('--gj-carousel-offset', (-index * 100) + '%');
      dots.forEach(function (dot, di) {
        if (di === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }
    dots.forEach(function (dot, di) { dot.addEventListener('click', function () { go(di); }); });
    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });
  });
})();
