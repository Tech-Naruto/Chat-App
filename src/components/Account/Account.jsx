import defaultProfilePic from "../../assets/Default Pic.png";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { authService, messageService } from "../index";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "../../store/store";
import { logout } from "../../store/authSlice";
import { resetUserToDefault } from "../../store/userSlice";
import { resetChatToDefault } from "../../store/chatSlice";
import { AnimatePresence, motion } from "motion/react";
import useClickOutside from "../../hooks/useClickOutside";

function Account({ profilePicUrl = defaultProfilePic }) {
  const activeRoomId = useSelector((state) => state.chat.roomId);
  const userId = useSelector((state) => state.auth.userData.$id);
  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currPath = location.pathname;
  const navItems = [
    {
      text: "Profile",
      to: "/profile",
      icon: <i className="fa-solid fa-user"></i>,
    },
    // {
    //   text: "Settings",
    //   to: "/settings",
    //   icon: <i className="fa-solid fa-gear"></i>,
    // },
  ];

  const ref = useRef(null);
  useClickOutside(ref, () => setShowAccountPanel(false));

  useEffect(() => {
    setShowAccountPanel(false);
  }, [currPath]);

  return (
    <div className="relative" ref={ref}>
      <div>
        <img
          src={profilePicUrl}
          alt="Profile Pic"
          className={`w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 duration-100 ${
            showAccountPanel ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => setShowAccountPanel(!showAccountPanel)}
        />
      </div>
      <AnimatePresence>
        {showAccountPanel && (
          <motion.div
            key="account-panel"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <div className=" bg-gray-800 shadow-lg rounded-lg p-3 mt-2 w-40 absolute right-0 ">
              <ul className="flex flex-col items-center space-y-2">
                <li
                  className="relative cursor-pointer brightness-100 hover:brightness-75 group duration-100 mb-4"
                  onClick={() =>
                    location.pathname !== "/profile"
                      ? navigate("/profile")
                      : null
                  }
                >
                  <div>
                    <img
                      src={profilePicUrl}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                      key="profile-pic"
                    />
                    <i className="fa-light fa-image absolute text-white bottom-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 group-hover:opacity-100 opacity-0 duration-100"></i>
                  </div>
                </li>
                {navItems.map((item) => (
                  <li
                    key={item.text}
                    onClick={() =>
                      location.pathname !== item.to ? navigate(item.to) : null
                    }
                    className="w-full py-1 hover:bg-gray-700 cursor-pointer text-white rounded-lg flex justify-center"
                  >
                    <div className="space-x-3">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  </li>
                ))}
                <li
                  key="Logout"
                  className="w-full py-1 hover:bg-gray-700 cursor-pointer text-white rounded-lg flex justify-center"
                  onClick={async () => {
                    try {
                      authService.logout();
                      dispatch(logout());
                      persistor.purge(); // Clear persisted state
                      dispatch(resetUserToDefault()); // Reset user state to default
                      dispatch(resetChatToDefault());
                      if (activeRoomId) {
                        const roomData = await messageService.getRoomData({
                          roomId: activeRoomId,
                          userId,
                        });

                        roomData.documents.length
                          ? await messageService.updateRoomLastSeenAt({
                              roomDataId: roomData.documents[0].$id,
                              isPresent: false,
                            })
                          : null;
                      }
                      navigate("/");
                    } catch (err) {
                      console.error("Error during logout:", err);
                    }
                  }}
                >
                  <div className="space-x-3">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span>Logout</span>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Account;
