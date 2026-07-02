import React__default from "react";
import { openNewImageDialog$ } from "../../image/index.js";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import styles from "../../../styles/ui.module.css.js";
import { readOnly$, iconComponentFor$, useTranslation } from "../../core/index.js";
import { TooltipWrap } from "../primitives/TooltipWrap.js";
import { usePublisher, useCellValues } from "@mdxeditor/gurx";
const InsertImage = React__default.forwardRef((_, forwardedRef) => {
  const openNewImageDialog = usePublisher(openNewImageDialog$);
  const [readOnly, iconComponentFor] = useCellValues(readOnly$, iconComponentFor$);
  const t = useTranslation();
  return /* @__PURE__ */ React__default.createElement(
    RadixToolbar.Button,
    {
      className: styles.toolbarButton,
      ref: forwardedRef,
      disabled: readOnly,
      onClick: () => {
        openNewImageDialog();
      }
    },
    /* @__PURE__ */ React__default.createElement(TooltipWrap, { title: t("toolbar.image", "Insert image") }, iconComponentFor("add_photo"))
  );
});
export {
  InsertImage
};
