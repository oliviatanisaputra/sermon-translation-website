import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { useCellValues } from "@mdxeditor/gurx";
import React__default from "react";
import styles from "../../styles/ui.module.css.js";
import { useCodeBlockEditorContext } from "../codeblock/CodeBlockNode.js";
import { readOnly$, iconComponentFor$, useTranslation } from "../core/index.js";
import { useCodeMirrorRef } from "./useCodeMirrorRef.js";
const CodeUpdateEmitter = ({ onChange, snippetFileName }) => {
  const { sandpack } = useSandpack();
  onChange(sandpack.files[snippetFileName].code);
  return null;
};
const SandpackEditor = ({ nodeKey, code, focusEmitter, preset }) => {
  const codeMirrorRef = useCodeMirrorRef(nodeKey, "sandpack", "jsx", focusEmitter);
  const [readOnly, iconComponentFor] = useCellValues(readOnly$, iconComponentFor$);
  const { setCode } = useCodeBlockEditorContext();
  const { parentEditor, lexicalNode } = useCodeBlockEditorContext();
  const t = useTranslation();
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.sandPackWrapper }, /* @__PURE__ */ React__default.createElement("div", { className: styles.codeMirrorToolbar }, /* @__PURE__ */ React__default.createElement(
    "button",
    {
      className: styles.iconButton,
      type: "button",
      disabled: readOnly,
      title: t("codeblock.delete", "Delete code block"),
      onClick: (e) => {
        e.preventDefault();
        parentEditor.update(() => {
          lexicalNode.remove();
        });
      }
    },
    iconComponentFor("delete_small")
  )), /* @__PURE__ */ React__default.createElement(
    SandpackProvider,
    {
      template: preset.sandpackTemplate,
      theme: preset.sandpackTheme,
      files: {
        [preset.snippetFileName]: code,
        ...Object.entries(preset.files ?? {}).reduce(
          (acc, [filePath, fileContents]) => ({ ...acc, ...{ [filePath]: { code: fileContents, readOnly: true } } }),
          {}
        )
      },
      customSetup: {
        dependencies: preset.dependencies
      }
    },
    /* @__PURE__ */ React__default.createElement(SandpackLayout, null, /* @__PURE__ */ React__default.createElement(SandpackCodeEditor, { readOnly, showLineNumbers: true, showInlineErrors: true, ref: codeMirrorRef }), /* @__PURE__ */ React__default.createElement(SandpackPreview, null)),
    /* @__PURE__ */ React__default.createElement(CodeUpdateEmitter, { onChange: setCode, snippetFileName: preset.snippetFileName })
  ));
};
export {
  SandpackEditor
};
