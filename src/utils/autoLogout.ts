let logoutTimer: ReturnType<typeof setTimeout> | null = null;

export const scheduleAutoLogout = (expireTimestamp: number, onLogout: () => void) => {
  if (logoutTimer) clearTimeout(logoutTimer);
  const delay = expireTimestamp - Date.now();
  if (delay <= 0) {
    onLogout();
    return;
  }
  logoutTimer = setTimeout(() => {
    onLogout();
  }, delay);
};

export const clearAutoLogout = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
};