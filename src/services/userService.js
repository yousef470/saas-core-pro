import mockUsers from "../data/mockUsers";

// Get All Users
export const getUsers = () => {
  const savedUsers = localStorage.getItem("users");

  if (savedUsers) {
    return JSON.parse(savedUsers);
  }

  localStorage.setItem(
    "users",
    JSON.stringify(mockUsers)
  );

  return mockUsers;
};

// Add User
export const addUser = (newUser) => {
  const users = getUsers();

  const updatedUsers = [
    ...users,
    {
      ...newUser,
      id: Date.now(),
      avatar: newUser.name.charAt(0).toUpperCase(),
    },
  ];

  localStorage.setItem(
    "users",
    JSON.stringify(updatedUsers)
  );

  return updatedUsers;
};

// Update User
export const updateUser = (updatedUser) => {
  const users = getUsers();

  const updatedUsers = users.map((user) =>
    user.id === updatedUser.id
      ? updatedUser
      : user
  );

  localStorage.setItem(
    "users",
    JSON.stringify(updatedUsers)
  );

  return updatedUsers;
};

// Delete User
export const deleteUser = (userId) => {
  const users = getUsers();

  const updatedUsers = users.filter(
    (user) => user.id !== userId
  );

  localStorage.setItem(
    "users",
    JSON.stringify(updatedUsers)
  );

  return updatedUsers;
};