import { useState } from "react";
import { AuthContext } from "./auth-context";
import mockUsers from "../data/mockUsers";

function AuthProvider({ children }) {
  // USERS
  const [users, setUsers] = useState(() => {
    const savedUsers =
      localStorage.getItem("saas_users");

    if (savedUsers) {
      return JSON.parse(savedUsers);
    }

    localStorage.setItem(
      "saas_users",
      JSON.stringify(mockUsers)
    );

    return mockUsers;
  });

  // CURRENT USER
  const [user, setUser] = useState(() => {
    const savedSession =
      localStorage.getItem("saas_session");

    if (!savedSession) return null;

    const session = JSON.parse(savedSession);

    return (
      users.find(
        (u) => u.id === session.userId
      ) || null
    );
  });

  // LOGIN
  const login = (email, password) => {
    const foundUser = users.find(
      (u) =>
        u.email === email &&
        u.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const session = {
      token: crypto.randomUUID(),
      userId: foundUser.id,
    };

    localStorage.setItem(
      "saas_session",
      JSON.stringify(session)
    );

    setUser(foundUser);

    return {
      success: true,
      user: foundUser,
    };
  };

  // REGISTER
  const register = (
    name,
    email,
    password
  ) => {
    const existingUser = users.find(
      (u) => u.email === email
    );

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message:
          "Password must be at least 6 characters",
      };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: "user",
      plan: "Starter",
      avatar:
        "https://i.pravatar.cc/150",
      status: "active",
      notifications: 0,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [
      ...users,
      newUser,
    ];

    setUsers(updatedUsers);

    localStorage.setItem(
      "saas_users",
      JSON.stringify(updatedUsers)
    );

    const session = {
      token: crypto.randomUUID(),
      userId: newUser.id,
    };

    localStorage.setItem(
      "saas_session",
      JSON.stringify(session)
    );

    setUser(newUser);

    return {
      success: true,
      user: newUser,
    };
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem(
      "saas_session"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isAuthenticated: !!user,
        loading: false,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;