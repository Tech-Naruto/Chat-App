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
            {roomId ? (
              <Chat />
            ) : (
              <div className="flex flex-col w-2/3 h-full justify-center items-center m-auto space-y-2 font-hyperlegible-mono text-xl text-shadow-sm text-shadow-gray-500">
                <Logo width="w-50" />
                <div>Want to add new friends</div>
                <div className="text-center space-y-2">
                  Just tap the &nbsp;
                  <i className="fa-solid fa-plus text-xl"></i>&nbsp; icon, then
                  hit the &nbsp;
                  <i className="fa-solid fa-user-plus text-2xl"></i>&nbsp;
                  profile button, <br />
                  and type their name into the search bar.
                </div>
              </div>
            )}
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
