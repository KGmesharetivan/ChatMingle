/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import logo from "../../assets/images/logo.png";
import { Link, NavLink } from "react-router-dom";
import userImg from "../../assets/images/avatar-icon.png";
import { BiMenu } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LoginLoader from "../Loader/LoginLoader";

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/mingle",
    display: "Mingle",
  },
  {
    path: "/profile",
    display: "Profile",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = ({ setLoggedIn, isLoggedIn, setUser, toast }) => {
  const [loadingLogout, setLoadingLogout] = useState(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();
    return () => window.removeEventListener("scroll", handleStickyHeader);
  });

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      const response = await fetch("https://48byhymg2s.ap-southeast-1.awsapprunner.com/auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.logout) {
          setUser(null);
          setLoggedIn(false);
          toast.success("Logout successful!"); // Use toast for success message
          navigate("/login");
        } else {
          console.error("Logout failed");
          toast.error("Logout failed. Please try again."); // Use toast for failure message
        }
      } else {
        console.error("Logout failed");
        toast.error("Logout failed. Please try again."); // Use toast for failure message
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An error occurred during logout. Please try again later."); // Use toast for error message
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleMingleClick = () => {
    if (!isLoggedIn) {
      // Show Toastify alert
      toast.error("Please login or register an account.");
    }
  };

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* ====== logo ======= */}
          <div>
            <img
              src={logo}
              className="w-[175px] h-[125px] rounded-[50px]"
              alt=""
            />
          </div>

          {/* ===== menu ====== */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    onClick={link.path === "/mingle" ? handleMingleClick : null}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600]"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          {/* ==== nav right ====== */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Render content for logged-in user */}
                <div className="hidden">
                  <Link to="/">
                    <figure className="w-[35px] h-[35px] rounded-full">
                      <img
                        src={userImg}
                        className="w-full rounded-full"
                        alt=""
                      />
                    </figure>
                  </Link>
                </div>
                {/* You can add more content specific to logged-in users here */}
                <button
                  className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]"
                  onClick={handleLogout}
                  disabled={loadingLogout}
                >
                  {loadingLogout ? <LoginLoader /> : "Logout"}
                </button>
              </>
            ) : (
              // Render content for users not logged in
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  setUser: PropTypes.func.isRequired,
  toast: PropTypes.func.isRequired,
};

export default Header;
