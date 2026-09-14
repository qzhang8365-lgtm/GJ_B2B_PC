(() => {
  const sync = wrap => {
    wrap.classList.toggle('has-overflow', wrap.scrollWidth > wrap.clientWidth + 1);
  };
  const syncAll = () => document.querySelectorAll('.gj-table-wrap').forEach(sync);

  const observed = new WeakSet();
  const observe = wrap => {
    if (observed.has(wrap)) return;
    observed.add(wrap);
    sync(wrap);
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => sync(wrap));
      ro.observe(wrap);
      const table = wrap.querySelector(':scope > table');
      if (table) ro.observe(table);
    }
  };

  const scan = () => document.querySelectorAll('.gj-table-wrap').forEach(observe);

  if (window.MutationObserver) {
    new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  }
  window.addEventListener('resize', syncAll);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }
})();
