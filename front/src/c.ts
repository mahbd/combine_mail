const getApiURL = () => {
  if (window.location.hostname === "localhost") {
    return "http://127.0.0.1:8000";
  }
  return window.location.origin;
};
export const baseAPI = getApiURL();
// export const baseAPI = "https://beta.tsp.com.bd";

export const sURL = {
  login: `${baseAPI}/users/login`,
};
