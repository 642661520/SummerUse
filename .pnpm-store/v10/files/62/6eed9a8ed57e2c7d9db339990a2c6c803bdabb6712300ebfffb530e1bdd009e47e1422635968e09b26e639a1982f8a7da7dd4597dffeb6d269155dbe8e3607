import { join } from 'node:path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { createSyncFn } from 'synckit';
import { distDir } from './dirs.mjs';
import MagicString from 'magic-string';
import { AST_TOKEN_TYPES } from '@typescript-eslint/types';
import 'node:url';

const CLASS_FIELDS = ["class", "classname"];
const AST_NODES_WITH_QUOTES = ["Literal", "VLiteral"];

const syncAction = createSyncFn(join(distDir, "worker.mjs"));
const createRule = ESLintUtils.RuleCreator(
  () => "https://unocss.dev/integrations/eslint#rules"
);

const IGNORE_ATTRIBUTES = ["style", "class", "classname", "value"];
const orderAttributify = createRule({
  name: "order-attributify",
  meta: {
    type: "layout",
    fixable: "code",
    docs: {
      description: "Order of UnoCSS attributes"
    },
    messages: {
      "invalid-order": "UnoCSS attributes are not ordered"
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    const scriptVisitor = {};
    const templateBodyVisitor = {
      VStartTag(node) {
        const valueless = node.attributes.filter((i) => typeof i.key?.name === "string" && !IGNORE_ATTRIBUTES.includes(i.key?.name?.toLowerCase()) && i.value == null);
        if (!valueless.length)
          return;
        const input = valueless.map((i) => i.key.name).join(" ").trim();
        const sorted = syncAction(
          context.settings.unocss?.configPath,
          "sort",
          input
        );
        if (sorted !== input) {
          context.report({
            node,
            messageId: "invalid-order",
            fix(fixer) {
              const codeFull = context.getSourceCode();
              const offset = node.range[0];
              const code = codeFull.getText().slice(node.range[0], node.range[1]);
              const s = new MagicString(code);
              const sortedNodes = valueless.map((i) => [i.range[0] - offset, i.range[1] - offset]).sort((a, b) => b[0] - a[0]);
              for (const [start, end] of sortedNodes.slice(1))
                s.remove(start, end);
              s.overwrite(sortedNodes[0][0], sortedNodes[0][1], ` ${sorted.trim()} `);
              return fixer.replaceText(node, s.toString());
            }
          });
        }
      }
    };
    const parserServices = context?.sourceCode.parserServices || context.parserServices;
    if (parserServices == null || parserServices.defineTemplateBodyVisitor == null) {
      return scriptVisitor;
    } else {
      return parserServices?.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
    }
  }
});

const blocklist = createRule({
  name: "blocklist",
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description: "Utilities in UnoCSS blocklist"
    },
    messages: {
      "in-blocklist": '"{{name}}" is in blocklist{{reason}}'
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    const checkLiteral = (node) => {
      if (typeof node.value !== "string" || !node.value.trim())
        return;
      const input = node.value;
      const blocked = syncAction(
        context.settings.unocss?.configPath,
        "blocklist",
        input,
        context.filename
      );
      blocked.forEach(([name, meta]) => {
        context.report({
          node,
          messageId: "in-blocklist",
          data: {
            name,
            reason: meta?.message ? `: ${meta.message}` : ""
          }
        });
      });
    };
    const scriptVisitor = {
      JSXAttribute(node) {
        if (typeof node.name.name === "string" && CLASS_FIELDS.includes(node.name.name.toLowerCase()) && node.value) {
          if (node.value.type === "Literal")
            checkLiteral(node.value);
        }
      },
      SvelteAttribute(node) {
        if (node.key.name === "class") {
          if (node.value?.[0].type === "SvelteLiteral")
            checkLiteral(node.value[0]);
        }
      }
    };
    const templateBodyVisitor = {
      VAttribute(node) {
        if (node.key.name === "class") {
          if (node.value.type === "VLiteral")
            checkLiteral(node.value);
        }
      },
      // Attributify
      VStartTag(node) {
        const valueless = node.attributes.filter((i) => typeof i.key?.name === "string" && !IGNORE_ATTRIBUTES.includes(i.key?.name?.toLowerCase()) && i.value == null);
        if (!valueless.length)
          return;
        for (const node2 of valueless) {
          if (!node2?.key?.name)
            continue;
          const blocked = syncAction(
            context.settings.unocss?.configPath,
            "blocklist",
            node2.key.name,
            context.filename
          );
          blocked.forEach(([name, meta]) => {
            context.report({
              node: node2,
              messageId: "in-blocklist",
              data: {
                name,
                reason: meta?.message ? `: ${meta.message}` : ""
              }
            });
          });
        }
      }
    };
    const parserServices = context?.sourceCode.parserServices || context.parserServices;
    if (parserServices == null || parserServices.defineTemplateBodyVisitor == null) {
      return scriptVisitor;
    } else {
      return parserServices?.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
    }
  }
});

