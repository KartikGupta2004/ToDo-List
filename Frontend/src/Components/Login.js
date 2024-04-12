import { React, useState } from "react";
import { SlNotebook } from "react-icons/sl";
import { Link } from "react-router-dom";
import { useLogin } from "../Hooks/useLogin";
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      await login(email, password);
    }
  };  
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`
            }
          }
        );
        if(userInfoResponse.ok){
        const userInfo = await userInfoResponse.json();
        const userEmail = userInfo.email;
        await login(userEmail, process.env.REACT_APP_DEFAULT_PASSWORD);
        }
      } catch (error) {
        console.error("Error logging in with Google:", error);
      }
    },
    onError: () => {
      console.log("Login Failed");
    }
  });
  const handleGoogleLoginClick = (e) => {
    e.preventDefault();
    googleLogin();
  }
  return (
    <>
      <div className="flex justify-center border-white bg-HomeBg">
        <form
          className="flex flex-col justify-center items-center ml-auto bg-orange-100 w-fit px-20 py-20 sm:rounded-lg sm:w-full sm:max-w-xl lg:rounded-none lg:rounded-l-lg lg:mr-0 lg:ml-0 lg:w-full lg:max-w-2xl my-16 lg:mx-12"
          onSubmit={handleSubmit}
        >
          <span className="flex font-bold text-xl mb-4 items-center">
            Sign In to ToDo <SlNotebook className="ml-2" />
          </span>
          <button className="flex items-center cursor-pointer bg-white hover:bg-blue-100 border-2 border-gray-100 rounded-lg mt-3 mb-3 px-7 py-2 text-sm" onClick={handleGoogleLoginClick}>
            <img
              src="https://www.techjunkie.com/wp-content/uploads/2020/11/How-to-Change-the-Google-Logo.jpg"
              alt=""
              className="w-10 h-auto bg-white p-1 rounded-3xl mr-3"
            />
            Sign In With Google
          </button>
          <span className="flex  text-gray-500 text-sm font-medium">
            Or Sign in with your e-mail
          </span>
          <hr className="-mt-2" />
          <input
            type="email"
            placeholder="Email"
            className="px-4 h-12 my-3 border border-1 outline-gray-200 border-gray-200 rounded-lg mt-10 font-medium pl-6 bg-white flex items-center focus:bg-white"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="Password"
            className="flex px-4 h-12 mb-3 border border-1 outline-gray-200 items-center rounded-lg font-medium pl-6 bg-white focus:bg-white"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            disabled={isLoading}
            className="px-4 h-12 my-2 py-4 text-lg rounded-lg mt-10 font-medium pl-6 flex text-white bg-blue-600 hover:bg-blue-800 justify-center w-56 items-center"
          >
            <img className="mr-2 w-8 h-8" src="login.svg" alt="" />
            Sign In
          </button>
          {error && <div className="error">{error}</div>}
          <span className="text-gray-600 decoration-gray-600 flex underline decoration-dotted text-sm my-4 cursor-pointer">
            Forgot Password?
          </span>
          <span className="text-gray-500 font-medium text-sm flex mt-3">
            Don't have an account?
            <Link to="/signup">
              <span className="decoration-gray-500 ml-1 underline decoration-dotted cursor-pointer">
                Sign Up
              </span>
            </Link>
          </span>
        </form>
        <div className="hidden lg:flex justify-center items-center max-w-screen-md h-auto bg-current py-42 rounded-r-xl my-16">
          <img
            className="w-full h-auto  object-cover"
            src="https://images1.dnaindia.com/images/DNA-EN/900x1600/2023/10/15/1697386585920_todolist.jpg"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

export default Login;
