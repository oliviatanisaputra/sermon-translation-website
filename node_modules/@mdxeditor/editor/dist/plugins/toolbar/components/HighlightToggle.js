import React__default from "react";
import { IS_HIGHLIGHT } from "../../../FormatConstants.js";
import { currentFormat$, iconComponentFor$, applyFormat$, useTranslation } from "../../core/index.js";
import { MultipleChoiceToggleGroup } from "../primitives/toolbar.js";
import { useCellValues, usePublisher } from "@mdxeditor/gurx";
const HighlightToggle = () => {
  const [currentFormat, iconComponentFor] = useCellValues(currentFormat$, iconComponentFor$);
  const applyFormat = usePublisher(applyFormat$);
  const t = useTranslation();
  const highlightIsOn = (currentFormat & IS_HIGHLIGHT) !== 0;
  const title = highlightIsOn ? t("toolbar.removeHighlight", "Remove highlight") : t("toolbar.highlight", "Highlight");
  return /* @__PURE__ */ React__default.createElement(
    MultipleChoiceToggleGroup,
    {
      items: [
        {
          title,
          contents: iconComponentFor("format_highlight"),
          active: highlightIsOn,
          onChange: applyFormat.bind(null, "highlight")
        }
      ]
    }
  );
};
export {
  HighlightToggle
};
