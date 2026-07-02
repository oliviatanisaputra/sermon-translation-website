import { mdxToMarkdown, mdxFromMarkdown } from "mdast-util-mdx";
import { mdxjs } from "micromark-extension-mdxjs";
import { insertDecoratorNode$, jsxComponentDescriptors$, addToMarkdownExtension$, addExportVisitor$, addLexicalNode$, addImportVisitor$, addSyntaxExtension$, addMdastExtension$, jsxIsAvailable$ } from "../core/index.js";
import { $createLexicalJsxNode, LexicalJsxNode } from "./LexicalJsxNode.js";
import { LexicalJsxVisitor } from "./LexicalJsxVisitor.js";
import { MdastMdxJsEsmVisitor } from "./MdastMdxJsEsmVisitor.js";
import { MdastMdxJsxElementVisitor } from "./MdastMdxJsxElementVisitor.js";
import { Signal, map } from "@mdxeditor/gurx";
import { realmPlugin } from "../../RealmWithPlugins.js";
import { MdastMdxExpressionVisitor } from "./MdastMdxExpressionVisitor.js";
import { LexicalMdxExpressionNode } from "./LexicalMdxExpressionNode.js";
import { LexicalMdxExpressionVisitor } from "./LexicalMdxExpressionVisitor.js";
import { GenericJsxEditor } from "../../jsx-editors/GenericJsxEditor.js";
function isMdastJsxNode(node) {
  return node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
}
const isExpressionValue = (value) => {
  if (value !== null && typeof value === "object" && "type" in value && "value" in value && typeof value.value === "string") {
    return true;
  }
  return false;
};
const toMdastJsxAttributes = (attributes) => Object.entries(attributes).map(
  ([name, value]) => ({
    type: "mdxJsxAttribute",
    name,
    value: isExpressionValue(value) ? { type: "mdxJsxAttributeValueExpression", value: value.value } : value
  })
);
const insertJsx$ = Signal((r) => {
  r.link(
    r.pipe(
      insertJsx$,
      map(({ kind, name, children, props }) => {
        return () => {
          const attributes = toMdastJsxAttributes(props);
          if (kind === "flow") {
            return $createLexicalJsxNode({
              type: "mdxJsxFlowElement",
              name,
              children: children ?? [],
              attributes
            });
          } else {
            return $createLexicalJsxNode({
              type: "mdxJsxTextElement",
              name,
              children: children ?? [],
              attributes
            });
          }
        };
      })
    ),
    insertDecoratorNode$
  );
});
const fragmentDescriptor = {
  name: null,
  kind: "flow",
  props: [],
  hasChildren: true,
  Editor: GenericJsxEditor
};
const getDescriptors = (params) => {
  if (params) {
    if (params.allowFragment ?? true) {
      return [fragmentDescriptor, ...params.jsxComponentDescriptors];
    }
    return params.jsxComponentDescriptors;
  }
  return [fragmentDescriptor];
};
const jsxPlugin = realmPlugin({
  init: (realm, params) => {
    realm.pubIn({
      // import
      [jsxIsAvailable$]: true,
      [addMdastExtension$]: mdxFromMarkdown(),
      [addSyntaxExtension$]: mdxjs(),
      [addImportVisitor$]: [MdastMdxJsxElementVisitor, MdastMdxJsEsmVisitor, MdastMdxExpressionVisitor],
      // export
      [addLexicalNode$]: [LexicalJsxNode, LexicalMdxExpressionNode],
      [addExportVisitor$]: [LexicalJsxVisitor, LexicalMdxExpressionVisitor],
      [addToMarkdownExtension$]: mdxToMarkdown(),
      [jsxComponentDescriptors$]: getDescriptors(params)
    });
  },
  update(realm, params) {
    realm.pub(jsxComponentDescriptors$, getDescriptors(params));
  }
});
export {
  insertJsx$,
  isMdastJsxNode,
  jsxPlugin
};
