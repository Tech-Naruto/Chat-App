import { Container, Button, profileService, contactService } from "../index";
import defaultPic from "../../assets/Default Pic.png";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { setUserProfileData } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { login } from "../../store/authSlice";

function Profile({ type }) {
  const name = useSelector((state) => state.user?.userName) || "";
  const userData = useSelector((state) => state.user);
  const { register, handleSubmit } = useForm();
  const [profilePic, setProfilePic] = useState(defaultPic);
  const [actionMenu, setActionMenu] = useState(false);
  const [deleteProfilePic, setDeleteProfilePic] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("userData", userData);
    if (userData.profilePic) {
      setProfilePic(userData.profilePic);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (profilePic?.startsWith("blob:")) {
        URL.revokeObjectURL(profilePic); // Revoke the object URL to prevent memory leaks
      }
    };
  }, [profilePic]);

  const profilePicHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDeleteProfilePic(false);
      const previewUrl = URL.createObjectURL(file);
      setProfilePic(previewUrl);
    }
  };

  const onSubmit = async (data) => {
    if(loading) return;
    let timeout = setTimeout(() => setLoading(true), 200);
    try {
      if (type === "signup") {
        data.profilePic[0] ? await profileService.setProfilePic(data.profilePic[0]) : null;
        dispatch(login(userData));
      } else if (type === "update") {
        if (deleteProfilePic) {
          await profileService.deleteProfilePic();
        } else {
          data.profilePic[0]
            ? await profileService.setProfilePic(data.profilePic[0])
            : null;
        }
      }
      if (type === "update" && data.userName !== name) {
        await profileService.updateUserName(data);
      }
      const updatedUserData = await contactService.getUserDetails();
      dispatch(setUserProfileData(updatedUserData));
      clearTimeout(timeout);
      setLoading(false);
      navigate("/");
    } catch (err) {
      clearTimeout(timeout);
      setLoading(false);
      console.error("Error during profile update:", err);
    }
  };

  return (
    <Container>
      <div className="flex flex-col items-center p-10 space-y-5 w-full">
        <div className="w-4/5">
          <form
            className="space-y-8 flex flex-col items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="profile relative ">
              <img
                src={profilePic}
                alt="profile pic"
                className="w-40 rounded-full h-40 object-cover relative z-20 border-2 border-[#04B2D9] shadow-sm shadow-[#04B2D9]"
              />
              <div tabIndex={0} onBlur={() => setActionMenu(false)}>
                <div
                  className=" bg-blue-400 rounded-xl cursor-pointer absolute right-2 bottom-4 z-30 group"
                  onClick={() => setActionMenu(!actionMenu)}
                >
                  <i className="fa-solid fa-pen m-2 group-hover:text-white"></i>
                </div>
                <AnimatePresence>
                  {actionMenu && (
                    <motion.div
                      className="absolute gap-3 py-1 px-2 right-2 bottom-4 flex items-center bg-red-400 rounded-xl z-0"
                      initial={{ translateX: "0%", opacity: 0 }}
                      animate={{ translateX: "110%", opacity: 1 }}
                      exit={{ translateX: "0%", opacity: 0 }}
                    >
                      <label htmlFor="profile" className="cursor-pointer">
                        <i className="fa-solid hover:text-white fa-image"></i>
                      </label>
                      {profilePic !== defaultPic && (
                        <label
                          className="cursor-pointer"
                          onClick={async () => {
                            try {
                              setDeleteProfilePic(true);
                              setActionMenu(false);
                              setProfilePic(defaultPic);
                            } catch (err) {
                              console.log(err);
                            }
                          }}
                        >
                          <i className="fa-solid fa-trash hover:text-white"></i>
                        </label>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <input
                id="profile"
                type="file"
                accept="image/*"
                className="hidden"
                {...register("profilePic", { onChange: profilePicHandler })}
              ></input>
            </div>
            {type !== "signup" && (
              <div className=" justify-center flex border-b-2 border-[#04B2D9] space-x-3 pl-2">
                <input
                  defaultValue={name}
                  className=" text-2xl w-full focus:outline-none caret-[#04B2D9] tracking-tighter font-medium"
                  {...register("userName", { required: true })}
                ></input>
                <div className="place-content-center">
                  <i className="fa-solid fa-pen text-[#04B2D9]"></i>
                </div>
              </div>
            )}
            <Button
              type="submit"
              text="Save"
              loading={loading}
              className="bg-[#04B2D9] text-lg"
            />
          </form>
        </div>
      </div>
    </Container>
  );
}

export default Profile;
