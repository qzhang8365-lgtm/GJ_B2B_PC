(() => {
  const scriptUrl = document.currentScript?.src || location.href;
  const iconRoot = new URL('../icons/iconfont/', scriptUrl).href;
  const selectors = [];
  let nextId = 0;
  let typeahead = '';
  let typeaheadTimer = 0;

  const enabledOptions = item => item.options.filter(option => !option.disabled);
  const close = (item, returnFocus = false) => {
    item.trigger.setAttribute('aria-expanded', 'false');
    item.trigger.removeAttribute('aria-activedescendant');
    item.menu.hidden = true;
    if (returnFocus) item.trigger.focus();
  };
  const closeOthers = current => selectors.forEach(item => {
    if (item !== current) close(item);
  });
  const sync = item => {
    const selectedIndex = item.native.selectedIndex;
    const selected = selectedIndex >= 0 ? item.native.options[selectedIndex] : null;
    item.value.textContent = selected?.text || '';
    item.trigger.setAttribute('aria-label', `${item.labelText} ${selected?.text || ''}`.trim());
    item.value.classList.toggle('gj-selector-placeholder', !selected || selected.value === '');
    item.options.forEach((option, index) => {
      const isSelected = Number(option.dataset.nativeIndex) === selectedIndex;
      option.setAttribute('aria-selected', String(isSelected));
      const check = option.querySelector('.gj-dropdown-check');
      check.hidden = !isSelected;
      check.style.display = isSelected ? 'block' : 'none';
    });
  };
  const choose = (item, option) => {
    if (option.disabled) return;
    item.native.selectedIndex = Number(option.dataset.nativeIndex);
    sync(item);
    item.native.dispatchEvent(new Event('change', { bubbles: true }));
    close(item, true);
  };
  const moveFocus = (item, delta) => {
    const options = enabledOptions(item);
    if (!options.length) return;
    const current = options.indexOf(document.activeElement);
    const selectedOption = item.options.find(option => Number(option.dataset.nativeIndex) === item.native.selectedIndex);
    const selected = options.indexOf(selectedOption);
    const start = current >= 0 ? current : Math.max(0, selected);
    options[(start + delta + options.length) % options.length].focus();
  };
  const focusByPrefix = (item, character) => {
    window.clearTimeout(typeaheadTimer);
    typeahead += character.toLocaleLowerCase();
    typeaheadTimer = window.setTimeout(() => { typeahead = ''; }, 500);
    const options = enabledOptions(item);
    if (!options.length) return;
    const current = Math.max(-1, options.indexOf(document.activeElement));
    const ordered = [...options.slice(current + 1), ...options.slice(0, current + 1)];
    const match = ordered.find(option => option.textContent.trim().toLocaleLowerCase().startsWith(typeahead));
    match?.focus();
  };
  const open = (item, edge) => {
    if (item.trigger.disabled) return;
    closeOthers(item);
    item.trigger.setAttribute('aria-expanded', 'true');
    item.menu.hidden = false;
    const options = enabledOptions(item);
    if (!options.length) return;
    const selected = item.options.find(option => Number(option.dataset.nativeIndex) === item.native.selectedIndex);
    const target = edge === 'last' ? options[options.length - 1] : edge === 'first' ? options[0] : (selected?.disabled ? options[0] : selected || options[0]);
    target.focus();
  };

  document.querySelectorAll('select.gj-select').forEach(native => {
    if (native.dataset.gjSelectorReady === 'true') return;
    native.dataset.gjSelectorReady = 'true';
    const id = `gj-selector-${nextId++}`;
    const wrapper = document.createElement('span');
    wrapper.className = 'gj-selector';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'gj-selector-trigger';
    trigger.id = `${id}-trigger`;
    trigger.disabled = native.disabled;
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', `${id}-menu`);
    trigger.innerHTML = `<span class="gj-selector-value"></span><span class="gj-selector-arrow" style="--gj-icon:url('${iconRoot}icf_Arrow_down.svg')" aria-hidden="true"></span>`;
    const menu = document.createElement('div');
    menu.className = 'gj-dropdown gj-dropdown-anchor';
    menu.id = `${id}-menu`;
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-labelledby', trigger.id);
    menu.setAttribute('aria-multiselectable', 'false');
    menu.hidden = true;
    const adjacentLabel = native.previousElementSibling?.matches('label') ? native.previousElementSibling : null;
    const labelText = native.labels?.[0]?.textContent?.trim() || adjacentLabel?.textContent?.trim() || '';
    const item = { native, wrapper, trigger, menu, value: trigger.firstElementChild, labelText, options: [] };

    Array.from(native.options).forEach((source, index) => {
      if (source.value === '') return;
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'gj-dropdown-item';
      option.id = `${id}-option-${index}`;
      option.dataset.nativeIndex = String(index);
      option.disabled = source.disabled;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-disabled', String(source.disabled));
      option.innerHTML = `<span class="gj-dropdown-label"></span><span class="gj-dropdown-check" style="--gj-icon:url('${iconRoot}icf_system_check.svg')" aria-hidden="true"></span>`;
      option.firstElementChild.textContent = source.text;
      option.addEventListener('click', () => choose(item, option));
      menu.append(option);
      item.options.push(option);
    });

    native.before(wrapper);
    native.classList.add('gj-selector-native');
    native.classList.remove('gj-select');
    native.setAttribute('aria-hidden', 'true');
    native.tabIndex = -1;
    wrapper.append(native, trigger, menu);
    selectors.push(item);
    sync(item);

    trigger.addEventListener('click', () => menu.hidden ? open(item) : close(item));
    trigger.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) {
        event.preventDefault();
        close(item, true);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        open(item, event.key === 'ArrowUp' ? 'last' : undefined);
      } else if ((event.key === 'Enter' || event.key === ' ') && menu.hidden) {
        event.preventDefault();
        open(item);
      }
    });
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(item, true);
      } else if (event.key === 'Tab') {
        close(item);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        moveFocus(item, event.key === 'ArrowDown' ? 1 : -1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        const options = enabledOptions(item);
        options[event.key === 'Home' ? 0 : options.length - 1]?.focus();
      } else if ((event.key === 'Enter' || event.key === ' ') && document.activeElement?.matches('.gj-dropdown-item')) {
        event.preventDefault();
        choose(item, document.activeElement);
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        focusByPrefix(item, event.key);
      }
    });
    menu.addEventListener('focusin', event => {
      if (event.target.matches('.gj-dropdown-item')) trigger.setAttribute('aria-activedescendant', event.target.id);
    });
    native.addEventListener('change', () => sync(item));
    native.form?.addEventListener('reset', () => setTimeout(() => sync(item), 0));
  });

  document.addEventListener('pointerdown', event => selectors.forEach(item => {
    if (!item.wrapper.contains(event.target)) close(item);
  }));
})();
