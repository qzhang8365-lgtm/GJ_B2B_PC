#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

const input = {
  primitive: "references/tokens/colors-primitive.json",
  semantic: "references/tokens/colors-semantic.json",
  dimensions: "references/tokens/dimensions.json",
  typography: "references/styles/typography.json",
  fontPolicy: "references/styles/font-policy.json",
  effects: "references/styles/effects.json",
  gradients: "references/styles/gradients.json",
  grids: "references/layout/grids.json",
  responsive: "references/layout/responsive.json",
  contentLayout: "references/layout/content-layout.json",
  radiusRules: "references/layout/radius-rules.json",
  docsSite: "references/tokens/docs-site.tokens.json",
  componentButton: "references/tokens/components/button.tokens.json",
  componentTextButton: "references/tokens/components/text-button.tokens.json",
  componentInput: "references/tokens/components/input.tokens.json",
  componentTable: "references/tokens/components/table.tokens.json",
  componentSelector: "references/tokens/components/selector.tokens.json",
  componentDropdown: "references/tokens/components/dropdown.tokens.json",
  componentCheckbox: "references/tokens/components/checkbox.tokens.json",
  componentRadio: "references/tokens/components/radio.tokens.json",
  componentSwitch: "references/tokens/components/switch.tokens.json",
  componentDivider: "references/tokens/components/divider.tokens.json",
  componentTooltip: "references/tokens/components/tooltip.tokens.json",
  componentNavbar: "references/tokens/components/navbar.tokens.json",
  componentBreadcrumb: "references/tokens/components/breadcrumb.tokens.json",
  componentCarousel: "references/tokens/components/carousel.tokens.json",
  componentPagination: "references/tokens/components/pagination.tokens.json",
  componentCascader: "references/tokens/components/cascader.tokens.json",
  componentForm: "references/tokens/components/form.tokens.json",
  componentTabs: "references/tokens/components/tabs.tokens.json",
  componentTag: "references/tokens/components/tag.tokens.json",
  componentDatePicker: "references/tokens/components/date-picker.tokens.json",
  componentMetric: "references/tokens/components/metric.tokens.json",
  componentChart: "references/tokens/components/chart.tokens.json",
  componentSearch: "references/tokens/components/search.tokens.json",
  componentTimePicker: "references/tokens/components/time-picker.tokens.json",
  componentUpload: "references/tokens/components/upload.tokens.json",
  componentSteps: "references/tokens/components/steps.tokens.json",
  componentToast: "references/tokens/components/toast.tokens.json",
  componentEmpty: "references/tokens/components/empty.tokens.json",
  componentAvatar: "references/tokens/components/avatar.tokens.json",
  componentIcon: "references/tokens/components/icon.tokens.json",
  componentDrawer: "references/tokens/components/drawer.tokens.json",
  componentModal: "references/tokens/components/modal.tokens.json",
  componentSkeleton: "references/tokens/components/skeleton.tokens.json",
  componentNotification: "references/tokens/components/notification.tokens.json",
  componentPopover: "references/tokens/components/popover.tokens.json",
  componentSidebar: "references/tokens/components/sidebar.tokens.json",
  componentGridNav: "references/tokens/components/grid-nav.tokens.json",
  componentInputNumber: "references/tokens/components/input-number.tokens.json",
  componentImage: "references/tokens/components/image.tokens.json",
  componentBadge: "references/tokens/components/badge.tokens.json",
  componentTimeline: "references/tokens/components/timeline.tokens.json"
};

const output = {
  json: "references/tokens/gj-b2b.tokens.json",
  css: "assets/styles/gj-b2b-tokens.css"
};

const readJson = relativePath => JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), "utf8"));
const data = Object.fromEntries(Object.entries(input).map(([key, value]) => [key, readJson(value)]));

const slug = value => value
  .normalize("NFKD")
  .replace(/[_/&.\s]+/g, "-")
  .replace(/[^a-zA-Z0-9-]/g, "-")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "")
  .toLowerCase();

