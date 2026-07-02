import React__default, { useEffect, useCallback, useMemo, createContext } from "react";
import { realmPlugin } from "../../RealmWithPlugins.js";
import { addComposerChild$ } from "../core/index.js";
const RemoteMDXEditorRealmContextValueStub = {
  editorMap: /* @__PURE__ */ new Map(),
  registerEditor: (_id, _realm) => void 0
};
const RemoteMDXEditorRealmContext = createContext(RemoteMDXEditorRealmContextValueStub);
const RemoteMDXEditorRealmProvider = ({ children }) => {
  const [editorMap, setEditorMap] = React__default.useState(/* @__PURE__ */ new Map());
  useEffect(() => {
    return () => {
      setEditorMap(/* @__PURE__ */ new Map());
    };
  }, []);
  const registerEditor = useCallback((id, realm) => {
    setEditorMap((prev) => {
      return new Map(prev).set(id, realm);
    });
  }, []);
  const contextValue = useMemo(
    () => ({
      editorMap,
      registerEditor
    }),
    [editorMap, registerEditor]
  );
  return /* @__PURE__ */ React__default.createElement(RemoteMDXEditorRealmContext.Provider, { value: contextValue }, children);
};
const RemotePluginRegister = ({ realm, editorId }) => {
  const { registerEditor } = React__default.useContext(RemoteMDXEditorRealmContext);
  useEffect(() => {
    registerEditor(editorId, realm);
  }, [realm, editorId, registerEditor]);
  return null;
};
const remoteRealmPlugin = realmPlugin({
  init: (realm, params) => {
    if (params == null ? void 0 : params.editorId) {
      realm.pub(addComposerChild$, () => /* @__PURE__ */ React__default.createElement(RemotePluginRegister, { realm, editorId: params.editorId }));
    }
  }
});
function useRemoteMDXEditorRealm(editorId) {
  return React__default.useContext(RemoteMDXEditorRealmContext).editorMap.get(editorId);
}
export {
  RemoteMDXEditorRealmProvider,
  remoteRealmPlugin,
  useRemoteMDXEditorRealm
};
