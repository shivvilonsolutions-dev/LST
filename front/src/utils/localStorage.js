export const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const setData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const addItem = (key, item) => {
  const existing = getData(key);
  const updated = [...existing, item];
  setData(key, updated);
};

export const updateItem = (key, id, updatedItem) => {
  const existing = getData(key);
  const updated = existing.map((item) =>
    item.id === id ? updatedItem : item
  );
  setData(key, updated);
};

export const deleteItem = (key, id) => {
  const existing = getData(key);
  const updated = existing.filter((item) => item.id !== id);
  setData(key, updated);
};