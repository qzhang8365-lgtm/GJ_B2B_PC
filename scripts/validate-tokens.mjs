#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const read = relativePath => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
const fail = message => { throw new Error(message); };

const primitive = read("references/tokens/colors-primitive.json").colors;
const semantic = read("references/tokens/colors-semantic.json").colors;
const dimensions = read("references/tokens/dimensions.json").variables;
const typography = read("references/styles/typography.json");
const fontPolicy = read("references/styles/font-policy.json");
const effects = read("references/styles/effects.json").styles;
const gradients = read("references/styles/gradients.json").styles;
const grids = read("references/layout/grids.json").styles;
const responsive = read("references/layout/responsive.json");
const contentLayout = read("references/layout/content-layout.json");
const componentButton = read("references/tokens/components/button.tokens.json");
const componentTextButton = read("references/tokens/components/text-button.tokens.json");
const componentInput = read("references/tokens/components/input.tokens.json");
const componentTable = read("references/tokens/components/table.tokens.json");
const componentSelector = read("references/tokens/components/selector.tokens.json");
const componentDropdown = read("references/tokens/components/dropdown.tokens.json");
const componentCheckbox = read("references/tokens/components/checkbox.tokens.json");
const componentRadio = read("references/tokens/components/radio.tokens.json");
const componentSwitch = read("references/tokens/components/switch.tokens.json");
const componentDivider = read("references/tokens/components/divider.tokens.json");
const componentTooltip = read("references/tokens/components/tooltip.tokens.json");
const componentNavbar = read("references/tokens/components/navbar.tokens.json");
const componentBreadcrumb = read("references/tokens/components/breadcrumb.tokens.json");
const componentCarousel = read("references/tokens/components/carousel.tokens.json");
const componentPagination = read("references/tokens/components/pagination.tokens.json");
const componentCascader = read("references/tokens/components/cascader.tokens.json");
const componentForm = read("references/tokens/components/form.tokens.json");
const componentTabs = read("references/tokens/components/tabs.tokens.json");
const componentTag = read("references/tokens/components/tag.tokens.json");
const componentDatePicker = read("references/tokens/components/date-picker.tokens.json");
const componentMetric = read("references/tokens/components/metric.tokens.json");
const componentChart = read("references/tokens/components/chart.tokens.json");
const componentSearch = read("references/tokens/components/search.tokens.json");
const componentTimePicker = read("references/tokens/components/time-picker.tokens.json");
const componentUpload = read("references/tokens/components/upload.tokens.json");
const componentSteps = read("references/tokens/components/steps.tokens.json");
const componentToast = read("references/tokens/components/toast.tokens.json");
const componentEmpty = read("references/tokens/components/empty.tokens.json");
const componentAvatar = read("references/tokens/components/avatar.tokens.json");
const componentIcon = read("references/tokens/components/icon.tokens.json");
const componentDrawer = read("references/tokens/components/drawer.tokens.json");
const componentModal = read("references/tokens/components/modal.tokens.json");
const componentSkeleton = read("references/tokens/components/skeleton.tokens.json");
const componentNotification = read("references/tokens/components/notification.tokens.json");
const componentPopover = read("references/tokens/components/popover.tokens.json");
const componentSidebar = read("references/tokens/components/sidebar.tokens.json");
const componentGridNav = read("references/tokens/components/grid-nav.tokens.json");
const componentInputNumber = read("references/tokens/components/input-number.tokens.json");
const componentImage = read("references/tokens/components/image.tokens.json");
const componentBadge = read("references/tokens/components/badge.tokens.json");
const componentTimeline = read("references/tokens/components/timeline.tokens.json");
// Structural components (no interactive stateMatrix): checked for schema validity and token
// alias resolution below, but excluded from the interactive requiredStates check via the `?? []`
// guard further down, since they are not form controls with hover/focus/disabled states.
const componentSources = [componentButton, componentTextButton, componentInput, componentTable, componentSelector, componentDropdown, componentCheckbox, componentRadio, componentSwitch, componentTag, componentDatePicker, componentSearch, componentTimePicker, componentUpload, componentCarousel, componentSteps, componentDivider, componentTooltip, componentNavbar, componentBreadcrumb, componentPagination, componentCascader, componentForm, componentTabs, componentMetric, componentChart, componentEmpty, componentToast, componentAvatar, componentIcon, componentDrawer, componentModal, componentSkeleton, componentNotification, componentPopover, componentSidebar, componentGridNav, componentInputNumber, componentImage, componentBadge, componentTimeline];
const selectorContract = read("references/components/selector/schema.json");
const dropdownContract = read("references/components/dropdown/schema.json");
const tableContract = read("references/components/table/schema.json");
const datePickerContract = read("references/components/date-picker/schema.json");
const inputContract = read("references/components/input/schema.json");
const formContract = read("references/components/form/schema.json");
const tabsContract = read("references/components/tabs/schema.json");
const docsSite = read("references/tokens/docs-site.tokens.json");
const libraryIndex = read("references/library-index.json");
const coverage = read("references/coverage.json");
const componentInventory = read("references/components/inventory.json");
const iconManifest = read("references/icons/manifest.json");
const systemIconManifest = read("references/icons/system-manifest.json");
const unified = read("references/tokens/gj-b2b.tokens.json");
const css = fs.readFileSync(path.join(root, "assets/styles/gj-b2b-tokens.css"), "utf8");
const countStateFields = value => {
  if (!value || typeof value !== "object") return 0;
  return Object.entries(value).reduce((sum, [key, child]) => {
    if (key === "review") return sum;
    if (typeof child !== "object" || child === null) return sum + 1;
    return sum + countStateFields(child);
  }, 0);
};
const expectedStateTokenCount = countStateFields(componentButton.stateMatrix)
  + countStateFields(componentTextButton.stateMatrix)
  + componentSources.slice(2).reduce((sum, component) => sum + countStateFields(component.stateMatrix), 0)
  + Object.values(componentButton.intentMatrix).reduce((sum, intent) => sum + Object.keys(intent.states).length + 1, 0);

const expectedCounts = {
  primitiveColors: Object.keys(primitive).length,
  semanticColors: Object.keys(semantic).length,
  dimensions: Object.keys(dimensions).length,
  typographyStyles: Object.keys(typography.styles).length,
  effects: Object.keys(effects).length,
  gradients: Object.keys(gradients).length,
  grids: Object.keys(grids).length,
  breakpoints: Object.keys(responsive.breakpoints).length,
  components: componentSources.length,
  componentTokens: componentSources.reduce((sum, component) => sum + Object.keys(component.tokens).length, 0),
  componentStateTokens: expectedStateTokenCount,
  docsSiteTokens: Object.keys(docsSite.tokens).length
};

for (const [name, expected] of Object.entries(expectedCounts)) {
  if (unified.meta.counts[name] !== expected) fail(`Count mismatch for ${name}: ${unified.meta.counts[name]} != ${expected}`);
}
const expectedComponentIds = ["button", "textButton", "input", "table", "selector", "dropdown", "checkbox", "radio", "switch", "tag", "date-picker", "search", "time-picker", "upload", "carousel", "steps", "toast", "divider", "tooltip", "navbar", "breadcrumb", "pagination", "cascader", "form", "tabs", "metric", "chart", "empty", "avatar", "icon", "drawer", "modal", "skeleton", "notification", "popover", "sidebar", "grid-nav", "input-number", "image", "badge", "timeline"];
if (JSON.stringify(Object.keys(unified.component)) !== JSON.stringify(expectedComponentIds)) fail("Unified component token registry is incomplete or out of order");

