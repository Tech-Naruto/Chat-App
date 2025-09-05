
function modifyResponseData(data) {
    const {
          username,
          activeFriends,
          contactFriends,
          ...modifiedResponse
        } = data;
        modifiedResponse.userName = username;
        modifiedResponse.activeFriendIds = activeFriends;
        modifiedResponse.contactFriendIds = contactFriends;
        return modifiedResponse;
}

export {modifyResponseData};