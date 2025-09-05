import axios from "./axios.config.js";
import { modifyResponseData } from "./modifyResponseData.js";

export class ContactService {
  async getUserDetails() {
    return axios
      .get("/users/details")
      .then((res) => {
        return modifyResponseData(res.data);
      })
      .catch((err) => {
        throw err;
      });
  }

  async getActiveFriendsDetails() {
    return axios
      .get("/users/active-friends")
      .then((res) => {
        const result = res.data?.map((friend) => {
          return modifyResponseData(friend);
        });
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  async getContactFriendsDetails() {
    return axios
      .get("/users/contact-friends")
      .then((res) => {
        const result = res.data?.map((friend) => {
          return modifyResponseData(friend);
        });
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  async addToActiveFriends({ friendName }) {
    return axios
      .post(`/users/active-friends/${friendName}`)
      .then((res) => modifyResponseData(res.data))
      .catch((err) => {
        throw err;
      });
  }

  async addToContactFriends({ friendName }) {
    return axios
      .post(`/users/contact-friends/${friendName}`)
      .then((res) => {
        return modifyResponseData(res.data);
      })
      .catch((err) => {
        throw err;
      });
  }

  async newFriendSearch({ searchText, page }) {
    const params = new URLSearchParams({ page });
    return axios
      .get(`/users/new-friend/${searchText}?${params.toString()}`)
      .then((res) => {
        const result = res.data?.result.map((friend) => {
          return modifyResponseData(friend);
        });
        const currPage = res.data?.page;
        return { result, page: currPage };
      })
      .catch((err) => {
        throw err;
      });
  }
}

const contactService = new ContactService();
export default contactService;
