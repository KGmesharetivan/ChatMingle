/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Routers from "../routes/Routers";

const Layout = ({ user, isLoggedIn, setLoggedIn, setUser, toast }) => {
  return (
    <>
      <Header
        user={user}
        isLoggedIn={isLoggedIn}
        setLoggedIn={setLoggedIn}
        setUser={setUser}
        toast={toast}
      />
      <main>
        <Routers
          user={user}
          isLoggedIn={isLoggedIn}
          setLoggedIn={setLoggedIn}
          setUser={setUser}
          toast={toast}
        />
      </main>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  user: PropTypes.object,
  setLoggedIn: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  setUser: PropTypes.func.isRequired,
  toast: PropTypes.func.isRequired,
};

export default Layout;
