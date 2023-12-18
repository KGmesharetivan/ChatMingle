/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import logo from "../../assets/images/logo.png";
import { Link, NavLink } from "react-router-dom";
import userImg from "../../assets/images/avatar-icon.png";
import { BiMenu } from "react-icons/bi";

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

const Header = ({ user, isLoggedIn }) => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);

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

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("User logged out");
  };

  return (
    <header className="header flex items-center  " ref={headerRef}>
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
                >
                  Logout
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
  user: PropTypes.object, // Adjust the type accordingly based on your data structure
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Header;
