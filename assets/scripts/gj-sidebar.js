(function () {
  'use strict';

  var storageKey = 'gj-pattern-sidebar-collapsed';

  function readCollapsed() {
    try { return window.sessionStorage.getItem(storageKey) === 'true'; }
    catch (_) { return false; }
  }

  function writeCollapsed(collapsed) {
    try { window.sessionStorage.setItem(storageKey, String(collapsed)); }
    catch (_) { /* file previews can block storage; interaction still works. */ }
  }

  function applyState(sidebar, collapsed) {
    var toggle = sidebar.querySelector('[data-gj-sidebar-toggle]');
    sidebar.classList.toggle('is-collapsed', collapsed);
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? '展开侧栏' : '收起侧栏');
    toggle.title = collapsed ? '展开侧栏' : '收起侧栏';
  }

  function markCurrentPage(sidebar) {
    var current = window.location.pathname.split('/').pop();
    sidebar.querySelectorAll('[data-pattern-page]').forEach(function (link) {
      var selected = link.getAttribute('href') === current;
      link.classList.toggle('is-active', selected);
      link.classList.toggle('is-selected', selected);
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function init(sidebar, index) {
    if (sidebar.dataset.gjSidebarReady === 'true') return;
    sidebar.dataset.gjSidebarReady = 'true';
    if (!sidebar.id) sidebar.id = 'gjSidebar' + (index + 1);
    var toggle = sidebar.querySelector('[data-gj-sidebar-toggle]');
    if (toggle) {
      toggle.setAttribute('aria-controls', sidebar.id);
      toggle.addEventListener('click', function () {
        var collapsed = !sidebar.classList.contains('is-collapsed');
        applyState(sidebar, collapsed);
        writeCollapsed(collapsed);
      });
    }
    markCurrentPage(sidebar);
    applyState(sidebar, readCollapsed());
  }

  document.querySelectorAll('[data-gj-sidebar]').forEach(init);
}());
