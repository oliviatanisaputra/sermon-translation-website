import React__default from "react";
import { ButtonWithTooltip } from "../primitives/toolbar.js";
import { openLinkEditDialog$ } from "../../link-dialog/index.js";
import { usePublisher, useCellValue } from "@mdxeditor/gurx";
import { iconComponentFor$, useTranslation } from "../../core/index.js";
const CreateLink = () => {
  const openLinkDialog = usePublisher(openLinkEditDialog$);
  const iconComponentFor = useCellValue(iconComponentFor$);
  const t = useTranslation();
  return /* @__PURE__ */ React__default.createElement(
    ButtonWithTooltip,
    {
      "aria-label": t("toolbar.link", "Create link"),
      title: t("toolbar.link", "Create link"),
      onClick: (_) => {
        openLinkDialog();
      }
    },
    iconComponentFor("link")
  );
};
export {
  CreateLink
};
