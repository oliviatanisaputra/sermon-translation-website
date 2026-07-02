import { $isLexicalJsxNode } from "./LexicalJsxNode.js";
import { isMdastJsxNode } from "./index.js";
import { htmlTags } from "../core/MdastHTMLNode.js";
const LexicalJsxVisitor = {
  testLexicalNode: $isLexicalJsxNode,
  visitLexicalNode({ actions, mdastParent, lexicalNode }) {
    function traverseNestedJsxNodes(node) {
      if ("children" in node && node.children instanceof Array) {
        node.children.forEach((child) => {
          if (isMdastJsxNode(child) && !htmlTags.includes(child.name.toLowerCase())) {
            actions.registerReferredComponent(child.name);
          }
          traverseNestedJsxNodes(child);
        });
      }
    }
    const mdastNode = lexicalNode.getMdastNode();
    const importStatement = lexicalNode.getImportStatement();
    actions.registerReferredComponent(mdastNode.name, importStatement);
    traverseNestedJsxNodes(mdastNode);
    actions.appendToParent(mdastParent, mdastNode);
  },
  priority: -200
};
export {
  LexicalJsxVisitor
};
