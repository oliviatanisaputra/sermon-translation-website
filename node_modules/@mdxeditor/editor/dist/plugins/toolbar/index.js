import { realmPlugin } from "../../RealmWithPlugins.js";
import { Cell, useCellValues } from "@mdxeditor/gurx";
import React__default from "react";
import { addBottomAreaChild$, addTopAreaChild$, readOnly$ } from "../core/index.js";
import { Root } from "./primitives/toolbar.js";
const toolbarContents$ = Cell(() => null);
const toolbarClassName$ = Cell("");
const DEFAULT_TOOLBAR_CONTENTS = () => {
  return "This is an empty toolbar. Pass `{toolbarContents: () => { return <>toolbar components</> }}` to the toolbarPlugin to customize it.";
};
const toolbarPlugin = realmPlugin({
  init(realm, params) {
    const toolbarPositionSymbol = (params == null ? void 0 : params.toolbarPosition) === "bottom" ? addBottomAreaChild$ : addTopAreaChild$;
    realm.pubIn({
      [toolbarContents$]: (params == null ? void 0 : params.toolbarContents) ?? DEFAULT_TOOLBAR_CONTENTS,
      [toolbarClassName$]: (params == null ? void 0 : params.toolbarClassName) ?? "",
      [toolbarPositionSymbol]: () => {
        const [toolbarContents, readOnly, toolbarClassName] = useCellValues(toolbarContents$, readOnly$, toolbarClassName$);
        return /* @__PURE__ */ React__default.createElement(Root, { className: toolbarClassName, readOnly }, toolbarContents());
      }
    });
  },
  update(realm, params) {
    realm.pub(toolbarContents$, (params == null ? void 0 : params.toolbarContents) ?? DEFAULT_TOOLBAR_CONTENTS);
    realm.pub(toolbarClassName$, (params == null ? void 0 : params.toolbarClassName) ?? "");
  }
});
export {
  toolbarClassName$,
  toolbarContents$,
  toolbarPlugin
};
