import { useState    } from "react";
import { AuthContext } from "./auth-context";
import mockUsers from "../data/mockUsers";

function AuthProvider({ children }) {
  // 1. قراءة المستخدمين بشكل آمن ومستقر من الـ LocalStorage
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("saas_users");
    if (savedUsers) {
      try {
        const parsed = JSON.parse(savedUsers);
        // إذا كانت المصفوفة المخزنة فارغة وكان ملف mockUsers يحتوي على بيانات، نستخدم الـ mock
        if (parsed.length === 0 && mockUsers && mockUsers.length > 0) {
          localStorage.setItem("saas_users", JSON.stringify(mockUsers));
          return mockUsers;
        }
        return parsed;
      } catch (e) {
        console.error("Error parsing saas_users", e);
      }
    }
    localStorage.setItem("saas_users", JSON.stringify(mockUsers || []));
    return mockUsers || [];
  });

  // 2. قراءة الجلسة الحالية والمستخدم الحالي بشكل متزامن دقيق
  const [user, setUser] = useState(() => {
    const savedSession = localStorage.getItem("saas_session");
    if (!savedSession) return null;

    try {
      const session = JSON.parse(savedSession);
      const savedUsers = localStorage.getItem("saas_users");
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        const found = parsedUsers.find((u) => u.id === session.userId);
        return found || null;
      }
    } catch (e) {
      console.error("Error parsing session or users", e);
    }
    return null;
  });


  // LOGIN
  const login = (email, password) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
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
        : u
    );

    setUsers(updatedUsers);
    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));
    
    const freshUser = updatedUsers.find((u) => u.id === foundUser.id);
    setUser(freshUser);

    return {
      success: true,
      user: freshUser,
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

  // UPDATE PROFILE (الحفظ والتعديل الفوري)
const updateProfile = (updatedData) => {
  if (!user) return;

  console.log("OLD USER =>", user);
  console.log("UPDATED DATA =>", updatedData);

  const localUsers =
    JSON.parse(localStorage.getItem("saas_users")) || [];

  const updatedUsers = localUsers.map((u) =>
    u.id === user.id
      ? { ...u, ...updatedData }
      : u
  );

  console.log(
    "UPDATED USER =>",
    updatedUsers.find((u) => u.id === user.id)
  );

  localStorage.setItem(
    "saas_users",
    JSON.stringify(updatedUsers)
  );

  setUsers(updatedUsers);

  console.log("USER ID =>", user.id);

console.log(
  "ALL IDS =>",
  updatedUsers.map((u) => u.id)
);

  const updatedUser =
    updatedUsers.find((u) => u.id === user.id);

  setUser(updatedUser);
};

  const addNotification = (title, message) => {
    if (!user) return;
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
        : u
    );

    setUsers(updatedUsers);
    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));
    setUser(updatedUsers.find((u) => u.id === user.id));
  };

  const markNotificationAsRead = (notificationId) => {
    if (!user) return;
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            notifications: (u.notifications || []).map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            ),
          }
        : u
    );

    setUsers(updatedUsers);
    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));
    setUser(updatedUsers.find((u) => u.id === user.id));
  };

  const markAllNotificationsAsRead = () => {
    if (!user) return;
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            notifications: (u.notifications || []).map((n) => ({ ...n, read: true })),
          }
        : u
    );

    setUsers(updatedUsers);
    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));
    setUser(updatedUsers.find((u) => u.id === user.id));
  };

  const deleteNotification = (notificationId) => {
    if (!user) return;
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            notifications: (u.notifications || []).filter((n) => n.id !== notificationId),
          }
        : u
    );

    setUsers(updatedUsers);
    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));
    setUser(updatedUsers.find((u) => u.id === user.id));
  };

  const clearAllNotifications = () => {
    if (!user) return;
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, ...{ notifications: [] } } : u
    );

    setUsers(updatedUsers);
    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));
    setUser(updatedUsers.find((u) => u.id === user.id));
  };

  const updatePassword = (currentPassword, newPassword) => {
    if (!user || user.password !== currentPassword) {
      return {
        success: false,
        message: "Wrong password",
      };
    }
    
    const activity = {
      id: crypto.randomUUID(),
      action: "Password Changed",
      description: "Password updated successfully",
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            password: newPassword,
            activityLog: [activity, ...(u.activityLog || [])],
          }
        : u
    );

    setUsers(updatedUsers);
    localStorage.setItem("saas_users", JSON.stringify(updatedUsers));
    setUser(updatedUsers.find((u) => u.id === user.id));

    return { success: true };
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
          : u
    );
      localStorage.setItem("saas_users", JSON.stringify(updatedUsers));
    }
    localStorage.removeItem("saas_session");
    setUser(null);
  };

  const addActivity = (action, description) => {
    if (!user) return;
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
        : u
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
        setUsers,
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