if (libraryIndex["$schema"] !== "gj-design-skill/library-index/v2") fail("Library index must use the complete v2 resource schema");
if (libraryIndex.aiWorkflow?.audience !== "ai-readable") fail("Library index must identify the AI-readable resource branch");
if (libraryIndex.aiWorkflow?.components !== "components/inventory.json") fail("Library index components must point only to the component inventory child index");
if (libraryIndex.aiWorkflow?.icons !== "icons/index.json") fail("Library index icons must point only to the icon child index");
const sourceIconDir = path.join(root, "assets/icons/general/system");
const underscoredSourceFiles = fs.readdirSync(sourceIconDir).filter(file => file.endsWith(".svg") && file.includes("_"));
if (underscoredSourceFiles.length) fail(`System source SVG filenames must use hyphens, found: ${underscoredSourceFiles.join(", ")}`);
const ico003Sources = {
  "system/icon-code-regular": "system/icon-code_regular",
  "system/icon-delete-back": "system/icon-delete_back",
  "system/icon-delete-back-fill": "system/icon-delete_back-fill",
  "system/icon-attachment": "system/icon_attachment"
};
for (const [canonical, legacy] of Object.entries(ico003Sources)) {
  const entry = systemIconManifest.icons.find(icon => icon.name === canonical);
  if (!entry) fail(`ICO-003 canonical source icon missing: ${canonical}`);
  if (!entry.aliases?.includes(legacy)) fail(`ICO-003 source alias missing: ${legacy} -> ${canonical}`);
  if (!fs.existsSync(path.join(root, "assets/icons/general", entry.file))) fail(`ICO-003 canonical source file missing: ${entry.file}`);
}
const compiledDeleteBackFill = iconManifest.icons.find(icon => icon.name === "icf_system_delete-back-fill");
if (!compiledDeleteBackFill) fail("ICO-003 canonical compiled icon missing: icf_system_delete-back-fill");
if (!compiledDeleteBackFill.aliases?.includes("icf_system_delete_back-fill")) fail("ICO-003 compiled compatibility alias is missing");
if (iconManifest.icons.some(icon => icon.name === "icf_system_delete_back-fill")) fail("ICO-003 legacy compiled name must not remain in the primary catalog");
if (!fs.existsSync(path.join(root, "assets/icons", compiledDeleteBackFill.file))) fail(`ICO-003 canonical compiled file missing: ${compiledDeleteBackFill.file}`);
const iconfontMapSource = fs.readFileSync(path.join(root, "assets/icons/iconfont/font/iconfont-map.js"), "utf8");
const iconCatalogSource = fs.readFileSync(path.join(root, "assets/icons/iconfont/all-icons.js"), "utf8");
const iconfontLineCss = fs.readFileSync(path.join(root, "assets/icons/iconfont/font/gj-icon-line.css"), "utf8");
const iconfontFillCss = fs.readFileSync(path.join(root, "assets/icons/iconfont/font/gj-icon-fill.css"), "utf8");
for (const [legacy, canonical] of Object.entries({
  "icf_system_code_regular": "icf_system_code-regular",
  "icf_system_delete_back": "icf_system_delete-back",
  "icf_system_delete_back-fill": "icf_system_delete-back-fill"
})) {
  if (!iconfontMapSource.includes(`'${legacy}': '${canonical}'`)) fail(`ICO-003 iconfont alias missing: ${legacy} -> ${canonical}`);
  if (!iconCatalogSource.includes(`'${legacy}': '${canonical}'`)) fail(`ICO-003 catalog search alias missing: ${legacy} -> ${canonical}`);
}
if (!iconfontLineCss.includes(".gj-line-icf-system-code_regular:before") || !iconfontLineCss.includes(".gj-line-icf-system-delete_back:before")) fail("ICO-003 line iconfont CSS aliases are missing");
if (!iconfontFillCss.includes(".gj-fill-icf-system-delete_back-fill:before")) fail("ICO-003 fill iconfont CSS alias is missing");
if (libraryIndex.aiWorkflow?.core?.coverage !== "coverage.json") fail("Library index must expose the component coverage dashboard");
for (const duplicatedIconCatalog of ["icons/manifest.json", "icons/glass-manifest.json", "icons/file-manifest.json", "icons/motion-manifest.json", "icons/system-manifest.json"]) {
  if (JSON.stringify(libraryIndex).includes(duplicatedIconCatalog)) fail(`Library index must not duplicate icon child catalog: ${duplicatedIconCatalog}`);
}
if (libraryIndex.humanPreviewSite?.audience !== "human-preview-only") fail("Library index must isolate the human preview site branch");
if (libraryIndex.scripts?.previewRuntimes?.audience !== "human-preview-only") fail("Preview runtimes must be marked human-preview-only");
const referencesRoot = path.join(root, "references");
const assertLibraryPath = (relativePath, label) => {
  if (!relativePath || relativePath.includes("<") || relativePath.includes("*") || relativePath === "aiWorkflow.icons") return;
  if (!fs.existsSync(path.resolve(referencesRoot, relativePath))) fail(`Library index path missing: ${label} -> ${relativePath}`);
};
for (const [name, relativePath] of Object.entries(libraryIndex.aiWorkflow.core)) assertLibraryPath(relativePath, `aiWorkflow.core.${name}`);
for (const sectionName of ["tokens", "styles", "layout"]) {
  for (const [name, relativePath] of Object.entries(libraryIndex.aiWorkflow[sectionName])) assertLibraryPath(relativePath, `aiWorkflow.${sectionName}.${name}`);
}
assertLibraryPath(libraryIndex.aiWorkflow.components, "aiWorkflow.components");
assertLibraryPath(libraryIndex.aiWorkflow.icons, "aiWorkflow.icons");
for (const [index, relativePath] of libraryIndex.outputAssets.styles.loadOrder.entries()) assertLibraryPath(relativePath, `outputAssets.styles.loadOrder[${index}]`);
assertLibraryPath(libraryIndex.outputAssets.fonts.root, "outputAssets.fonts.root");
const maintenanceScriptNames = ["tokenBuild", "coverageBuild", "validation", "semanticColorMigration", "pageVerification"];
for (const name of maintenanceScriptNames) assertLibraryPath(libraryIndex.scripts[name].path, `scripts.${name}.path`);
for (const [name, runtime] of Object.entries(libraryIndex.scripts.previewRuntimes)) {
  if (runtime && typeof runtime === "object" && runtime.path) assertLibraryPath(runtime.path, `scripts.previewRuntimes.${name}.path`);
}
for (const [name, relativePath] of Object.entries(libraryIndex.humanPreviewSite.entryPoints)) assertLibraryPath(relativePath, `humanPreviewSite.entryPoints.${name}`);
for (const [name, relativePath] of Object.entries(libraryIndex.humanPreviewSite.pagePatternSharedFiles)) assertLibraryPath(relativePath, `humanPreviewSite.pagePatternSharedFiles.${name}`);
assertLibraryPath(libraryIndex.humanPreviewSite.siteOnlyTokens, "humanPreviewSite.siteOnlyTokens");
assertLibraryPath(libraryIndex.humanPreviewSite.previewImagesRoot, "humanPreviewSite.previewImagesRoot");
assertLibraryPath(libraryIndex.humanPreviewSite.legacyStyles.path, "humanPreviewSite.legacyStyles.path");
const normalizeRegisteredScript = relativePath => path.relative(root, path.resolve(referencesRoot, relativePath));
const registeredMaintenanceScripts = new Set(maintenanceScriptNames.map(name => normalizeRegisteredScript(libraryIndex.scripts[name].path)));
const actualMaintenanceScripts = fs.readdirSync(path.join(root, "scripts"), { withFileTypes: true }).filter(entry => entry.isFile() && /\.(?:mjs|js)$/.test(entry.name)).map(entry => path.join("scripts", entry.name));
for (const scriptPath of actualMaintenanceScripts) if (!registeredMaintenanceScripts.has(scriptPath)) fail(`Unregistered maintenance script: ${scriptPath}`);
const registeredPreviewScripts = new Set(Object.values(libraryIndex.scripts.previewRuntimes).filter(runtime => runtime && typeof runtime === "object" && runtime.path).map(runtime => normalizeRegisteredScript(runtime.path)));
const actualPreviewScripts = fs.readdirSync(path.join(root, "assets/scripts"), { withFileTypes: true }).filter(entry => entry.isFile() && /\.js$/.test(entry.name)).map(entry => path.join("assets/scripts", entry.name));
for (const scriptPath of actualPreviewScripts) if (!registeredPreviewScripts.has(scriptPath)) fail(`Unregistered preview runtime: ${scriptPath}`);
if (coverage["$schema"] !== "gj-design-skill/component-coverage/v1") fail("Component coverage dashboard schema is invalid");
if (coverage.components.length !== coverage.summary.components) fail("Component coverage row count does not match its summary");
if (new Set(coverage.components.map(component => component.id)).size !== coverage.components.length) fail("Component coverage contains duplicate component ids");
for (const component of coverage.components) {
  for (const dimension of ["narrativeRules", "structuredContract", "componentToken", "previewPage"]) {
    if (!component[dimension]?.status) fail(`Component coverage missing ${dimension} status: ${component.component}`);
  }
}
const coverageCheck = spawnSync(process.execPath, [path.join(root, "scripts/build-coverage.mjs"), "--check"], { cwd: root, encoding: "utf8" });
if (coverageCheck.status !== 0) fail(coverageCheck.stderr.trim() || coverageCheck.stdout.trim() || "Component coverage dashboard is stale");