const enforceClassCompile = createRule({
  name: "enforce-class-compile",
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description: "Enforce class compilation"
    },
    messages: {
      missing: "prefix: `{{prefix}}` is missing"
    },
    schema: [{
      type: "object",
      properties: {
        prefix: {
          type: "string"
        },
        enableFix: {
          type: "boolean"
        }
      },
      additionalProperties: false
    }]
  },
  defaultOptions: [{ prefix: ":uno:", enableFix: true }],
  create(context, [mergedOptions]) {
    const CLASS_COMPILE_PREFIX = `${mergedOptions.prefix} `;
    const ENABLE_FIX = mergedOptions.enableFix;
    function report({ node, fix }) {
      context.report({
        node,
        loc: node.loc,
        messageId: "missing",
        data: { prefix: CLASS_COMPILE_PREFIX.trim() },
        fix: (...args) => ENABLE_FIX ? fix(...args) : null
      });
    }
    const scriptVisitor = {
      JSXAttribute(_node) {
      },
      SvelteAttribute(_node) {
      }
    };
    const reportClassList = (node, classList) => {
      if (classList.startsWith(CLASS_COMPILE_PREFIX))
        return;
      report({
        node,
        fix(fixer) {
          return fixer.replaceTextRange([node.range[0] + 1, node.range[1] - 1], `${CLASS_COMPILE_PREFIX}${classList}`);
        }
      });
    };
    const templateBodyVisitor = {
      [`VAttribute[key.name=class]`](attr) {
        const valueNode = attr.value;
        if (!valueNode || !valueNode.value)
          return;
        reportClassList(valueNode, valueNode.value);
      },
      [`VAttribute[key.argument.name=class] VExpressionContainer Literal:not(ConditionalExpression .test Literal):not(Property .value Literal)`](literal) {
        if (!literal.value || typeof literal.value !== "string")
          return;
        reportClassList(literal, literal.value);
      },
      [`VAttribute[key.argument.name=class] VExpressionContainer TemplateElement`](templateElement) {
        if (!templateElement.value.raw)
          return;
        reportClassList(templateElement, templateElement.value.raw);
      },
      [`VAttribute[key.argument.name=class] VExpressionContainer Property`](property) {
        if (property.key.type !== "Identifier")
          return;
        const classListString = property.key.name;
        if (classListString.startsWith(CLASS_COMPILE_PREFIX))
          return;
        report({
          node: property.key,
          fix(fixer) {
            let replacePropertyKeyText = `'${CLASS_COMPILE_PREFIX}${classListString}'`;
            if (property.shorthand)
              replacePropertyKeyText = `${replacePropertyKeyText}: ${classListString}`;
            return fixer.replaceTextRange(property.key.range, replacePropertyKeyText);
          }
        });
      }
    };
    const parserServices = context?.sourceCode.parserServices || context.parserServices;
    if (parserServices == null || parserServices.defineTemplateBodyVisitor == null) {
      return scriptVisitor;
    } else {
      return parserServices?.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
    }
  }
});

