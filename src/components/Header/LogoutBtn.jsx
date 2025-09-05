import { authService, Button } from "../index"
import { persistor } from "../../store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import store from "../../store/store.js";
import { socket } from "../../config/webSocket.js";

function LogoutBtn() {
    const navigate = useNavigate();
    
  return (
    <Button
      text="Logout"
      icon="fa-solid fa-right-from-bracket"
      className="duration-200 ease-in-out text-white hover:underline"
      onClick={async () => {
        try {
          await authService.logout();
          store.dispatch({ type: "RESET_STORE"})
          persistor.purge();
          navigate("/");
        } catch (err) {
          console.error("Error during logout:", err);
        }
      }}
    />
  );
}

export default LogoutBtn;