const componentRoot = path.join(root, "references/components");
const inventoryEntries = componentInventory.schemaRegistry?.executionOrder;
if (!Array.isArray(inventoryEntries) || inventoryEntries.length === 0) fail("Component inventory schema registry is missing or empty");
const allowedInventoryStatuses = new Set(["figma-audited", "local-contract", "rules-derived", "inventory-only"]);
const inventoryPaths = new Set();
const inventoryDirectories = new Set();
const inventoryComponents = new Set();
const inventoryOrders = new Set();
const normalizedComponentName = value => value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
for (const entry of inventoryEntries) {
  if (!entry.component || !entry.path || !entry.status) fail("Component inventory entry must include component, path, and status");
  if (!allowedInventoryStatuses.has(entry.status)) fail(`Unknown component inventory status: ${entry.component} -> ${entry.status}`);
  if (inventoryPaths.has(entry.path)) fail(`Duplicate component inventory path: ${entry.path}`);
  if (inventoryComponents.has(entry.component)) fail(`Duplicate component inventory name: ${entry.component}`);
  if (inventoryOrders.has(entry.order)) fail(`Duplicate component inventory order: ${entry.order}`);
  inventoryPaths.add(entry.path);
  inventoryComponents.add(entry.component);
  inventoryOrders.add(entry.order);

  const schemaPath = path.resolve(componentRoot, entry.path);
  if (!schemaPath.startsWith(`${componentRoot}${path.sep}`) || path.basename(schemaPath) !== "schema.json") fail(`Invalid component inventory schema path: ${entry.component} -> ${entry.path}`);
  if (!fs.existsSync(schemaPath)) fail(`Inventory component missing schema.json: ${entry.component} -> ${entry.path}`);
  const directory = path.dirname(schemaPath);
  const directoryName = path.basename(directory);
  inventoryDirectories.add(directoryName);
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  if (!["gj-design-skill/component-schema/v1", "gj-design-skill/component/v1"].includes(schema["$schema"])) fail(`Invalid component schema version: ${entry.component}`);
  if (schema.component !== entry.component) fail(`Inventory/schema component mismatch: ${entry.component} != ${schema.component}`);

  const requiredFiles = entry.status === "figma-audited"
    ? ["rules.md", "mapping.json", "audit.md"]
    : entry.status === "local-contract"
      ? schema.source?.figmaAudit === "not-planned" && schema.decision
        ? ["rules.md"]
        : ["rules.md", "mapping.json", "audit.md"]
      : entry.status === "rules-derived"
        ? ["rules.md"]
        : [];
  for (const filename of requiredFiles) {
    if (!fs.existsSync(path.join(directory, filename))) fail(`Inventory status ${entry.status} requires ${filename}: ${entry.component}`);
  }
  const pendingExtraction = schema.pendingExtraction || [];
  if (entry.status === "rules-derived" && pendingExtraction.length === 0) fail(`rules-derived component must declare pendingExtraction: ${entry.component}`);
  if ((entry.status === "figma-audited" || entry.status === "local-contract") && pendingExtraction.length > 0) fail(`${entry.status} component must not retain pendingExtraction: ${entry.component}`);
}

const actualComponentDirectories = fs.readdirSync(componentRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && !entry.name.startsWith("."))
  .map(entry => entry.name);
for (const directoryName of actualComponentDirectories) {
  if (!inventoryDirectories.has(directoryName)) fail(`Component directory is not registered in inventory: components/${directoryName}`);
  for (const filename of ["schema.json", "rules.md"]) {
    if (!fs.existsSync(path.join(componentRoot, directoryName, filename))) fail(`Registered component directory missing ${filename}: components/${directoryName}`);
  }
}
for (const directoryName of inventoryDirectories) {
  if (!actualComponentDirectories.includes(directoryName)) fail(`Inventory component directory is missing: components/${directoryName}`);
}

