export const getData = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};