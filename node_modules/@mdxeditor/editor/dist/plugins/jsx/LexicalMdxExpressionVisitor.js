import { $isLexicalMdxExpressionNode } from "./LexicalMdxExpressionNode.js";
const LexicalMdxExpressionVisitor = {
  testLexicalNode: $isLexicalMdxExpressionNode,
  visitLexicalNode({ actions, mdastParent, lexicalNode }) {
    const mdastNode = {
      type: lexicalNode.getMdastType(),
      value: lexicalNode.getValue()
    };
    actions.appendToParent(mdastParent, mdastNode);
  }
};
export {
  LexicalMdxExpressionVisitor
};
