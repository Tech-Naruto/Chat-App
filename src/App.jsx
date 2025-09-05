import "./App.css";
import { Header } from "./components";
import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfileData } from "./store/userSlice";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { webSocketConfig } from "./config/webSocket";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const userStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const userStatusRef = useRef(userStatus);

  useEffect(() => {
    userStatusRef.current = userStatus;
    if(!userStatus) return;

    let socket;

    if(userStatus){
      socket = webSocketConfig(userStatusRef);
      dispatch(setUserProfileData(userData));
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
        console.log("🧹 WebSocket cleaned up");
      }
    };
  }, [userStatus]);

  return (
    <div className="flex flex-col h-screen relative isolate z-0 bg-[#19212d]">
      <Header />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-full relative z-10"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}

export default App;
