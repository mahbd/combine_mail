import axios from "axios";

export function getJwt() {
  return localStorage.getItem("access");
}

if (getJwt()) {
  axios.defaults.headers.common["authorization"] = "Bearer " + getJwt();
}

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedError) {
      console.log("Logging the error", error);
      alert("An unexpected error.");
    }
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access");
    }
    return Promise.reject(error);
  }
);

axios.interceptors.request.use((config) => {
  return config;
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};
