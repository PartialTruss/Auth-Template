import { createContext, useState, type ReactNode } from "react";

interface ContextChildren {
  children: ReactNode;
}
export const TokenContext = createContext();

export const TokenProvider = ({ children }: ContextChildren) => {
  const [token, setTokenInternal] = useState(() => {
    return localStorage.getItem("token");
  });

  const setToken = (newToken: string) => {
    if (!newToken) {
      return localStorage.removeItem("token");
    }

    localStorage.setItem("token", newToken);
    setTokenInternal(newToken);
  };

  return (
    <TokenContext.Provider value={[token, setToken]}>
      {children}
    </TokenContext.Provider>
  );
};
