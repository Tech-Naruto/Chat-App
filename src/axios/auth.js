import axios from "./axios.config.js";
import { modifyResponseData } from "./modifyResponseData.js";

export class AuthService {
  async createAccount({ email, password, name }) {
    return axios
      .post(
        "/users/register",
        { email, password, username: name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        return modifyResponseData(res.data);
      })
      .catch((err) => {
        throw err;
      });
  }

  async login({ email, password }) {
    return axios
      .post("/users/login", { emailOrUsername: email, password })
      .then((res) => {
        return modifyResponseData(res.data);
      })
      .catch((err) => {
        throw err;
      });
  }

  async logout() {
    return axios
      .post("/users/logout")
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  }

  async clearCookies() {
    return axios
      .post(
        "/users/clear-cookies",
        {},
        {
          headers: {
            "X-Internal-Logout": "true",
          },
        }
      )
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  }
}

const authService = new AuthService();

export default authService;
