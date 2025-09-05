import axios from "./axios.config.js";
import { modifyResponseData } from "./modifyResponseData.js";

export class ProfileService {

  async setProfilePic(file) {

    const formData = new FormData();
    formData.append("profilePic", file);

    return axios
      .patch("/users/profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        return modifyResponseData(res.data);
      })
      .catch((err) => {
        throw err;
      });
  }

  async deleteProfilePic() {
    return axios
      .delete("/users/profile-pic")
      .then((res) => {
        return modifyResponseData(res.data);
      })
      .catch((err) => {
        throw err;
      });
  }

  async updateUserName({ userName }) {
    return axios
      .patch("/users/profile", { username: userName })
      .then((res) => {
        return modifyResponseData(res.data);
      })
      .catch((err) => {
        throw err;
      });
  }

}

const profileService = new ProfileService();
export default profileService;
