(() => {
  const names = ['量价拥挤度', '盈利质量', '短期反转', 'ETF 动量 60 日', '基金经理稳定性', '北向资金趋势', '高股息质量', '行业景气指数', '信用利差跟踪', '可转债估值', '宏观流动性', '公告事件提取', '盈利预测调整', '机构持仓变化', '市场情绪温度', '小盘成长组合', '红利低波组合', '债券久期监测', '基金风格漂移', '上市公司治理', '交易拥挤预警', '研报观点聚合', '资产配置月报'];
  const owners = ['王雅萍', '李明', '张晓宁', '陈思远'];
  const categories = ['研报', '公告', '研报', '制度文件'];
  const statuses = ['已发布', '处理中', '草稿', '已驳回'];
  const sources = ['系统上传', '外部同步', '人工录入'];
  const markets = ['A股', 'ETF', '基金'];
  let documents = names.map((name, index) => ({
    id: index + 1,
    name,
    factor: `factor_${String(index + 1).padStart(3, '0')}_${['quality', 'momentum', 'risk'][index % 3]}`,
    category: categories[index % categories.length],
    status: statuses[index % statuses.length],
    source: sources[index % sources.length],
    market: markets[index % markets.length],
    size: [4.8, 12.6, 38.4, 66.2][index % 4],
    owner: owners[index % owners.length],
    updated: `2026-08-${String(31 - index).padStart(2, '0')} ${String(9 + index % 9).padStart(2, '0')}:20`
  }));

  const $ = selector => document.querySelector(selector);
  const form = $('#queryForm');
  const tableBody = $('#tableBody');
  const tableWrap = $('.query-table-region .gj-table-wrap');
  const empty = $('#queryEmpty');
  const footer = $('#listFooter');
  const bulkBar = $('#bulkBar');
  const selectAll = $('#selectAll');
  const actionMenu = $('#actionMenu');
  const modalLayer = $('#modalLayer');
  const toast = $('#queryToast');
  const selected = new Set();
  let filters = {};
  let page = 1;
  let pageSize = 20;
  let sortDirection = 'desc';
  let pendingDelete = [];
  let actionRowId = null;
  let actionMenuTrigger = null;
  let toastTimer;
  let lastModalFocus;

  const controls = {
    category: $('#categoryFilter'), status: $('#statusFilter'), source: $('#sourceFilter'), owner: $('#ownerFilter'),
    keyword: $('#keywordFilter'), from: $('#dateFrom'), to: $('#dateTo'), size: $('#sizeFilter'), market: $('#marketFilter')
  };
  const labels = { category: '类别', status: '状态', source: '来源', owner: '创建者', keyword: '关键词', from: '开始日期', to: '结束日期', size: '大小', market: '市场' };

  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
  }

  function sizeBand(value) {
    if (value < 10) return 'small';
    if (value <= 50) return 'medium';
    return 'large';
  }

  function filteredRows() {
    const keyword = (filters.keyword || '').toLowerCase();
    return documents.filter(item =>
      (!filters.category || item.category === filters.category) &&
      (!filters.status || item.status === filters.status) &&
      (!filters.source || item.source === filters.source) &&
      (!filters.owner || item.owner.includes(filters.owner)) &&
      (!keyword || item.name.toLowerCase().includes(keyword) || item.factor.toLowerCase().includes(keyword)) &&
      (!filters.from || item.updated.slice(0, 10) >= filters.from) &&
      (!filters.to || item.updated.slice(0, 10) <= filters.to) &&
      (!filters.size || sizeBand(item.size) === filters.size) &&
      (!filters.market || item.market === filters.market)
    ).sort((a, b) => sortDirection === 'desc' ? b.updated.localeCompare(a.updated) : a.updated.localeCompare(b.updated));
  }

  function statusTag(status) {
    const tone = { '已发布': 'gj-tag-success', '处理中': 'gj-tag-warning', '已驳回': 'gj-tag-error', '草稿': '' }[status];
    return `<span class="gj-tag ${tone}">${status}</span>`;
  }

  function renderPagination(totalPages) {
    const nav = $('#pagination');
    nav.replaceChildren();
    const button = (label, target, options = {}) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `gj-page-btn${options.selected ? ' gj-page-btn-selected' : ''}`;
      el.textContent = label;
      el.disabled = options.disabled;
      if (options.selected) el.setAttribute('aria-current', 'page');
      el.addEventListener('click', () => { page = target; render(); });
      nav.append(el);
    };
    button('‹', page - 1, { disabled: page === 1 });
    let pages = totalPages <= 7 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [1, ...(page > 4 ? ['…'] : []), ...[page - 1, page, page + 1].filter(n => n > 1 && n < totalPages), ...(page < totalPages - 3 ? ['…'] : []), totalPages];
    [...new Set(pages)].forEach(value => {
      if (value === '…') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'query-page-ellipsis';
        ellipsis.textContent = '…';
        nav.append(ellipsis);
      } else button(String(value), value, { selected: value === page });
    });
    button('›', page + 1, { disabled: page === totalPages });
  }

  function syncSelection(currentRows) {
    const currentIds = currentRows.map(item => item.id);
    const checked = currentIds.filter(id => selected.has(id)).length;
    selectAll.checked = currentIds.length > 0 && checked === currentIds.length;
    selectAll.indeterminate = checked > 0 && checked < currentIds.length;
    bulkBar.hidden = selected.size === 0;
    $('#selectionCount').textContent = `已选择 ${selected.size} 项`;
    tableBody.querySelectorAll('tr').forEach(row => {
      const isSelected = selected.has(Number(row.dataset.id));
      row.classList.toggle('is-selected', isSelected);
      const box = row.querySelector('.row-check');
      if (box) box.checked = isSelected;
    });
  }

  function render() {
    closeActionMenu();
    const result = filteredRows();
    const totalPages = Math.max(1, Math.ceil(result.length / pageSize));
    page = Math.min(page, totalPages);
    const current = result.slice((page - 1) * pageSize, page * pageSize);
    tableBody.innerHTML = current.map(item => `<tr data-id="${item.id}"><td><input class="gj-checkbox row-check" type="checkbox" ${selected.has(item.id) ? 'checked' : ''} aria-label="选择${item.name}"></td><td><button class="query-name-link" type="button" data-row-action="view">${item.name}</button></td><td>${item.factor}</td><td><span class="gj-tag">${item.category}</span></td><td>${statusTag(item.status)}</td><td>${item.size.toFixed(1)} MB</td><td>${item.owner}</td><td>${item.updated}</td><td class="gj-table-action"><button class="gj-text-btn" type="button" data-row-action="view">查看</button><button class="gj-text-btn" type="button" data-row-action="edit">编辑</button><button class="gj-text-btn query-row-more" type="button" data-row-action="more" aria-haspopup="menu" aria-expanded="false">更多</button></td></tr>`).join('');
    const hasRows = result.length > 0;
    tableWrap.hidden = !hasRows;
    empty.hidden = hasRows;
    footer.hidden = !hasRows;
    $('#resultSummary').textContent = filters && Object.values(filters).some(Boolean) ? `筛选结果 ${result.length} 条` : `共 ${result.length} 条`;
    $('#totalCount').textContent = `共 ${result.length} 条，第 ${page}/${totalPages} 页`;
    if (hasRows) renderPagination(totalPages);
    syncSelection(current);
  }

  function readFilters() {
    filters = Object.fromEntries(Object.entries(controls).map(([key, control]) => [key, control.value.trim()]));
  }

  function syncFilterTags() {
    const active = Object.entries(filters).filter(([, value]) => value);
    $('#activeFilters').hidden = active.length === 0;
    $('#activeFilterTags').innerHTML = active.map(([key, value]) => `<span class="gj-tag query-filter-tag">${labels[key]}：${value}<button type="button" data-filter-key="${key}" aria-label="移除${labels[key]}筛选"></button></span>`).join('');
  }

  function applyQuery() {
    readFilters();
    selected.clear();
    page = 1;
    syncFilterTags();
    render();
  }

  function clearAllFilters() { form.reset(); }

  function openActionMenu(button, id) {
    closeActionMenu();
    actionRowId = id;
    actionMenuTrigger = button;
    const rect = button.getBoundingClientRect();
    actionMenu.style.top = `${rect.bottom + 4}px`;
    actionMenu.style.left = `${Math.max(8, rect.right - 152)}px`;
    actionMenu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    actionMenu.querySelector('[role="menuitem"]')?.focus();
  }

  function closeActionMenu(returnFocus = false) {
    actionMenu.hidden = true;
    tableBody?.querySelectorAll('[data-row-action="more"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    if (returnFocus) actionMenuTrigger?.focus();
  }

  function openDelete(ids, focusTarget = document.activeElement) {
    pendingDelete = ids;
    $('#modalMessage').textContent = ids.length > 1 ? `将删除已选择的 ${ids.length} 个文档。删除后数据无法恢复，请确认是否继续。` : '删除后数据将无法恢复，请确认是否继续。';
    lastModalFocus = focusTarget;
    modalLayer.hidden = false;
    $('#modalCancel').focus();
  }

  function closeModal() {
    modalLayer.hidden = true;
    pendingDelete = [];
    lastModalFocus?.focus();
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const input = document.createElement('textarea');
      input.value = text;
      document.body.append(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    notify('因子 ID 已复制');
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (controls.from.value && controls.to.value && controls.from.value > controls.to.value) {
      $('#dateRangeTrigger').classList.add('gj-form-error');
      notify('开始日期不能晚于结束日期');
      $('#dateRangeTrigger').focus();
      return;
    }
    const button = $('#queryButton');
    const label = button.lastElementChild;
    button.disabled = true;
    label.textContent = '查询中…';
    $('#tableRegion').setAttribute('aria-busy', 'true');
    setTimeout(() => { applyQuery(); button.disabled = false; label.textContent = '查询'; $('#tableRegion').setAttribute('aria-busy', 'false'); }, 320);
  });
  form.addEventListener('reset', () => setTimeout(() => { filters = {}; selected.clear(); page = 1; syncFilterTags(); render(); }, 0));
  $('#clearFilters').addEventListener('click', clearAllFilters);
  $('#emptyClear').addEventListener('click', clearAllFilters);
  $('#moreFilterToggle').addEventListener('click', event => {
    const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true';
    event.currentTarget.setAttribute('aria-expanded', String(!expanded));
    $('#advancedFilters').hidden = expanded;
  });
  $('#activeFilterTags').addEventListener('click', event => {
    const button = event.target.closest('[data-filter-key]');
    if (!button) return;
    controls[button.dataset.filterKey].value = '';
    controls[button.dataset.filterKey].dispatchEvent(new Event('change', { bubbles: true }));
    applyQuery();
  });
  selectAll.addEventListener('change', () => {
    const current = filteredRows().slice((page - 1) * pageSize, page * pageSize);
    current.forEach(item => selectAll.checked ? selected.add(item.id) : selected.delete(item.id));
    syncSelection(current);
  });
  tableBody.addEventListener('change', event => {
    const checkbox = event.target.closest('.row-check');
    if (!checkbox) return;
    const id = Number(checkbox.closest('tr').dataset.id);
    checkbox.checked ? selected.add(id) : selected.delete(id);
    syncSelection(filteredRows().slice((page - 1) * pageSize, page * pageSize));
  });
  tableBody.addEventListener('click', event => {
    const button = event.target.closest('[data-row-action]');
    if (!button) return;
    const id = Number(button.closest('tr').dataset.id);
    if (button.dataset.rowAction === 'more') openActionMenu(button, id);
    else notify(button.dataset.rowAction === 'view' ? '已打开文档详情' : '已进入文档编辑');
  });
  $('#clearSelection').addEventListener('click', () => { selected.clear(); render(); });
  $('#downloadSelected').addEventListener('click', () => notify(`已开始下载 ${selected.size} 个文档`));
  $('#deleteSelected').addEventListener('click', () => openDelete([...selected]));
  $('#bulkStatus').addEventListener('change', event => {
    if (!event.target.value || selected.size === 0) return;
    documents.forEach(item => { if (selected.has(item.id)) item.status = event.target.value; });
    const count = selected.size;
    event.target.value = '';
    event.target.dispatchEvent(new Event('change', { bubbles: true }));
    selected.clear();
    render();
    notify(`已更新 ${count} 个文档的状态`);
  });
  actionMenu.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    const item = documents.find(row => row.id === actionRowId);
    const returnTarget = actionMenuTrigger;
    closeActionMenu();
    if (!item) return;
    if (action === 'copy') { copyText(item.factor); returnTarget?.focus(); }
    if (action === 'delete') openDelete([item.id], returnTarget);
  });
  document.addEventListener('pointerdown', event => { if (!actionMenu.hidden && !actionMenu.contains(event.target) && !event.target.closest('[data-row-action="more"]')) closeActionMenu(); });
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalCancel').addEventListener('click', closeModal);
  $('#modalConfirm').addEventListener('click', () => {
    const count = pendingDelete.length;
    documents = documents.filter(item => !pendingDelete.includes(item.id));
    pendingDelete.forEach(id => selected.delete(id));
    closeModal();
    render();
    notify(`已删除 ${count} 个文档`);
  });
  modalLayer.addEventListener('click', event => { if (event.target === modalLayer) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { if (!modalLayer.hidden) closeModal(); else closeActionMenu(true); } });
  $('#sortUpdated').addEventListener('click', event => {
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    $('#updatedHeader').setAttribute('aria-sort', sortDirection === 'desc' ? 'descending' : 'ascending');
    page = 1;
    render();
  });
  [controls.from, controls.to].forEach(control => control.addEventListener('change', () => $('#dateRangeTrigger').classList.remove('gj-form-error')));
  $('#pageSize').addEventListener('change', event => { pageSize = Number(event.target.value); page = 1; render(); });
  $('#pageJump').addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    const totalPages = Math.max(1, Math.ceil(filteredRows().length / pageSize));
    page = Math.min(totalPages, Math.max(1, Number(event.target.value) || 1));
    event.target.value = '';
    render();
  });

  render();
})();
