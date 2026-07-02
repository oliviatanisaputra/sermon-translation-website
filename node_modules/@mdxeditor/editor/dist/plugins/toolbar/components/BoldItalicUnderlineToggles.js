import { useTranslation, currentFormat$, iconComponentFor$, applyFormat$ } from "../../core/index.js";
import { useCellValues, usePublisher } from "@mdxeditor/gurx";
import React__default from "react";
import { IS_BOLD, IS_ITALIC, IS_UNDERLINE, IS_STRIKETHROUGH, IS_SUPERSCRIPT, IS_SUBSCRIPT } from "../../../FormatConstants.js";
import { ToggleSingleGroupWithItem } from "../primitives/toolbar.js";
import styles from "../../../styles/ui.module.css.js";
const FormatButton = ({ format, addTitle, removeTitle, icon, formatName }) => {
  const [currentFormat, iconComponentFor] = useCellValues(currentFormat$, iconComponentFor$);
  const applyFormat = usePublisher(applyFormat$);
  const active = (currentFormat & format) !== 0;
  return /* @__PURE__ */ React__default.createElement(
    ToggleSingleGroupWithItem,
    {
      title: active ? removeTitle : addTitle,
      on: active,
      onValueChange: () => {
        applyFormat(formatName);
      }
    },
    iconComponentFor(icon)
  );
};
const BoldItalicUnderlineToggles = ({ options }) => {
  const t = useTranslation();
  const showAllButtons = typeof options === "undefined";
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.toolbarGroupOfGroups }, showAllButtons || options.includes("Bold") ? /* @__PURE__ */ React__default.createElement(
    FormatButton,
    {
      format: IS_BOLD,
      addTitle: t("toolbar.bold", "Bold"),
      removeTitle: t("toolbar.removeBold", "Remove bold"),
      icon: "format_bold",
      formatName: "bold"
    }
  ) : null, showAllButtons || options.includes("Italic") ? /* @__PURE__ */ React__default.createElement(
    FormatButton,
    {
      format: IS_ITALIC,
      addTitle: t("toolbar.italic", "Italic"),
      removeTitle: t("toolbar.removeItalic", "Remove italic"),
      icon: "format_italic",
      formatName: "italic"
    }
  ) : null, showAllButtons || options.includes("Underline") ? /* @__PURE__ */ React__default.createElement(
    FormatButton,
    {
      format: IS_UNDERLINE,
      addTitle: t("toolbar.underline", "Underline"),
      removeTitle: t("toolbar.removeUnderline", "Remove underline"),
      icon: "format_underlined",
      formatName: "underline"
    }
  ) : null);
};
const StrikeThroughSupSubToggles = ({ options }) => {
  const t = useTranslation();
  const showAllButtons = typeof options === "undefined";
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.toolbarGroupOfGroups }, showAllButtons || options.includes("Strikethrough") ? /* @__PURE__ */ React__default.createElement(
    FormatButton,
    {
      format: IS_STRIKETHROUGH,
      addTitle: t("toolbar.strikethrough", "Strikethrough"),
      removeTitle: t("toolbar.removeStrikethrough", "Remove strikethrough"),
      icon: "strikeThrough",
      formatName: "strikethrough"
    }
  ) : null, showAllButtons || options.includes("Sup") ? /* @__PURE__ */ React__default.createElement(
    FormatButton,
    {
      format: IS_SUPERSCRIPT,
      addTitle: t("toolbar.superscript", "Superscript"),
      removeTitle: t("toolbar.removeSuperscript", "Remove superscript"),
      icon: "superscript",
      formatName: "superscript"
    }
  ) : null, showAllButtons || options.includes("Sub") ? /* @__PURE__ */ React__default.createElement(
    FormatButton,
    {
      format: IS_SUBSCRIPT,
      addTitle: t("toolbar.subscript", "Subscript"),
      removeTitle: t("toolbar.removeSubscript", "Remove subscript"),
      icon: "subscript",
      formatName: "subscript"
    }
  ) : null);
};
export {
  BoldItalicUnderlineToggles,
  StrikeThroughSupSubToggles
};
