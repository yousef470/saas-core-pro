import {
  createContext,
  useState,
} from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const login = (email) => {
    const fakeUser = {
      email,
      name: "Yousef Ahmed",
    };

    setUser(fakeUser);

    localStorage.setItem(
      "user",
      JSON.stringify(fakeUser)
    );
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export { AuthContext };