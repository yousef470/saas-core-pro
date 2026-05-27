import { createContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // LOGIN الحقيقي
  const login = (email, password) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) return false;

    if (
      storedUser.email === email &&
      storedUser.password === password
    ) {
      setUser(storedUser);
      return true;
    }

    return false;
  };

  // REGISTER
  const register = (email, password, name) => {
    if (password.length < 6) {
      alert("كلمة المرور يجب أن تكون 6 خانات على الأقل");
      return false;
    }

    const newUser = { email, password, name };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export { AuthContext };