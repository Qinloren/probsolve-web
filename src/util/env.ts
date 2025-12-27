const getBoolean = (str: string | number | boolean | null | undefined): boolean => {
  if (typeof str === 'boolean') {
    return str;
  }

  if (str === null || str === undefined) {
    return false;
  }

  if (typeof str === 'number') {
    return str === 1;
  }

  const normalizedStr = str.trim().toLowerCase();

  // 处理 "true", "yes", "1" 等情况
  if (['true', 'yes', '1'].includes(normalizedStr)) {
    return true;
  }

  // 处理 "false", "no", "0" 等情况
  if (['false', 'no', '0'].includes(normalizedStr)) {
    return false;
  }

  // 默认返回 false
  return false;
};


export const env = {
  SERVER_URI: import.meta.env.VITE_SERVER_URI,
  SERVER_SSL: getBoolean(import.meta.env.VITE_SERVER_SSL),
  WS_SSL: getBoolean(import.meta.env.VITE_WS_SSL),
}
