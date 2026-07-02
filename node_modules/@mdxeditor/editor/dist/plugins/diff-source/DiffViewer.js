import React__default from "react";
import { diffMarkdown$, readOnlyDiff$, cmExtensions$ } from "./index.js";
import { markdown$, readOnly$, markdownSourceEditorValue$, onBlur$ } from "../core/index.js";
import { MergeView } from "@codemirror/merge";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { COMMON_STATE_CONFIG_EXTENSIONS } from "./SourceEditor.js";
import { useRealm, useCellValues, usePublisher, useCellValue } from "@mdxeditor/gurx";
function setContent(view, content) {
  if (view !== void 0) {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: content } });
  }
}
const DiffViewer = () => {
  const realm = useRealm();
  const [newMarkdown, oldMarkdown, readOnly, readOnlyDiff] = useCellValues(markdown$, diffMarkdown$, readOnly$, readOnlyDiff$);
  const onUpdate = usePublisher(markdownSourceEditorValue$);
  const elRef = React__default.useRef(null);
  const cmMergeViewRef = React__default.useRef(null);
  const cmExtensions = useCellValue(cmExtensions$);
  const triggerOnBlur = usePublisher(onBlur$);
  React__default.useEffect(() => {
    return realm.sub(diffMarkdown$, (newDiffMarkdown) => {
      var _a;
      setContent((_a = cmMergeViewRef.current) == null ? void 0 : _a.a, newDiffMarkdown);
    });
  }, [realm]);
  React__default.useEffect(() => {
    return realm.sub(markdown$, (newMarkdown2) => {
      var _a;
      setContent((_a = cmMergeViewRef.current) == null ? void 0 : _a.b, newMarkdown2);
    });
  }, [realm]);
  React__default.useEffect(() => {
    const isReadOnly = readOnly || readOnlyDiff;
    const revertParams = isReadOnly ? {
      renderRevertControl: void 0,
      revertControls: void 0
    } : {
      renderRevertControl: () => {
        const el = document.createElement("button");
        el.classList.add("cm-merge-revert");
        el.appendChild(document.createTextNode("⮕"));
        return el;
      },
      revertControls: "a-to-b"
    };
    cmMergeViewRef.current = new MergeView({
      ...revertParams,
      parent: elRef.current,
      orientation: "a-b",
      gutter: true,
      a: {
        doc: oldMarkdown,
        extensions: [...cmExtensions, ...COMMON_STATE_CONFIG_EXTENSIONS, EditorState.readOnly.of(true)]
      },
      b: {
        doc: newMarkdown,
        extensions: [
          ...cmExtensions,
          ...COMMON_STATE_CONFIG_EXTENSIONS,
          EditorState.readOnly.of(isReadOnly),
          EditorView.updateListener.of(({ state }) => {
            const md = state.doc.toString();
            onUpdate(md);
          }),
          EditorView.focusChangeEffect.of((_, focused) => {
            if (!focused) {
              triggerOnBlur(new FocusEvent("blur"));
            }
            return null;
          })
        ]
      }
    });
    return () => {
      var _a;
      (_a = cmMergeViewRef.current) == null ? void 0 : _a.destroy();
      cmMergeViewRef.current = null;
    };
  }, [onUpdate, cmExtensions]);
  return /* @__PURE__ */ React__default.createElement("div", { ref: elRef, className: "mdxeditor-diff-editor" });
};
export {
  DiffViewer
};