const componentTokenFiles = fs.readdirSync(path.join(root, "references/tokens/components"), { withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith(".tokens.json"));
for (const file of componentTokenFiles) {
  const directoryName = file.name.replace(/\.tokens\.json$/, "");
  if (!inventoryDirectories.has(directoryName)) fail(`Component token has no inventory component: tokens/components/${file.name}`);
  const token = read(`references/tokens/components/${file.name}`);
  const inventoryEntry = inventoryEntries.find(entry => path.posix.dirname(entry.path) === directoryName);
  if (normalizedComponentName(token.component) !== normalizedComponentName(inventoryEntry.component)) fail(`Inventory/component-token name mismatch: ${inventoryEntry.component} != ${token.component}`);
}
for (const retiredName of ["patterns.css", "patterns.js"]) {
  if (fs.existsSync(path.join(root, "preview/patterns", retiredName))) fail(`Retired generic page-pattern asset still exists: preview/patterns/${retiredName}`);
}
for (const filename of ["search-list.html", "form-edit.html", "object-detail.html", "step-task.html", "dashboard.html"]) {
  const source = fs.readFileSync(path.join(root, "preview/patterns", filename), "utf8");
  if (!source.includes("page-patterns.css")) fail(`Page pattern missing namespaced stylesheet: ${filename}`);
  if (/(?:^|[/'"=])patterns\.(?:css|js)(?:[?"'\s]|$)/m.test(source)) fail(`Page pattern retains generic shared asset name: ${filename}`);
}

const knownColorNames = new Set([...Object.keys(primitive), ...Object.keys(semantic)]);
for (const [name, token] of Object.entries(semantic)) {
  if (!token.usage?.trim()) fail(`Missing semantic color usage: ${name}`);
  const alias = /^\{(.+)\}$/.exec(token.value);
  if (alias && !knownColorNames.has(alias[1])) fail(`Missing color alias target: ${name} -> ${alias[1]}`);
}
for (const [name, token] of Object.entries(dimensions)) {
  if (!token.usage?.trim()) fail(`Missing dimension usage: ${name}`);
}
for (const [name, token] of Object.entries(effects)) {
  if (!token.usage?.trim()) fail(`Missing effect usage: ${name}`);
}

const knownDimensions = new Set(Object.keys(dimensions));
const knownTypography = new Set(Object.keys(typography.styles));
const knownEffects = new Set(Object.keys(effects));
for (const component of componentSources) {
  for (const [name, token] of Object.entries(component.tokens)) {
    const alias = typeof token.value === "string" && /^\{(.+)\}$/.exec(token.value);
    if (!alias) continue;
    if (!knownDimensions.has(alias[1]) && !knownTypography.has(alias[1]) && !knownColorNames.has(alias[1]) && !knownEffects.has(alias[1])) {
      fail(`Missing component token alias target: ${component.component}.${name} -> ${alias[1]}`);
    }
  }
}
const checkStateColorRefs = (componentName, value, pathParts = []) => {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    const nextPath = [...pathParts, key];
    if (typeof child === "string" && child.includes("/") && !/^(url|var|calc)\(/.test(child) && !knownColorNames.has(child)) {
      fail(`Missing state color target: ${componentName}.${nextPath.join(".")} -> ${child}`);
    }
    if (typeof child === "object") checkStateColorRefs(componentName, child, nextPath);
  }
};
checkStateColorRefs("Button", componentButton.stateMatrix);
checkStateColorRefs("Button.intent", componentButton.intentMatrix);
checkStateColorRefs("TextButton", componentTextButton.stateMatrix);
for (const component of componentSources.slice(2)) checkStateColorRefs(component.component, component.stateMatrix);

const requiredStates = {
  Input: ["outlined.hover", "outlined.focused", "outlined.error", "outlined.disabled", "filled.hover", "filled.focused", "filled.error", "filled.disabled"],
  Table: ["header.default", "row.hover", "row.selected", "row.disabled", "action.hover", "action.disabled"],
  Selector: ["hover", "focused", "selected", "error", "disabled"],
  Dropdown: ["hover", "focused", "selected", "disabled"],
  Checkbox: ["hover", "pressed", "focused", "checked", "indeterminate", "disabled", "checked-disabled"],
  Radio: ["hover", "pressed", "focused", "checked", "disabled", "checked-disabled"],
  Switch: ["off", "on", "pressed-off", "pressed-on", "focused-off", "focused-on", "disabled-off", "disabled-on"],
  Search: ["default", "focused", "filled", "disabled", "result.hover"],
  Steps: ["wait", "process", "finished"]
};
for (const component of componentSources.slice(2)) {
  if (component["$schema"] !== "gj-design-skill/component-tokens/v1") fail(`${component.component} component token schema is invalid`);
  if (!fs.existsSync(path.join(root, component.source.componentSchema))) fail(`${component.component} component schema source is missing`);
  for (const state of requiredStates[component.component] ?? []) {
    if (!component.stateMatrix[state]) fail(`${component.component} state matrix missing required state: ${state}`);
  }
}

if (fontPolicy.rules.numeric.preferredFamily !== "GJType") fail("Numeric preferred font must be GJType");
if (!fontPolicy.rules.numeric.fontFaceRequired) fail("GJType must require @font-face");
if (!fontPolicy.rules.ui?.pairingRequired) fail("UI font pairing must be required");
if (contentLayout.componentSizing?.defaultPolicy !== "same-size-per-visual-level-or-control-group") fail("Global same-level component size policy is missing");
if ((contentLayout.componentSizing?.requirements || []).length < 3) fail("Global component size policy is incomplete");
const expectedFontPairs = ["pingfang-sf", "yahei-arial", "source-sans"];
for (const pair of expectedFontPairs) {
  if (!fontPolicy.rules.ui.pairs?.[pair]) fail(`Missing approved UI font pair: ${pair}`);
}
const expectedNumericComponents = ["Metric", "Chart/Gauge", "Chart/Progress", "Chart/ProgressRing"];
if (JSON.stringify(fontPolicy.rules.numeric.allowedComponents) !== JSON.stringify(expectedNumericComponents)) {
  fail("Numeric font component whitelist changed without an explicit policy update");
}
for (const filename of ["GJType-Regular.ttf", "GJType-Medium.ttf", "GJType-Bold.ttf"]) {
  if (!fs.existsSync(path.join(root, "assets/fonts", filename))) fail(`Missing bundled font: ${filename}`);
}

if (selectorContract.selection_model?.single?.selectedOptionCardinality !== "0..1") fail("Selector single-selection cardinality must remain 0..1");
if (dropdownContract.selection_behavior?.single?.selectedOptionCardinality !== "0..1") fail("Dropdown single-selection cardinality must remain 0..1");
if (!selectorContract.selection_model?.placeholder) fail("Selector placeholder behavior must be defined");
if (selectorContract.state_ownership?.selected !== "derived from value") fail("Selector selected state must be derived from value");
if (!selectorContract.layout?.recommendedWidth || !selectorContract.layout?.minimumWidth) fail("Selector stable desktop width contract is missing");
if (JSON.stringify(dropdownContract.state_priority) !== JSON.stringify(["disabled", "selected", "focused", "hover", "default"])) fail("Dropdown state priority changed or is missing");
if (!dropdownContract.viewport_behavior?.collision || !dropdownContract.data_states?.includes("error")) fail("Dropdown viewport or async state contract is incomplete");
if (tableContract.size?.default !== "medium" || !tableContract.size?.atomic) fail("Table must default to one atomic Medium size variant");
if (tableContract.sourceAudit?.localGenerationContract !== "complete") fail("Table local generation contract must be complete");
if (!tableContract.columns?.requiredFields?.includes("widthPolicy") || !tableContract.dataStates?.loading) fail("Table column or data-state contract is incomplete");
if (datePickerContract.properties?.size?.default !== "medium") fail("DatePicker public size values must be normalized to lowercase");
for (const tier of ["small", "medium", "large"]) {
  const size = tableContract.size?.variants?.[tier];
  if (!size || size.headerHeight !== size.cellHeight) fail(`Table ${tier} header and cell heights must match`);
}
const selectorRuntime = fs.readFileSync(path.join(root, "assets/scripts/gj-selector.js"), "utf8");
const datePickerRuntime = fs.readFileSync(path.join(root, "assets/scripts/gj-date-picker.js"), "utf8");
const componentCss = fs.readFileSync(path.join(root, "assets/styles/gj-b2b-components.css"), "utf8");
const componentDocsCss = fs.readFileSync(path.join(root, "assets/styles/component-docs.css"), "utf8");
const queryListHtml = fs.readFileSync(path.join(root, "preview/patterns/search-list.html"), "utf8");
const queryListRuntime = fs.readFileSync(path.join(root, "preview/patterns/search-list.js"), "utf8");
const tablePreviewHtml = fs.readFileSync(path.join(root, "preview/table/index.html"), "utf8");
const avatarPreviewHtml = fs.readFileSync(path.join(root, "preview/avatar/index.html"), "utf8");
const paginationPreviewHtml = fs.readFileSync(path.join(root, "preview/pagination/index.html"), "utf8");
const navbarPreviewHtml = fs.readFileSync(path.join(root, "preview/navbar/index.html"), "utf8");
const breadcrumbPreviewHtml = fs.readFileSync(path.join(root, "preview/breadcrumb/index.html"), "utf8");
const inputPreviewHtml = fs.readFileSync(path.join(root, "preview/input/index.html"), "utf8");
const selectorPreviewHtml = fs.readFileSync(path.join(root, "preview/selector/index.html"), "utf8");
const formPreviewHtml = fs.readFileSync(path.join(root, "preview/form/index.html"), "utf8");
const dropdownPreviewHtml = fs.readFileSync(path.join(root, "preview/dropdown/index.html"), "utf8");
const cascaderPreviewHtml = fs.readFileSync(path.join(root, "preview/cascader/index.html"), "utf8");
const timePickerPreviewHtml = fs.readFileSync(path.join(root, "preview/time-picker/index.html"), "utf8");
const inputNumberPreviewHtml = fs.readFileSync(path.join(root, "preview/input-number/index.html"), "utf8");
const uploadPreviewHtml = fs.readFileSync(path.join(root, "preview/upload/index.html"), "utf8");
const imagePreviewHtml = fs.readFileSync(path.join(root, "preview/image/index.html"), "utf8");
const formPatternHtml = fs.readFileSync(path.join(root, "preview/patterns/form-edit.html"), "utf8");
const tabsPreviewHtml = fs.readFileSync(path.join(root, "preview/tabs/index.html"), "utf8");
if (!selectorRuntime.includes("option.setAttribute('aria-selected', String(isSelected))")) fail("Shared Selector runtime must synchronize aria-selected");
if (!selectorRuntime.includes("item.native.dispatchEvent(new Event('change'")) fail("Shared Selector runtime must emit native change");
if (!selectorRuntime.includes("if (source.value === '') return;")) fail("Shared Selector runtime must exclude empty-value placeholders from Dropdown options");
if (!selectorRuntime.includes("option.dataset.nativeIndex")) fail("Shared Selector runtime must retain native option index mapping");
if (!selectorRuntime.includes("trigger.setAttribute('role', 'combobox')")) fail("Shared Selector trigger must expose combobox semantics");
if (!selectorRuntime.includes("focusByPrefix")) fail("Shared Selector runtime must support option typeahead without changing selection");
if (!selectorPreviewHtml.includes('class="docs-shell"') || !selectorPreviewHtml.includes('docs-structure-primary')) fail("Selector preview must use the unified documentation layout and primary structure card");
if ((selectorPreviewHtml.match(/assets\/scripts\/gj-selector\.js/g) || []).length !== 1) fail("Selector preview must initialize the shared Selector runtime exactly once");
if (!selectorPreviewHtml.includes('<option value="">请选择产品类型</option>')) fail("Selector preview must model Placeholder as an empty native option");
if (selectorPreviewHtml.includes('value="cascade"') || selectorPreviewHtml.includes('value="tree"')) fail("Selector preview must not duplicate Cascader or Tree interaction implementations");
if (!selectorPreviewHtml.includes("桌面端建议 160–240px") || !selectorPreviewHtml.includes("同一表单层级")) fail("Selector preview must retain stable width and same-level size guidance");
if (selectorPreviewHtml.includes('class="selector-icon"') || !selectorPreviewHtml.includes('class="gj-selector-icon"')) fail("Selector Selection Item close icons must use the shared centered icon primitive");
for (const [name, source] of [["TimePicker", timePickerPreviewHtml], ["InputNumber", inputNumberPreviewHtml], ["Upload", uploadPreviewHtml], ["Image", imagePreviewHtml]]) {
  if (!source.includes("component-docs.css") || !source.includes("docs-legacy")) fail(`${name} preview must use the unified documentation layout`);
  if (!source.includes('class="ds-table"')) fail(`${name} preview must present specifications or rules in the shared table style`);
}
if (!timePickerPreviewHtml.includes('class="panel-preview time-system-grid"')) fail("TimePicker panel comparison must use aligned time-system cards");
if (!timePickerPreviewHtml.includes('id="staticPanel12"') || !timePickerPreviewHtml.includes('periodColumn("AM")')) fail("TimePicker 12-hour panel must include hour, minute, and AM/PM columns");
if (!componentCss.includes('.gj-time-panel-match-trigger{width:100%;min-width:var(--ds-component-time-picker-panel-width)}') || !timePickerPreviewHtml.includes('gj-time-panel-match-trigger stage-panel')) fail("TimePicker anchored popup must match its trigger without stretching time columns");
if (!componentCss.includes('.gj-upload-file-item.is-error .gj-upload-file-status-icon{color:var(--ds-component-upload-error-icon)}')) fail("Upload error status icon must inherit the semantic error token");
if (!componentCss.includes('.gj-upload-file-item.is-error .gj-upload-file-action{color:var(--ds-text-tertiary)}')) fail("Upload retry action must default to Text/Tertiary");
if (uploadPreviewHtml.includes('<img class="gj-upload-file-icon" src="../../assets/icons/iconfont/icf_system_close-circle-fill.svg"')) fail("Upload error state icons must not use non-tintable img elements");
if (imagePreviewHtml.includes("figma-audited") || imagePreviewHtml.includes("节点 3536")) fail("Image preview must not expose internal extraction or Figma process notes");
if (!componentCss.includes('.gj-dropdown-item:not([aria-selected="true"]) .gj-dropdown-check{display:none}')) fail("Unselected Dropdown check icons must be hidden by the component base style");
if (!componentCss.includes('.gj-table .gj-text-btn+.gj-text-btn{margin-left:var(--ds-component-button-group-gap-medium)}')) fail("Adjacent text actions in Table must use the medium button-group gap token");
if (!componentCss.includes('.gj-table thead .gj-table-action{z-index:2;background:var(--ds-table-head-bg)}')) fail("Fixed Table header cells must retain the Table header background token");
if (!componentCss.includes('.gj-table-sort-icon{')) fail("Shared Table sort icon style is missing");
if (!componentCss.includes('.gj-table tbody tr.is-selected td{background:var(--ds-background-selected)}')) fail("Shared Table selected-row state is missing");
if (!componentCss.includes('.gj-table tbody tr.is-disabled:hover td{background:var(--ds-table-bg-1)')) fail("Disabled Table rows must suppress hover background");
if (tabsContract.status !== "figma-audited" || tabsContract.source?.inventory?.componentSets !== 10 || tabsContract.source?.inventory?.variants !== 172) fail("Tabs Figma inventory must remain audited at 10 sets / 172 variants");
if (componentTabs.pendingExtraction?.length) fail("Tabs audit must not retain resolved pendingExtraction items");
if (componentTabs.tokens["highlight.icon-size"]?.value !== 16 || componentTabs.tokens["left.group-width"]?.value !== 96 || componentTabs.tokens["button.height.small"]?.value !== 24) fail("Tabs audited dimensions changed");
if (["small", "medium", "large"].some((size) => componentTabs.typography?.leftItem?.[size]?.active !== "中文/S4-CN-S")) fail("Tabs Left active Text Style must remain S4-CN-S across all sizes");
if (!componentCss.includes('.gj-tabs-left .gj-tab-active{padding-left:calc(var(--ds-component-tabs-left-padding-inline) - var(--ds-component-tabs-left-indicator-width));border-left:var(--ds-component-tabs-left-indicator-width) solid var(--ds-component-tabs-left-active-text);color:var(--ds-component-tabs-left-active-text);font-family:var(--ds-type-cn-s8-font-family);font-size:var(--ds-type-cn-s8-font-size);font-weight:600;line-height:var(--ds-type-cn-s8-line-height)}')) fail("Tabs Left active implementation must keep the default Medium font metrics and text baseline");
if (["checked", "indeterminate"].some((state) => componentCheckbox.stateMatrix?.[state]?.background !== "Brand/GJ_Blue" || componentCheckbox.stateMatrix?.[state]?.border !== "Brand/GJ_Blue")) fail("Checkbox checked and indeterminate fill must remain Brand/GJ_Blue");
if (componentDatePicker.stateMatrix?.["month.hover"]?.background !== "Background/Hover" || componentDatePicker.stateMatrix?.["month.hover"]?.text !== "Text/Primary") fail("DatePicker Month hover must remain Background/Hover with Text/Primary");
if (JSON.stringify(componentSearch.properties?.visualState?.values) !== JSON.stringify(["default", "focused", "filled", "disabled"]) || componentSearch.openItems?.["SEA-002"]) fail("Search state names must remain normalized after SEA-002 closure");
for (const sharedSelector of [".gj-tabs-card .gj-tab:hover:not(.gj-tab-active):not(:disabled){background:var(--ds-component-tabs-card-default-background);color:var(--ds-component-tabs-card-hover-text)}", ".gj-tabs-pill .gj-tab:hover:not(.gj-tab-active):not(:disabled){background:var(--ds-component-tabs-pill-hover-background);color:var(--ds-component-tabs-pill-hover-text)}", ".gj-tabs-left .gj-tab:hover:not(.gj-tab-active):not(:disabled){background:var(--ds-component-tabs-left-background);color:var(--ds-component-tabs-left-hover-text)}"]) {
  if (!componentCss.includes(sharedSelector)) fail(`Shared Tabs base missing audited state selector: ${sharedSelector}`);
}
if (!tabsPreviewHtml.includes('role="tablist"') || !tabsPreviewHtml.includes('aria-controls="tabs-panel"') || !tabsPreviewHtml.includes("e.key==='Home'") || !tabsPreviewHtml.includes("e.key==='End'")) fail("Tabs specification preview must retain ARIA and keyboard behavior");
if (tabsPreviewHtml.includes("提供横向滚动")) fail("Tabs specification preview must not recommend default horizontal scrolling");
if (!componentCss.includes('column-gap:var(--ds-component-date-picker-compact-grid-column-gap)')) fail("DatePicker compact grid must use the audited horizontal gap token");
if (!componentCss.includes('width:var(--ds-component-search-reference-width)')) fail("Search must use its audited 233px reference-width token");
if (!componentCss.includes('--gj-search-gap:var(--ds-component-search-size-small-focused-gap)')) fail("Search Small active/typing gap must use the audited component token");
if (!componentCss.includes('gap:var(--ds-component-search-group-gap)')) fail("Search and its paired Button must use the component group-gap token");
if (!componentCss.includes('height:var(--ds-component-search-result-item-height)')) fail("Search result items must use the component height token");
if (!componentCss.includes('height:var(--ds-component-date-picker-range-actions-height)') || !componentCss.includes('gap:var(--ds-component-date-picker-range-actions-gap)')) fail("DatePicker action area must use the audited height and gap tokens");
if (!componentCss.includes('.gj-calendar-day:disabled:hover') || !componentCss.includes('.gj-date-trigger:hover:not(:disabled)')) fail("DatePicker disabled states must suppress hover feedback");
if (!datePickerRuntime.includes("'Wed'") || datePickerRuntime.includes("'Wen'")) fail("DatePicker weekday labels must use Wed");
for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]) {
  if (!datePickerRuntime.includes(`event.key === '${key}'`)) fail(`DatePicker keyboard navigation missing ${key}`);
}
if ((tablePreviewHtml.match(/class="gj-table(?:\s|\")/g) || []).length < 3) fail("Table specification demos must compose the shared Table base, including the nested table");
if (tablePreviewHtml.includes('class="table-demo') || tablePreviewHtml.includes('class="subtable')) fail("Table specification demos must not use retired private Table implementations");
for (const sharedClass of ["gj-table-wrap", "gj-table-sort", "gj-table-head-icon", "gj-table-action", "gj-table-expand", "gj-table-icon-actions"]) {
  if (!tablePreviewHtml.includes(sharedClass)) fail(`Table specification demo missing shared composition class: ${sharedClass}`);
}
if (!tablePreviewHtml.includes("icf_Arrow_caret.svg") || !tablePreviewHtml.includes("icf_system_filter.svg")) fail("Table specification demo must use the contract sort and filter icons");
for (const [name, source, rulesLabel] of [["Table", tablePreviewHtml, "表格选用规则"], ["Avatar", avatarPreviewHtml, "头像选用规则"]]) {
  if (!source.includes('class="docs-legacy"') || !source.includes("component-docs.css")) fail(`${name} preview must use the unified documentation layout`);
  if (!source.includes("docs-structure-primary")) fail(`${name} preview must use the primary structure block`);
  if (!source.includes(`aria-label="${rulesLabel}"`)) fail(`${name} preview must present usage rules in the shared table style`);
}
if (!paginationPreviewHtml.includes('class="gj-pagination ') || !paginationPreviewHtml.includes('class="gj-page-btn')) fail("Pagination specification demos must compose the shared Pagination base");
if (paginationPreviewHtml.includes('class="pagination ') || paginationPreviewHtml.includes('class="page-btn')) fail("Pagination specification demos must not use retired private Pagination classes");
if (!componentCss.includes(".gj-page-btn-selected{background:var(--ds-component-pagination-number-selected-background") && !componentCss.includes(".gj-page-btn-selected{background:var(--ds-background-selected")) fail("Pagination selected state must use the selected-background token");
if (paginationPreviewHtml.includes("data-more")) fail("Pagination ellipsis must remain a non-interactive range indicator");
if (!paginationPreviewHtml.includes('data-step="${step}"') || !paginationPreviewHtml.includes('double?5:1')) fail("Pagination double arrows must implement the default five-page fast navigation step");
if (!navbarPreviewHtml.includes('width:var(--ds-component-navbar-menu-dropdown-width)')) fail("Navbar Menu Dropdown must consume its audited width token");
if (!navbarPreviewHtml.includes('.menu-item.active{color:var(--ds-component-navbar-menu-item-active-text);font-weight:600}')) fail("Navbar active Menu Item must keep primary text and use the audited Semibold style");
if (!navbarPreviewHtml.includes('font:600 14px/22px var(--ds-font-family-ui);cursor:pointer')) fail("Navbar dropdown rows must use the audited Semibold text style");
if (navbarPreviewHtml.includes('width:231px') || navbarPreviewHtml.includes('.menu-item.active{color:var(--ds-text-blue)')) fail("Navbar preview retains retired pre-audit values");
if (!breadcrumbPreviewHtml.includes('class="gj-breadcrumb"') || !breadcrumbPreviewHtml.includes('class="gj-breadcrumb-item"')) fail("Breadcrumb specification demos must compose the shared Breadcrumb base");
if (breadcrumbPreviewHtml.includes('class="breadcrumb"') || breadcrumbPreviewHtml.includes('class="crumb-item')) fail("Breadcrumb specification demos must not use retired private Breadcrumb classes");
if (!inputPreviewHtml.includes('class="gj-input-wrap')) fail("Input specification demos must compose the shared Input wrapper");
for (const sharedSelector of [".gj-field{", ".gj-input-wrap{", ".gj-input-wrap.outlined:focus-within", ".gj-input-wrap.filled", ".gj-input-wrap.error", ".gj-input-wrap.disabled"]) {
  if (!componentCss.includes(sharedSelector)) fail(`Shared Input base missing required selector: ${sharedSelector}`);
}
for (const sharedClass of ["gj-input-icon", "gj-input-action", "gj-input-count", "gj-form-help"]) {
  if (!inputPreviewHtml.includes(sharedClass)) fail(`Input specification demo missing shared composition class: ${sharedClass}`);
}
for (const retiredClass of ["field-icon", "icon-button", 'class="counter"', 'class="helper"', 'class="action"']) {
  if (inputPreviewHtml.includes(retiredClass)) fail(`Input specification demo retains retired private implementation: ${retiredClass}`);
}
if (inputContract.implementation?.wrapperClass !== "gj-input-wrap") fail("Input contract must declare the shared wrapper base");
if (formContract.implementation?.dependency !== "Input") fail("Form contract must declare Input as a dependency");
for (const sharedClass of ["gj-form-item", "gj-form-item-vertical", "gj-form-item-horizontal", "gj-form-content", "gj-form-help", "gj-form-label-required", "gj-form-addon-row", "gj-input-addon"]) {
  if (!formPreviewHtml.includes(sharedClass)) fail(`Form specification demo missing shared composition class: ${sharedClass}`);
}
if (!formPreviewHtml.includes('class="gj-input-wrap outlined medium')) fail("Form specification controls must compose the shared Medium Input base");
for (const retiredClass of ['class="form-item', 'class="form-label', 'class="form-content', 'class="input', 'class="help', 'class="btn']) {
  if (formPreviewHtml.includes(retiredClass)) fail(`Form specification demo retains retired private implementation: ${retiredClass}`);
}
for (const sharedSelector of [".gj-form-item-vertical{", ".gj-form-item-horizontal{", ".gj-form-content{", ".gj-form-stack{", ".gj-form-grid{", ".gj-form-addon-row{", ".gj-input-addon{"]) {
  if (!componentCss.includes(sharedSelector)) fail(`Shared Form base missing required selector: ${sharedSelector}`);
}
if (!componentCss.includes(".gj-form-item-vertical{gap:var(--ds-component-form-label-to-control-vertical,var(--ds-space-2))}")) fail("Vertical Form Item must use the audited Form label-to-control token");
for (const demoLayoutClass of ['class="state-grid"', 'class="state-name"', 'class="alignment-grid"', 'class="addon-grid"']) {
  if (!formPreviewHtml.includes(demoLayoutClass)) fail(`Form specification page missing demonstration layout class: ${demoLayoutClass}`);
}
for (const docsStructure of ['class="docs-sheet"', 'class="docs-stage docs-surface-gray"', 'class="docs-spec-table"']) {
  if (!formPreviewHtml.includes(docsStructure)) fail(`Form specification page missing unified documentation structure: ${docsStructure}`);
}
if (!componentDocsCss.includes('.docs-structure-primary{background:var(--ds-brand-gj-blue)!important')) fail("Documentation structure diagrams must expose a shared prominent primary-card style");
for (const [name, html] of [["Form", formPreviewHtml], ["Dropdown", dropdownPreviewHtml], ["Cascader", cascaderPreviewHtml]]) {
  if (!html.includes("docs-structure-primary")) fail(`${name} structure diagram must use the shared prominent primary-card style`);
}
for (const docsStructure of ['class="docs-sheet"', 'class="docs-stage docs-surface-gray"', 'class="docs-spec-table"']) {
  if (!dropdownPreviewHtml.includes(docsStructure)) fail(`Dropdown specification page missing unified documentation structure: ${docsStructure}`);
  if (!cascaderPreviewHtml.includes(docsStructure)) fail(`Cascader specification page missing unified documentation structure: ${docsStructure}`);
}
if (!dropdownPreviewHtml.includes('aria-multiselectable="true"') || !dropdownPreviewHtml.includes("state.mode==='single'&&state.selected.length>1")) fail("Dropdown specification must preserve separate single and multiple selection behavior");
if (dropdownPreviewHtml.includes('gj-dropdown-item is-hover')) fail("Dropdown static single-select example must not pin Hover beside Selected");
if (dropdownPreviewHtml.includes('data-value="Select"') || dropdownPreviewHtml.includes('>Select</button>')) fail("Dropdown specification must not render its placeholder as an option");
if (!dropdownPreviewHtml.includes('class="placement-stage"') || !dropdownPreviewHtml.includes('data-placement=')) fail("Dropdown placement guidance must use an interactive trigger stage");
if (!dropdownPreviewHtml.includes('class="menu-frame long-text-frame"') || !dropdownPreviewHtml.includes('text-overflow:ellipsis')) fail("Dropdown long-text example must visibly constrain and ellipsize its label");
if (!dropdownPreviewHtml.includes('class="scrollbar-rail"') || !dropdownPreviewHtml.includes('syncScrollThumb')) fail("Dropdown long-list example must keep a visible scrollbar indicator synchronized with scroll position");
if (!cascaderPreviewHtml.includes("state.path=state.path.slice(0,level).concat(value)") || !cascaderPreviewHtml.includes("if(!state.multiple)state.selected=[]")) fail("Cascader specification must reset stale descendants without clearing completed multi-select results");
if (!cascaderPreviewHtml.includes("!state.multiple&&state.closeLeaf")) fail("Cascader specification must support optional close-on-single-leaf behavior");
if (!formPatternHtml.includes('class="gj-form-item gj-form-item-vertical')) fail("Form page pattern must compose the shared Form Item base");
if (!formPatternHtml.includes('class="gj-input-wrap outlined medium')) fail("Form page pattern must compose the shared Medium Input base");
if (formPatternHtml.includes('class="field') || formPatternHtml.includes('class="gj-input"') || formPatternHtml.includes('class="gj-textarea"')) fail("Form page pattern retains a retired direct field/input implementation");
if (queryListHtml.includes("page-patterns.js")) fail("Query-list must not load page-pattern-wide behavior when its dedicated runtime is sufficient");
if ((queryListHtml.match(/gj-selector\.js/g) || []).length !== 1) fail("Query-list must initialize the shared Selector runtime exactly once");
if ((queryListHtml.match(/gj-date-picker\.js/g) || []).length !== 1) fail("Query-list must initialize the shared DatePicker runtime exactly once");
if (/type="date"/.test(queryListHtml)) fail("Query-list must not replace the existing DatePicker with native date inputs");
for (const requiredId of ["advancedFilters", "activeFilters", "bulkBar", "queryEmpty", "pagination", "modalLayer", "queryToast"]) {
  if (!queryListHtml.includes(`id="${requiredId}"`)) fail(`Query-list missing required interaction region: ${requiredId}`);
}
if (!queryListRuntime.includes("const selected = new Set()")) fail("Query-list row selection must have one shared selection state");
if (!queryListRuntime.includes("selectAll.indeterminate")) fail("Query-list must synchronize the partial-selection state");
if (!queryListRuntime.includes("tableWrap.hidden = !hasRows") || !queryListRuntime.includes("footer.hidden = !hasRows")) fail("Query-list empty result must replace Table and Pagination");
if (!queryListRuntime.includes("openDelete([...selected])")) fail("Bulk delete must use the confirmation flow");
if (!queryListRuntime.includes('class="query-name-link"')) fail("Query-list primary field must not inherit the Small table-action style");
if (/id="(?:downloadSelected|deleteSelected)"[^>]*gj-btn-small/.test(queryListHtml)) fail("Query-list bulk Button group must stay Medium");
if (!queryListHtml.includes("icf_Arrow_caret.svg") || !queryListHtml.includes('class="gj-table-sort"')) fail("Query-list sorting must compose the shared Table sort control and icon");
if (queryListHtml.includes("icf_editor_sort.svg")) fail("Query-list must not substitute a generic editor sort icon for the Table sort icon");
const queryPatternCss = fs.readFileSync(path.join(root, "preview/patterns/page-patterns.css"), "utf8");
if (!/\.card\{[^}]*border:0[^}]*background:var\(--ds-background-container\)/.test(queryPatternCss)) fail("L1 page-pattern cards must be borderless by default");
if (!queryPatternCss.includes(".query-filter-grid>.query-filter-pair{flex:0 0 240px}")) fail("Query-list filter items must retain stable left-aligned widths");
if (queryPatternCss.includes(".query-filter-grid{display:grid;grid-template-columns:repeat(4")) fail("Query-list filters must not use an equal-fill four-column grid");
if (queryPatternCss.includes(".query-sort") || queryPatternCss.includes(".query-sort-icon")) fail("Page CSS must not redraw the shared Table sort control");

const cssVariables = [
  ...Object.values(unified.color.primitive),
  ...Object.values(unified.color.semantic),
  ...Object.values(unified.dimension),
  ...Object.values(unified.effect),
  ...Object.values(unified.gradient),
  ...Object.values(unified.component).flatMap(component => Object.values(component.tokens))
].map(token => token.cssVariable);
const collectComponentStateVariables = value => {
  if (!value || typeof value !== "object") return [];
  if (value.cssVariable) return [value.cssVariable];
  return Object.values(value).flatMap(collectComponentStateVariables);
};
for (const component of Object.values(unified.component)) cssVariables.push(...collectComponentStateVariables(component.stateMatrix));
cssVariables.push(...collectComponentStateVariables(unified.component.button.intentMatrix));
const filteredCssVariables = cssVariables.filter(Boolean);
if (new Set(filteredCssVariables).size !== filteredCssVariables.length) fail("Duplicate CSS variable name in unified token package");
for (const variable of filteredCssVariables) {
  if (!css.includes(`${variable}:`)) fail(`Generated CSS missing variable: ${variable}`);
}
for (const token of Object.values(typography.styles)) {
  if (!css.includes(`.${token.cssClass} {`)) fail(`Generated CSS missing typography class: ${token.cssClass}`);
}

const previewRoot = path.join(root, "preview");
const previewFiles = [];
const walkPreview = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walkPreview(fullPath);
    else if (/\.(html|css)$/.test(entry.name)) previewFiles.push(fullPath);
  }
};
walkPreview(previewRoot);
for (const file of previewFiles) {
  const source = fs.readFileSync(file, "utf8");
  if (source.includes("semantic-colors.css") || source.includes("fonts.css") || source.includes("preview-lightweight.css") || source.includes("design-styles.css") || source.includes("responsive.css")) fail(`Legacy stylesheet import remains: ${path.relative(root, file)}`);
  if (/\bRoboto\b/i.test(source)) fail(`Unapproved Roboto binding remains: ${path.relative(root, file)}`);
  if (file.endsWith(".html") && !source.includes("gj-b2b-tokens.css")) fail(`Unified token import missing: ${path.relative(root, file)}`);
  if (file.endsWith(".html") && !source.includes("font-runtime.js")) fail(`Local font runtime missing: ${path.relative(root, file)}`);
  if (file.endsWith(".html") && /<select[^>]*class="[^"]*gj-select/.test(source) && !source.includes("assets/scripts/gj-selector.js")) fail(`Shared Selector runtime missing: ${path.relative(root, file)}`);
  if (/font(?:-family)?\s*:[^;}]*(?:PingFang|Microsoft YaHei|Source Han Sans|Noto Sans CJK|Roboto)/i.test(source)) fail(`Direct UI font family binding remains: ${path.relative(root, file)}`);
}

console.log(JSON.stringify({
  status: "ok",
  counts: expectedCounts,
  checkedInventoryComponents: inventoryEntries.length,
  checkedComponentDirectories: actualComponentDirectories.length,
  checkedComponentTokenFiles: componentTokenFiles.length,
  checkedCssVariables: filteredCssVariables.length,
  checkedAliases: Object.values(semantic).filter(token => /^\{(.+)\}$/.test(token.value)).length
}, null, 2));
