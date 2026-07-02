import React__default from "react";
import { ButtonOrDropdownButton } from "../primitives/toolbar.js";
import { insertDirective$ } from "../../directives/index.js";
import { ADMONITION_TYPES } from "../../../directive-editors/AdmonitionDirectiveDescriptor.js";
import { usePublisher, useCellValue } from "@mdxeditor/gurx";
import { iconComponentFor$, useTranslation } from "../../core/index.js";
import { admonitionLabelsMap } from "./ChangeAdmonitionType.js";
const InsertAdmonition = () => {
  const insertDirective = usePublisher(insertDirective$);
  const iconComponentFor = useCellValue(iconComponentFor$);
  const t = useTranslation();
  const items = React__default.useMemo(() => {
    const labels = admonitionLabelsMap(t);
    return ADMONITION_TYPES.map((type) => ({ value: type, label: labels[type] }));
  }, [t]);
  return /* @__PURE__ */ React__default.createElement(
    ButtonOrDropdownButton,
    {
      title: t("toolbar.admonition", "Insert Admonition"),
      onChoose: (admonitionName) => {
        insertDirective({
          type: "containerDirective",
          name: admonitionName
        });
      },
      items
    },
    iconComponentFor("admonition")
  );
};
export {
  InsertAdmonition
};