const order = createRule({
  name: "order",
  meta: {
    type: "layout",
    fixable: "code",
    docs: {
      description: "Order of UnoCSS utilities in class attribute"
    },
    messages: {
      "invalid-order": "UnoCSS utilities are not ordered"
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    function checkLiteral(node, addSpace) {
      if (typeof node.value !== "string" || !node.value.trim())
        return;
      const input = node.value;
      let sorted = syncAction(
        context.settings.unocss?.configPath,
        "sort",
        input
      ).trim();
      if (addSpace === "before")
        sorted = ` ${sorted}`;
      else if (addSpace === "after")
        sorted += " ";
      if (sorted !== input) {
        const nodeOrToken = node.type === "SvelteLiteral" ? { type: AST_TOKEN_TYPES.String, value: node.value, loc: node.loc, range: node.range } : node;
        context.report({
          node: nodeOrToken,
          loc: node.loc,
          messageId: "invalid-order",
          fix(fixer) {
            if (AST_NODES_WITH_QUOTES.includes(node.type))
              return fixer.replaceTextRange([node.range[0] + 1, node.range[1] - 1], sorted);
            else
              return fixer.replaceText(nodeOrToken, sorted);
          }
        });
      }
    }
    const scriptVisitor = {
      JSXAttribute(node) {
        if (typeof node.name.name === "string" && CLASS_FIELDS.includes(node.name.name.toLowerCase()) && node.value) {
          if (node.value.type === "Literal")
            checkLiteral(node.value);
          else if (node.value.type === "JSXExpressionContainer" && node.value.expression.type === "Literal")
            checkLiteral(node.value.expression);
        }
      },
      SvelteAttribute(node) {
        if (node.key.name === "class") {
          let checkExpressionRecursively = function(expression) {
            if (expression.type !== "ConditionalExpression")
              return;
            if (expression.consequent.type === "Literal") {
              checkLiteral(expression.consequent);
            }
            if (expression.alternate) {
              if (expression.alternate.type === "ConditionalExpression") {
                checkExpressionRecursively(expression.alternate);
              } else if (expression.alternate.type === "Literal") {
                checkLiteral(expression.alternate);
              }
            }
          };
          if (!node.value.length)
            return;
          node.value.forEach((obj, i) => {
            if (obj.type === "SvelteMustacheTag") {
              checkExpressionRecursively(obj.expression);
            } else if (obj.type === "SvelteLiteral") {
              const addSpace = node.value?.[i - 1]?.type === "SvelteMustacheTag" ? "before" : node.value?.[i + 1]?.type === "SvelteMustacheTag" ? "after" : void 0;
              checkLiteral(obj, addSpace);
            }
          });
        }
      }
    };
    const templateBodyVisitor = {
      VAttribute(node) {
        if (node.key.name === "class") {
          if (node.value.type === "VLiteral")
            checkLiteral(node.value);
        }
      }
    };
    const parserServices = context?.sourceCode.parserServices || context.parserServices;
    if (parserServices == null || parserServices.defineTemplateBodyVisitor == null) {
      return scriptVisitor;
    } else {
      return parserServices?.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
    }
  }
});

const plugin = {
  rules: {
    order,
    "order-attributify": orderAttributify,
    blocklist,
    "enforce-class-compile": enforceClassCompile
  }
};

const configsFlat = {
  plugins: {
    unocss: plugin
  },
  rules: {
    "unocss/order": "warn",
    "unocss/order-attributify": "warn"
  }
};

const configsRecommended = {
  plugins: ["@unocss"],
  rules: {
    "@unocss/order": "warn",
    "@unocss/order-attributify": "warn"
  }
};

const index = {
  ...plugin,
  configs: {
    recommended: configsRecommended,
    flat: configsFlat
  }
};

export { index as default };
