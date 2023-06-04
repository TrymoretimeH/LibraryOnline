import { useState } from "react";
import Login from "./Components/Login";
import {
  request,
  setAuthHeader,
  getRole,
  setRole,
  getTen,
  setTen,
  setEmail,
  getEmail,
  setGiohang,
  getUsername,
  setUsername,
  getGiohang,
} from "./Components/axios_helper";
import Books from "./Components/Books";
import { Route, Routes, useNavigate } from "react-router-dom";
import LogBtn from "./Components/LogBtn";
import Header from "./Components/Header";
import BookDetails from "./Components/BookDetails";
import Users from "./Components/Users";
import UserDetails from "./Components/UserDetails";
import Register from "./Components/Register";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    ten: getTen(),
    username: getUsername(),
    role: getRole(),
    email: getEmail(),
    giohang: getGiohang(),
  });
  const navigation = useNavigate();
  

  const handleChangeAuth = (token, ten, role, email, giohang, username) => {
    setAuthHeader(token);
    setTen(ten);
    setRole(role);
    setEmail(email);
    setGiohang(giohang);
    setUsername(username);
  };

  const handleChangeIsLogged = (value) => {
    setIsLoggedIn(value);
  };

  const getIsLoggedIn = () => {
    return isLoggedIn;
  };

  const getCurrentUser = () => {
    return currentUser;
  };

  const handleChangeCurrentUser = (value) => {
    setCurrentUser(value);
  };

  const handleLogout = (value) => {
    logout();
  };

  const logout = () => {
    handleChangeAuth(null, "", "", "", [], "");
    handleChangeCurrentUser({ ten: "", role: "", email: "", giohang: [], username: "",});
    setIsLoggedIn(false);
  };

  const handleLogin = (e, username, password) => {
    onLogin(e, username, password);
  };

  const handleRegister = (e, username, password, ten, email, role, giohang) => {
    onRegister(e, username, password, ten, email, role, giohang);
  };

  const onLogin = (e, username, password) => {
    e.preventDefault();
    request("POST", "/login", { username, password })
      .then((response) => {
        console.log(response);
        handleChangeIsLogged(true);
        handleChangeAuth(
          response.data.token,
          response.data.ten,
          response.data.role,
          response.data.email,
          response.data.giohang,
          response.data.username,
        );
        console.log(response.data.giohang);
        handleChangeCurrentUser({
          ten: response.data.ten,
          role: response.data.role,
          email: response.data.email,
          giohang: JSON.parse(response.data.giohang),
          username: response.data.username,
        });
        alert("Đăng nhập thành công");
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message);
        handleChangeAuth(null, "", "", "", [], "");
        handleChangeIsLogged(false);
        handleChangeCurrentUser({ ten: "", role: "", email: "", giohang: [], username: "" });
      });
  };

  const onRegister = (e, username, password, ten, email, role, giohang) => {
    e.preventDefault();
    request("POST", "/register", { username, password, ten, email, role, giohang })
      .then((response) => {
        alert(response.data);
        navigation("/login", { replace: true })
      })
      .catch((error) => {
        console.log(error.response.data);
        handleChangeAuth(null, "", "", "", [], "");
        handleChangeIsLogged(false);
        handleChangeCurrentUser({ ten: "", role: "", email: "", giohang: [], username: "" });
        alert(error.response.data);
      });
  };

  return (
    <div className="app">
      <Header
        logout={handleLogout}
        isLoggedIn={getIsLoggedIn}
        currentUser={getCurrentUser}
      />
      <Routes>
        <Route
          path="/"
          element={<LogBtn currentUser={getCurrentUser} />}
        ></Route>
        <Route
          path="/login"
          element={
            <Login
              isLoggedIn={getIsLoggedIn}
              setIsLoggedIn={handleChangeIsLogged}
              onLogin={handleLogin}
              currentUser={getCurrentUser}
            />
          }
        ></Route>
        <Route
          path="/"
          element={<LogBtn currentUser={getCurrentUser} />}
        ></Route>
        <Route
          path="/register"
          element={
            <Register
              isLoggedIn={getIsLoggedIn}
              setIsLoggedIn={handleChangeIsLogged}
              onRegister={handleRegister}
              currentUser={getCurrentUser}
            />
          }
        ></Route>
        <Route
          path="/books"
          element={
            <Books
              currentUser={getCurrentUser}
              setCurrentUser={handleChangeCurrentUser}
              isLoggedIn={getIsLoggedIn}
              setIsLoggedIn={handleChangeIsLogged}
            />
          }
        ></Route>
        <Route
          path="/book/:id"
          element={
            <BookDetails
              currentUser={getCurrentUser}
              setCurrentUser={handleChangeCurrentUser}
            />
          }
        ></Route>
        <Route
          path="/users"
          element={
            <Users
              isLoggedIn={getIsLoggedIn}
              setIsLoggedIn={handleChangeIsLogged}
              currentUser={getCurrentUser}
            />
          }
        ></Route>
        <Route
          path="/user/:id"
          element={<UserDetails currentUser={getCurrentUser} />}
        ></Route>
      </Routes>
    </div>
  );
}
