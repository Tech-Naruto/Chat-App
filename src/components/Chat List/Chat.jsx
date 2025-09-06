import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { messageService, Button, contactService } from "../index";
import { useForm } from "react-hook-form";
import { addMessage } from "../../store/chatSlice";
import ScrollableContainer from "./ScrollableContainer";
import { setUserProfileData } from "../../store/userSlice";
import { updateLastMessageAt } from "../../store/chatSlice";
import MyEmojiPicker from "./Emoji";
import useClickOutside from "../../hooks/useClickOutside";
import { socket } from "../../config/webSocket";
import { AnimatePresence } from "motion/react";
import { useEffect } from "react";

function Chat() {
  const roomId = useSelector((state) => state.chat.roomId);
  const friendId = useSelector((state) => state.chat.friendId);
  const friendName = useSelector((state) => state.chat.friendName);
  const senderId = useSelector((state) => state.auth.userData._id);
  const senderDetails = {
    userName: useSelector((state) => state.user.userName),
    profilePicId: useSelector((state) => state.user.profilePicId),
    activeFriendIds: useSelector((state) => state.user.activeFriendIds),
    contactFriendIds: useSelector((state) => state.user.contactFriendIds),
    isOnline: useSelector((state) => state.user.isOnline),
    lastSeen: useSelector((state) => state.user.lastSeen),
  };
  const [messages, setMessages] = useState(
    useSelector((state) => state.chat.messages)
  );
  let friendProfilePic = useSelector((state) => state.chat.friendProfilePic);
  const { register, handleSubmit, reset, setValue, getValues } = useForm();
  const dispatch = useDispatch();
  const emojiRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const messageMapRef = useRef({});
  const [loading, setLoading] = useState(false);

  useClickOutside(emojiRef, (event) => {
    if (
      !emojiButtonRef.current ||
      !emojiButtonRef.current.contains(event.target)
    )
      setShowEmoji(false);
  });

  useEffect(() => {
    if(messages.length > 0){
      setMessages([]);
    }
  }, [roomId]);

  const addNewActiveFriend = async () => {
    if(loading) return;
    const timeout = setTimeout(() => setLoading(true), 100);
    try {
      const newUserData = await contactService.addToActiveFriends({
        friendName,
      });
      if (newUserData) dispatch(setUserProfileData(newUserData));
      clearTimeout(timeout);
      setLoading(false);
    } catch (err) {
      clearTimeout(timeout);
      setLoading(false);
      console.log(err);
    }
  };

  const onSend = async (data) => {
    if (data.message === "" && !data.file) return;
    const tempMessageId = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    try {
      const tempMessage = {
        _id: tempMessageId,
        roomId: roomId,
        senderId: senderId,
        receiverId: friendId,
        message: data.message,
        file: data.file ? data.file[0] : null,
        visibleTo: [senderId, friendId],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "pending",
      };
      setMessages((prev) => [...prev, tempMessage]);
      reset();
      messageMapRef.current[tempMessageId] = tempMessage;
      if (!senderDetails.activeFriendIds.includes(friendId)) {
        console.log("Adding new active friend");
        await addNewActiveFriend();
      }
      const messageData = {
        friendName,
        message: data.message,
      };

      if (Array.isArray(data.file)) {
        messageData.file = data.file[0];
      }

      const message = await messageService.postMessage(messageData);

      if (message) {
        messageMapRef.current[tempMessageId]._id = message._id;
        messageMapRef.current[tempMessageId].status = "sent";
        messageMapRef.current[tempMessageId].file = message.file;
        dispatch(addMessage(message));
        dispatch(
          updateLastMessageAt(
            new Date(message.updatedAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          )
        );
        socket.send(
          JSON.stringify({
            type: "message",
            _id: message._id,
            roomId: message.roomId,
            senderId: message.senderId,
            senderName: senderDetails.userName,
            receiverId: message.receiverId,
            message: message.message,
            file: message.file,
            visibleTo: message.visibleTo,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
          })
        );
      }
    } catch (err) {
      messageMapRef.current[tempMessageId].status = "failed";
      setMessages((prev) => [...prev]);
      console.log(err);
    }
  };

  const onEmojiClick = (emoji) => {
    const currMessage = getValues("message") || "";
    setValue("message", currMessage + emoji.emoji);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="w-full flex bg-gray-700 items-center space-x-5 p-2">
        <img
          src={friendProfilePic}
          alt="Profile Pic"
          className="w-12 h-12 rounded-full object-cover"
        />
        <h1 className="text-white">{friendName}</h1>
        <div className="grow"></div>
        {!senderDetails?.contactFriendIds.includes(friendId) && (
          <div>
            <Button
              text="Add"
              loading={loading}
              className="bg-[#077dc1] justify-self-end hover:bg-[#84d9ec]"
              icon={"fa-solid fa-user-plus"}
              onClick={async () => {
                try {
                  const newUserData = await contactService.addToContactFriends({
                    friendName,
                  });
                  console.log("newUserData", newUserData);
                  dispatch(setUserProfileData(newUserData));
                } catch (err) {
                  console.log(err);
                }
              }}
            />
          </div>
        )}
      </div>
      <ScrollableContainer
        roomId={roomId}
        userId={senderId}
        friendId={friendId}
        friendName={friendName}
        messages={messages}
        setMessages={setMessages}
      />
      <AnimatePresence>
        {showEmoji && (
          <MyEmojiPicker onEmojiClick={onEmojiClick} emojiRef={emojiRef} />
        )}
      </AnimatePresence>
      <form onSubmit={handleSubmit(onSend)} className="h-12 py-1 px-2">
        <div className=" flex items-center space-x-2">
          <div className="bg-gray-800 rounded-xl aspect-square h-10 flex items-center justify-center grow">
            <div className=" aspect-square h-10 flex items-center justify-center ">
              <button
                ref={emojiButtonRef}
                type="button"
                className="cursor-pointer text-gray-300 hover:text-black hover:bg-red-400 aspect-square h-7 rounded-lg"
                onClick={() => setShowEmoji((prev) => !prev)}
              >
                <i className="fa-solid fa-face-smile-wink text-xl h-fit"></i>
              </button>
            </div>
            <input
              className="px-3 py-2 h-10 text-white border-none bg-gray-800 focus:outline-none grow rounded-xl"
              defaultValue=""
              {...register("message")}
            />
          </div>
          <button type="submit" className="cursor-pointer">
            <div className="bg-red-400 rounded-full aspect-square h-10 flex items-center justify-center">
              <i className="fa-solid fa-message-lines text-xl h-fit"></i>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
