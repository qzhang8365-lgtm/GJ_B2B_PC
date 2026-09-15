(function () {
  function closeField(field, returnFocus) {
    var trigger = field.querySelector('[data-gj-cascader-trigger]');
    var popup = field.querySelector('[data-gj-cascader-popup]');
    if (!trigger || !popup || popup.hidden) return;
    popup.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
  }

  function initField(field) {
    if (field.dataset.gjCascaderReady === 'true') return;
    field.dataset.gjCascaderReady = 'true';
    var trigger = field.querySelector('[data-gj-cascader-trigger]');
    var popup = field.querySelector('[data-gj-cascader-popup]');
    var value = field.querySelector('[data-gj-cascader-value]');
    var path = [];
    if (!trigger || !popup || !value) return;

    trigger.addEventListener('click', function () {
      var willOpen = popup.hidden;
      document.querySelectorAll('[data-gj-cascader-field]').forEach(function (other) {
        if (other !== field) closeField(other, false);
      });
      popup.hidden = !willOpen;
      trigger.setAttribute('aria-expanded', String(willOpen));
    });
    trigger.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      if (popup.hidden) trigger.click();
      popup.querySelector('.gj-cascader-item:not([hidden]):not(:disabled)')?.focus();
    });

    popup.addEventListener('click', function (event) {
      var item = event.target.closest('.gj-cascader-item');
      if (!item || item.disabled || item.classList.contains('is-disabled')) return;
      var column = item.closest('[data-cascader-column]');
      var level = Number(column && column.dataset.cascaderColumn || 0);
      path = path.slice(0, level);
      path[level] = item.dataset.value || item.textContent.trim();
      value.textContent = path.filter(Boolean).join(' / ');
      value.classList.remove('gj-selector-placeholder');
      column.querySelectorAll('.gj-cascader-item').forEach(function (candidate) {
        candidate.classList.toggle('is-path', candidate === item && item.dataset.hasChildren === 'true');
        candidate.classList.toggle('is-checked', candidate === item && item.dataset.leaf === 'true');
      });
      popup.querySelectorAll('[data-cascader-column]').forEach(function (candidate) {
        var candidateLevel = Number(candidate.dataset.cascaderColumn);
        if (candidateLevel > level) candidate.hidden = candidateLevel !== level + 1 || item.dataset.hasChildren !== 'true';
      });
      if (item.dataset.hasChildren === 'true') {
        var nextColumn = popup.querySelector('[data-cascader-column="' + (level + 1) + '"]');
        if (nextColumn) nextColumn.querySelectorAll('.gj-cascader-item').forEach(function (child) {
          child.hidden = child.dataset.parentKey !== item.dataset.childKey;
          child.classList.remove('is-checked');
        });
      }
      if (item.dataset.leaf === 'true') {
        closeField(field, true);
      }
    });

    field.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeField(field, true);
      if (popup.hidden) return;
      var item = event.target.closest('.gj-cascader-item');
      if (!item) return;
      var column = item.closest('.gj-cascader-column');
      var items = [].slice.call(column.querySelectorAll('.gj-cascader-item:not([hidden]):not(:disabled)'));
      var index = items.indexOf(item);
      var target;
      if (event.key === 'ArrowDown') target = items[Math.min(index + 1, items.length - 1)];
      if (event.key === 'ArrowUp') target = items[Math.max(index - 1, 0)];
      if (event.key === 'Home') target = items[0];
      if (event.key === 'End') target = items[items.length - 1];
      if (event.key === 'ArrowRight' && item.dataset.hasChildren === 'true') {
        item.click();
        target = popup.querySelector('[data-cascader-column="' + (Number(column.dataset.cascaderColumn) + 1) + '"] .gj-cascader-item:not([hidden])');
      }
      if (event.key === 'ArrowLeft') {
        var previous = popup.querySelector('[data-cascader-column="' + (Number(column.dataset.cascaderColumn) - 1) + '"] .gj-cascader-item.is-path');
        if (previous) target = previous;
      }
      if (event.key === 'Enter') item.click();
      if (target || ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter'].includes(event.key)) event.preventDefault();
      if (target) target.focus();
    });
  }

  document.querySelectorAll('[data-gj-cascader-field]').forEach(initField);
  document.addEventListener('pointerdown', function (event) {
    document.querySelectorAll('[data-gj-cascader-field]').forEach(function (field) {
      if (!field.contains(event.target)) closeField(field, false);
    });
  });
})();
