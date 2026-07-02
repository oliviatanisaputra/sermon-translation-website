import { $createGenericHTMLNode } from "./GenericHTMLNode.js";
import { isMdastHTMLNode } from "./MdastHTMLNode.js";
const MdastHTMLVisitor = {
  testNode: isMdastHTMLNode,
  visitNode: function({ mdastNode, actions, lexicalParent }) {
    if (mdastNode.name === "span" && mdastNode.attributes.length === 1 && mdastNode.attributes[0].type === "mdxJsxAttribute" && mdastNode.attributes[0].name === "style") {
      actions.addStyle(mdastNode.attributes[0].value, mdastNode);
      actions.visitChildren(mdastNode, lexicalParent);
    } else {
      actions.addAndStepInto($createGenericHTMLNode(mdastNode.name, mdastNode.type, mdastNode.attributes));
    }
  },
  priority: -100
};
export {
  MdastHTMLVisitor
};
