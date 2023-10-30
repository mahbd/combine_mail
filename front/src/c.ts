const getApiURL = () => {
  if (window.location.hostname === "localhost") {
    return "http://127.0.0.1:8000";
  }
  return window.location.origin;
};
export const baseAPI = getApiURL();
// export const baseAPI = "https://beta.tsp.com.bd";

export const sURL = {
  login: `${baseAPI}/users/token/`,
  register: `${baseAPI}/users/register/`,
  changePassword: `${baseAPI}/users/change-password/`,
  resetPassword: `${baseAPI}/users/reset-password/`,
  refreshToken: `${baseAPI}/users/token/refresh/`,
  verifyToken: `${baseAPI}/users/token/verify/`,
};
