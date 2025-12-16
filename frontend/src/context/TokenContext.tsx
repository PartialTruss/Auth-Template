import { useState, type ReactNode } from "react";
import { TokenContext } from "./CreateContext";

interface ContextChildren {
  children: ReactNode;
}

export const TokenProvider = ({ children }: ContextChildren) => {
  const [token, setTokenInternal] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const setToken = (newToken: string) => {
    if (!newToken) {
      localStorage.removeItem("token");
      setTokenInternal(null);
      return;
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
