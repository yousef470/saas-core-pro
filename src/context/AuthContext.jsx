import { useState } from "react";
import { AuthContext } from "./auth-context";
import mockUsers from "../data/mockUsers";

function AuthProvider({ children }) {
  // USERS
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("saas_users");

    if (savedUsers) {
      return JSON.parse(savedUsers);
    }

    localStorage.setItem("saas_users", JSON.stringify(mockUsers));

    return mockUsers;
  });

  // CURRENT USER
  const [user, setUser] = useState(() => {
    const savedSession = localStorage.getItem("saas_session");

    if (!savedSession) return null;

    const session = JSON.parse(savedSession);

    return users.find((u) => u.id === session.userId) || null;
  });

  // LOGIN
  const login = (email, password) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
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

    localStorage.setItem("saas_session", JSON.stringify(session));

    setUser(foundUser);
    const updatedUsers = users.map((u) =>
      u.id === foundUser.id
        ? {
            ...u,
            activityLog: [
              {
                id: crypto.randomUUID(),
                action: "Login",
                description: "User logged in",
                createdAt: new Date().toISOString(),
              },
              ...(u.activityLog || []),
            ],
          }
        : u,
    );

    setUsers(updatedUsers);

    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));

    setUser(updatedUsers.find((u) => u.id === foundUser.id));

    return {
      success: true,
      user: foundUser,
    };
  };

  // REGISTER
  const register = (name, email, password) => {
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: "user",
      plan: "Starter",
      avatar: "https://i.pravatar.cc/150",
      status: "Active",
      phone: "",

      twoFactor: false,

      language: "en",

      theme: "light",

      emailNotifications: true,

      notifications: [
        {
          id: crypto.randomUUID(),
          title: "Welcome to Saas core",
          message: "Your account has been created successfully.",
          read: false,
          createdAt: new Date().toISOString(),
        },
      ],
      activityLog: [
        {
          id: crypto.randomUUID(),
          action: "Account Created",
          description: "User created a new account",
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };
    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);

    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));

    const session = {
      token: crypto.randomUUID(),
      userId: newUser.id,
    };

    localStorage.setItem("saas_session", JSON.stringify(session));

    setUser(newUser);

    return {
      success: true,
      user: newUser,
    };
  };

  const updateProfile = (updatedData) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, ...updatedData } : u,
    );

    setUsers(updatedUsers);

    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));

    const updatedUser = updatedUsers.find((u) => u.id === user.id);

    setUser(updatedUser);
  };

  const addNotification = (title, message) => {
    const notification = {
      id: crypto.randomUUID(),
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            notifications: [notification, ...(u.notifications || [])],
          }
        : u,
    );

    setUsers(updatedUsers);

    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));

    const updatedUser = updatedUsers.find((u) => u.id === user.id);

    setUser(updatedUser);
  };

  const markNotificationAsRead = (notificationId) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            notifications: u.notifications.map((n) =>
              n.id === notificationId
                ? {
                    ...n,
                    read: true,
                  }
                : n,
            ),
          }
        : u,
    );

    setUsers(updatedUsers);

    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));

    const updatedUser = updatedUsers.find((u) => u.id === user.id);

    setUser(updatedUser);
  };

  const markAllNotificationsAsRead = () => {
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            notifications: u.notifications.map((n) => ({
              ...n,
              read: true,
            })),
          }
        : u,
    );

    setUsers(updatedUsers);

    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));

    setUser(updatedUsers.find((u) => u.id === user.id));
  };

  const deleteNotification = (notificationId) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            notifications: u.notifications.filter(
              (n) => n.id !== notificationId,
            ),
          }
        : u,
    );

    setUsers(updatedUsers);

    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));

    setUser(updatedUsers.find((u) => u.id === user.id));
  };

  const clearAllNotifications = () => {
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            notifications: [],
          }
        : u,
    );

    setUsers(updatedUsers);

    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));

    setUser(updatedUsers.find((u) => u.id === user.id));
  };

  const updatePassword = (currentPassword, newPassword) => {
    if (user.password !== currentPassword) {
      return {
        success: false,
        message: "Wrong password",
      };
    }
    addActivity("Password Changed", "Password updated successfully");

    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            password: newPassword,
          }
        : u,
    );

    setUsers(updatedUsers);

    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));

    const updatedUser = updatedUsers.find((u) => u.id === user.id);

    setUser(updatedUser);

    return {
      success: true,
    };
  };

  // LOGOUT
  const logout = () => {
    if (user) {
      const updatedUsers = users.map((u) =>
        u.id === user.id
          ? {
              ...u,
              activityLog: [
                {
                  id: crypto.randomUUID(),
                  action: "Logout",
                  description: "User logged out",
                  createdAt: new Date().toISOString(),
                },
                ...(u.activityLog || []),
              ],
            }
          : u,
      );

      localStorage.setItem("saas_users", JSON.stringify(updatedUsers));
    }

    localStorage.removeItem("saas_session");

    setUser(null);
  };

  const addActivity = (action, description) => {
    const activity = {
      id: crypto.randomUUID(),
      action,
      description,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            activityLog: [activity, ...(u.activityLog || [])],
          }
        : u,
    );

    setUsers(updatedUsers);

    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));

    setUser(updatedUsers.find((u) => u.id === user.id));
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
        updateProfile,
        updatePassword,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        addActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
