import { ChatList, Chat, Container } from "./index";
import { useSelector } from "react-redux";
import { Logo } from "./index";
function Home() {
  const roomId = useSelector((state) => state.chat.roomId);
  const userStatus = useSelector((state) => state.auth.status);

  return (
    <Container className="h-full">
      {userStatus ? (
        <Container className="flex h-full">
          <div className="w-1/4 bg-gray-800 min-w-70 rounded-t-xl">
            <ChatList />
          </div>
          <div className="w-3/4 bg-[#077dc1] rounded-t-xl overflow-hidden">
            {roomId ? <Chat /> : <h1>Select a chat</h1>}
          </div>
        </Container>
      ) : (
        <div className="bg-gray-700 h-full flex justify-center items-center">
          <div className="w-1/3 flex flex-col items-center">
            <div className="flex justify-center w-1/2">
              <Logo width="w-full" />
            </div>
            <p className="text-2xl text-center text-white font-hyperlegible-mono text-shadow-blue-400 text-shadow-lg/50">
              Real-time. Real presence.
              <br /> Real people.
              <br /> You in?
            </p>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Home;
