import { viewMode$, iconComponentFor$, useTranslation } from "../../core/index.js";
import { useCellValues, usePublisher } from "@mdxeditor/gurx";
import React__default from "react";
import styles from "../../../styles/ui.module.css.js";
import { SingleChoiceToggleGroup } from "../primitives/toolbar.js";
const DiffSourceToggleWrapper = ({
  children,
  SourceToolbar,
  options = ["rich-text", "diff", "source"]
}) => {
  const [viewMode, iconComponentFor] = useCellValues(viewMode$, iconComponentFor$);
  const changeViewMode = usePublisher(viewMode$);
  const t = useTranslation();
  const toggleGroupItems = [];
  if (options.includes("rich-text")) {
    toggleGroupItems.push({ title: t("toolbar.richText", "Rich text"), contents: iconComponentFor("rich_text"), value: "rich-text" });
  }
  if (options.includes("diff")) {
    toggleGroupItems.push({ title: t("toolbar.diffMode", "Diff mode"), contents: iconComponentFor("difference"), value: "diff" });
  }
  if (options.includes("source")) {
    toggleGroupItems.push({ title: t("toolbar.source", "Source mode"), contents: iconComponentFor("markdown"), value: "source" });
  }
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, viewMode === "rich-text" ? children : viewMode === "diff" ? /* @__PURE__ */ React__default.createElement("span", { className: styles.toolbarTitleMode }, t("toolbar.diffMode", "Diff mode")) : SourceToolbar ?? /* @__PURE__ */ React__default.createElement("span", { className: styles.toolbarTitleMode }, t("toolbar.source", "Source mode")), /* @__PURE__ */ React__default.createElement("div", { className: styles.diffSourceToggleWrapper }, /* @__PURE__ */ React__default.createElement(
    SingleChoiceToggleGroup,
    {
      className: styles.diffSourceToggle,
      ggClassName: styles.ggDiffSourceToggle,
      value: viewMode,
      items: toggleGroupItems,
      onChange: (value) => {
        changeViewMode(value === "" ? "rich-text" : value);
      }
    }
  )));
};
export {
  DiffSourceToggleWrapper
};
