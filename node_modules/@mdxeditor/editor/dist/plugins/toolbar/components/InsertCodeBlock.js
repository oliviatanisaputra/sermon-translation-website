import React__default from "react";
import { ButtonWithTooltip } from "../primitives/toolbar.js";
import { insertCodeBlock$ } from "../../codeblock/index.js";
import { usePublisher, useCellValue } from "@mdxeditor/gurx";
import { iconComponentFor$, useTranslation } from "../../core/index.js";
const InsertCodeBlock = () => {
  const insertCodeBlock = usePublisher(insertCodeBlock$);
  const iconComponentFor = useCellValue(iconComponentFor$);
  const t = useTranslation();
  return /* @__PURE__ */ React__default.createElement(
    ButtonWithTooltip,
    {
      title: t("toolbar.codeBlock", "Insert Code Block"),
      onClick: () => {
        insertCodeBlock({});
      }
    },
    iconComponentFor("frame_source")
  );
};
export {
  InsertCodeBlock
};
