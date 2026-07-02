import React__default from "react";
import { ButtonOrDropdownButton } from "../primitives/toolbar.js";
import { sandpackConfig$, insertSandpack$ } from "../../sandpack/index.js";
import { useCellValues, usePublisher } from "@mdxeditor/gurx";
import { iconComponentFor$, useTranslation } from "../../core/index.js";
const InsertSandpack = () => {
  const [sandpackConfig, iconComponentFor] = useCellValues(sandpackConfig$, iconComponentFor$);
  const insertSandpack = usePublisher(insertSandpack$);
  const items = React__default.useMemo(() => sandpackConfig.presets.map((preset) => ({ value: preset.name, label: preset.label })), [sandpackConfig]);
  const t = useTranslation();
  return /* @__PURE__ */ React__default.createElement(ButtonOrDropdownButton, { title: t("toolbar.insertSandpack", "Insert Sandpack"), onChoose: insertSandpack, items }, iconComponentFor("sandpack"));
};
export {
  InsertSandpack
};
