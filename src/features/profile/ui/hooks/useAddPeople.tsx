import { useState } from "react";

export const useAddPeople = () => {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [fullNameError, setFullNameError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Validaciones simples
    const validateEmail = (value: string) => {
        if (!value) return "El correo es requerido";
        // Regex simple para email
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value)) return "Correo inválido";
        return null;
    };

    const validateFullName = (value: string) => {
        if (!value) return "El nombre es requerido";
        if (value.length < 3) return "El nombre es muy corto";
        return null;
    };

    // Validación global
    const isFormValid =
        !validateEmail(email) &&
        !validateFullName(fullName);

    const handleAddAccount = async () => {
        const emailErr = validateEmail(email);
        const nameErr = validateFullName(fullName);
        setEmailError(emailErr);
        setFullNameError(nameErr);

        if (emailErr || nameErr) return;

        setIsLoading(true);
        try {
            await new Promise(res => setTimeout(res, 1000));
            setEmail("");
            setFullName("");
        } catch (e) {
            console.error("Error al agregar miembro:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        setEmail,
        fullName,
        setFullName,
        emailError,
        fullNameError,
        isLoading,
        isFormValid,
        handleAddAccount,
    };
};