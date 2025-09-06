import { useSelector } from "react-redux";
import {
  contactService,
  messageService,
  ChatListContainer,
  ContactAndSearchPanel,
  Search,
} from "../index";
import { useState, useEffect } from "react";
import defaultProfilePic from "../../assets/Default Pic.png";
import { motion, AnimatePresence } from "motion/react";
import useClickOutside from "../../hooks/useClickOutside";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import {
  addPresenceEventsListener,
  removePresenceEventsListener,
  addMessageEventsListener,
  removeMessageEventsListener,
} from "../../config/webSocket";
import { setUserProfileData } from "../../store/userSlice";
import { set } from "react-hook-form";

function ChatList() {
  const activeFriendIds = useSelector((state) => state.user.activeFriendIds);
  const contactFriendIds = useSelector((state) => state.user.contactFriendIds);
  const userId = useSelector((state) => state.user.id);
  const [contactFriendData, setContactFriendData] = useState([]);
  const [activeFriendData, setActiveFriendData] = useState([]);
  const activeFriendDataRef = useRef(activeFriendData);
  const [angle, setAngle] = useState(0);
  const [showContactList, setShowContactList] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();

  const processInChunks = async (data, chunkSize) => {
    const results = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map(async (friend) => {
          const [lastMessage, newMessages] = await Promise.all([
            messageService.getLastMessage({ friendName: friend.userName }),
            messageService.countNewMessages({ friendName: friend.userName }),
          ]);

          let lastMessageAt;

          if (lastMessage) {
            if (
              new Date(lastMessage.updatedAt).toLocaleDateString() ===
              new Date().toLocaleDateString()
            ) {
              lastMessageAt = new Date(
                lastMessage.updatedAt
              ).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });
            } else {
              const today = new Date();
              const yesterday = new Date(today);
              yesterday.setDate(yesterday.getDate() - 1);
              if (
                new Date(lastMessage.updatedAt).toLocaleDateString() ===
                yesterday.toLocaleDateString()
              ) {
                lastMessageAt = "Yesterday";
              } else {
                lastMessageAt = new Date(
                  lastMessage.updatedAt
                ).toLocaleDateString();
              }
            }
          }
          return {
            ...friend,
            roomId: [friend._id, userId].sort().join("_"),
            lastMessage: lastMessage ? lastMessage.message : null,
            lastMessageAt: lastMessageAt ? lastMessageAt : null,
            lastMessageAtISO: lastMessage ? new Date(lastMessage.updatedAt) : new Date(0),
            newMessages: newMessages ? newMessages.count : 0,
          };
        })
      );
      results.push(...chunkResults);
    }
    results.sort((a, b) => b.lastMessageAtISO - a.lastMessageAtISO);
    console.log("Processed Results", results);
    return results;
  };

  useClickOutside(ref, () => {
    setShowContactList(false);
    setShowContactOptions(false);
    setShowSearchPanel(false);
    setAngle(0);
  });

  useEffect(() => {
    const presenceListener = (data) => {
      console.log("Presence Event", data);
      const friendId = data.userId;
      const isOnline = data.isOnline;
      const timeStamp = data.timeStamp;

      const updatedActiveFriendData = activeFriendDataRef.current.map(
        (friend) => {
          if (friend._id === friendId) {
            console.log("Updating friend", friendId, isOnline, timeStamp);
            return { ...friend, isOnline: isOnline, lastSeen: timeStamp };
          }
          return friend;
        }
      );

      console.log("Updated Active Friend Data", updatedActiveFriendData);

      setActiveFriendData([...updatedActiveFriendData]);
      activeFriendDataRef.current = [...updatedActiveFriendData];
    };

    const messageListener = async(data) => {
      let newMessageRoomId = data.roomId;
      if(activeFriendIds.indexOf(data.senderId) === -1){
        const newUserData = await contactService.addToActiveFriends({
          friendName: data.senderName,
        });
        if (newUserData) dispatch(setUserProfileData(newUserData));
      }
      else if (activeFriendDataRef.current[0].roomId !== newMessageRoomId) {
        const updatedActiveFriendData = activeFriendDataRef.current.reduce((acc, friend) => {
          if(friend.roomId === newMessageRoomId){
            acc.unshift({...friend});
          }
          else{
            acc.push(friend);
          }
          return acc;
        }, []);

        setActiveFriendData(updatedActiveFriendData);
        activeFriendDataRef.current = updatedActiveFriendData;
      }
    };

    addPresenceEventsListener(presenceListener);
    addMessageEventsListener(messageListener);

    return () => {
      removePresenceEventsListener(presenceListener);
      removeMessageEventsListener(messageListener);
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        let getActiveFriendData =
          await contactService.getActiveFriendsDetails();

        getActiveFriendData = await processInChunks(getActiveFriendData, 10);
        console.log("Get active friend data", getActiveFriendData);
        setActiveFriendData(getActiveFriendData);
        activeFriendDataRef.current = getActiveFriendData;
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [activeFriendIds]);

  useEffect(() => {
    const getData = async () => {
      try {
        let getContactFriendData =
          await contactService.getContactFriendsDetails();
        getContactFriendData = getContactFriendData.map((friend) => {
          return {
            ...friend,
            roomId: [friend._id, userId].sort().join("_"),
          };
        });
        setContactFriendData(getContactFriendData);
        console.log(contactFriendData);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [contactFriendIds]);

  return (
    <div className="relative h-full p-3 space-y-3 flex flex-col w-full">
      <div className="w-3/4 mx-auto">
        <Search
          type="activeFriendSearch"
          allData={(() => {
            const seen = new Set();
            return [...activeFriendData, ...contactFriendData].filter(
              (item) => {
                if (seen.has(item._id)) return false;
                seen.add(item._id);
                return true;
              }
            );
          })()}
        />
      </div>
      <ul className=" grow flex flex-col space-y-2 overflow-scroll overflow-x-hidden scrollbar-hide w-full">
          {activeFriendData.map((friend) => (
          <li key={friend._id} className="relative z-auto w-full">
            <ChatListContainer
              roomId={friend.roomId}
              friendId={friend._id}
              friendName={friend.userName}
              profilePic={friend.profilePic || defaultProfilePic}
              isOnline={friend.isOnline}
              lastSeen={friend.updatedAt}
              newMessages={friend.newMessages}
              lastMessageAt={friend.lastMessageAt}
              lastMessage={friend.lastMessage}
            />
          </li>
        ))}
      </ul>
      <div ref={ref} className="">
        <motion.div
          className="absolute bottom-5 right-3 bg-[#04B2D9] w-12 h-12 flex justify-center items-center rounded-full z-10"
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: angle }}
          onTap={() => setAngle((prev) => (prev === 0 ? 180 : 0))}
          onClick={() => {
            {
              setShowContactOptions(!showContactOptions);
              setShowContactList(false);
              setShowSearchPanel(false);
            }
          }}
        >
          <i className="fa-solid fa-plus text-2xl"></i>
        </motion.div>

        <ContactAndSearchPanel
          showContactList={showContactList}
          showSearchPanel={showSearchPanel}
          contactFriendData={contactFriendData}
        />

        <AnimatePresence>
          {showContactOptions && (
            <div>
              <motion.div
                className="absolute bottom-5 right-17 bg-[#04B2D9] w-12 h-12 flex justify-center items-center rounded-full z-10"
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, translateX: "100%" }}
                animate={{ opacity: 1, translateX: "0%" }}
                exit={{ opacity: 0, translateX: "100%" }}
                onClick={() => {
                  setShowSearchPanel(!showSearchPanel);
                  setShowContactList(false);
                }}
              >
                <i className="fa-solid fa-user-plus text-2xl"></i>
              </motion.div>
              <motion.div
                className="absolute bottom-5 right-31 bg-[#04B2D9] w-12 h-12 flex justify-center items-center rounded-full z-10"
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, translateX: "200%" }}
                animate={{ opacity: 1, translateX: "0%" }}
                exit={{ opacity: 0, translateX: "200%" }}
                onClick={() => {
                  setShowContactList(!showContactList);
                  setShowSearchPanel(false);
                }}
              >
                <i className="fa-solid fa-message-plus text-2xl"></i>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ChatList;
