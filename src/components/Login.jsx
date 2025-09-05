import { Container, Input, Logo, Button, Loading } from "./index";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authService, contactService } from "./index";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { setUserProfileData } from "../store/userSlice";
import { useState } from "react";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState({ status: 200, message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if(loading) return;
    let timeout = setTimeout(() => setLoading(true), 200);
    try {
      let userDataAuth = await authService.login(data);
      dispatch(login(userDataAuth));
      console.log("userDataAuth", userDataAuth);
      dispatch(setUserProfileData(userDataAuth));
      clearTimeout(timeout);
      setLoading(false);      
      navigate("/");
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
      <div className="p-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
          <p className="text-center text-gray-600 mb-4">
            Don't have an account?
            <Link to="/login" className="text-blue-500 underline">
              Sign Up
            </Link>
          </p>
        </div>
        <div>
          <Container>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-4 items-center"
            >
              <Input
                label="Email or Username"
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
              <Button
                type="submit"
                text="Login"
                loading={loading}
                className="bg-[#04B2D9]"
                icon="fa-solid fa-right-to-bracket"
              />
            </form>
          </Container>
        </div>
      </div>
    </div>
  );
}
