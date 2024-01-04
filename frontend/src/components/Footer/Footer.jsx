/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { RiLinkedinFill } from "react-icons/ri";
import {
  AiFillYoutube,
  AiFillGithub,
  AiOutlineInstagram,
} from "react-icons/ai";

const socialLinks = [
  {
    path: "https://www.youtube.com",
    icon: <AiFillYoutube className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "https://www.github.com",
    icon: <AiFillGithub className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "https://www.instagram.com",
    icon: <AiOutlineInstagram className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "https://www.linkedin.com",
    icon: <RiLinkedinFill className="group-hover:text-white w-4 h-5" />,
  },
];

const quickLinks01 = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/home",
    display: "About Us",
  },
  {
    path: "/mingle",
    display: "Mingle",
  },
  {
    path: "/",
    display: "Blog",
  },
];

const quickLinks02 = [
  {
    path: "/mingle",
    display: "Talk with Strangers",
  },
  {
    path: "/signup",
    display: "Register",
  },
  {
    path: "/",
    display: "Find a Location",
  },
  {
    path: "/",
    display: "Get an Opinion",
  },
];

const quickLinks03 = [
  {
    path: "/",
    display: "Donate",
  },
  {
    path: "/contact",
    display: "Contact Us",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <section
      style={{
        background: "linear-gradient(28deg, #ebf8fa, #fcfaec)",
        marginTop: "-20px",
      }}
    >
      <footer>
        <div className="container">
          <div className="flex justify-between flex-col md:flex-row flex-wrap gap-[30px] mt-[70px]">
            <div>
              <img src={logo} alt="" className="logo-footer" />
              <p className="text-[16px] leading-7 font-[400] text-textColor mt-4">
                Copyright © {year} developed by Group 1 - WD92P all right
                reserved.
              </p>
              <div className="flex items-center gap-3 mt-4">
                {socialLinks.map((link, index) => (
                  <Link
                    to={link.path}
                    key={index}
                    className="w-9 h-9  border border-solid border-[#181A1E] rounded-full flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[20px] leading-[30px] font-[700] mb-6 text-headingColor">
                Quick Links
              </h4>
              <ul>
                {quickLinks01.map((link, index) => (
                  <li key={index} className="mb-4">
                    <Link
                      to={link.path}
                      className="text-[16px] leading-7 font-[400] text-textColor "
                    >
                      {link.display}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[20px] leading-[30px] font-[700] mb-6 text-headingColor">
                I want to:
              </h4>
              <ul>
                {quickLinks02.map((link, index) => (
                  <li key={index} className="mb-4">
                    <Link
                      to={link.path}
                      className="text-[16px] leading-7 font-[400] text-textColor "
                    >
                      {link.display}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[20px] leading-[30px] font-[700] mb-6 text-headingColor">
                Support
              </h4>
              <ul>
                {quickLinks03.map((link, index) => (
                  <li key={index} className="mb-4">
                    <Link
                      to={link.path}
                      className="text-[16px] leading-7 font-[400] text-textColor "
                    >
                      {link.display}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
