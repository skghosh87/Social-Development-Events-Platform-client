import { createContext } from "react";

export const AuthContext = createContext(null);

import { useContext } from "react";

export const useAuth = () => {
  return useContext(AuthContext);
};
