/* Figma 网页导入兼容运行时（仅用于 HTML 原型 / 验证页）。
 * 数据由 scripts/embed-icons.cjs 写入 window.GJ_PC_ICONS / window.GJ_PC_ASSETS。
 * 组件基座仍使用 mask、外部图片与 inset 描边；本脚本只在生成后改变页面中的传输形式。
 */
(function () {
  var ICONS = window.GJ_PC_ICONS;
  var ASSETS = window.GJ_PC_ASSETS || {};
  if (!ICONS || typeof document === 'undefined') return;

  var ICON_NAME = /(icf_[A-Za-z0-9_.-]+?)\.svg/;
  var SIDES = ['top', 'right', 'bottom', 'left'];
  var sequence = 0;
  var pending = false;
  var observer = null;
  var touchedBorders = [];
  var touchedBackgrounds = [];

  var base = document.createElement('style');
  base.setAttribute('data-gj-pc-inline', 'base');
  base.textContent =
    '[style*="--gj-icon"],[style*="--i:"],[style*="--gj-metric-graph"],[style*="mask-image"]{' +
      '-webkit-mask:none!important;mask:none!important}' +
    '[style*="--gj-icon"]::before,[style*="--gj-icon"]::after,' +
    '[style*="--i:"]::before,[style*="--i:"]::after,' +
    '[style*="--gj-metric-graph"]::before,[style*="--gj-metric-graph"]::after,' +
    '[style*="mask-image"]::before,[style*="mask-image"]::after{' +
      '-webkit-mask:none!important;mask:none!important}' +
    '.gj-pc-inline-icon{background:none!important;-webkit-mask:none!important;mask:none!important}' +
    '.gj-pc-inline-icon>svg{display:block;width:100%;height:100%;pointer-events:none}';

  var generated = document.createElement('style');
  generated.setAttribute('data-gj-pc-inline', 'generated');
  (document.head || document.documentElement).appendChild(base);
  (document.head || document.documentElement).appendChild(generated);

  /* link/style 均位于内嵌块之前时，正文解析前先把直接 mask URL 改成 data URL，
   * 避免 Chromium file:// 在 MutationObserver 接管前发出 CORS 请求。 */
  rewriteMaskStylesheets();

  function iconName(value) {
    var match = ICON_NAME.exec(value || '');
    return match && ICONS[match[1]] ? match[1] : null;
  }

  function declaredIcon(computed, element) {
    var direct = (computed.getPropertyValue('--gj-pc-mask-icon') || '').replace(/["']/g, '').trim();
    if (direct && ICONS[direct]) return direct;
    return iconName(computed.getPropertyValue('--gj-icon')) ||
      iconName(computed.getPropertyValue('--i')) ||
      iconName(computed.getPropertyValue('--gj-metric-graph')) ||
      iconName(computed.webkitMaskImage || computed.maskImage) ||
      iconName(element && element.getAttribute && element.getAttribute('style'));
  }

  function assetKey(value) {
    if (!value || /^data:/i.test(value)) return null;
    try { value = decodeURI(value); } catch (_) {}
    var match = /(?:^|\/)assets\/((?:icons|images)\/[^?#"')]+)/.exec(value.replace(/\\/g, '/'));
    return match && ASSETS[match[1]] ? match[1] : null;
  }

  function svgBackground(svg, color) {
    var painted = svg.replace(/currentColor/g, color || 'rgb(16,24,40)');
    return 'url("data:image/svg+xml,' + encodeURIComponent(painted) + '")';
  }

  function inlineBackground(value) {
    var changed = false;
    var next = (value || '').replace(/url\((['"]?)(.*?)\1\)/g, function (full, quote, url) {
      var key = assetKey(url);
      if (!key) return full;
      changed = true;
      return 'url("' + ASSETS[key] + '")';
    });
    return changed ? next : null;
  }

  function rewriteMaskStylesheets() {
    function visit(rules) {
      for (var index = 0; index < rules.length; index++) {
        var rule = rules[index];
        if (rule.cssRules) {
          try { visit(rule.cssRules); } catch (_) {}
        }
        if (!rule.style) continue;
        ['-webkit-mask', 'mask', '-webkit-mask-image', 'mask-image'].forEach(function (property) {
          var value = rule.style.getPropertyValue(property);
          var next = inlineBackground(value);
          if (!next) return;
          var name = iconName(value);
          if (name) rule.style.setProperty('--gj-pc-mask-icon', name);
          rule.style.setProperty(property, next, rule.style.getPropertyPriority(property));
        });
      }
    }
    for (var sheetIndex = 0; sheetIndex < document.styleSheets.length; sheetIndex++) {
      try { visit(document.styleSheets[sheetIndex].cssRules); } catch (_) {}
    }
  }

  function saveInline(element, store, property) {
    var value = element.style.getPropertyValue(property);
    store[property] = value ? [value, element.style.getPropertyPriority(property)] : null;
  }

  function restoreTouched(list) {
    list.forEach(function (entry) {
      Object.keys(entry.styles).forEach(function (property) {
        var value = entry.styles[property];
        if (value) entry.element.style.setProperty(property, value[0], value[1]);
        else entry.element.style.removeProperty(property);
      });
    });
    list.length = 0;
  }

  function splitShadows(value) {
    var result = [];
    var depth = 0;
    var current = '';
    for (var index = 0; index < value.length; index++) {
      var character = value[index];
      if (character === '(') depth++;
      if (character === ')') depth--;
      if (character === ',' && !depth) {
        result.push(current.trim());
        current = '';
      } else current += character;
    }
    if (current.trim()) result.push(current.trim());
    return result;
  }

  function alpha(color) {
    var match = /rgba?\(([^)]+)\)/.exec(color || '');
    if (!match) return color === 'transparent' ? 0 : 1;
    var parts = match[1].split(/[\s,/]+/).filter(Boolean);
    return parts.length > 3 ? parseFloat(parts[3]) : 1;
  }

  function fade(color, factor) {
    var match = /rgba?\(([^)]+)\)/.exec(color || '');
    if (!match) return color;
    var parts = match[1].split(/[\s,/]+/).filter(Boolean);
    var currentAlpha = parts.length > 3 ? parseFloat(parts[3]) : 1;
    return 'rgba(' + parts[0] + ',' + parts[1] + ',' + parts[2] + ',' + (currentAlpha * factor).toFixed(3) + ')';
  }

  /* 只转换无模糊的 inset 描边：全包围或单侧 1px 线；真正的内阴影继续保留。 */
  function parseInset(value, computed) {
    if (!value || value === 'none' || value.indexOf('inset') < 0) return null;
    var sides = {};
    var rest = [];
    var converted = false;
    splitShadows(value).forEach(function (shadow) {
      var color = (/(rgba?\([^)]*\)|#[0-9a-f]+|transparent)/i.exec(shadow) || [''])[0];
      var numbers = (shadow.replace(color, '').match(/-?[\d.]+px/g) || []).map(parseFloat);
      var supported = /inset/.test(shadow) && numbers.length >= 3 && numbers[2] === 0 && color && alpha(color) > 0;
      var side = null;
      var width = 0;
      if (supported) {
        var x = numbers[0];
        var y = numbers[1];
        var spread = numbers[3] || 0;
        if (x === 0 && y === 0 && spread > 0) { side = 'all'; width = spread; }
        else if (spread === 0 && x === 0 && y !== 0) { side = y < 0 ? 'bottom' : 'top'; width = Math.abs(y); }
        else if (spread === 0 && x !== 0 && y === 0) { side = x < 0 ? 'right' : 'left'; width = Math.abs(x); }
      }
      if (side && width > 1) side = null;
      if (side && width < 1) { color = fade(color, width); width = 1; }
      var targets = side === 'all' ? SIDES : side ? [side] : [];
      var free = targets.length && targets.every(function (target) {
        return !sides[target] && (!computed || !parseFloat(computed.getPropertyValue('border-' + target + '-width')));
      });
      if (free) {
        targets.forEach(function (target) { sides[target] = [width, color]; });
        converted = true;
      } else rest.push(shadow);
    });
    return converted ? { sides: sides, rest: rest.length ? rest.join(', ') : 'none' } : null;
  }

  function convertBorder(element, computed) {
    var parsed = parseInset(computed.boxShadow, computed);
    if (!parsed) return;
    var styles = {};
    var beforeHeight = element.offsetHeight;
    var beforeWidth = element.offsetWidth;
    saveInline(element, styles, 'box-shadow');
    element.style.setProperty('box-shadow', parsed.rest, 'important');
    Object.keys(parsed.sides).forEach(function (side) {
      var width = parsed.sides[side][0];
      var padding = parseFloat(computed.getPropertyValue('padding-' + side)) || 0;
      saveInline(element, styles, 'border-' + side);
      saveInline(element, styles, 'padding-' + side);
      element.style.setProperty('border-' + side, width + 'px solid ' + parsed.sides[side][1], 'important');
      element.style.setProperty('padding-' + side, Math.max(0, padding - width) + 'px', 'important');
    });
    var heightDelta = element.offsetHeight - beforeHeight;
    var widthDelta = element.offsetWidth - beforeWidth;
    if ((heightDelta > 0.01 || widthDelta > 0.01) && computed.display.indexOf('inline') !== 0) {
      saveInline(element, styles, 'box-sizing');
      element.style.setProperty('box-sizing', 'border-box', 'important');
      if (heightDelta > 0.01) {
        saveInline(element, styles, 'height');
        element.style.setProperty('height', (element.getBoundingClientRect().height - heightDelta) + 'px', 'important');
      }
      if (widthDelta > 0.01) {
        saveInline(element, styles, 'width');
        element.style.setProperty('width', (element.getBoundingClientRect().width - widthDelta) + 'px', 'important');
      }
    }
    element.setAttribute('data-gj-pc-border', 'true');
    touchedBorders.push({ element: element, styles: styles });
  }

  function pseudoBorder(selector, computed) {
    var parsed = parseInset(computed.boxShadow, computed);
    if (!parsed) return '';
    var css = 'box-shadow:' + parsed.rest + '!important;box-sizing:border-box!important;';
    Object.keys(parsed.sides).forEach(function (side) {
      var width = parsed.sides[side][0];
      var padding = parseFloat(computed.getPropertyValue('padding-' + side)) || 0;
      css += 'border-' + side + ':' + width + 'px solid ' + parsed.sides[side][1] + '!important;';
      css += 'padding-' + side + ':' + Math.max(0, padding - width) + 'px!important;';
    });
    return selector + '{' + css + '}';
  }

  function convertBackground(element, computed) {
    var next = inlineBackground(computed.backgroundImage);
    if (!next) return;
    var styles = {};
    saveInline(element, styles, 'background-image');
    element.style.setProperty('background-image', next, 'important');
    element.setAttribute('data-gj-pc-background', 'true');
    touchedBackgrounds.push({ element: element, styles: styles });
  }

  function pseudoColor(computed) {
    return computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent'
      ? computed.backgroundColor
      : computed.color;
  }

  function run() {
    pending = false;
    generated.textContent = '';
    restoreTouched(touchedBorders);
    restoreTouched(touchedBackgrounds);
    var rules = [];
    var elements = document.body ? document.body.getElementsByTagName('*') : [];
    for (var index = 0; index < elements.length; index++) {
      var element = elements[index];
      if (element.namespaceURI === 'http://www.w3.org/2000/svg') continue;
      var computed = getComputedStyle(element);
      var name = declaredIcon(computed, element);
      if (name && (element.classList.contains('gj-pc-inline-icon') || !element.children.length)) {
        if (element.getAttribute('data-gj-pc-icon') !== name) {
          element.innerHTML = ICONS[name];
          element.setAttribute('data-gj-pc-icon', name);
          element.classList.add('gj-pc-inline-icon');
        }
      }

      convertBackground(element, computed);
      convertBorder(element, computed);

      for (var pseudoIndex = 0; pseudoIndex < 2; pseudoIndex++) {
        var pseudo = pseudoIndex ? '::after' : '::before';
        var pseudoComputed = getComputedStyle(element, pseudo);
        if (pseudoComputed.content === 'none' || pseudoComputed.content === 'normal') continue;
        var pseudoName = declaredIcon(pseudoComputed, element);
        var pseudoBackground = inlineBackground(pseudoComputed.backgroundImage);
        var hasInset = pseudoComputed.boxShadow && pseudoComputed.boxShadow.indexOf('inset') >= 0;
        if (!pseudoName && !pseudoBackground && !hasInset) continue;
        var id = element.getAttribute('data-gj-pc-pseudo');
        if (!id) {
          id = String(++sequence);
          element.setAttribute('data-gj-pc-pseudo', id);
        }
        var selector = '[data-gj-pc-pseudo="' + id + '"]' + pseudo;
        if (pseudoName) {
          rules.push(selector + '{-webkit-mask:none!important;mask:none!important;background-color:transparent!important;' +
            'background-image:' + svgBackground(ICONS[pseudoName], pseudoColor(pseudoComputed)) + '!important;' +
            'background-position:center!important;background-size:contain!important;background-repeat:no-repeat!important}');
        } else if (pseudoBackground) rules.push(selector + '{background-image:' + pseudoBackground + '!important}');
        if (hasInset) {
          var borderRule = pseudoBorder(selector, pseudoComputed);
          if (borderRule) rules.push(borderRule);
        }
      }
    }

    var images = document.images || [];
    for (var imageIndex = 0; imageIndex < images.length; imageIndex++) {
      var image = images[imageIndex];
      var source = image.getAttribute('src') || '';
      if (/^(?:data:|blob:)/i.test(source)) continue;
      var key = assetKey(source) || assetKey(image.currentSrc);
      if (key) {
        image.setAttribute('data-gj-pc-src', source);
        image.setAttribute('src', ASSETS[key]);
      }
    }

    generated.textContent = rules.join('\n');
    if (observer) observer.takeRecords();
  }

  function schedule() {
    if (pending) return;
    pending = true;
    (window.queueMicrotask || function (callback) { Promise.resolve().then(callback); })(run);
  }

  observer = new MutationObserver(function (records) {
    for (var index = 0; index < records.length; index++) {
      var target = records[index].target;
      if (target !== generated && target.parentNode !== generated && target !== base && target.parentNode !== base) {
        schedule();
        return;
      }
    }
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'src', 'aria-checked', 'aria-pressed', 'aria-selected', 'aria-expanded', 'disabled', 'checked', 'open', 'hidden'],
  });
  ['change', 'input', 'click', 'pointerover', 'pointerout', 'focusin', 'focusout'].forEach(function (eventName) {
    document.addEventListener(eventName, schedule, true);
  });
  window.addEventListener('resize', schedule);
  document.addEventListener('DOMContentLoaded', schedule);
  schedule();
  window.GJPCInlineIcons = { refresh: run };
})();
