import { IS_ITALIC, IS_BOLD, IS_CODE, IS_STRIKETHROUGH, IS_HIGHLIGHT, IS_UNDERLINE, IS_SUPERSCRIPT, IS_SUBSCRIPT } from "../../FormatConstants.js";
import { $createTextNode } from "lexical";
function buildFormattingVisitors(tag, format) {
  return [
    {
      testNode: (node) => node.type === "mdxJsxTextElement" && node.name === tag,
      visitNode({ actions, mdastNode, lexicalParent }) {
        actions.addFormatting(format);
        actions.visitChildren(mdastNode, lexicalParent);
      }
    },
    {
      testNode: (node) => node.type === "html" && node.value === `<${tag}>`,
      visitNode({ actions, mdastParent }) {
        actions.addFormatting(format, mdastParent);
      }
    },
    {
      testNode: (node) => node.type === "html" && node.value === `</${tag}>`,
      visitNode({ actions, mdastParent }) {
        actions.removeFormatting(format, mdastParent);
      }
    }
  ];
}
const StrikeThroughVisitor = {
  testNode: "delete",
  visitNode({ mdastNode, actions, lexicalParent }) {
    actions.addFormatting(IS_STRIKETHROUGH);
    actions.visitChildren(mdastNode, lexicalParent);
  }
};
const HighlightVisitor = {
  testNode: "highlight",
  visitNode({ mdastNode, actions, lexicalParent }) {
    actions.addFormatting(IS_HIGHLIGHT);
    actions.visitChildren(mdastNode, lexicalParent);
  }
};
const MdCodeVisitor = {
  testNode: "inlineCode",
  visitNode({ mdastNode, actions }) {
    actions.addAndStepInto($createTextNode(mdastNode.value).setFormat(actions.getParentFormatting() | IS_CODE));
  }
};
const MdEmphasisVisitor = {
  testNode: "emphasis",
  visitNode({ mdastNode, actions, lexicalParent }) {
    actions.addFormatting(IS_ITALIC);
    actions.visitChildren(mdastNode, lexicalParent);
  }
};
const MdStrongVisitor = {
  testNode: "strong",
  visitNode({ mdastNode, actions, lexicalParent }) {
    actions.addFormatting(IS_BOLD);
    actions.visitChildren(mdastNode, lexicalParent);
  }
};
const formattingVisitors = [
  // emphasis
  MdEmphasisVisitor,
  // strong
  MdStrongVisitor,
  // underline
  ...buildFormattingVisitors("u", IS_UNDERLINE),
  // code
  ...buildFormattingVisitors("code", IS_CODE),
  MdCodeVisitor,
  // strikethrough
  StrikeThroughVisitor,
  // highlight
  HighlightVisitor,
  // superscript
  ...buildFormattingVisitors("sup", IS_SUPERSCRIPT),
  // subscript
  ...buildFormattingVisitors("sub", IS_SUBSCRIPT)
];
export {
  formattingVisitors
};
