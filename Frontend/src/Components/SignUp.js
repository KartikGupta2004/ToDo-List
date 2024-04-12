import React, { useState } from 'react'
import { SlNotebook } from "react-icons/sl";
import { Link } from 'react-router-dom';
import { useSignup } from '../Hooks/useSignup';
import { useGoogleLogin } from '@react-oauth/google';
function SignUp() {
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')
  const {signup,error,isLoading} = useSignup()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      await signup(email, password);
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
        const userInfo = await userInfoResponse.json();
        const userEmail = userInfo.email;
        console.log(userEmail)
        await signup(userEmail, process.env.REACT_APP_DEFAULT_PASSWORD);
      } catch (error) {
        console.error("Error logging in with Google:", error);
      }
    },
    onError: () => {
      console.log("SignUp Failed");
    }
  });
  const handleGoogleSignUpClick = (e) => {
    e.preventDefault();
    googleLogin();
  }
  return (
    <>
    <div className="flex justify-center border-white bg-HomeBg">
    <form className="flex flex-col justify-center items-center ml-auto bg-orange-100 w-fit px-20 py-20 sm:rounded-lg sm:w-full sm:max-w-xl lg:rounded-none lg:rounded-l-lg lg:mr-0 lg:ml-0 lg:w-full lg:max-w-2xl my-16 lg:mx-12" onSubmit={handleSubmit}>
      <span className="flex font-bold text-xl mb-4 items-center">
        Sign Up to ToDo <SlNotebook className='ml-2'/>
      </span>
      <button className="flex items-center cursor-pointer bg-white hover:bg-blue-100 border-2 border-gray-100 rounded-lg mt-3 mb-3 px-7 py-2 text-sm" onClick={handleGoogleSignUpClick}>
            <img
              src="https://www.techjunkie.com/wp-content/uploads/2020/11/How-to-Change-the-Google-Logo.jpg"
              alt=""
              className="w-10 h-auto bg-white p-1 rounded-3xl mr-3"
            />
            Sign Up With Google
          </button>
      <span className="flex  text-gray-500 text-sm font-medium">
        Or Sign Up with your e-mail
      </span>
      <hr className="-mt-2" />
      <input
        type="email"
        placeholder="Email"
        className="px-4 h-12 my-3 border border-1 outline-gray-200 border-gray-200 rounded-lg mt-10 font-medium pl-6 bg-white flex items-center focus:bg-white"
        onChange={(e)=>setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        placeholder="Password"
        className="flex px-4 h-12 mb-2 border border-1 outline-gray-200 items-center rounded-lg font-medium pl-6 bg-white focus:bg-white"
        onChange={(e)=>setPassword(e.target.value)}
        value={password}
      />
      <span className="flex text-gray-500 text-sm font-medium">
        Already have an account? <Link to='/login'><p className='underline hover:cursor-pointer'>Sign In</p></Link>
      </span>
      <button disabled={isLoading} className="px-4 h-12 my-2 py-4 text-lg rounded-lg mt-10 font-medium pl-6 flex text-white bg-blue-600 hover:bg-blue-800 justify-center w-56 items-center">
        <img className="mr-2 w-8 h-8" src="login.svg" alt="" />
        Sign Up
      </button>
      {error &&<div className='error'>{error}</div>}
    </form>
    <div className="hidden lg:flex justify-center items-center max-w-screen-md h-auto bg-current py-42 rounded-r-xl my-16">
      <img
        className="w-450 h-auto object-contain"
        src="https://content.wepik.com/statics/134600189/preview-page0.jpg"
        alt=""
      />
    </div>
  </div>
    </>
  )
}

export default SignUp