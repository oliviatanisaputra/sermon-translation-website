import React__default from "react";
import { Realm, RealmContext } from "@mdxeditor/gurx";
import { tap } from "./utils/fp.js";
function realmPlugin(plugin) {
  return function(params) {
    return {
      init: (realm) => {
        var _a;
        return (_a = plugin.init) == null ? void 0 : _a.call(plugin, realm, params);
      },
      postInit: (realm) => {
        var _a;
        return (_a = plugin.postInit) == null ? void 0 : _a.call(plugin, realm, params);
      },
      update: (realm) => {
        var _a;
        return (_a = plugin.update) == null ? void 0 : _a.call(plugin, realm, params);
      }
    };
  };
}
function RealmWithPlugins({ children, plugins }) {
  const theRealm = React__default.useMemo(() => {
    return tap(new Realm(), (r) => {
      var _a, _b;
      for (const plugin of plugins) {
        (_a = plugin.init) == null ? void 0 : _a.call(plugin, r);
      }
      for (const plugin of plugins) {
        (_b = plugin.postInit) == null ? void 0 : _b.call(plugin, r);
      }
    });
  }, []);
  React__default.useEffect(() => {
    var _a;
    for (const plugin of plugins) {
      (_a = plugin.update) == null ? void 0 : _a.call(plugin, theRealm);
    }
  });
  return /* @__PURE__ */ React__default.createElement(RealmContext.Provider, { value: theRealm }, children);
}
export {
  RealmWithPlugins,
  realmPlugin
};
