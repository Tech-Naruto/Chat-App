import defaultProfilePic from "../../assets/Default Pic.png";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import useClickOutside from "../../hooks/useClickOutside";
import { useDispatch, useSelector } from "react-redux";
import { setRoomId } from "../../store/chatSlice";
import { messageService } from "../index";
import {
  addMessageEventsListener,
  removeMessageEventsListener,
} from "../../config/webSocket";
import { useDebouncedCallback } from "../../hooks/useDebounce";

function ChatListContainer({
  roomId,
  friendName,
  profilePic,
  friendId,
  isOnline,
  lastSeen,
  newMessages,
  lastMessageAt,
  lastMessage,
  type = "active",
}) {
  const [showProfile, setShowProfile] = useState(false);
  const currRoomId = useSelector((state) => state.chat.roomId);
  const currRoomIdRef = useRef(currRoomId);
  const containerRoomIdRef = useRef(roomId);
  const lastMessageAtByUser = useSelector((state) => state.chat.lastMessageAt);
  const dispatch = useDispatch();
  const [newFriendMessages, setNewFriendMessages] = useState(newMessages);
  const [lastMessageAtTime, setLastMessageAtTime] = useState(lastMessageAt);
  const prevRoomFriendName = useSelector((state) => state.chat.friendName);
  const ref = useRef(null);

  useClickOutside(ref, () => setShowProfile(false));

  useEffect(() => {
    containerRoomIdRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    currRoomIdRef.current = currRoomId;
  }, [currRoomId]);

  useEffect(() => {
    const listener = (data) => {
      if (
        data.roomId === containerRoomIdRef.current &&
        data.roomId !== currRoomIdRef.current
      ) {
        setNewFriendMessages((prev) => prev + 1);
        setLastMessageAtTime(
          new Date(data.updatedAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      }
    };
    addMessageEventsListener(listener);

    return () => {
      removeMessageEventsListener(listener);
    };
  }, []);

  useEffect(() => {
    if (lastMessageAtByUser > lastMessageAtTime) {
      setLastMessageAtTime(lastMessageAtByUser);
    }
  }, [lastMessageAtByUser]);

  const [updatePrevIsPresent, cancelDebounce1] = useDebouncedCallback(
    async ({ prevRoomFriendName, friendName, isPresent }) => {
      try {
        if (prevRoomFriendName && prevRoomFriendName !== "" && prevRoomFriendName !== friendName) {
          await messageService.updateIsPresent({
            friendName: prevRoomFriendName,
            isPresent,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    type === "active" ? 3000 : 0
  );

  const [updateCurrIsPresent, cancelDebounce2] = useDebouncedCallback(
    async ({ friendName, isPresent }) => {
      try {
        await messageService.updateIsPresent({ friendName, isPresent });
      } catch (error) {
        console.log(error);
      }
    },
    type === "active" ? 3000 : 0
  );

  useEffect(() => {
    return () => cancelDebounce1();
  }, [cancelDebounce1]);

  useEffect(() => {
    return () => cancelDebounce2();
  }, [cancelDebounce2]);

  return (
    <motion.div
      className={`rounded-xl flex p-2 relative hover:bg-gray-700 transition duration-200 ${
        type === "active" && prevRoomFriendName === friendName
          ? "bg-gray-700"
          : ""
      }`}
      key={friendId}
      whileHover={{ zIndex: 10 }}
      onClick={async () => {
        if (friendName === "User Not Found...") return;
        dispatch(
          setRoomId({
            roomId,
            friendId,
            friendName,
            friendProfilePic: profilePic,
            isOnline,
            lastSeen,
          })
        );
        setNewFriendMessages(0);
        updatePrevIsPresent({
          prevRoomFriendName,
          friendName,
          isPresent: false,
        });
        updateCurrIsPresent({ friendName, isPresent: true });
      }}
    >
      <div ref={ref} className="flex-shrink-0">
        {friendName !== "User Not Found..." && (
          <div className="relative">
            <img
              src={profilePic || defaultProfilePic}
              alt="Profile Pic"
              className="w-13 h-13 rounded-full object-cover"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfile(!showProfile);
              }}
            />
            {isOnline && (
              <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-1 right-0"></div>
            )}
          </div>
        )}
        <AnimatePresence>
          {showProfile ? (
            <motion.div
              className="absolute bg-white rounded-xl right-0 top-0 overflow-hidden w-4/7"
              initial={{
                scale: 0,
                opacity: 0,
                zIndex: 20,
                translateX: "-90%",
                translateY: "-30%",
              }}
              animate={{
                scale: 1,
                opacity: 1,
                zIndex: 20,
                translateX: "0%",
                translateY: "0%",
              }}
              exit={{
                scale: 0,
                opacity: 0,
                zIndex: 20,
                translateX: "-90%",
                translateY: "-30%",
              }}
            >
              <img
                src={profilePic}
                alt="Profile Pic"
                className="w-full aspect-square object-cover"
              />
              <p className="px-2 font-bold absolute top-0 left-0 bg-black/30 w-full text-white">
                {friendName}
              </p>
              {type === "active" && (
                <p
                  className={`p-2  bg-gray-800 font-semibold ${
                    isOnline ? "text-[#04B2D9]" : "text-red-500"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="text-white grow flex flex-col justify-center space-y-1">
        <div className="flex items-center">
          <div className="grow">
            <p className="ml-2 font-bold">
              {type === "search" && friendName === "User Not Found..." ? (
                <i className="fa-solid fa-circle-exclamation text-red-600 mr-2"></i>
              ) : null}
              {friendName}
            </p>
          </div>
          {type === "active" && lastMessageAtTime && (
            <div>
              <p className="ml-2 text-sm">{lastMessageAtTime}</p>
            </div>
          )}
        </div>
        {type === "active" && (
          <div className="flex justify-between items-center">
            <p className="ml-2 max-w-40 xl:max-w-50 overflow-hidden text-nowrap truncate text-sm text-gray-400">
              {lastMessage}
            </p>
            {type === "active" &&
              currRoomId !== roomId &&
              newFriendMessages > 0 && (
                <div className="text-sm w-4 h-4 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <p className="text-white pb-0.5 text-xs text-center">
                    {newFriendMessages}
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ChatListContainer;
