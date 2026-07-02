import { ImagePlaceholder } from "./ImagePlaceholder.js";
import { mergeRegister, $wrapNodeInElement } from "@lexical/utils";
import { Signal, Cell, Action, withLatestFrom, mapTo, map } from "@mdxeditor/gurx";
import { createCommand, $getNodeByKey, $insertNodes, $isRootOrShadowRoot, $createParagraphNode, COMMAND_PRIORITY_EDITOR, DRAGSTART_COMMAND, COMMAND_PRIORITY_HIGH, DRAGOVER_COMMAND, COMMAND_PRIORITY_LOW, DROP_COMMAND, PASTE_COMMAND, COMMAND_PRIORITY_CRITICAL, $createRangeSelection, $setSelection, $getSelection, $isNodeSelection } from "lexical";
import { realmPlugin } from "../../RealmWithPlugins.js";
import { CAN_USE_DOM } from "../../utils/detectMac.js";
import { activeEditor$, createActiveEditorSubscription$, addComposerChild$, addExportVisitor$, addLexicalNode$, addImportVisitor$ } from "../core/index.js";
import { EditImageToolbar } from "./EditImageToolbar.js";
import { ImageDialog } from "./ImageDialog.js";
import { $createImageNode, ImageNode, $isImageNode } from "./ImageNode.js";
import { LexicalImageVisitor } from "./LexicalImageVisitor.js";
import { MdastImageVisitor, MdastHtmlImageVisitor, MdastJsxImageVisitor } from "./MdastImageVisitor.js";
const internalInsertImage$ = Signal((r) => {
  r.sub(r.pipe(internalInsertImage$, withLatestFrom(activeEditor$)), ([values, theEditor]) => {
    theEditor == null ? void 0 : theEditor.update(() => {
      const imageNode = $createImageNode({
        altText: values.altText ?? "",
        src: values.src,
        title: values.title ?? "",
        width: parseImageDimension(values.width),
        height: parseImageDimension(values.height)
      });
      $insertNodes([imageNode]);
      if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
        $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
      }
    });
  });
});
const insertImage$ = Signal((r) => {
  r.sub(r.pipe(insertImage$, withLatestFrom(imageUploadHandler$)), ([values, imageUploadHandler]) => {
    const handler = (src) => {
      r.pub(internalInsertImage$, { ...values, src });
    };
    if ("file" in values) {
      imageUploadHandler == null ? void 0 : imageUploadHandler(values.file).then(handler).catch((e) => {
        throw e;
      });
    } else {
      handler(values.src);
    }
  });
});
const imageAutocompleteSuggestions$ = Cell([]);
const disableImageResize$ = Cell(false);
const imageUploadHandler$ = Cell(null);
const imagePreviewHandler$ = Cell(null);
const imagePlaceholder$ = Cell(null);
const imageDialogState$ = Cell(
  { type: "inactive" },
  (r) => {
    r.sub(
      r.pipe(saveImage$, withLatestFrom(activeEditor$, imageUploadHandler$, imageDialogState$, allowSetImageDimensions$)),
      ([values, theEditor, imageUploadHandler, dialogState, allowSetImageDimensions]) => {
        const handler = dialogState.type === "editing" ? (src) => {
          theEditor == null ? void 0 : theEditor.update(() => {
            const { nodeKey } = dialogState;
            const imageNode = $getNodeByKey(nodeKey);
            imageNode.setTitle(values.title);
            imageNode.setAltText(values.altText);
            imageNode.setSrc(src);
            if (allowSetImageDimensions) {
              const width = parseImageDimension(values.width);
              const height = parseImageDimension(values.height);
              imageNode.setWidthAndHeight(width ?? "inherit", height ?? "inherit");
            }
          });
          r.pub(imageDialogState$, { type: "inactive" });
        } : (src) => {
          r.pub(internalInsertImage$, { ...values, src });
          r.pub(imageDialogState$, { type: "inactive" });
        };
        if (values.file && values.file.length > 0) {
          imageUploadHandler == null ? void 0 : imageUploadHandler(values.file.item(0)).then(handler).catch((e) => {
            throw e;
          });
        } else if (values.src) {
          handler(values.src);
        }
      }
    );
    r.pub(createActiveEditorSubscription$, (editor) => {
      const theUploadHandler = r.getValue(imageUploadHandler$);
      return mergeRegister(
        editor.registerCommand(
          INSERT_IMAGE_COMMAND,
          (payload) => {
            const imageNode = $createImageNode(payload);
            $insertNodes([imageNode]);
            if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
              $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
            }
            return true;
          },
          COMMAND_PRIORITY_EDITOR
        ),
        editor.registerCommand(
          DRAGSTART_COMMAND,
          (event) => {
            return onDragStart(event);
          },
          COMMAND_PRIORITY_HIGH
        ),
        editor.registerCommand(
          DRAGOVER_COMMAND,
          (event) => {
            return onDragover(event, !!theUploadHandler);
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          DROP_COMMAND,
          (event) => {
            return onDrop(event, editor, r.getValue(imageUploadHandler$));
          },
          COMMAND_PRIORITY_HIGH
        ),
        editor.registerCommand(
          PASTE_COMMAND,
          (event) => {
            var _a, _b;
            if (!theUploadHandler) {
              let fromWeb = Array.from(((_a = event.clipboardData) == null ? void 0 : _a.items) ?? []);
              fromWeb = fromWeb.filter((i) => i.type.includes("text"));
              if (!fromWeb.length || fromWeb.length === 0) {
                return true;
              }
              return false;
            }
            const cbPayload = Array.from(((_b = event.clipboardData) == null ? void 0 : _b.items) ?? []);
            const isMixedPayload = cbPayload.some((item) => !item.type.includes("image"));
            if (isMixedPayload)
              return false;
            if (!cbPayload.length || cbPayload.length === 0) {
              return false;
            }
            const imageUploadHandlerValue = r.getValue(imageUploadHandler$);
            Promise.all(cbPayload.map((file) => imageUploadHandlerValue(file.getAsFile()))).then((urls) => {
              urls.forEach((url) => {
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                  src: url,
                  altText: ""
                });
              });
            }).catch((e) => {
              throw e;
            });
            return true;
          },
          COMMAND_PRIORITY_CRITICAL
        )
      );
    });
  }
);
const openNewImageDialog$ = Action((r) => {
  r.link(r.pipe(openNewImageDialog$, mapTo({ type: "new" })), imageDialogState$);
});
const openEditImageDialog$ = Signal((r) => {
  r.link(
    r.pipe(
      openEditImageDialog$,
      map((payload) => ({ type: "editing", ...payload }))
    ),
    imageDialogState$
  );
});
const closeImageDialog$ = Action((r) => {
  r.link(r.pipe(closeImageDialog$, mapTo({ type: "inactive" })), imageDialogState$);
});
const disableImageSettingsButton$ = Cell(false);
const allowSetImageDimensions$ = Cell(false);
const saveImage$ = Signal();
const editImageToolbarComponent$ = Cell(EditImageToolbar);
const parseImageDimension = (value) => {
  if (typeof value === "undefined")
    return void 0;
  const parsed = parseInt(String(value), 10);
  return Number.isNaN(parsed) ? void 0 : parsed;
};
const imagePlugin = realmPlugin({
  init(realm, params) {
    realm.pubIn({
      [addImportVisitor$]: [MdastImageVisitor, MdastHtmlImageVisitor, MdastJsxImageVisitor],
      [addLexicalNode$]: ImageNode,
      [addExportVisitor$]: LexicalImageVisitor,
      [addComposerChild$]: (params == null ? void 0 : params.ImageDialog) ?? ImageDialog,
      [imageUploadHandler$]: (params == null ? void 0 : params.imageUploadHandler) ?? null,
      [imageAutocompleteSuggestions$]: (params == null ? void 0 : params.imageAutocompleteSuggestions) ?? [],
      [disableImageResize$]: Boolean(params == null ? void 0 : params.disableImageResize),
      [disableImageSettingsButton$]: Boolean(params == null ? void 0 : params.disableImageSettingsButton),
      [allowSetImageDimensions$]: Boolean(params == null ? void 0 : params.allowSetImageDimensions),
      [imagePreviewHandler$]: (params == null ? void 0 : params.imagePreviewHandler) ?? null,
      [editImageToolbarComponent$]: (params == null ? void 0 : params.EditImageToolbar) ?? EditImageToolbar,
      [imagePlaceholder$]: (params == null ? void 0 : params.imagePlaceholder) ?? ImagePlaceholder
    });
  },
  update(realm, params) {
    realm.pubIn({
      [imageUploadHandler$]: (params == null ? void 0 : params.imageUploadHandler) ?? null,
      [imageAutocompleteSuggestions$]: (params == null ? void 0 : params.imageAutocompleteSuggestions) ?? [],
      [disableImageResize$]: Boolean(params == null ? void 0 : params.disableImageResize),
      [imagePreviewHandler$]: (params == null ? void 0 : params.imagePreviewHandler) ?? null,
      [allowSetImageDimensions$]: Boolean(params == null ? void 0 : params.allowSetImageDimensions),
      [editImageToolbarComponent$]: (params == null ? void 0 : params.EditImageToolbar) ?? EditImageToolbar,
      [imagePlaceholder$]: (params == null ? void 0 : params.imagePlaceholder) ?? ImagePlaceholder
    });
  }
});
const getDOMSelection = (targetWindow) => CAN_USE_DOM ? (targetWindow ?? window).getSelection() : null;
const INSERT_IMAGE_COMMAND = createCommand("INSERT_IMAGE_COMMAND");
const TRANSPARENT_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
function onDragStart(event) {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return false;
  }
  dataTransfer.setData("text/plain", "_");
  const img = document.createElement("img");
  img.src = TRANSPARENT_IMAGE;
  dataTransfer.setDragImage(img, 0, 0);
  dataTransfer.setData(
    "application/x-lexical-drag",
    JSON.stringify({
      data: {
        altText: node.__altText,
        title: node.__title,
        key: node.getKey(),
        src: node.__src
      },
      type: "image"
    })
  );
  return true;
}
function onDragover(event, hasUploadHandler) {
  var _a;
  if (hasUploadHandler) {
    let cbPayload = Array.from(((_a = event.dataTransfer) == null ? void 0 : _a.items) ?? []);
    cbPayload = cbPayload.filter((i) => i.type.includes("image"));
    if (cbPayload.length > 0) {
      event.preventDefault();
      return true;
    }
  }
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}
function onDrop(event, editor, imageUploadHandler) {
  var _a;
  let cbPayload = Array.from(((_a = event.dataTransfer) == null ? void 0 : _a.items) ?? []);
  cbPayload = cbPayload.filter((i) => i.type.includes("image"));
  if (cbPayload.length > 0) {
    if (imageUploadHandler !== null) {
      event.preventDefault();
      Promise.all(
        cbPayload.map((image) => {
          if (image.kind === "string") {
            return new Promise((rs) => {
              image.getAsString(rs);
            });
          }
          return imageUploadHandler(image.getAsFile());
        })
      ).then((urls) => {
        urls.forEach((url) => {
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            src: url,
            altText: ""
          });
        });
      }).catch((e) => {
        throw e;
      });
      return true;
    }
  }
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== void 0) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  }
  return true;
}
function getImageNodeInSelection() {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}
function getDragImageData(event) {
  var _a;
  const dragData = (_a = event.dataTransfer) == null ? void 0 : _a.getData("application/x-lexical-drag");
  if (!dragData) {
    return null;
  }
  const { type, data } = JSON.parse(dragData);
  if (type !== "image") {
    return null;
  }
  return data;
}
function canDropImage(event) {
  const target = event.target;
  return !!(target && target instanceof HTMLElement && target.parentElement);
}
function getDragSelection(event) {
  let range;
  const target = event.target;
  const targetWindow = target == null ? null : target.nodeType === 9 ? target.defaultView : target.ownerDocument.defaultView;
  const domSelection = getDOMSelection(targetWindow);
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset ?? 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }
  return range;
}
export {
  $createImageNode,
  $isImageNode,
  INSERT_IMAGE_COMMAND,
  ImageNode,
  allowSetImageDimensions$,
  closeImageDialog$,
  disableImageResize$,
  disableImageSettingsButton$,
  editImageToolbarComponent$,
  imageAutocompleteSuggestions$,
  imageDialogState$,
  imagePlaceholder$,
  imagePlugin,
  imagePreviewHandler$,
  imageUploadHandler$,
  insertImage$,
  openEditImageDialog$,
  openNewImageDialog$,
  parseImageDimension,
  saveImage$
};
