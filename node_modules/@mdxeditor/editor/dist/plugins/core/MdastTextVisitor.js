import { $createTextNode } from "lexical";
const MdastTextVisitor = {
  testNode: "text",
  visitNode({ mdastNode, actions }) {
    const node = $createTextNode(mdastNode.value);
    node.setFormat(actions.getParentFormatting());
    const style = actions.getParentStyle();
    if (style !== "") {
      node.setStyle(style);
    }
    actions.addAndStepInto(node);
  }
};
export {
  MdastTextVisitor
};
