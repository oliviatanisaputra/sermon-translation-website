import React__default from "react";
import { editorInFocus$, rootEditor$, useTranslation } from "../../core/index.js";
import { Select } from "../primitives/select.js";
import { ADMONITION_TYPES } from "../../../directive-editors/AdmonitionDirectiveDescriptor.js";
import { useCellValues } from "@mdxeditor/gurx";
function admonitionLabelsMap(t) {
  return {
    note: t("admonitions.note", "Note"),
    tip: t("admonitions.tip", "Tip"),
    danger: t("admonitions.danger", "Danger"),
    info: t("admonitions.info", "Info"),
    caution: t("admonitions.caution", "Caution")
  };
}
const ChangeAdmonitionType = () => {
  const [editorInFocus, rootEditor] = useCellValues(editorInFocus$, rootEditor$);
  const admonitionNode = editorInFocus.rootNode;
  const t = useTranslation();
  const labels = admonitionLabelsMap(t);
  return /* @__PURE__ */ React__default.createElement(
    Select,
    {
      value: admonitionNode.getMdastNode().name,
      onChange: (name) => {
        rootEditor == null ? void 0 : rootEditor.update(() => {
          admonitionNode.setMdastNode({ ...admonitionNode.getMdastNode(), name });
          setTimeout(() => {
            rootEditor.update(() => {
              admonitionNode.getLatest().select();
            });
          }, 80);
        });
      },
      triggerTitle: t("admonitions.changeType", "Select admonition type"),
      placeholder: t("admonitions.placeholder", "Admonition type"),
      items: ADMONITION_TYPES.map((type) => ({ label: labels[type], value: type }))
    }
  );
};
export {
  ChangeAdmonitionType,
  admonitionLabelsMap
};
