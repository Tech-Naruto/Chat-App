import {
  Container,
  Logo,
  Button,
  Account,
} from "../index";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import defaultProfilePic from "../../assets/Default Pic.png";
import { useEffect, useState } from "react";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const profilePic = useSelector((state) => state.user.profilePic);
  const navigate = useNavigate();
  const location = useLocation();
  const [profilePicUrl, setProfilePicUrl] = useState(defaultProfilePic);

  useEffect(() => {
    if (profilePic) {
      setProfilePicUrl(profilePic);
    }
    else {
      setProfilePicUrl(defaultProfilePic);
    }
  }, [profilePic]);

  const currPath = location.pathname;

  const authItems = [
    {
      name: "Login",
      to: "/login",
      icon: "fa-solid fa-right-to-bracket",
    },
    {
      name: "Signup",
      to: "/signup",
      icon: "fa-solid fa-user-plus",
    },
  ];

  return (
    <>
      <Container className="relative z-20">
        <div className="flex bg-[#19212d]">
          <div>
            <Link to="/" className="flex items-center space-x-1">
              <Logo />
              <h1 className="text-2xl font-bold text-center text-white">
                Chat App
              </h1>
            </Link>
          </div>
          <div className="content-center grow flex justify-center items-center">
            {/* TODO: Navigation buttons to add*/}
          </div>
          <div className="content-center">
            <ul className="flex space-x-3 px-2">
              {!authStatus ? (
                authItems.map((item) => (
                  <li key={item.name}>
                    <Button
                      text={item.name}
                      icon={item.icon}
                      className={` duration-200 ease-in-out ${
                        currPath === item.to
                          ? "bg-[#04B2D9] text-black"
                          : "text-white hover:underline"
                      }`}
                      onClick={() =>
                        location.pathname !== item.to && navigate(item.to)
                      }
                    />
                  </li>
                ))
              ) : (
                <li>
                  <Account profilePicUrl={profilePicUrl} />
                </li>
              )}
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Header;
