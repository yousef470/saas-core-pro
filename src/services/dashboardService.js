const API_URL = "http://localhost:5000/api/dashboard";

export const getDashboardStats = async () => {
  const res = await fetch(`${API_URL}/stats`);
  return res.json();
};

export const getRevenueData = async () => {
  const res = await fetch(`${API_URL}/revenue`);
  return res.json();
};

export const getSubscriptions = async () => {
  const res = await fetch(`${API_URL}/subscriptions`);
  return res.json();
};

export const getTeamMembers = async () => {
  const res = await fetch(`${API_URL}/team`);
  return res.json();
};

export const getTransactions = async () => {
  const res = await fetch(`${API_URL}/transactions`);
  return res.json();
};

export const getNotifications = async () => {
  const res = await fetch(`${API_URL}/notifications`);
  return res.json();
};