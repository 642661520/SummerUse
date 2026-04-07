import process from 'node:process';
import { parseVariantGroup, notNull, collapseVariantGroup, createGenerator } from '@unocss/core';
import { loadConfig } from '@unocss/config';
import { runAsWorker } from 'synckit';

async function sortRules(rules, uno) {
  const unknown = [];
  if (!uno.config.details)
    uno.config.details = true;
  const expandedResult = parseVariantGroup(rules);
  rules = expandedResult.expanded;
  const result = await Promise.all(rules.split(/\s+/g).map(async (i) => {
    const token = await uno.parseToken(i);
    if (token == null) {
      unknown.push(i);
      return void 0;
    }
    const variantRank = (token[0][5]?.variantHandlers?.length || 0) * 1e5;
    const order = token[0][0] + variantRank;
    return [order, i];
  }));
  let sorted = result.filter(notNull).sort((a, b) => {
    let result2 = a[0] - b[0];
    if (result2 === 0)
      result2 = a[1].localeCompare(b[1]);
    return result2;
  }).map((i) => i[1]).join(" ");
  if (expandedResult?.prefixes.length)
    sorted = collapseVariantGroup(sorted, expandedResult.prefixes);
  return [...unknown, sorted].join(" ").trim();
}

const promises = /* @__PURE__ */ new Map();
process.env.ESLINT ||= "true";
async function _getGenerator(configPath) {
  const { config, sources } = await loadConfig(
    process.cwd(),
    configPath
  );
  if (!sources.length)
    throw new Error("[@unocss/eslint-plugin] No config file found, create a `uno.config.ts` file in your project root and try again.");
  return createGenerator({
    ...config,
    warn: false
  });
}
async function getGenerator(configPath) {
  let promise = promises.get(configPath);
  if (!promise) {
    promise = _getGenerator(configPath);
    promises.set(configPath, promise);
  }
  return await promise;
}
function setGenerator(generator, configPath) {
  promises.set(configPath, Promise.resolve(generator));
}
async function actionSort(configPath, classes) {
  return await sortRules(classes, await getGenerator(configPath));
}
async function actionBlocklist(configPath, classes, id) {
  const uno = await getGenerator(configPath);
  const blocked = /* @__PURE__ */ new Map();
  const extracted = await uno.applyExtractors(classes, id);
  const values = [...extracted.values()];
  const getMeta = (raw, meta) => {
    return meta?.message ? {
      ...meta,
      message: typeof meta.message === "function" ? meta.message(raw) : meta.message
    } : meta;
  };
  const matchBlocked = async (raw) => {
    if (blocked.has(raw))
      return;
    const rule = uno.getBlocked(raw);
    if (rule) {
      blocked.set(raw, getMeta(raw, rule[1]));
      return;
    }
    let current = raw;
    for (const p of uno.config.preprocess)
      current = p(raw);
    const results = await uno.matchVariants(raw, current);
    const rules = results.map((r) => r && uno.getBlocked(r[1]));
    for (const rule2 of rules) {
      if (rule2)
        blocked.set(raw, getMeta(raw, rule2[1]));
    }
  };
  await Promise.all(values.map(matchBlocked));
  return [...blocked];
}
async function runAsync(configPath, action, ...args) {
  switch (action) {
    case "sort":
      return actionSort(configPath, ...args);
    case "blocklist":
      return actionBlocklist(configPath, ...args);
  }
}
function run(configPath, action, ...args) {
  return runAsync(configPath, action, ...args);
}
runAsWorker(run);

export { getGenerator, run, runAsync, setGenerator };
