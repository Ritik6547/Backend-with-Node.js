import { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState();

  const login = (email, password) => {
    // In a real app, this would make an API call
    const userData = { email, name: email.split("@")[0] };
    setUser(userData);
  };

  const register = (email, password) => {
    // In a real app, this would make an API call
    const userData = { email, name: email.split("@")[0] };
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
