/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import Loader from "../../components/Loader/Loader";
import LoginLoader from "../../components/Loader/LoginLoader";

const Profile = ({ isLoggedIn, toast, user, setUser }) => {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const abortControllerRef = useRef(new AbortController());
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  useEffect(() => {
    // Check if the user is not logged in
    if (!isLoggedIn) {
      // Navigate to the login page
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    // Return null or an alternative component/message if not logged in
    return null;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch(
          "https://wihwxepmb2.ap-southeast-1.awsapprunner.com/auth/isLoggedIn",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();

          // Update the user data in App component only if the user is not null
          if (result.user) {
            setUser(result.user);
          }
        }
      } catch (error) {
        if (error.name === "AbortError") {
        } else {
          console.error("Error checking if user is logged in:", error);
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Extract profile image information from the user object
    if (user && user.profileImage && user.profileImage.path) {
      try {
        const imageUrl = new URL(
          user.profileImage.path,
          "https://wihwxepmb2.ap-southeast-1.awsapprunner.com"
        ).href;

        // Append a timestamp as a query parameter to the image URL
        const cacheBustedImageUrl = `${imageUrl}?t=${Date.now()}`;
        setProfileImageUrl(cacheBustedImageUrl);
      } catch (error) {
        console.error("Error constructing URL:", error);
        setProfileImageUrl(null);
      }
    } else {
      setProfileImageUrl(null);
    }
  }, []);

  const handlePostTextChange = (event) => {
    setPostText(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);

    const previewURL = URL.createObjectURL(file);
    setImagePreview(() => previewURL);
    setProfileImageUrl(previewURL);
  };

  const handleImageSubmit = async () => {
    try {
      setImageUploadLoading(true);

      const authToken = localStorage.getItem("authToken");

      // You may want to add additional checks on the authToken if necessary

      const formData = new FormData();
      formData.append("image", profileImage);

      const response = await fetch(
        "https://wihwxepmb2.ap-southeast-1.awsapprunner.com/auth/uploadimg",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        toast("Profile image uploaded successfully", { type: "success" });

        const result = await response.json();

        // Update the user data immediately without a page refresh
        setUser((prevUser) => ({
          ...prevUser,
          profileImage: { path: result.filePath },
        }));

        setImagePreview(null);
        setProfileImage(null);
      } else {
        const errorData = await response.json();
        console.error("Error uploading image:", errorData);
        toast(`Error uploading profile image: ${errorData.message}`, {
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast("Error uploading profile image", { type: "error" });
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handlePostSubmit = (event) => {
    event.preventDefault();
    const newPost = {
      text: postText,
      actor: "actor",
      name: user?.name || "Guest",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    setPosts([...posts, newPost]);
    setPostText("");
    toast("Post submitted successfully", { type: "success" });
  };

  const renderProfileImage = () => {
    if (profileImageUrl && profileImageUrl !== "") {
      return (
        <img
          src={profileImageUrl}
          alt="Profile Preview"
          className="w-full h-full object-cover rounded-full border-4 border-white"
          onError={() => setProfileImageUrl("")}
        />
      );
    } else {
      return (
        <div className="flex justify-center items-center mt-[-12px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="250"
            height="250"
            fill="currentColor"
            aria-hidden="true"
            role="img"
          >
            <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM6.02332 15.4163C7.49083 17.6069 9.69511 19 12.1597 19C14.6243 19 16.8286 17.6069 18.2961 15.4163C16.6885 13.9172 14.5312 13 12.1597 13C9.78821 13 7.63095 13.9172 6.02332 15.4163ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"></path>
          </svg>
        </div>
      );
    }
  };

  return (
    <section className="hero__section pt-[60px] 2xl:h-[800px]">
      <div className="container">
        <div className="profile-container">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div
                className="h-80 bg-cover bg-center relative"
                style={{
                  backgroundImage:
                    "url(https://scontent.fwnp1-1.fna.fbcdn.net/v/t39.30808-6/412766910_933175778178170_1496804038733721839_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeHhyBFHTGmluy8TAwSREwKX6sr8ObL6_i7qyvw5svr-LkVh18gD5ckHo5V9VApPOn9v9dPtTQ6rAe2Vrnpb64rg&_nc_ohc=Pf75o6KanssAX8WYAR1&_nc_ht=scontent.fwnp1-1.fna&oh=00_AfAESnyzBQoBPxsm0hW1FeuwxNSZiR_eJBpI0DHVIAS0Iw&oe=658A88F9)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <button className="transition ease-in-out delay-100 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-120 flex absolute top-4 right-7 border-solid font-semibold text-white py-1 px-1 rounded sm:px-2 sm:py-1">
                  Edit Cover Photo <DriveFileRenameOutlineIcon />
                </button>

                <div className="text-center h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44 lg:h-48 lg:w-48 xl:h-56 xl:w-56 bg-white rounded-full border-2 border-black absolute -bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {imageUploadLoading ? (
                    <Loader />
                  ) : (
                    <div className="mt-2 absolute top-[-7px] left-0 right-0 bottom-0">
                      {renderProfileImage()}
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    id="profileImageInput"
                  />
                  <label
                    htmlFor="profileImageInput"
                    className=" opacity-0 hover:opacity-100 absolute left-1/2 top-[110px] transform -translate-x-1/2 -translate-y-1/2 text-white cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="50"
                      height="50"
                      fill="#ffffff"
                    >
                      <path d="M9.82843 5L7.82843 7H4V19H20V7H16.1716L14.1716 5H9.82843ZM9 3H15L17 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V6C2 5.44772 2.44772 5 3 5H7L9 3ZM9.64042 7.53044C10.3555 7.19033 11.1555 7 12 7C15.0376 7 17.5 9.46243 17.5 12.5C17.5 14.05 16.8588 15.4502 15.8273 16.4499L13.75 12.6H15.4986C15.4995 12.5668 15.5 12.5334 15.5 12.5C15.5 10.567 13.933 9 12 9C11.4912 9 11.0078 9.10856 10.5716 9.30378L9.64042 7.53044ZM14.3175 17.4894C13.6132 17.817 12.828 18 12 18C8.96243 18 6.5 15.5376 6.5 12.5C6.5 10.9678 7.12654 9.58193 8.13738 8.58462L10.25 12.5H8.5C8.5 14.433 10.067 16 12 16C12.4923 16 12.9608 15.8984 13.3857 15.715L14.3175 17.4894Z"></path>
                    </svg>
                  </label>
                </div>
                <div
                  className="relative top-[80%]
               left-0 flex justify-center items-center"
                >
                  <button
                    type="button"
                    onClick={handleImageSubmit}
                    className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    style={{ backgroundColor: "rgb(0, 235, 199)" }}
                  >
                    {imageUploadLoading ? <LoginLoader /> : "Upload Image"}
                  </button>
                </div>
              </div>

              <div className="max-w-xl mx-auto px-5 mt-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {user?.fullname || "Guest"}
                </h1>
                <p className="text-gray-500">
                  A member of the South Korean girl group Twice, formed by JYP
                  Entertainment in 2015.
                </p>

                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-gray-700">
                    <strong>Age: </strong> {user?.age || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Country: </strong> {user?.country || "N/A"}
                  </p>
                </div>

                <h1 className="mt-4 text-green-400 font-bold">BIO</h1>
                <p className="mt-4 text-gray-700">
                  I was born on May 28, 1998, I'm a South Korean singer and
                  performer known for her vibrant personality and versatility.
                </p>

                <div className="mt-4">
                  <form onSubmit={handlePostSubmit}>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="What are you thinking?"
                      value={postText}
                      onChange={handlePostTextChange}
                    />
                    <button
                      type="submit"
                      className="w-20 mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Post
                    </button>
                  </form>
                </div>

                {posts.length > 0 && (
                  <div className="mt-4">
                    <h1 className="text-green-400 font-bold">POSTS</h1>
                    {posts.map((userPost, index) => (
                      <div
                        key={index}
                        className="mt-4 border border-gray-300 p-4 rounded"
                      >
                        <div className="flex items-center">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/20220121%E2%80%94Dahyun_%EB%8B%A4%ED%98%84_Campaign_Film%2C_Pearlygates_x_Twice_2022.jpg/640px-20220121%E2%80%94Dahyun_%EB%8B%A4%ED%98%84_Campaign_Film%2C_Pearlygates_x_Twice_2022.jpg"
                            alt="User"
                            className="h-8 w-8 rounded-full mr-2"
                          />
                          <p className="text-gray-800 font-semibold">
                            {userPost.name}
                          </p>
                        </div>
                        <p className="text-gray-600 mt-2">{userPost.text}</p>
                        <div className="text-gray-500 mt-2">
                          <span>{userPost.date}</span>{" "}
                          <span>{userPost.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex space-x-5">
                  <a
                    href="https://www.facebook.com/facebook"
                    className="hover:underline transform transition-transform duration-300 hover:scale-110"
                  >
                    <FacebookOutlinedIcon />
                  </a>
                  <a
                    href="https://twitter.com/"
                    className="hover:underline transform transition-transform duration-300 hover:scale-110"
                  >
                    <TwitterIcon />
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    className="hover:underline transform transition-transform duration-300 hover:scale-110"
                  >
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
  isLoggedIn: PropTypes.bool.isRequired,
  toast: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Profile;
