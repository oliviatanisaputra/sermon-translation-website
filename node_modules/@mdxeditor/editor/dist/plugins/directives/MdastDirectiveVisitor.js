import { $createTextNode } from "lexical";
import { $createDirectiveNode } from "./DirectiveNode.js";
const DIRECTIVE_TYPES = ["leafDirective", "containerDirective", "textDirective"];
function isMdastDirectivesNode(node) {
  return DIRECTIVE_TYPES.includes(node.type);
}
const MdastDirectiveVisitor = (escapeUnknownTextDirectives) => ({
  testNode: (node, { directiveDescriptors }) => {
    if (isMdastDirectivesNode(node)) {
      const descriptor = directiveDescriptors.find((descriptor2) => descriptor2.testNode(node));
      if (escapeUnknownTextDirectives && !descriptor && node.type === "textDirective") {
        return true;
      }
      return descriptor !== void 0;
    }
    return false;
  },
  visitNode({ lexicalParent, mdastNode, descriptors }) {
    const isKnown = !escapeUnknownTextDirectives || descriptors.directiveDescriptors.some((d) => d.testNode(mdastNode));
    if (isKnown) {
      lexicalParent.append($createDirectiveNode(mdastNode));
    } else {
      lexicalParent.append($createTextNode(`:${mdastNode.name}`));
    }
  }
});
export {
  MdastDirectiveVisitor,
  isMdastDirectivesNode
};