const primitiveVar = name => `--ds-${slug(name)}`;
const semanticVar = name => {
  const [group, ...parts] = name.split("/");
  let rest = parts.join("-");
  if (group === "Table") {
    rest = rest.replace(/^table_bg(\d+)$/i, "bg-$1");
  }
  return `--ds-${slug(`${group}-${rest}`)}`;
};
const dimensionVar = name => {
  const [group, raw] = name.split("/");
  if (group === "Radius") return `--ds-${slug(raw)}`;
  if (group === "Components") return `--ds-${slug(raw)}`;
  if (group === "Interval") return `--ds-${slug(raw.replace(/^space(\d+)$/i, "space-$1"))}`;
  return `--ds-${slug(name)}`;
};
const colorReferenceToCss = value => {
  const match = /^\{(.+)\}$/.exec(value);
  if (!match) return value;
  const target = match[1];
  return `var(${target.startsWith("Primitive/") ? primitiveVar(target) : semanticVar(target)})`;
};
const componentValueToCss = token => {
  const { value, unit = "" } = token;
  if (typeof value === "number") return `${value}${unit}`;
  const alias = /^\{(.+)\}$/.exec(value);
  if (!alias) return value;
  const target = alias[1];
  if (/^(Components|Interval|Radius)\//.test(target)) return `var(${dimensionVar(target)})`;
  if (target.startsWith("中文/") || target.startsWith("数字/")) return null;
  if (Object.prototype.hasOwnProperty.call(data.effects.styles, target)) return `var(--ds-effect-${effectNames[target] ?? slug(target)})`;
  return colorReferenceToCss(value);
};
const docsValueToCss = token => {
  const { value, unit = "" } = token;
  if (typeof value === "number") return `${value}${unit}`;
  const alias = /^\{(.+)\}$/.exec(value);
  if (!alias) return value;
  return `var(${dimensionVar(alias[1])})`;
};
const enrichStateMatrix = (componentId, matrix) => Object.fromEntries(Object.entries(matrix).map(([group, states]) => [group, Object.fromEntries(Object.entries(states).map(([state, fields]) => [state, Object.fromEntries(Object.entries(fields).map(([property, value]) => {
  if (property === "review") return [property, value];
  return [property, {
    value,
    cssVariable: `--ds-component-${componentId}-${slug(group)}-${slug(state)}-${slug(property)}`
  }];
}))]))]));
const enrichFlatStateMatrix = (componentId, matrix) => Object.fromEntries(Object.entries(matrix).map(([state, fields]) => [state, Object.fromEntries(Object.entries(fields).map(([property, value]) => [property, {
  value,
  cssVariable: `--ds-component-${componentId}-${slug(state)}-${slug(property)}`
}]))]));
const enrichIntentMatrix = (componentId, matrix) => Object.fromEntries(Object.entries(matrix).map(([intent, config]) => [intent, {
  ...config,
  states: Object.fromEntries(Object.entries(config.states).map(([state, value]) => [state, {
    value,
    cssVariable: `--ds-component-${componentId}-intent-${slug(intent)}-${slug(state)}-background`
  }])),
  text: {
    value: config.text,
    cssVariable: `--ds-component-${componentId}-intent-${slug(intent)}-text`
  }
}]));

const primitive = Object.fromEntries(Object.entries(data.primitive.colors).map(([name, value]) => [name, {
  value,
  cssVariable: primitiveVar(name)
}]));

const semantic = Object.fromEntries(Object.entries(data.semantic.colors).map(([name, token]) => [name, {
  ...token,
  cssVariable: semanticVar(name)
}]));

const dimensions = Object.fromEntries(Object.entries(data.dimensions.variables).map(([name, token]) => [name, {
  ...token,
  cssVariable: dimensionVar(name)
}]));

const gradientNames = {
  "蓝色渐变背景": "blue-background",
  "橙色渐变背景": "orange-background",
  "white_gradient_up": "white-up",
  "white_gradient_bottom": "white-bottom",
  "科技蓝渐变": "tech-blue",
  "极客蓝渐变": "geek-blue",
  "国金红渐变": "brand-red",
  "国金紫渐变": "brand-purple",
  "活力橙渐变": "vitality-orange",
  "灰蓝渐变": "gray-blue",
  "深蓝渐变": "deep-blue",
  "灰色渐变背景": "gray-background"
};

const gradients = Object.fromEntries(Object.entries(data.gradients.styles).map(([name, token]) => [name, {
  ...token,
  cssVariable: `--ds-gradient-${gradientNames[name] ?? slug(name)}`
}]));

const effectNames = { "Innershadow_small": "inner-shadow-small" };
const effects = Object.fromEntries(Object.entries(data.effects.styles).map(([name, token]) => [name, {
  ...token,
  cssVariable: `--ds-effect-${effectNames[name] ?? slug(name)}`
}]));

const componentButton = {
  ...data.componentButton,
  stateMatrix: enrichStateMatrix("button", data.componentButton.stateMatrix),
  intentMatrix: enrichIntentMatrix("button", data.componentButton.intentMatrix)
};
const componentTextButton = {
  ...data.componentTextButton,
  stateMatrix: enrichFlatStateMatrix("text-button", data.componentTextButton.stateMatrix)
};
const flatComponentSources = {
  input: data.componentInput,
  table: data.componentTable,
  selector: data.componentSelector,
  dropdown: data.componentDropdown,
  checkbox: data.componentCheckbox,
  radio: data.componentRadio,
  switch: data.componentSwitch,
  tag: data.componentTag,
  "date-picker": data.componentDatePicker,
  search: data.componentSearch,
  "time-picker": data.componentTimePicker,
  upload: data.componentUpload,
  carousel: data.componentCarousel,
  steps: data.componentSteps,
  toast: data.componentToast
};
const flatComponents = Object.fromEntries(Object.entries(flatComponentSources).map(([id, component]) => [id, {
  ...component,
  stateMatrix: enrichFlatStateMatrix(id, component.stateMatrix)
}]));
// Structural components: no interactive stateMatrix (not form controls), so their tokens are
// emitted as-is without the enrichFlatStateMatrix pass used for flatComponentSources.
const structuralComponentSources = {
  divider: data.componentDivider,
  tooltip: data.componentTooltip,
  navbar: data.componentNavbar,
  breadcrumb: data.componentBreadcrumb,
  pagination: data.componentPagination,
  cascader: data.componentCascader,
  form: data.componentForm,
  tabs: data.componentTabs,
  metric: data.componentMetric,
  chart: data.componentChart,
  empty: data.componentEmpty,
  avatar: data.componentAvatar,
  icon: data.componentIcon,
  drawer: data.componentDrawer,
  modal: data.componentModal,
  skeleton: data.componentSkeleton,
  notification: data.componentNotification,
  popover: data.componentPopover,
  sidebar: data.componentSidebar,
  "grid-nav": data.componentGridNav,
  "input-number": data.componentInputNumber,
  image: data.componentImage,
  badge: data.componentBadge,
  timeline: data.componentTimeline
};
const componentSources = [data.componentButton, data.componentTextButton, ...Object.values(flatComponentSources), ...Object.values(structuralComponentSources)];
const countCssVariableLeaves = value => {
  if (!value || typeof value !== "object") return 0;
  if (value.cssVariable) return 1;
  return Object.values(value).reduce((sum, child) => sum + countCssVariableLeaves(child), 0);
};

const unified = {
  "$schema": "gj-design-skill/unified-tokens/v1",
  meta: {
    name: "GJ B2B PC Design Tokens",
    mode: "PC light",
    sourcePolicy: "Derived from the read-only Figma extraction files listed below. Edit source files, then rebuild; do not hand-edit this generated file.",
    sourceFiles: Object.values(input),
    counts: {
      primitiveColors: Object.keys(primitive).length,
      semanticColors: Object.keys(semantic).length,
      dimensions: Object.keys(dimensions).length,
      typographyStyles: Object.keys(data.typography.styles).length,
      effects: Object.keys(effects).length,
      gradients: Object.keys(gradients).length,
      grids: Object.keys(data.grids.styles).length,
      breakpoints: Object.keys(data.responsive.breakpoints).length,
      components: componentSources.length,
      componentTokens: componentSources.reduce((sum, component) => sum + Object.keys(component.tokens).length, 0),
      componentStateTokens: countCssVariableLeaves(componentButton.stateMatrix) + countCssVariableLeaves(componentTextButton.stateMatrix) + countCssVariableLeaves(componentButton.intentMatrix) + Object.values(flatComponents).reduce((sum, component) => sum + countCssVariableLeaves(component.stateMatrix), 0),
      docsSiteTokens: Object.keys(data.docsSite.tokens).length
    }
  },
  color: { primitive, semantic },
  dimension: dimensions,
  typography: {
    policy: data.fontPolicy,
    letterSpacing: data.typography.letterSpacingTokens,
    numericFeatures: data.typography.numericTypographyTokens,
    styles: data.typography.styles
  },
  effect: effects,
  gradient: gradients,
  component: {
    button: componentButton,
    textButton: componentTextButton,
    ...flatComponents,
    ...structuralComponentSources
  },
  site: { docs: data.docsSite },
  layout: {
    grid: data.grids.styles,
    responsive: {
      designBaseline: data.responsive.source.designBaseline,
      minimumSupportedViewport: data.responsive.source.minimumSupportedViewport,
      validationViewports: data.responsive.validationViewports,
      breakpoints: data.responsive.breakpoints,
      ranges: data.responsive.ranges,
      rules: data.responsive.rules
    },
    spacing: data.contentLayout.baseGrid,
    cardLevels: data.contentLayout.cardLevels,
    pageMargins: data.contentLayout.pageMargins,
    radius: {
      hierarchy: data.radiusRules.cardHierarchy,
      componentDefaults: data.radiusRules.componentDefaults,
      precedence: data.radiusRules.precedence,
      flexibleCases: data.radiusRules.flexibleCases,
      flexibleRule: data.radiusRules.flexibleRule
    }
  }
};

const componentStateValueToCss = value => {
  if (typeof value === "number") return String(value);
  if (["transparent", "none", "currentColor", "inherit"].includes(value)) return value;
  if (/^(url|var|calc)\(/.test(value)) return value;
  if (Object.prototype.hasOwnProperty.call(data.primitive.colors, value) || Object.prototype.hasOwnProperty.call(data.semantic.colors, value)) {
    return colorReferenceToCss(`{${value}}`);
  }
  return value;
};
const collectCssVariableLeaves = value => {
  if (!value || typeof value !== "object") return [];
  if (value.cssVariable) return [value];
  return Object.values(value).flatMap(collectCssVariableLeaves);
};

const cssLines = [
  "/* SKILL.md workflow load target. Pair with gj-b2b-components.css.",
  "   Generated by scripts/build-tokens.mjs.",
  "   Edit the source JSON files and rebuild; do not hand-edit this file. */",
  "",
  "@font-face {",
  "  font-family: \"GJType\";",
  "  src: url(\"../fonts/GJType-Regular.ttf\") format(\"truetype\");",
  "  font-style: normal;",
  "  font-weight: 400;",
  "  font-display: swap;",
  "}",
  "",
  "@font-face {",
  "  font-family: \"GJType\";",
  "  src: url(\"../fonts/GJType-Medium.ttf\") format(\"truetype\");",
  "  font-style: normal;",
  "  font-weight: 500;",
  "  font-display: swap;",
  "}",
  "",
  "@font-face {",
  "  font-family: \"GJType\";",
  "  src: url(\"../fonts/GJType-Bold.ttf\") format(\"truetype\");",
  "  font-style: normal;",
  "  font-weight: 700;",
  "  font-display: swap;",
  "}",
  "",
  ":root {",
  "  /* Font policy */",
  `  --ds-font-family-ui-pingfang-sf: ${data.fontPolicy.rules.ui.pairs["pingfang-sf"].fontStack.map(item => item.includes(" ") ? `"${item}"` : item).join(", ")};`,
  `  --ds-font-family-ui-yahei-arial: ${data.fontPolicy.rules.ui.pairs["yahei-arial"].fontStack.map(item => item.includes(" ") ? `"${item}"` : item).join(", ")};`,
  `  --ds-font-family-ui-source-sans: ${data.fontPolicy.rules.ui.pairs["source-sans"].fontStack.map(item => item.includes(" ") ? `"${item}"` : item).join(", ")};`,
  "  --ds-font-family-ui: var(--ds-font-family-ui-pingfang-sf);",
  `  --ds-font-family-numeric: ${data.fontPolicy.rules.numeric.fontStack.map(item => item.includes(" ") ? `\"${item}\"` : item).join(", ")};`,
  "  --gj-font-family-ui: var(--ds-font-family-ui);",
  "  --gj-font-family-numeric: var(--ds-font-family-numeric);",
  "  --ds-font-numeric-tabular: tabular-nums;",
  "  --ds-font-feature-tnum: \"tnum\";",
  "",
  "  /* Primitive colors: raw palette values only */",
  ...Object.entries(primitive).map(([, token]) => `  ${token.cssVariable}: ${token.value};`),
  "",
  "  /* Semantic colors: use these in components */",
  ...Object.entries(semantic).map(([, token]) => `  ${token.cssVariable}: ${colorReferenceToCss(token.value)};`),
  "",
  "  /* Dimensions */",
  ...Object.entries(dimensions).map(([, token]) => `  ${token.cssVariable}: ${token.value}${token.unit};`),
  "",
  "  /* Component tokens */",
  ...componentSources.flatMap(component => Object.values(component.tokens).flatMap(token => {
    if (!token.cssVariable) return [];
    const cssValue = componentValueToCss(token);
    return cssValue === null ? [] : [`  ${token.cssVariable}: ${cssValue};`];
  })),
  ...Object.values(unified.component).flatMap(component => collectCssVariableLeaves(component.stateMatrix).map(token => `  ${token.cssVariable}: ${componentStateValueToCss(token.value)};`)),
  ...Object.values(componentButton.intentMatrix).flatMap(intent => [
    ...Object.values(intent.states),
    intent.text
  ].map(token => `  ${token.cssVariable}: ${colorReferenceToCss(`{${token.value}}`)};`)),
  "",
  "  /* Typography primitives and style metrics */",
  ...Object.entries(data.typography.letterSpacingTokens).map(([, token]) => `  ${token.cssVariable.replace(/^--font-/, "--ds-font-")}: ${token.value}${token.unit};`),
  ...Object.entries(data.typography.styles).flatMap(([name, token]) => {
    const family = name.startsWith("数字/") ? "numeric" : "ui";
    const id = token.cssClass.replace(/^gj-type-/, "");
    return [
      `  --ds-type-${id}-font-size: ${token.fontSize}px;`,
      `  --ds-type-${id}-line-height: ${token.lineHeight}px;`,
      `  --ds-type-${id}-font-weight: ${token.fontWeight};`,
      `  --ds-type-${id}-font-family: var(--ds-font-family-${family});`
    ];
  }),
  "",
  "  /* Effects */",
  ...Object.entries(effects).map(([, token]) => `  ${token.cssVariable}: ${token.css};`),
  "",
  "  /* Gradients */",
  ...Object.entries(gradients).map(([, token]) => `  ${token.cssVariable}: ${token.css};`),
  "",
  "  /* Grid styles */",
  ...Object.entries(data.grids.styles).flatMap(([name, token]) => {
    const id = slug(name);
    return [
      `  --ds-grid-${id}-columns: ${token.count};`,
      `  --ds-grid-${id}-gutter: ${token.gutterSize}px;`,
      `  --ds-grid-${id}-offset: ${token.offset}px;`
    ];
  }),
  "",
  "  /* Responsive defaults: 1440px design baseline */",
  ...Object.entries(data.responsive.breakpoints).map(([name, token]) => `  --ds-${slug(name)}: ${token.value}px;`),
  "  --ds-page-gutter: 24px;",
  "  --ds-content-max-width: none;",
  "",
  "  /* Card hierarchy */",
  ...Object.entries(data.contentLayout.cardLevels).flatMap(([name, token]) => [
    `  --ds-card-${name.toLowerCase()}-gap: ${token.gap}px;`,
    `  --ds-card-${name.toLowerCase()}-padding: ${token.padding}px;`
  ]),
  "",
  "  /* Documentation site only: never use in product UI */",
  ...Object.values(data.docsSite.tokens).map(token => `  ${token.cssVariable}: ${docsValueToCss(token)};`),
  "}"
];

for (const [name, token] of Object.entries(data.typography.styles)) {
  const id = token.cssClass.replace(/^gj-type-/, "");
  cssLines.push(
    "",
    `.${token.cssClass} {`,
    `  font-family: var(--ds-type-${id}-font-family);`,
    `  font-size: var(--ds-type-${id}-font-size);`,
    `  line-height: var(--ds-type-${id}-line-height);`,
    `  font-weight: var(--ds-type-${id}-font-weight);`,
    "  letter-spacing: var(--ds-font-letter-spacing-0);",
    ...(name.startsWith("数字/") ? [
      "  font-variant-numeric: var(--ds-font-numeric-tabular);",
      "  font-feature-settings: var(--ds-font-feature-tnum);"
    ] : []),
    "}"
  );
}

cssLines.push(
  "",
  ":root[data-gj-os=\"windows\"] {",
  "  --ds-font-family-ui: var(--ds-font-family-ui-yahei-arial);",
  "}",
  "",
  ":root[data-gj-os=\"macos\"] {",
  "  --ds-font-family-ui: var(--ds-font-family-ui-pingfang-sf);",
  "}",
  "",
  ":root[data-gj-os=\"other\"] {",
  "  --ds-font-family-ui: var(--ds-font-family-ui-source-sans);",
  "}",
  "",
  ":root[data-gj-font-pair=\"source-sans\"] {",
  "  --ds-font-family-ui: var(--ds-font-family-ui-source-sans);",
  "}",
  "",
  ".gj-page-content {",
  "  width: 100%;",
  "  max-width: var(--ds-content-max-width);",
  "  margin-inline: auto;",
  "  padding-inline: var(--ds-page-gutter);",
  "}",
  "",
  "@media (min-width: 1280px) and (max-width: 1359px) {",
  "  :root { --ds-page-gutter: 16px; }",
  "}",
  "",
  "@media (min-width: 1360px) and (max-width: 1919px) {",
  "  :root { --ds-page-gutter: 24px; }",
  "}",
  "",
  "@media (min-width: 1920px) and (max-width: 2559px) {",
  "  :root { --ds-page-gutter: 32px; }",
  "}",
  "",
  "@media (min-width: 2560px) {",
  "  :root { --ds-page-gutter: 40px; --ds-content-max-width: 1920px; }",
  "}",
  "",
  "html, body, button, input, select, textarea {",
  "  font-family: var(--ds-font-family-ui);",
  "}",
  ""
);

fs.writeFileSync(path.join(projectRoot, output.json), `${JSON.stringify(unified, null, 2)}\n`);
fs.writeFileSync(path.join(projectRoot, output.css), cssLines.join("\n"));

console.log(JSON.stringify({ outputs: output, counts: unified.meta.counts }, null, 2));
