import React__default from "react";
import { useMdastNodeUpdater, NestedLexicalEditor } from "../plugins/core/NestedLexicalEditor.js";
import { PropertyPopover } from "../plugins/core/PropertyPopover.js";
import styles from "../styles/ui.module.css.js";
const isExpressionValue = (value) => {
  if (value !== null && typeof value === "object" && "type" in value && "value" in value && typeof value.value === "string") {
    return true;
  }
  return false;
};
const isStringValue = (value) => typeof value === "string";
const isMdxJsxAttribute = (value) => {
  if (value.type === "mdxJsxAttribute" && typeof value.name === "string") {
    return true;
  }
  return false;
};
const GenericJsxEditor = ({ mdastNode, descriptor, PropertyEditor }) => {
  const updateMdastNode = useMdastNodeUpdater();
  const properties = React__default.useMemo(
    () => descriptor.props.reduce((acc, { name }) => {
      const attribute = mdastNode.attributes.find((attr) => isMdxJsxAttribute(attr) ? attr.name === name : false);
      if (attribute) {
        if (isExpressionValue(attribute.value)) {
          acc[name] = attribute.value.value;
          return acc;
        }
        if (isStringValue(attribute.value)) {
          acc[name] = attribute.value;
          return acc;
        }
      }
      acc[name] = "";
      return acc;
    }, {}),
    [mdastNode, descriptor]
  );
  const onChange = React__default.useCallback(
    (values) => {
      const updatedAttributes = Object.entries(values).reduce((acc, [name, value]) => {
        if (value === "") {
          return acc;
        }
        const property = descriptor.props.find((prop) => prop.name === name);
        if ((property == null ? void 0 : property.type) === "expression") {
          acc.push({
            type: "mdxJsxAttribute",
            name,
            value: { type: "mdxJsxAttributeValueExpression", value }
          });
          return acc;
        }
        acc.push({
          type: "mdxJsxAttribute",
          name,
          value
        });
        return acc;
      }, []);
      updateMdastNode({ attributes: updatedAttributes });
    },
    [mdastNode, updateMdastNode, descriptor]
  );
  const PropertyEditorComponent = PropertyEditor ?? PropertyPopover;
  const shouldRenderComponentName = descriptor.props.length == 0 && descriptor.hasChildren && descriptor.kind === "flow";
  return /* @__PURE__ */ React__default.createElement("div", { className: descriptor.kind === "text" ? styles.inlineEditor : styles.blockEditor }, shouldRenderComponentName ? /* @__PURE__ */ React__default.createElement("span", { className: styles.genericComponentName }, mdastNode.name ?? "Fragment") : null, descriptor.props.length > 0 ? /* @__PURE__ */ React__default.createElement(PropertyEditorComponent, { properties, title: mdastNode.name ?? "", onChange }) : null, descriptor.hasChildren ? /* @__PURE__ */ React__default.createElement(
    NestedLexicalEditor,
    {
      block: descriptor.kind === "flow",
      getContent: (node) => node.children,
      getUpdatedMdastNode: (mdastNode2, children) => {
        return { ...mdastNode2, children };
      }
    }
  ) : /* @__PURE__ */ React__default.createElement("span", { className: styles.genericComponentName }, mdastNode.name));
};
export {
  GenericJsxEditor
};
