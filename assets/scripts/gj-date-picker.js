(() => {
  const scriptUrl = document.currentScript?.src || location.href;
  const iconRoot = new URL('../icons/iconfont/', scriptUrl).href;
  const icons = {
    doubleLeft: `${iconRoot}icf_Arrow_tarrows-left-regular.svg`,
    left: `${iconRoot}icf_Arrow_left.svg`,
    right: `${iconRoot}icf_Arrow_right.svg`,
    doubleRight: `${iconRoot}icf_Arrow_arrows-right-regular.svg`
  };
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const instances = [];
  const pad = value => String(value).padStart(2, '0');
  const key = (year, month, date) => `${year}-${pad(month + 1)}-${pad(date)}`;
  const serial = value => value ? new Date(`${value}T00:00:00`).getTime() : NaN;

  function close(item, returnFocus = false) {
    item.panel.hidden = true;
    item.trigger.setAttribute('aria-expanded', 'false');
    item.pendingStart = item.start.value;
    item.pendingEnd = item.end.value;
    if (returnFocus) item.trigger.focus();
  }

  function closeOthers(current) {
    instances.forEach(item => { if (item !== current) close(item); });
  }

  function icon(url) {
    return `<span class="gj-date-panel-icon" style="--gj-icon:url('${url}')" aria-hidden="true"></span>`;
  }

  function header(item, date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    return `<div class="gj-calendar-header"><button class="gj-calendar-nav" type="button" data-date-nav="-12" aria-label="上一年">${icon(icons.doubleLeft)}</button><button class="gj-calendar-nav" type="button" data-date-nav="-1" aria-label="上个月">${icon(icons.left)}</button><span class="gj-calendar-title">${monthNames[month]}&nbsp;&nbsp;${year}</span><button class="gj-calendar-nav" type="button" data-date-nav="1" aria-label="下个月">${icon(icons.right)}</button><button class="gj-calendar-nav" type="button" data-date-nav="12" aria-label="下一年">${icon(icons.doubleRight)}</button></div>`;
  }

  function monthDays(item, year, month) {
    const first = (new Date(year, month, 1).getDay() + 6) % 7;
    const count = new Date(year, month + 1, 0).getDate();
    const previousCount = new Date(year, month, 0).getDate();
    const total = first + count <= 35 ? 35 : 42;
    const today = new Date();
    const todayKey = key(today.getFullYear(), today.getMonth(), today.getDate());
    let cells = '';
    for (let index = 0; index < total; index += 1) {
      let date;
      let targetMonth = month;
      let targetYear = year;
      let other = false;
      if (index < first) {
        date = previousCount - first + index + 1;
        targetMonth -= 1;
        other = true;
      } else if (index >= first + count) {
        date = index - first - count + 1;
        targetMonth += 1;
        other = true;
      } else date = index - first + 1;
      if (targetMonth < 0) { targetMonth = 11; targetYear -= 1; }
      if (targetMonth > 11) { targetMonth = 0; targetYear += 1; }
      const value = key(targetYear, targetMonth, date);
      const classes = ['gj-calendar-day'];
      if (other) classes.push('gj-calendar-day-other');
      if (value === todayKey) classes.push('gj-calendar-day-today');
      if (item.pendingStart && item.pendingEnd && serial(value) > serial(item.pendingStart) && serial(value) < serial(item.pendingEnd)) classes.push('gj-calendar-day-range');
      if (value === item.pendingStart) classes.push('gj-calendar-day-start');
      if (value === item.pendingEnd) classes.push('gj-calendar-day-end');
      const selected = value === item.pendingStart || value === item.pendingEnd;
      cells += `<button class="${classes.join(' ')}" type="button" role="gridcell" tabindex="-1" data-date-value="${value}" aria-selected="${selected}"${value === todayKey ? ' aria-current="date"' : ''}>${date}</button>`;
    }
    return `<div class="gj-calendar-weekdays" aria-hidden="true">${weekNames.map(name => `<span>${name}</span>`).join('')}</div><div class="gj-calendar-days" role="grid">${cells}</div>`;
  }

  function calendar(item, date) {
    return `<section class="gj-calendar">${header(item, date)}${monthDays(item, date.getFullYear(), date.getMonth())}</section>`;
  }

  function render(item) {
    const first = new Date(item.cursor.getFullYear(), item.cursor.getMonth(), 1);
    const second = new Date(first.getFullYear(), first.getMonth() + 1, 1);
    item.panel.innerHTML = `<div class="gj-calendar-group">${calendar(item, first)}${calendar(item, second)}</div><footer class="gj-calendar-footer"><button class="gj-btn" type="button" data-date-action="clear">清除</button><button class="gj-btn gj-btn-primary" type="button" data-date-action="confirm">确定</button></footer>`;
  }

  function shiftMonth(date, amount) {
    const day = date.getDate();
    const result = new Date(date.getFullYear(), date.getMonth() + amount, 1);
    result.setDate(Math.min(day, new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate()));
    return result;
  }

  function focusDate(item, date) {
    const value = key(date.getFullYear(), date.getMonth(), date.getDate());
    let target = item.panel.querySelector(`[data-date-value="${value}"]`);
    if (!target) {
      item.cursor = new Date(date.getFullYear(), date.getMonth(), 1);
      render(item);
      target = item.panel.querySelector(`[data-date-value="${value}"]`);
    }
    target?.focus();
  }

  function syncTrigger(item) {
    const startLabel = item.trigger.querySelector('[data-date-start]');
    const endLabel = item.trigger.querySelector('[data-date-end]');
    startLabel.textContent = item.start.value || '开始日期';
    endLabel.textContent = item.end.value || '结束日期';
    item.trigger.classList.toggle('gj-date-trigger-has-value', Boolean(item.start.value || item.end.value));
  }

  function open(item) {
    closeOthers(item);
    item.pendingStart = item.start.value;
    item.pendingEnd = item.end.value;
    const initial = item.start.value ? new Date(`${item.start.value}T00:00:00`) : new Date();
    item.cursor = new Date(initial.getFullYear(), initial.getMonth(), 1);
    render(item);
    item.panel.hidden = false;
    item.trigger.setAttribute('aria-expanded', 'true');
    item.panel.querySelector('[data-date-value]')?.focus();
  }

  document.querySelectorAll('[data-gj-date-picker]').forEach(root => {
    if (root.dataset.gjDatePickerReady === 'true') return;
    root.dataset.gjDatePickerReady = 'true';
    const item = {
      root,
      trigger: root.querySelector('.gj-date-trigger'),
      panel: root.querySelector('[data-date-panel]'),
      start: root.querySelector('input[name="dateFrom"]'),
      end: root.querySelector('input[name="dateTo"]'),
      cursor: new Date(),
      pendingStart: '',
      pendingEnd: ''
    };
    if (!item.trigger || !item.panel || !item.start || !item.end) return;
    instances.push(item);
    syncTrigger(item);

    item.trigger.addEventListener('click', () => item.panel.hidden ? open(item) : close(item, true));
    item.panel.addEventListener('click', event => {
      const dateButton = event.target.closest('[data-date-value]');
      const navButton = event.target.closest('[data-date-nav]');
      const action = event.target.closest('[data-date-action]')?.dataset.dateAction;
      if (dateButton) {
        const value = dateButton.dataset.dateValue;
        const restoreKeyboardFocus = event.detail === 0;
        if (!item.pendingStart || item.pendingEnd) { item.pendingStart = value; item.pendingEnd = ''; }
        else if (serial(value) < serial(item.pendingStart)) { item.pendingEnd = item.pendingStart; item.pendingStart = value; }
        else item.pendingEnd = value;
        render(item);
        if (restoreKeyboardFocus) item.panel.querySelector(`[data-date-value="${value}"]`)?.focus();
      } else if (navButton) {
        item.cursor.setMonth(item.cursor.getMonth() + Number(navButton.dataset.dateNav));
        render(item);
      } else if (action === 'clear') {
        item.pendingStart = '';
        item.pendingEnd = '';
        render(item);
      } else if (action === 'confirm') {
        item.start.value = item.pendingStart;
        item.end.value = item.pendingEnd;
        item.start.dispatchEvent(new Event('change', { bubbles: true }));
        item.end.dispatchEvent(new Event('change', { bubbles: true }));
        syncTrigger(item);
        close(item, true);
      }
    });
    item.panel.addEventListener('keydown', event => {
      const active = event.target.closest('[data-date-value]');
      if (!active) return;
      const current = new Date(`${active.dataset.dateValue}T00:00:00`);
      let target = null;
      if (event.key === 'ArrowLeft') target = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1);
      else if (event.key === 'ArrowRight') target = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
      else if (event.key === 'ArrowUp') target = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 7);
      else if (event.key === 'ArrowDown') target = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 7);
      else if (event.key === 'Home') target = new Date(current.getFullYear(), current.getMonth(), current.getDate() - ((current.getDay() + 6) % 7));
      else if (event.key === 'End') target = new Date(current.getFullYear(), current.getMonth(), current.getDate() + (6 - ((current.getDay() + 6) % 7)));
      else if (event.key === 'PageUp') target = shiftMonth(current, event.shiftKey ? -12 : -1);
      else if (event.key === 'PageDown') target = shiftMonth(current, event.shiftKey ? 12 : 1);
      if (!target) return;
      event.preventDefault();
      focusDate(item, target);
    });
    [item.start, item.end].forEach(input => input.addEventListener('change', () => syncTrigger(item)));
    item.start.form?.addEventListener('reset', () => setTimeout(() => syncTrigger(item), 0));
  });

  document.addEventListener('pointerdown', event => instances.forEach(item => {
    if (!item.root.contains(event.target)) close(item);
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') instances.forEach(item => { if (!item.panel.hidden) close(item, true); });
  });
})();
