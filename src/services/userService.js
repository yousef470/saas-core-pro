import mockUsers from "../data/mockUsers";

// Get All Users
export const getUsers = () => {
  const savedUsers = localStorage.getItem("saas_users");

  if (savedUsers) {
    return JSON.parse(savedUsers);
  }

  localStorage.setItem(
    "saas_users",
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
    "saas_users",
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
    "saas_users",
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
    "saas_users",
    JSON.stringify(updatedUsers)
  );

  return updatedUsers;
};