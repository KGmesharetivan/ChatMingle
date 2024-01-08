/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./App.css";
import Layout from "./layout/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Aos from "aos";
import "aos/dist/aos.css";
import "remixicon/fonts/remixicon.css";
import Spinner from "react-spinners/ClipLoader";

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Aos.init();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      try {
        const AUTH_STATUS_URL = "http://localhost:3001/auth/isLoggedIn";
        const result = await fetch(AUTH_STATUS_URL, {
          method: "GET",
          signal: abortController.signal,
          credentials: "include",
        });

        console.log("Server response status:", result.status);
        console.log("Server response headers:", result.headers);

        if (result.ok) {
          const parsedResult = await result.json();
          console.log("Parsed result:", parsedResult);
          handleAuthenticationStatus(parsedResult);
        } else {
          handleServerError(result);
        }
      } catch (error) {
        handleFetchError(error);
      } finally {
        setLoading(false);
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
    setError(result.statusText);
    toast.error("Server error. Please try again later.");
  };

  const handleFetchError = (error) => {
    if (error.name === "AbortError") {
      // Handle abort error
      console.warn("Fetch request was aborted:", error.message);
      return;
    }

    console.error("Error fetching authentication status:", error);
    setError("An error occurred. Please try again later.");
    toast.error("An error occurred. Please try again later.");
  };

  return (
    <>
      {/* Show loading indicator or error message */}
      {loading && (
        <div>
          Loading <Spinner />
        </div>
      )}
      {error && <div>Error: {error}</div>}

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
