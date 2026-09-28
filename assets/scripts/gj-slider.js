/**
 * gj-slider.js — shared foundation behavior for `.gj-slider` (range input) instances.
 *
 * Problem this fixes: `.gj-slider`'s filled track segment is driven by `--start`/`--end`
 * CSS custom properties set on the `.gj-slider` wrapper itself (see `.gj-slider-track`'s
 * gradient in gj-b2b-components.css) — they only move when something explicitly
 * recalculates them from the current <input type="range"> value(s). This logic already
 * existed once, hand-written per page (see `initStaticSliders()` in
 * preview/input-number/index.html), but wasn't shared — so any *other* `.gj-slider`
 * usage that doesn't reimplement it (e.g. Audio's static "组件结构" demo bar) drags the
 * thumb without moving the fill. That's a foundation gap, not a one-off bug: the next
 * new static/demo `.gj-slider` usage would hit it again.
 *
 * This script generalizes that exact logic (single-thumb and two-thumb/range cases,
 * plus optional `.gj-slider-tooltip` sync) and auto-wires every `.gj-slider` on the
 * page, so consuming pages don't need to hand-roll it. A page with its own bespoke
 * playback logic (e.g. preview/audio/index.html's interactive demo, which also drives
 * playback state/time text) can keep that handler — this script's updates to
 * `--start`/`--end`/`--tip*` are additive and idempotent (`dataset.gjSliderBound`
 * guards against double-binding), so both can coexist safely.
 *
 * Usage: `<script src="../../assets/scripts/gj-slider.js" defer></script>` (adjust the
 * relative path) on any page that renders `.gj-slider` markup.
 */
(function () {
  "use strict";

  function percent(input) {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    if (max === min) return 0;
    return Math.min(100, Math.max(0, ((Number(input.value) - min) / (max - min)) * 100));
  }

  function syncSingle(slider, input) {
    const p = percent(input);
    slider.style.setProperty("--end", p + "%");
    slider.style.setProperty("--tip", p + "%");
    const tip = slider.querySelector(".gj-slider-tooltip");
    if (tip) tip.textContent = input.value;
  }

  function syncRange(slider, inputs, movedIndex) {
    let start = Number(inputs[0].value);
    let end = Number(inputs[1].value);
    // Keep the two thumbs from crossing, matching the established input-number logic.
    if (movedIndex === 0) {
      start = Math.min(start, end);
      inputs[0].value = String(start);
    } else {
      end = Math.max(end, start);
      inputs[1].value = String(end);
    }
    const a = percent(inputs[0]);
    const b = percent(inputs[1]);
    slider.style.setProperty("--start", a + "%");
    slider.style.setProperty("--end", b + "%");
    slider.style.setProperty("--tip", a + "%");
    slider.style.setProperty("--tip-end", b + "%");
    const tips = slider.querySelectorAll(".gj-slider-tooltip");
    if (tips[0]) tips[0].textContent = String(start);
    if (tips[1]) tips[1].textContent = String(end);
  }

  function bind(slider) {
    if (slider.dataset.gjSliderBound === "1") return;
    slider.dataset.gjSliderBound = "1";
    const inputs = Array.prototype.slice.call(slider.querySelectorAll("input[type=range]"));
    if (!inputs.length) return;
    inputs.forEach((input, index) => {
      const handler = () => {
        if (inputs.length === 1) syncSingle(slider, input);
        else syncRange(slider, inputs, index);
      };
      input.addEventListener("input", handler);
      input.addEventListener("change", handler);
    });
  }

  function bindAll(root) {
    (root || document).querySelectorAll(".gj-slider").forEach(bind);
  }

  function init() {
    bindAll(document);
    // Cover sliders inserted later (e.g. dynamically re-rendered demo markup) without
    // requiring every future page to call an init function manually.
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.matches && node.matches(".gj-slider")) bind(node);
          if (node.querySelectorAll) bindAll(node);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
