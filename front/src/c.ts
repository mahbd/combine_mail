const getApiURL = () => {
  if (window.location.hostname === "localhost") {
    return "http://127.0.0.1:8000";
  }
  return window.location.origin;
};
export const baseAPI = getApiURL();

export const sURL = {
  login: `${baseAPI}/users/token/`,
  register: `${baseAPI}/users/register/`,
  changePassword: `${baseAPI}/users/change-password/`,
  resetPassword: `${baseAPI}/users/reset-password/`,
  refreshToken: `${baseAPI}/users/token/refresh/`,
  verifyToken: `${baseAPI}/users/token/verify/`,

  senderMail: `${baseAPI}/core/sender-mail/`,
  sendMail: `${baseAPI}/core/send-mail/`,
  sentMails: `${baseAPI}/core/sent-mail/`,
  userStats: `${baseAPI}/core/user-stats/`,
};
