import { useState, type ReactNode } from "react";
import Dialog from "../components/Dialog";
import { DialogContext, type DialogOptions } from "./DialogContext";

export const DialogProvider = ({ children }: { children: ReactNode }) => {
    const [dialogOptions, setDialogOptions] = useState<DialogOptions | null>(null);

    const showDialog = (options: DialogOptions) => setDialogOptions(options);
    const closeDialog = () => setDialogOptions(null);

    return (
        <DialogContext.Provider value={{ showDialog, closeDialog }}>
            {children}
            <Dialog
                open={!!dialogOptions}
                onClose={() => {
                    if (dialogOptions?.onBack) {
                        dialogOptions.onBack();
                    }
                    closeDialog();
                }}
                title={dialogOptions?.title ?? ""}
                subtitle={dialogOptions?.subtitle}
                icon={dialogOptions?.icon}
                onNext={
                    () => {
                        if (dialogOptions?.onNext) {
                            dialogOptions.onNext();
                        }
                        closeDialog();
                    }
                }
                onBack={
                    () => {
                        if (dialogOptions?.onBack) {
                            dialogOptions.onBack();
                        }
                        closeDialog();
                    }
                }
                nextText={dialogOptions?.nextText}
                backText={dialogOptions?.backText}
                hideBack={dialogOptions?.hideBack}
                hideNext={dialogOptions?.hideNext}
            >
                {dialogOptions?.children}
            </Dialog>
        </DialogContext.Provider>
    );
};