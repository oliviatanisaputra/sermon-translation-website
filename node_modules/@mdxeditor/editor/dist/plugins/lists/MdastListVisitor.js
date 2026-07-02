import { $createListNode, $isListItemNode, $createListItemNode } from "@lexical/list";
const MdastListVisitor = {
  testNode: "list",
  visitNode: function({ mdastNode, lexicalParent, actions }) {
    const listType = mdastNode.children.some((e) => typeof e.checked === "boolean") ? "check" : mdastNode.ordered ? "number" : "bullet";
    const lexicalNode = $createListNode(listType);
    if ($isListItemNode(lexicalParent)) {
      const dedicatedParent = $createListItemNode();
      dedicatedParent.append(lexicalNode);
      lexicalParent.insertAfter(dedicatedParent);
    } else {
      lexicalParent.append(lexicalNode);
    }
    actions.visitChildren(mdastNode, lexicalNode);
  }
};
export {
  MdastListVisitor
};
