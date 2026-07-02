import { $createParagraphNode } from "lexical";
import { $createLexicalJsxNode } from "./LexicalJsxNode.js";
const MdastMdxJsxElementVisitor = {
  testNode: (node, { jsxComponentDescriptors }) => {
    if (node.type === "mdxJsxTextElement" || node.type === "mdxJsxFlowElement") {
      const descriptor = jsxComponentDescriptors.find((descriptor2) => descriptor2.name === node.name) ?? jsxComponentDescriptors.find((descriptor2) => descriptor2.name === "*");
      return descriptor !== void 0;
    }
    return false;
  },
  visitNode({ lexicalParent, mdastNode, descriptors: { jsxComponentDescriptors }, metaData }) {
    const descriptor = jsxComponentDescriptors.find((descriptor2) => descriptor2.name === mdastNode.name) ?? jsxComponentDescriptors.find((descriptor2) => descriptor2.name === "*");
    if ((descriptor == null ? void 0 : descriptor.kind) === "text" && mdastNode.type === "mdxJsxFlowElement") {
      const patchedNode = { ...mdastNode, type: "mdxJsxTextElement" };
      const paragraph = $createParagraphNode();
      paragraph.append($createLexicalJsxNode(patchedNode, mdastNode.name ? metaData.importDeclarations[mdastNode.name] : void 0));
      lexicalParent.append(paragraph);
    } else {
      lexicalParent.append(
        $createLexicalJsxNode(mdastNode, mdastNode.name ? metaData.importDeclarations[mdastNode.name] : void 0)
      );
    }
  },
  priority: -200
};
export {
  MdastMdxJsxElementVisitor
};
