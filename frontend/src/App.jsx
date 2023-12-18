/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./App.css";
import Layout from "./layout/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // Define state variables
  const [user, setUser] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      try {
        const result = await fetch("http://localhost:3001/auth/isLoggedIn", {
          method: "GET",
          signal: abortController.signal,
          credentials: "include", // Ensure credentials are sent (cookies)
        });

        console.log("Server response:", result);

        if (result.ok) {
          const parsedResult = await result.json();
          console.log("Parsed result:", parsedResult);

          if (!abortController.signal.aborted) {
            console.log("Type of isLoggedIn:", typeof parsedResult.isLoggedIn);

            if (parsedResult.isLoggedIn) {
              setUser(parsedResult.user);
              setLoggedIn(true);
              console.log("User is logged in:", parsedResult.user);
            } else {
              setLoggedIn(false);
              console.log("User is not logged in");
            }
          }
        } else {
          console.error("Server error:", result.statusText);
          toast.error("Server error. Please try again later.");
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error fetching authentication status:", error);
          toast.error("An error occurred. Please try again later.");
        }
      }
    }

    fetchData();

    return () => abortController.abort();
  }, []);

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
