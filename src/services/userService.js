import mockUsers from "../data/mockUsers";

// Get All Users
export const getUsers = () => {
  const savedUsers = localStorage.getItem("saas_users");

  if (savedUsers) {
    return JSON.parse(savedUsers);
  }

  localStorage.setItem(
    "saas_users",
    "[]" // لو مش حابب الـ mock يملى الداتا تلقائي أو سيبها mockUsers زي ما تحب
  );

  return mockUsers || [];
};

// Add User
export const addUser = (newUser) => {
  const users = getUsers();
  
  // استخراج أول حرف لعمل صورة رمزية ملونة واحترافية بدلاً من نص عادي يكسر الـ Layout
  const firstLetter = newUser.name ? newUser.name.charAt(0).toUpperCase() : "U";
  const premiumAvatar = `https://ui-avatars.com/api/?name=${firstLetter}&background=6366f1&color=fff&rounded=true&bold=true`;

  const updatedUsers = [
    ...users,
    {
      ...newUser,
      id: Date.now(),
      avatar: premiumAvatar, // الحرف محول لصورة حقيقية متوافقة مع الـ Layout
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