import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import XSvg from "./components/svg/X";
import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";
import Notification from "./pages/Notification";
import Profile from "./pages/Profile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "./components/Spinner";

const App = () => {
  const {
    data: authUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/auth/profile");
        console.log(response);

        return response.data;
      } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          return null;
        }

        throw error;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex ">
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to={"/"} />}
        />

        <Route
          path="/profile/:name"
          element={authUser ? <Profile /> : <Navigate to={"/login"} />}
        />

        <Route
          path="/notification"
          element={authUser ? <Notification /> : <Navigate to={"/login"} />}
        />
      </Routes>
      <ToastContainer />
      {authUser && <RightPanel className="hidden md:block" />}
    </div>
  );
};

export default App;
