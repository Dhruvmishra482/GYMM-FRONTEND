// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:4000/api/v1",
//   withCredentials: true,
//    headers: {
//     'Content-Type': 'application/json',
//   }
// });

// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:4000/api/v1"
      : "https://api.fittracker.in/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
