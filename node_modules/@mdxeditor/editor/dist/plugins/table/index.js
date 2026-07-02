import { realmPlugin } from "../../RealmWithPlugins.js";
import { Signal, map } from "@mdxeditor/gurx";
import { gfmTableToMarkdown, gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { gfmTable } from "micromark-extension-gfm-table";
import { insertDecoratorNode$, addToMarkdownExtension$, addExportVisitor$, addLexicalNode$, addImportVisitor$, addSyntaxExtension$, addMdastExtension$ } from "../core/index.js";
import { LexicalTableVisitor } from "./LexicalTableVisitor.js";
import { MdastTableVisitor } from "./MdastTableVisitor.js";
import { $createTableNode, TableNode } from "./TableNode.js";
import { $convertTableElement, $isTableNode } from "./TableNode.js";
function seedTable(rows = 1, columns = 1) {
  const table = {
    type: "table",
    children: []
  };
  for (let i = 0; i < rows; i++) {
    const tableRow = {
      type: "tableRow",
      children: []
    };
    for (let j = 0; j < columns; j++) {
      const cell = {
        type: "tableCell",
        children: []
      };
      tableRow.children.push(cell);
    }
    table.children.push(tableRow);
  }
  return table;
}
const insertTable$ = Signal((r) => {
  r.link(
    r.pipe(
      insertTable$,
      map(({ rows, columns }) => {
        return () => $createTableNode(seedTable(rows, columns));
      })
    ),
    insertDecoratorNode$
  );
});
const tablePlugin = realmPlugin({
  init(realm, params) {
    realm.pubIn({
      // import
      [addMdastExtension$]: gfmTableFromMarkdown(),
      [addSyntaxExtension$]: gfmTable(),
      [addImportVisitor$]: MdastTableVisitor,
      // export
      [addLexicalNode$]: TableNode,
      [addExportVisitor$]: LexicalTableVisitor,
      [addToMarkdownExtension$]: gfmTableToMarkdown({
        tableCellPadding: (params == null ? void 0 : params.tableCellPadding) ?? true,
        tablePipeAlign: (params == null ? void 0 : params.tablePipeAlign) ?? true
      })
    });
  }
});
export {
  $convertTableElement,
  $createTableNode,
  $isTableNode,
  TableNode,
  insertTable$,
  tablePlugin
};
