const STORAGE_KEY = "business_goals";

export const DEFAULT_GOALS = {
  customers: 100,
  subscriptions: 10000,
  orders: 200,
  sales: 10000,
};

export const getBusinessGoals = () => {
  const saved = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "{}"
  );

  const goals = {
    ...DEFAULT_GOALS,
    ...saved,
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(goals)
  );

  return goals;
};

export const saveBusinessGoals = (goals) => {
  const updated = {
    ...DEFAULT_GOALS,
    ...goals,
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};