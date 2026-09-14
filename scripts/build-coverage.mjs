#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const referencesRoot = path.join(root, "references");
const inventoryPath = path.join(referencesRoot, "components/inventory.json");
const coveragePath = path.join(referencesRoot, "coverage.json");

const readJson = filePath => JSON.parse(fs.readFileSync(filePath, "utf8"));
const exists = relativePath => fs.existsSync(path.join(referencesRoot, relativePath));
const normalize = value => value
  .normalize("NFKC")
  .replace(/✅/g, "")
  .replace(/[^a-zA-Z0-9]/g, "")
  .toLowerCase();
const toKebab = value => value
  .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
  .replace(/[^a-zA-Z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .toLowerCase();
const statusCount = items => Object.fromEntries([...new Set(items)].sort().map(status => [status, items.filter(item => item === status).length]));

const inventory = readJson(inventoryPath);
const registry = inventory.schemaRegistry.executionOrder;
const inventoryPages = inventory.groups
  .filter(group => !["foundation", "legacy", "business"].includes(group.name))
  .flatMap(group => group.pages.map(page => ({ ...page, group: group.name })));
const registeredPageKeys = new Set();

const previewDirectories = fs.readdirSync(path.join(root, "preview"), { withFileTypes: true })
  .filter(entry => entry.isDirectory() && fs.existsSync(path.join(root, "preview", entry.name, "index.html")))
  .map(entry => entry.name);

const findInventoryPage = entry => {
  const candidateKeys = new Set([entry.component, ...(entry.aliases || []), entry.planParent].filter(Boolean).map(normalize));
  const match = inventoryPages.find(page => candidateKeys.has(normalize(page.page)));
  if (match) registeredPageKeys.add(`${match.group}:${match.page}`);
  return match || null;
};

const findPreviewDirectory = entry => {
  const candidateKeys = new Set([entry.component, ...(entry.aliases || [])].filter(Boolean).map(normalize));
  return previewDirectories.find(directory => {
    const key = normalize(directory);
    return candidateKeys.has(key) || candidateKeys.has(key.replace(/s$/, ""));
  }) || null;
};

const makeCoverageRow = (entry, figmaPage, registered = true) => {
  const componentDirectory = registered ? path.posix.dirname(entry.path) : toKebab(entry.component);
  const rulesPath = `components/${componentDirectory}/rules.md`;
  const schemaPath = `components/${componentDirectory}/schema.json`;
  const mappingPath = `components/${componentDirectory}/mapping.json`;
  const auditPath = `components/${componentDirectory}/audit.md`;
  const tokenPath = `tokens/components/${componentDirectory}.tokens.json`;
  const previewDirectory = findPreviewDirectory(entry);
  const previewPath = previewDirectory ? `../preview/${previewDirectory}/index.html` : `../preview/${componentDirectory}/index.html`;
  const rulesPresent = exists(rulesPath);
  const schemaPresent = exists(schemaPath);
  const mappingPresent = exists(mappingPath);
  const auditPresent = exists(auditPath);
  const tokenPresent = exists(tokenPath);
  const previewPresent = fs.existsSync(path.join(referencesRoot, previewPath));
  const isMaskException = entry.component === "Mask" && schemaPresent;
  const registryStatus = registered ? entry.status : "unregistered";

  let contractStatus = "missing";
  if (schemaPresent) {
    if (registryStatus === "rules-derived" || registryStatus === "inventory-only") contractStatus = "partial";
    else if (registryStatus === "figma-audited") contractStatus = mappingPresent && auditPresent ? "complete" : "partial";
    else if (registryStatus === "local-contract") contractStatus = isMaskException || (mappingPresent && auditPresent) ? "complete" : "partial";
    else contractStatus = "partial";
  }

  const row = {
    id: componentDirectory,
    component: entry.component,
    group: entry.group || figmaPage?.group || "unregistered",
    order: entry.order ?? null,
    figmaInventory: {
      status: figmaPage ? "listed" : "missing",
      page: figmaPage?.page ?? null,
      pageMarkedComplete: Boolean(figmaPage?.page?.includes("✅")),
      componentSets: figmaPage?.sets ?? 0,
      variants: figmaPage?.variants ?? 0,
      standaloneComponents: figmaPage?.standalone ?? 0,
      relation: figmaPage && entry.planParent ? "plan-parent-page" : figmaPage ? "direct-page" : "none",
      registryStatus
    },
    narrativeRules: {
      status: rulesPresent ? "complete" : "missing",
      path: rulesPath
    },
    structuredContract: {
      status: contractStatus,
      maturity: registryStatus,
      schema: { status: schemaPresent ? "present" : "missing", path: schemaPath },
      mapping: { status: isMaskException ? "not-required" : mappingPresent ? "present" : "missing", path: isMaskException ? null : mappingPath },
      audit: { status: isMaskException ? "not-required" : auditPresent ? "present" : "missing", path: isMaskException ? null : auditPath }
    },
    componentToken: {
      status: isMaskException ? "not-required" : tokenPresent ? "complete" : "missing",
      path: isMaskException ? null : tokenPath
    },
    previewPage: {
      status: isMaskException ? "not-required" : previewPresent ? "complete" : "missing",
      path: isMaskException ? null : previewPath
    }
  };

  const dimensions = [row.narrativeRules.status, row.structuredContract.status, row.componentToken.status, row.previewPage.status];
  row.overallStatus = dimensions.every(status => status === "complete" || status === "not-required")
    ? "complete"
    : dimensions.every(status => status === "missing")
      ? "missing"
      : "partial";
  row.needs = [
    ["narrativeRules", row.narrativeRules.status],
    ["structuredContract", row.structuredContract.status],
    ["componentToken", row.componentToken.status],
    ["previewPage", row.previewPage.status]
  ].filter(([, status]) => status === "missing" || status === "partial").map(([name]) => name);
  return row;
};

const registeredRows = registry.map(entry => makeCoverageRow(entry, findInventoryPage(entry)));
const unregisteredRows = inventoryPages
  .filter(page => !registeredPageKeys.has(`${page.group}:${page.page}`))
  .filter(page => page.sets + page.standalone > 0)
  .map(page => makeCoverageRow({ component: page.page.replace(/✅/g, ""), group: page.group, aliases: [] }, page, false));
const components = [...registeredRows, ...unregisteredRows];

const coverage = {
  "$schema": "gj-design-skill/component-coverage/v1",
  title: "GJ B2B PC Component Coverage",
  generatedBy: "../scripts/build-coverage.mjs",
  sourcePolicy: "Generated from the component inventory plus actual rules, contract, component-token, and preview files. Do not hand-edit component rows.",
  sources: {
    figmaInventory: "components/inventory.json",
    narrativeRulesIndex: "design-system-rules.md",
    componentRoot: "components/",
    componentTokenRoot: "tokens/components/",
    previewRoot: "../preview/"
  },
  statusDefinitions: {
    complete: "The required artifact exists and its registered maturity is sufficient.",
    partial: "An artifact exists, but its Figma extraction or required supporting files are incomplete.",
    missing: "The artifact is required but not present.",
    "not-required": "A recorded component decision explicitly excludes this artifact.",
    pageMarkedComplete: "Mirrors the ✅ character in the Figma page name only; it is not an engineering completion claim."
  },
  completionRule: "A component is complete only when narrativeRules, structuredContract, componentToken, and previewPage are complete or explicitly not-required.",
  summary: {
    components: components.length,
    registeredComponents: registeredRows.length,
    unregisteredInventoryComponents: unregisteredRows.length,
    overall: statusCount(components.map(component => component.overallStatus)),
    narrativeRules: statusCount(components.map(component => component.narrativeRules.status)),
    structuredContract: statusCount(components.map(component => component.structuredContract.status)),
    componentToken: statusCount(components.map(component => component.componentToken.status)),
    previewPage: statusCount(components.map(component => component.previewPage.status))
  },
  components
};

const serializedCoverage = `${JSON.stringify(coverage, null, 2)}\n`;
if (process.argv.includes("--check")) {
  if (!fs.existsSync(coveragePath) || fs.readFileSync(coveragePath, "utf8") !== serializedCoverage) {
    console.error("references/coverage.json is stale. Run: node scripts/build-coverage.mjs");
    process.exit(1);
  }
  console.log("references/coverage.json is current.");
} else {
  fs.writeFileSync(coveragePath, serializedCoverage);
  console.log(JSON.stringify(coverage.summary, null, 2));
}
