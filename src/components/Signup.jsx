import { Container, Input, Logo, Button, Profile } from "./index";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authService } from "./index";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setUserProfileData } from "../store/userSlice";

export default function Signup() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const [error, setError] = useState({ status: 200, message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (loading) return;
    let timeout = setTimeout(() => setLoading(true), 200);
    try {
      data.email = data.email.trim();
      const userData = data ? await authService.createAccount(data) : null;
      await authService.login({ email: data.email, password: data.password });
      dispatch(setUserProfileData(userData));
      clearTimeout(timeout);
      setLoading(false);
      navigate("/signup/profile");
    } catch (err) {
      clearTimeout(timeout);
      setLoading(false);
      console.log("Error caught", err);
      setError({
        status: err.response.status,
        message: err.response.data.message,
      });
    }
  };

  return (
    <div className="w-1/3 bg-white font-hyperlegible-mono relative rounded-2xl">
      <div className="absolute right-3 top-3">
        <Link to="/">
          <i className="fa-solid fa-circle-xmark text-2xl text-red-600"></i>
        </Link>
      </div>
      {!authStatus ? (
        <div className="px-10 py-5">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
            <p className="text-center text-gray-600 mb-2">
              Already have an account?
              <Link to="/login" className="text-blue-500 underline">
                Login
              </Link>
            </p>
            <p
              className={`text-center text-red-500 mb-4 text-sm font-semibold ${
                error.status === 400 ? "" : "invisible"
              }`}
            >
              <i className="fa-solid fa-circle-exclamation mr-2"></i>All fields
              are required
            </p>
          </div>
          <div>
            <Container>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-4 items-center"
              >
                <Input
                  label="Name"
                  {...register("name")}
                  type="text"
                  classNameInput="border-gray-500"
                  classNameLabel="text-gray-700"
                  error={error}
                  setError={setError}
                />
                <Input
                  label="Email"
                  {...register("email")}
                  type="text"
                  classNameInput="border-gray-500"
                  classNameLabel="text-gray-700"
                  error={error}
                  setError={setError}
                />
                <Input
                  label="Password"
                  {...register("password")}
                  type="password"
                  classNameInput="border-gray-500"
                  classNameLabel="text-gray-700"
                  error={error}
                  setError={setError}
                />
                <Button type="submit" text="Sign Up" loading={loading} className="bg-[#04B2D9]" />
              </form>
            </Container>
          </div>
        </div>
      ) : (
        <Profile />
      )}
    </div>
  );
}
