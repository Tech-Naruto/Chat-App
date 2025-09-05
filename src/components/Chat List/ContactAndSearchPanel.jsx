import { ContactList, SearchPanel } from "../index";
import { motion, AnimatePresence } from "motion/react";

function ContactAndSearchPanel({
  showContactList,
  showSearchPanel,
  contactFriendData,
}) {
  return (
    <AnimatePresence>
      {showContactList || showSearchPanel ? (
        <motion.div
          className="h-3/5 bg-gray-900 absolute bottom-21 left-3 right-3 p-3 rounded-xl space-y-2 z-20 shadow-lg shadow-gray-700"
          initial={{
            opacity: 0,
            scale: 0,
            translateY: "0%",
            translateX: "35%",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            translateY: "0%",
            translateX: "0%",
          }}
          exit={{
            opacity: 0,
            scale: 0,
            translateY: "40%",
            translateX: "35%",
          }}
          transition={{
            duration: 0.1,
            bounce: 1,
            stiffness: 200,
            damping: 20,
            type: "spring",
            delay: 0,
          }}
        >
          { showContactList && <ContactList
            contactFriendData={contactFriendData}
          />}
          { showSearchPanel && <SearchPanel />}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default ContactAndSearchPanel;
