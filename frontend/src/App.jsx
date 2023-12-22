/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./App.css";
import Layout from "./layout/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      try {
        const result = await fetch(
          "https://48byhymg2s.ap-southeast-1.awsapprunner.com/auth/isLoggedIn",
          {
            method: "GET",
            signal: abortController.signal,
            credentials: "include",
          }
        );

        console.log("Server response:", result);

        if (result.ok) {
          const parsedResult = await result.json();
          console.log("Parsed result:", parsedResult);

          if (!abortController.signal.aborted) {
            handleAuthenticationStatus(parsedResult);
          }
        } else {
          handleServerError(result);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          handleFetchError(error);
        }
      }
    }

    fetchData();

    return () => abortController.abort();
  }, []);

  const handleAuthenticationStatus = (parsedResult) => {
    console.log("Type of isLoggedIn:", typeof parsedResult.isLoggedIn);

    if (parsedResult.isLoggedIn) {
      setUser(parsedResult.user);
      setLoggedIn(true);
      console.log("User is logged in:", parsedResult.user);
    } else {
      setLoggedIn(false);
      console.log("User is not logged in");
    }
  };

  const handleServerError = (result) => {
    console.error("Server error:", result.statusText);
    toast.error("Server error. Please try again later.");
  };

  const handleFetchError = (error) => {
    console.error("Error fetching authentication status:", error);
    toast.error("An error occurred. Please try again later.");
  };

  return (
    <>
      <Layout
        user={user}
        setUser={setUser}
        isLoggedIn={isLoggedIn}
        setLoggedIn={setLoggedIn}
        toast={toast}
      />
      <ToastContainer />
    </>
  );
}

export default App;
