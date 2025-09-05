import axios from "./axios.config.js";

export class MessageService {

  async postMessage({ friendName, message, file }) {
    return axios
      .post(
        `/messages/${friendName}`,
        { message, file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  }

  async getMessages({ friendName, lastMessageCreatedAt }) {
    const params = new URLSearchParams({ lastMessageCreatedAt });
    return axios
      .get(`/messages/${friendName}?${params.toString()}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  }

  async deleteMessage({ messageId }) {
    return axios.delete(`/messages/${messageId}`).then((res) => {
      return res.data;
    }).catch((err) => {
      throw err;
    });
  }

  async createRoomData({ friendName }) {
    return axios
      .post(`/rooms/${friendName}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  }

  async getRoomData({ friendName }) {
    return axios.get(`/rooms/${friendName}`).then((res) => {
      return res.data;
    });
  }

  async updateIsPresent({ friendName, isPresent }) {
    const params = new URLSearchParams({ isPresent });
    return axios
      .patch(`/rooms/is-present/${friendName}?${params.toString()}`)
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  }

  async deleteAllMessages({ friendName }) {
    return axios
      .delete(`/messages/delete-all/${friendName}`)
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  }

  async getLastMessage({ friendName }) {
    return axios
      .get(`/messages/last/${friendName}`)
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  }

  async countNewMessages({ friendName }) {
    return axios
      .get(`/messages/count-new/${friendName}`)
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  }
}

const messageService = new MessageService();
export default messageService;
