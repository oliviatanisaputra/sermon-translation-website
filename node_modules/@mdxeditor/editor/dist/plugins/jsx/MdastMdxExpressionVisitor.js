import { $createLexicalMdxExpressionNode } from "./LexicalMdxExpressionNode.js";
const MdastMdxExpressionVisitor = {
  testNode: (node) => node.type === "mdxTextExpression" || node.type === "mdxFlowExpression",
  visitNode({ lexicalParent, mdastNode }) {
    lexicalParent.append($createLexicalMdxExpressionNode(mdastNode.value, mdastNode.type));
  },
  priority: -200
};
export {
  MdastMdxExpressionVisitor
};
