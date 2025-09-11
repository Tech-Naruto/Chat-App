import {  motion } from "framer-motion";
import ChatListContainer from "./ChatListContainer";

function ContactList({ contactFriendData }) {
  return (
          <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            exit={{ opacity: 0}}
            className="h-full overflow-y-hidden"
          >
            <ul className="flex flex-col space-y-2 h-full overflow-y-auto scrollbar-medium">
              {contactFriendData.map((friend) => (
                <li key={friend._id} className="relative z-0 ">
                  <ChatListContainer
                    friendId={friend._id}
                    friendName={friend.userName}
                    profilePic={friend.profilePic}
                    isOnline={friend.isOnline}
                    lastSeen={friend.lastSeen}
                    type="contact"
                  />
                </li>
              ))}
            </ul>
          </motion.div>
  );
}

export default ContactList;
