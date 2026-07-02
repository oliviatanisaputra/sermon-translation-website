import * as Dialog from "@radix-ui/react-dialog";
import classNames from "classnames";
import React__default from "react";
import { useForm } from "react-hook-form";
import styles from "../../styles/ui.module.css.js";
import { editorRootElementRef$, useTranslation } from "../core/index.js";
import { imageAutocompleteSuggestions$, imageDialogState$, imageUploadHandler$, allowSetImageDimensions$, saveImage$, closeImageDialog$ } from "./index.js";
import { DownshiftAutoComplete } from "../core/ui/DownshiftAutoComplete.js";
import { useCellValues, usePublisher } from "@mdxeditor/gurx";
const ImageDialog = () => {
  const [imageAutocompleteSuggestions, state, editorRootElementRef, imageUploadHandler, allowSetImageDimensions] = useCellValues(
    imageAutocompleteSuggestions$,
    imageDialogState$,
    editorRootElementRef$,
    imageUploadHandler$,
    allowSetImageDimensions$
  );
  const saveImage = usePublisher(saveImage$);
  const closeImageDialog = usePublisher(closeImageDialog$);
  const t = useTranslation();
  const { register, handleSubmit, control, setValue, reset } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    values: state.type === "editing" ? state.initialValues : {}
  });
  const resetFormState = () => {
    reset({ src: "", title: "", altText: "", width: void 0, height: void 0 });
  };
  if (state.type === "inactive")
    return null;
  return /* @__PURE__ */ React__default.createElement(
    Dialog.Root,
    {
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          closeImageDialog();
          resetFormState();
        }
      }
    },
    /* @__PURE__ */ React__default.createElement(Dialog.Portal, { container: editorRootElementRef == null ? void 0 : editorRootElementRef.current }, /* @__PURE__ */ React__default.createElement(Dialog.Overlay, { className: styles.dialogOverlay }), /* @__PURE__ */ React__default.createElement(
      Dialog.Content,
      {
        className: styles.dialogContent,
        onOpenAutoFocus: (e) => {
          e.preventDefault();
        }
      },
      /* @__PURE__ */ React__default.createElement(Dialog.Title, null, t("uploadImage.dialogTitle", "Upload an image")),
      /* @__PURE__ */ React__default.createElement(
        "form",
        {
          onSubmit: async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await handleSubmit(saveImage)(e);
            resetFormState();
          },
          className: styles.multiFieldForm
        },
        imageUploadHandler === null ? /* @__PURE__ */ React__default.createElement("input", { type: "hidden", accept: "image/*", ...register("file") }) : /* @__PURE__ */ React__default.createElement("div", { className: styles.formField }, /* @__PURE__ */ React__default.createElement("label", { htmlFor: "file" }, t("uploadImage.uploadInstructions", "Upload an image from your device:")), /* @__PURE__ */ React__default.createElement("input", { type: "file", accept: "image/*", ...register("file") })),
        /* @__PURE__ */ React__default.createElement("div", { className: styles.formField }, /* @__PURE__ */ React__default.createElement("label", { htmlFor: "src" }, imageUploadHandler !== null ? t("uploadImage.addViaUrlInstructions", "Or add an image from an URL:") : t("uploadImage.addViaUrlInstructionsNoUpload", "Add an image from an URL:")), /* @__PURE__ */ React__default.createElement(
          DownshiftAutoComplete,
          {
            register,
            initialInputValue: state.type === "editing" ? state.initialValues.src ?? "" : "",
            inputName: "src",
            suggestions: imageAutocompleteSuggestions,
            setValue,
            control,
            placeholder: t("uploadImage.autoCompletePlaceholder", "Select or paste an image src")
          }
        )),
        /* @__PURE__ */ React__default.createElement("div", { className: styles.formField }, /* @__PURE__ */ React__default.createElement("label", { htmlFor: "alt" }, t("uploadImage.alt", "Alt:")), /* @__PURE__ */ React__default.createElement("input", { type: "text", ...register("altText"), className: styles.textInput })),
        /* @__PURE__ */ React__default.createElement("div", { className: styles.formField }, /* @__PURE__ */ React__default.createElement("label", { htmlFor: "title" }, t("uploadImage.title", "Title:")), /* @__PURE__ */ React__default.createElement("input", { type: "text", ...register("title"), className: styles.textInput })),
        allowSetImageDimensions && /* @__PURE__ */ React__default.createElement("div", { className: styles.imageDimensionsContainer }, /* @__PURE__ */ React__default.createElement("div", { className: styles.formField }, /* @__PURE__ */ React__default.createElement("label", { htmlFor: "width" }, t("uploadImage.width", "Width:")), /* @__PURE__ */ React__default.createElement("input", { type: "number", min: 0, ...register("width"), className: styles.textInput })), /* @__PURE__ */ React__default.createElement("div", { className: styles.formField }, /* @__PURE__ */ React__default.createElement("label", { htmlFor: "height" }, t("uploadImage.height", "Height:")), /* @__PURE__ */ React__default.createElement("input", { type: "number", min: 0, ...register("height"), className: styles.textInput }))),
        /* @__PURE__ */ React__default.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: "var(--spacing-2)" } }, /* @__PURE__ */ React__default.createElement(
          "button",
          {
            type: "submit",
            title: t("dialogControls.save", "Save"),
            "aria-label": t("dialogControls.save", "Save"),
            className: classNames(styles.primaryButton)
          },
          t("dialogControls.save", "Save")
        ), /* @__PURE__ */ React__default.createElement(Dialog.Close, { asChild: true }, /* @__PURE__ */ React__default.createElement(
          "button",
          {
            type: "reset",
            title: t("dialogControls.cancel", "Cancel"),
            "aria-label": t("dialogControls.cancel", "Cancel"),
            className: classNames(styles.secondaryButton)
          },
          t("dialogControls.cancel", "Cancel")
        )))
      )
    ))
  );
};
export {
  ImageDialog
};
