import React__default from "react";
import { insertThematicBreak$ } from "../../thematic-break/index.js";
import { ButtonWithTooltip } from "../primitives/toolbar.js";
import { usePublisher, useCellValue } from "@mdxeditor/gurx";
import { iconComponentFor$, useTranslation } from "../../core/index.js";
const InsertThematicBreak = () => {
  const insertThematicBreak = usePublisher(insertThematicBreak$);
  const iconComponentFor = useCellValue(iconComponentFor$);
  const t = useTranslation();
  return /* @__PURE__ */ React__default.createElement(
    ButtonWithTooltip,
    {
      title: t("toolbar.thematicBreak", "Insert thematic break"),
      onClick: () => {
        insertThematicBreak();
      }
    },
    iconComponentFor("horizontal_rule")
  );
};
export {
  InsertThematicBreak
};
