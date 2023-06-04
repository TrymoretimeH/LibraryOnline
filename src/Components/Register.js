import React, { useEffect, useState } from "react";
import { request, getAuthToken, setTen, setUsername, setEmail, setRole, setGiohang } from "./axios_helper";
import { useNavigate } from "react-router-dom";
// import jwt from 'jsonwebtoken';

const Register = ({ isLoggedIn, setIsLoggedIn, onRegister, currentUser }) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    ten: "",
    email: "",
    role: "reader",
    giohang: "[]"
  });

  const checkLoginStatus = () => {
    if (getAuthToken() !== "null") {
      if (isLoggedIn()) {
        navigation("/books", { replace: true });
      } else {
        setIsLoggedIn(true);
      }
    } else {
      if (isLoggedIn()) {
        setTen("");
        setUsername("")
        setEmail("")
        setRole("")
        setGiohang("")
        setIsLoggedIn(false);
      }
    }
  };

  const navigation = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("Vui lòng nhập lại password đúng")
    } else {
      onRegister(e, user.username, user.password, user.ten, user.email, user.role, user.giohang);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [isLoggedIn()]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:h-5/6 lg:py-0">
      <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="sm:px-6 sm:py-2 md:space-y-6 ">
          <h2 className="text-xl font-bold leading-tight text-center tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Register
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm my-4">
          <form
            id="formRegister"
            className="space-y-4 md:space-y-6"
            onSubmit={handleRegister}
            method="POST"
          >
            <div>
              <label
                htmlFor="ten"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tên người dùng
              </label>
              <div className="mt-2">
                <input
                  id="ten"
                  name="ten"
                  type="text"
                  onChange={handleChange}
                  value={user.ten}
                  required
                  placeholder="Tên người dùng"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={handleChange}
                  value={user.email}
                  required
                  placeholder="Email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  onChange={handleChange}
                  value={user.username}
                  required
                  placeholder="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={handleChange}
                  value={user.password}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  onChange={handleChange}
                  value={user.confirmPassword}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-cyan-400 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign Up
            </button>

            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already created account? 
              <a
                href="/login"
                className="font-medium text-cyan-300 hover:underline"
              >
                 Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
