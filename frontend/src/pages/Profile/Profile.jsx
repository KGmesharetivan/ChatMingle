/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

const Profile = () => {
  // Example state for user posts
  const [postText, setPostText] = useState(''); // Arrays
  const [posts, setPosts] = useState([]); // Arrays
  const handlePostTextChange = (event) => {
    setPostText(event.target.value);
  };

  const handlePostSubmit = (event) => {
    event.preventDefault();

    // Save the post with additional details to the array and clear the input
    const newPost = {
      text: postText,
      actor: 'actor',
      name: 'Kim Da-hyun',
      date: new Date().toLocaleDateString(), // date
      time: new Date().toLocaleTimeString(), // time
      // Add more details (Optional) fields as needed
    };

    setPosts([...posts, newPost]);
    setPostText('');
  };

  return (
    <div className='bg-gray-100 min-h-min'>
      {/* Cover Photo */}
      <div
        className='h-80 bg-cover bg-center relative'
        style={{
          backgroundImage: 'url(https://lh3.googleusercontent.com/ledvgumQmauwI-C2mKr31nAJ4rVLkNz3GAz8fpufS2HdNXVOKVQ1bLOuqYg_kJ8XWiYW9fovz298cBjknYB0sMwpiu6uG8tlpw=w1200-h600-pp-rj-s365)', backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      >
      <div className='flex justify-end top-4 right-7 relative border-solid font-semibold'>Edit Profile <DriveFileRenameOutlineIcon/></div>
        {/* Profile Picture */}
        <div
          className='h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44 lg:h-48 lg:w-48 xl:h-56 xl:w-56 bg-white rounded-full border-4 border-white absolute -bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
          style={{
            backgroundImage:
              'url(https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/20220121%E2%80%94Dahyun_%EB%8B%A4%ED%98%84_Campaign_Film%2C_Pearlygates_x_Twice_2022.jpg/640px-20220121%E2%80%94Dahyun_%EB%8B%A4%ED%98%84_Campaign_Film%2C_Pearlygates_x_Twice_2022.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/*can add profile Picture here */}
        </div>
      </div>

      {/* User Information */}
      <div className='max-w-xl mx-auto px-5 mt-4'>
        <h1 className='text-3xl font-bold text-gray-800'>Kim Da-hyun</h1>
        <p className='text-gray-500'>
          A member of the South Korean girl group Twice, formed by JYP Entertainment in 2015.
        </p>

        {/* Age and Country */}
        <div className='flex items-center space-x-4 mt-2'>
          <p className='text-gray-700'>
            <strong>Age:</strong> 25
          </p>
          <p className='text-gray-700'>
            <strong>Country:</strong> South Korea
          </p>
        </div>

        {/* Bio */}
        <h1 className='mt-4 text-green-400 font-bold'>BIO</h1>
        <p className='mt-4 text-gray-700'>
          🌈 Exploring life's wonders | 📸 Amateur Photographer ✨ Embrace the journey, and the
          journey will embrace you. I love chocolate, especially choco-pie. Im the most flexible member. I have very pale skin, My nickname Dubu. I can touch my nose with my tongue.
        </p>

        {/* User Posts */}
        <div className='mt-4'>
          <form onSubmit={handlePostSubmit}>
            <textarea
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='What are you thinking?'
              value={postText}
              onChange={handlePostTextChange}
            />
            <button
              type='submit'
              className='mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
            >
              Post
            </button>
          </form>
        </div>

        {/* Display User Posts */}
        {posts.length > 0 && (
          <div className='mt-4'>
            <h1 className='text-green-400 font-bold'>POSTS</h1>
            {posts.map((userPost, index) => (
              <div key={index} className='mt-4 border border-gray-300 p-4 rounded'>
                <div className='flex items-center'>
                  <img
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/20220121%E2%80%94Dahyun_%EB%8B%A4%ED%98%84_Campaign_Film%2C_Pearlygates_x_Twice_2022.jpg/640px-20220121%E2%80%94Dahyun_%EB%8B%A4%ED%98%84_Campaign_Film%2C_Pearlygates_x_Twice_2022.jpg'
                    alt='User'
                    className='h-8 w-8 rounded-full mr-2'
                  />
                  <p className='text-gray-800 font-semibold'>{userPost.name}</p>
                </div>
                <p className='text-gray-600 mt-2'>{userPost.text}</p>
                <div className='text-gray-500 mt-2'>
                  <span>{userPost.date}</span> <span>{userPost.time}</span>
                </div>
                {/* You can add more details like image, likes, comments, etc. */}
              </div>
            ))}
          </div>
        )}

        {/* Social Links */}
        <div className='mt-4 flex space-x-4'>
          <a href='#' className='text-blue-500 hover:underline'>
            Facebook
          </a>
        </div>
      </div>
    </div>
  );
};


export default Profile;
