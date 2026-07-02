import React__default from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import { useCellValues } from "@mdxeditor/gurx";
import classNames from "classnames";
import { $isNodeSelection, $getSelection, $getNodeByKey, $setSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW, CLICK_COMMAND, DRAGSTART_COMMAND, KEY_DELETE_COMMAND, KEY_BACKSPACE_COMMAND, KEY_ENTER_COMMAND, KEY_ESCAPE_COMMAND } from "lexical";
import { imagePlaceholder$, disableImageResize$, allowSetImageDimensions$, imagePreviewHandler$, editImageToolbarComponent$ } from "./index.js";
import styles from "../../styles/ui.module.css.js";
import { readOnly$ } from "../core/index.js";
import { $isImageNode } from "./ImageNode.js";
import ImageResizer from "./ImageResizer.js";
const BROKEN_IMG_URI = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
  /* xml */
  `
    <svg id="imgLoadError" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect x="0" y="0" width="100" height="100" fill="none" stroke="red" stroke-width="4" stroke-dasharray="4" />
      <text x="50" y="55" text-anchor="middle" font-size="20" fill="red">⚠️</text>
    </svg>
`
);
const imgCache = {
  __cache: {},
  read(src) {
    if (!this.__cache[src]) {
      this.__cache[src] = new Promise((resolve) => {
        const img = new Image();
        img.onerror = () => {
          this.__cache[src] = BROKEN_IMG_URI;
          resolve();
        };
        img.onload = () => {
          this.__cache[src] = src;
          resolve();
        };
        img.src = src;
      });
    }
    if (this.__cache[src] instanceof Promise) {
      throw this.__cache[src];
    }
    return this.__cache[src];
  }
};
function LazyImage({
  title,
  alt,
  className,
  imageRef,
  src,
  width,
  height
}) {
  return /* @__PURE__ */ React__default.createElement(
    "img",
    {
      className: className ?? void 0,
      alt,
      src: imgCache.read(src),
      title,
      ref: imageRef,
      draggable: "false",
      width,
      height
    }
  );
}
function ImageEditor({ src, title, alt, nodeKey, width, height, rest }) {
  const [ImagePlaceholderComponent, disableImageResize, allowSetImageDimensions, imagePreviewHandler, readOnly, EditImageToolbar] = useCellValues(
    imagePlaceholder$,
    disableImageResize$,
    allowSetImageDimensions$,
    imagePreviewHandler$,
    readOnly$,
    editImageToolbarComponent$
  );
  const imageRef = React__default.useRef(null);
  const buttonRef = React__default.useRef(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = React__default.useState(null);
  const activeEditorRef = React__default.useRef(null);
  const [isResizing, setIsResizing] = React__default.useState(false);
  const [imageSource, setImageSource] = React__default.useState(null);
  const [initialImagePath, setInitialImagePath] = React__default.useState(null);
  const onDelete = React__default.useCallback(
    (payload) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );
  const onEnter = React__default.useCallback(
    (event) => {
      const latestSelection = $getSelection();
      const buttonElem = buttonRef.current;
      if (isSelected && $isNodeSelection(latestSelection) && latestSelection.getNodes().length === 1) {
        if (buttonElem !== null && buttonElem !== document.activeElement) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [isSelected]
  );
  const onEscape = React__default.useCallback(
    (event) => {
      if (buttonRef.current === event.target) {
        $setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [editor, setSelected]
  );
  React__default.useEffect(() => {
    if (imagePreviewHandler) {
      const callPreviewHandler = async () => {
        if (!initialImagePath)
          setInitialImagePath(src);
        const updatedSrc = await imagePreviewHandler(src);
        setImageSource(updatedSrc);
      };
      callPreviewHandler().catch((e) => {
        console.error(e);
      });
    } else {
      setImageSource(src);
    }
  }, [src, imagePreviewHandler, initialImagePath]);
  React__default.useEffect(() => {
    if (allowSetImageDimensions && imageRef.current) {
      const { current: image } = imageRef;
      syncDimensionWithImageResizer(image, "width", width);
      syncDimensionWithImageResizer(image, "height", height);
    }
  }, [allowSetImageDimensions, width, height]);
  React__default.useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;
          if (isResizing) {
            return true;
          }
          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, onEscape, COMMAND_PRIORITY_LOW)
    );
    return () => {
      isMounted = false;
      unregister();
    };
  }, [clearSelection, editor, isResizing, isSelected, nodeKey, onDelete, onEnter, onEscape, setSelected]);
  const onResizeEnd = (nextWidth, nextHeight) => {
    setTimeout(() => {
      setIsResizing(false);
    }, 200);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };
  const onResizeStart = () => {
    setIsResizing(true);
  };
  const draggable = $isNodeSelection(selection);
  const isFocused = isSelected;
  const passedClassName = React__default.useMemo(() => {
    if (rest.length === 0) {
      return null;
    }
    const className = rest.find((attr) => attr.type === "mdxJsxAttribute" && (attr.name === "class" || attr.name === "className"));
    if (className) {
      return className.value;
    }
    return null;
  }, [rest]);
  return imageSource !== null ? /* @__PURE__ */ React__default.createElement(React__default.Suspense, { fallback: ImagePlaceholderComponent ? /* @__PURE__ */ React__default.createElement(ImagePlaceholderComponent, null) : null }, /* @__PURE__ */ React__default.createElement("div", { className: styles.imageWrapper, "data-editor-block-type": "image" }, /* @__PURE__ */ React__default.createElement("div", { draggable }, /* @__PURE__ */ React__default.createElement(
    LazyImage,
    {
      width,
      height,
      className: classNames(
        {
          [styles.focusedImage]: isFocused
        },
        passedClassName
      ),
      src: imageSource,
      title: title ?? "",
      alt: alt ?? "",
      imageRef
    }
  )), draggable && isFocused && !disableImageResize && /* @__PURE__ */ React__default.createElement(ImageResizer, { editor, imageRef, onResizeStart, onResizeEnd }), readOnly || /* @__PURE__ */ React__default.createElement(
    EditImageToolbar,
    {
      nodeKey,
      imageSource,
      initialImagePath,
      title: title ?? "",
      alt: alt ?? "",
      width,
      height
    }
  ))) : null;
}
const syncDimensionWithImageResizer = (image, key, value) => {
  if (typeof value === "number") {
    image.style[key] = `${value}px`;
  } else {
    image.style.removeProperty(key);
  }
};
export {
  ImageEditor
};
