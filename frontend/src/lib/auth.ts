const TOKEN_KEY = "tafftaff_access_token";

const canUseStorage = () => typeof window !== "undefined";

export const setToken = (token: string) => {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  if (!canUseStorage()) {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => Boolean(getToken());
