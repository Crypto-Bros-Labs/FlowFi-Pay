import { createContext } from "react";

type DialogOptions = {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onNext?: () => void;
    onBack?: () => void;
    nextText?: string;
    backText?: string;
    hideBack?: boolean;
    hideNext?: boolean;
    children?: React.ReactNode;
};

type DialogContextType = {
    showDialog: (options: DialogOptions) => void;
    closeDialog: () => void;
};

export const DialogContext = createContext<DialogContextType | undefined>(undefined);
export type { DialogOptions, DialogContextType };