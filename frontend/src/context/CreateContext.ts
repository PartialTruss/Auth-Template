import { createContext } from "react";

export type TokenContextType = [
    string | null,
    (token: string) => void
];

export const TokenContext = createContext<TokenContextType | undefined>(
    undefined
);
