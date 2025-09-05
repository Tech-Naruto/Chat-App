import { useState, useEffect, useRef } from "react";
import { contactService, ChatListContainer } from "../index";
import { useDispatch, useSelector } from "react-redux";
import useClickOutside from "../../hooks/useClickOutside";
import defaultProfilePic from "../../assets/Default Pic.png";
import { useDebouncedCallback } from "../../hooks/useDebounce";
function Search({ type, allData = [] }) {
  const [focus, setFocus] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [allSearchResultReceived, setAllSearchResultReceived] = useState(false);
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.user.id);
  const currentUserName = useSelector((state) => state.user.userName);
  const searchRef = useRef(null);
  const searchResultRef = useRef(null);

  useClickOutside(searchRef, () => {
    setFocus(false);
    setSearchResult([]);
    setAllSearchResultReceived(false);
    setSearchPage(1);
    setSearchText("");
  });

  const [search, cancelDebounce] = useDebouncedCallback(async (data) => {
    let { result, page } = await contactService.newFriendSearch({
      searchText: data.search,
      page: searchPage,
    });

    if (result.length === 0) {
      setAllSearchResultReceived(true);
      if (searchPage === 1)
        result = [{ userName: "User Not Found...", _id: "User Not Found" }];
    } else if (result.length < 10) {
      setAllSearchResultReceived(true);
    } else {
      setSearchPage(page + 1);
    }
    setSearchResult((prev) => [...prev, ...result]);
  }, 1500);

  useEffect(() => {
    return () => cancelDebounce();
  }, [cancelDebounce]);

  const onChange = (data) => {
    setSearchText(data.search);
    if (data.search === "") {
      setSearchResult([]);
      setAllSearchResultReceived(false);
      setSearchPage(1);
      return;
    }
    data.search = data.search.trim();
    setAllSearchResultReceived(false);
    setSearchResult([]);
    setSearchPage(1);
    try {
      if (type === "newFriendSearch") {
        search(data);
      }

      if (type === "activeFriendSearch") {
        const searchResult = allData.filter((item) =>
          item.userName.toLowerCase().includes(data.search.toLowerCase())
        );
        if (searchResult.length === 0)
          searchResult.push({
            userName: "User Not Found...",
            _id: "User Not Found",
          });
        setSearchResult(searchResult);
      }
    } catch (err) {
      console.log("Search Error", err);
    }
  };

  return (
    <div className="relative z-20" ref={searchRef}>
      <div
        className={`flex space-x-2 items-center py-2 px-3 rounded-full group duration-100 ${
          focus ? "bg-transparent outline outline-cyan-500" : "bg-gray-500"
        }`}
      >
        <label htmlFor="search">
          <i
            className={`fa-solid fa-magnifying-glass duration-100 ${
              focus
                ? "bg-linear-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"
                : "text-black"
            }`}
          ></i>
        </label>
        <input
          id="search"
          type="text"
          value={searchText}
          placeholder={
            type === "newFriendSearch" ? "Add New Friend..." : "Search..."
          }
          className="bg-transparent focus:outline-none focus:bg-transparent focus:text-white text-black duration-100 px-1 w-full"
          onFocus={() => setFocus(true)}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>
      {focus && (
        <div
          className={`rounded-lg shadow-lg shadow-gray-900 absolute top-12 w-full flex flex-col max-h-50 overflow-y-scroll ${
            type === "activeFriendSearch" ? "bg-gray-900" : ""
          }`}
          ref={searchResultRef}
        >
          {searchResult.map((user) => (
            <ChatListContainer
              roomId={[currentUserId, user._id].sort().join("_")}
              friendName={user.userName}
              profilePic={user.profilePic || defaultProfilePic}
              friendId={user._id}
              isOnline=""
              lastSeen=""
              newMessages=""
              lastMessageAt=""
              type="search"
            ></ChatListContainer>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
