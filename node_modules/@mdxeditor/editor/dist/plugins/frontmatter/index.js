import { realmPlugin } from "../../RealmWithPlugins.js";
import { rootEditor$, createRootEditorSubscription$, addToMarkdownExtension$, addExportVisitor$, addImportVisitor$, addLexicalNode$, addSyntaxExtension$, addMdastExtension$ } from "../core/index.js";
import { Cell, Action, withLatestFrom } from "@mdxeditor/gurx";
import { $getRoot, KEY_DOWN_COMMAND, $getSelection, $isRangeSelection, $isTextNode, COMMAND_PRIORITY_CRITICAL } from "lexical";
import { frontmatterToMarkdown, frontmatterFromMarkdown } from "mdast-util-frontmatter";
import { frontmatter } from "micromark-extension-frontmatter";
import { $isFrontmatterNode, $createFrontmatterNode, FrontmatterNode } from "./FrontmatterNode.js";
import { LexicalFrontmatterVisitor } from "./LexicalFrontmatterVisitor.js";
import { MdastFrontmatterVisitor } from "./MdastFrontmatterVisitor.js";
const frontmatterDialogOpen$ = Cell(false);
const insertFrontmatter$ = Action((r) => {
  r.sub(r.pipe(insertFrontmatter$, withLatestFrom(rootEditor$)), ([, rootEditor]) => {
    rootEditor == null ? void 0 : rootEditor.update(() => {
      const firstItem = $getRoot().getFirstChild();
      if (!$isFrontmatterNode(firstItem)) {
        const fmNode = $createFrontmatterNode('"": ""');
        if (firstItem) {
          firstItem.insertBefore(fmNode);
        } else {
          $getRoot().append(fmNode);
        }
      }
    });
    r.pub(frontmatterDialogOpen$, true);
  });
});
const removeFrontmatter$ = Action((r) => {
  r.sub(r.pipe(removeFrontmatter$, withLatestFrom(rootEditor$)), ([, rootEditor]) => {
    rootEditor == null ? void 0 : rootEditor.update(() => {
      const firstItem = $getRoot().getFirstChild();
      if ($isFrontmatterNode(firstItem)) {
        firstItem.remove();
      }
    });
    r.pub(frontmatterDialogOpen$, false);
  });
});
const hasFrontmatter$ = Cell(false, (r) => {
  r.pub(createRootEditorSubscription$, (rootEditor) => {
    return rootEditor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        r.pub(hasFrontmatter$, $isFrontmatterNode($getRoot().getFirstChild()));
      });
    });
  });
});
const frontmatterPlugin = realmPlugin({
  init: (realm) => {
    realm.pubIn({
      [addMdastExtension$]: frontmatterFromMarkdown("yaml"),
      [addSyntaxExtension$]: frontmatter(),
      [addLexicalNode$]: FrontmatterNode,
      [addImportVisitor$]: MdastFrontmatterVisitor,
      [addExportVisitor$]: LexicalFrontmatterVisitor,
      [addToMarkdownExtension$]: frontmatterToMarkdown("yaml"),
      [createRootEditorSubscription$]: (editor) => {
        return editor.registerCommand(
          KEY_DOWN_COMMAND,
          (event) => {
            let shouldPrevent = false;
            editor.read(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                if (selection.isCollapsed() && selection.anchor.offset === 0 && selection.focus.offset === 0 && event.key === "Backspace") {
                  let node = selection.getNodes()[0];
                  if ($isTextNode(node)) {
                    node = node.getParent();
                  }
                  const prevSibling = node == null ? void 0 : node.getPreviousSibling();
                  if ($isFrontmatterNode(prevSibling)) {
                    shouldPrevent = true;
                    event.preventDefault();
                  }
                } else {
                  const firstNode = selection.getNodes()[0];
                  if ($isFrontmatterNode(firstNode)) {
                    const yaml = firstNode.getYaml();
                    setTimeout(() => {
                      editor.update(
                        () => {
                          const firstItem = $getRoot().getFirstChild();
                          if (!$isFrontmatterNode(firstItem)) {
                            $getRoot().splice(0, 0, [$createFrontmatterNode(yaml)]);
                          }
                        },
                        { discrete: true }
                      );
                    });
                  }
                }
              }
            });
            if (shouldPrevent) {
              return true;
            }
            return false;
          },
          COMMAND_PRIORITY_CRITICAL
        );
      }
    });
  }
});
export {
  $createFrontmatterNode,
  $isFrontmatterNode,
  FrontmatterNode,
  frontmatterDialogOpen$,
  frontmatterPlugin,
  hasFrontmatter$,
  insertFrontmatter$,
  removeFrontmatter$
};
