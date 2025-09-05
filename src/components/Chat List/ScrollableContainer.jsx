import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { messageService } from "../index";
import { useDispatch } from "react-redux";
import { addMessage } from "../../store/chatSlice";
import {
  socket,
  addMessageEventsListener,
  removeMessageEventsListener,
  addRoomEventsListener,
  removeRoomEventsListener,
} from "../../config/webSocket.js";

function ScrollableContainer({
  roomId,
  userId,
  friendId,
  friendName,
  messages,
  setMessages,
}) {
  const [friendLastSeenAt, setFriendLastSeenAt] = useState(null);
  const containerRef = useRef(null);
  const latestMessage = useRef(null);
  const hasReceivedAllMessages = useRef(false);
  const isFetchingRef = useRef(false);
  const prevRoom = useRef(null);
  const dispatch = useDispatch();
  const date = useRef(null);
  const [isPresent, setIsPresent] = useState(false);
  const roomIdRef = useRef(roomId);
  const bottomRef = useRef(null);

  useLayoutEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    const messageListener = (data) => {
      console.log("Message", data);
      if (data.roomId === roomIdRef.current) {
        console.log("Message", data);
        data.createdAt = new Date(data.createdAt).toISOString();
        data.updatedAt = new Date(data.updatedAt).toISOString();
        setMessages((prev) => [...prev, data]);
        dispatch(addMessage(data));
        console.log("Added Message");
      }
    };

    const roomListener = (data) => {
      console.log("Room Presence", data);
      if (data.roomId === roomIdRef.current) {
        setIsPresent(data.isPresent === "true" ? true : false);
        if (data.isPresent === "false") {
          setFriendLastSeenAt(data.timeStamp);
        }
      }
    };

    addMessageEventsListener(messageListener);
    addRoomEventsListener(roomListener);

    return () => {
      removeMessageEventsListener(messageListener);
      removeRoomEventsListener(roomListener);
    };
  }, []);

  const fetchLogic = async () => {
    const container = containerRef.current;
    if (!container || isFetchingRef.current || messages.length === 0) return;

    isFetchingRef.current = true;

    const scrollHeightBefore = container.scrollHeight;
    const lastMessage = messages[0];

    const olderMessages = await messageService.getMessages({
      friendName,
      lastMessageCreatedAt: lastMessage.createdAt,
    });
    if (olderMessages.length > 0) {
      olderMessages.reverse();
      dispatch(addMessage([...olderMessages, ...messages]));
      setMessages((prev) => [...olderMessages, ...prev]);

      requestAnimationFrame(() => {
        const scrollHeightAfter = container.scrollHeight;
        container.scrollTop = scrollHeightAfter - scrollHeightBefore - 60;
      });
    } else {
      hasReceivedAllMessages.current = true;
    }

    isFetchingRef.current = false;
  };

  useEffect(() => {
    const container = containerRef.current;
    hasReceivedAllMessages.current = false;
    if (!container) {
      return;
    }
    const getPreviousMessages = async () => {
      try {
        const receivedMessages = await messageService.getMessages({
          friendName,
        });

        if (receivedMessages.length !== 0) {
          receivedMessages.reverse();
          date.current = new Date(
            receivedMessages[0].updatedAt
          ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
        dispatch(addMessage(receivedMessages));
        setMessages(receivedMessages);

        const roomData = await messageService.getRoomData({
          friendName,
        });
        const friendLastSeen = roomData?.updatedAt;
        setIsPresent(roomData.isPresent);
        setFriendLastSeenAt(friendLastSeen);
      } catch (err) {
        console.log(err);
      }
    };
    getPreviousMessages();
    if (prevRoom.current !== null) {
      console.log("Room prev:", prevRoom.current);
      socket.send(
        JSON.stringify({
          type: "room",
          roomId: prevRoom.current.roomId,
          userId: prevRoom.current.userId,
          friendId: prevRoom.current.friendId,
          isPresent: prevRoom.current.isPresent,
        })
      );
    }
    prevRoom.current = {
      roomId: roomId,
      userId: userId,
      friendId: friendId,
      isPresent: "false",
    };
    socket.send(
      JSON.stringify({
        type: "room",
        roomId: roomId,
        userId: userId,
        friendId: friendId,
        isPresent: "true",
      })
    );
  }, [roomId]);

  useEffect(() => {
    console.log("Messages changed", messages[messages.length - 1]);
    console.log("User ID", userId);
    const container = containerRef.current;
    if (!container || hasReceivedAllMessages.current) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (container && container.scrollTop === 0) {
        fetchLogic();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!messages.length || messages[messages.length - 1]._id === latestMessage)
      return;

    latestMessage.current = messages[messages.length - 1]._id;

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("Auto scrolled");
  }, [messages.length]);

  return (
    <div
      className="w-full h-90 px-4 place-content-end grow overflow-y-scroll scrollbar-medium"
      ref={containerRef}
    >
      {messages &&
        messages.map((message, index) => {
          const now = new Date();
          let currentDate = new Date(message.updatedAt).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          );
          const isToday =
            currentDate ===
            now.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);
          const isYesterday =
            currentDate ===
            yesterday.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          currentDate = isToday
            ? "Today"
            : isYesterday
            ? "Yesterday"
            : currentDate;
          const isNewDate = currentDate !== date.current;
          if (isNewDate) {
            date.current = isToday
              ? "Today"
              : isYesterday
              ? "Yesterday"
              : currentDate;
          }
          return (
            <div key={message._id}>
              {(isNewDate || index === 0) && (
                <div className="flex justify-center">
                  <div className="bg-gray-800 text-white py-1 px-2 rounded-lg shadow-lg shadow-gray-800">
                    {date.current}
                  </div>
                </div>
              )}
              <div className="flex relative">
                <div
                  className={`my-2 p-2 flex flex-col bg-red-400 max-w-3/5 space-y-3 ${
                    message.senderId === userId
                      ? "ml-auto mr-2 rounded-l-xl rounded-br-xl rounded-tr-xs"
                      : "mr-auto ml-2 rounded-r-xl rounded-bl-xl"
                  }`}
                >
                  <div className="bg-red-300 p-1 rounded-md">
                    {message.message}
                  </div>
                  <div
                    className={`text-xs px-1 flex space-x-2 ${
                      message.senderId === userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div>
                      {date.current +
                        " " +
                        new Date(message.updatedAt).toLocaleString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </div>
                    <div>
                      {message.senderId === userId ? (
                        message?.status === "pending" ? (
                          <i className={`fa-regular fa-clock-eight`}></i>
                        ) : message?.status === "failed" ? (
                          <i className="fa-regular fa-circle-exclamation"></i>
                        ) : (
                          <i
                            className={`fa-solid fa-check-double ${
                              isPresent
                                ? "text-blue-700"
                                : new Date(message.updatedAt) >
                                  new Date(friendLastSeenAt)
                                ? "text-black"
                                : "text-blue-700"
                            }`}
                          ></i>
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <div ref={bottomRef}></div>
    </div>
  );
}

export default ScrollableContainer;
