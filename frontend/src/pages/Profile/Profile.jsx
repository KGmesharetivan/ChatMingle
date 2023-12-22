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

    // Save the post with additional details arrays
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
          backgroundImage: 'url(https://scontent.fwnp1-1.fna.fbcdn.net/v/t39.30808-6/412766910_933175778178170_1496804038733721839_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeHhyBFHTGmluy8TAwSREwKX6sr8ObL6_i7qyvw5svr-LkVh18gD5ckHo5V9VApPOn9v9dPtTQ6rAe2Vrnpb64rg&_nc_ohc=Pf75o6KanssAX8WYAR1&_nc_ht=scontent.fwnp1-1.fna&oh=00_AfAESnyzBQoBPxsm0hW1FeuwxNSZiR_eJBpI0DHVIAS0Iw&oe=658A88F9)', backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      >
      
      <button className='transition ease-in-out delay-100 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-120 flex absolute top-4 right-7 border-solid font-semibold text-white py-1 px-1 rounded sm:px-2 sm:py-1'>Edit Cover Photo <DriveFileRenameOutlineIcon/></button>
        {/* Profile Picture */}
        <div
          className='text-center h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44 lg:h-48 lg:w-48 xl:h-56 xl:w-56 bg-white rounded-full border-4 border-white absolute -bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
          style={{
            backgroundImage:
              'url(https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/20220121%E2%80%94Dahyun_%EB%8B%A4%ED%98%84_Campaign_Film%2C_Pearlygates_x_Twice_2022.jpg/640px-20220121%E2%80%94Dahyun_%EB%8B%A4%ED%98%84_Campaign_Film%2C_Pearlygates_x_Twice_2022.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/*can add profile Picture here */}
          <div 
            className='opacity-0 hover:opacity-100 absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white'
            style={{cursor: 'pointer'}}
            
            >
            Edit Profile Picture
          </div>
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
          🌈 Exploring lifes wonders | 📸 Amateur Photographer ✨ Embrace the journey, and the
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
              className='w-20 mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
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
          <a href='https://www.facebook.com/facebook' className='text-blue-500 hover:underline'>
            Facebook
          </a>
          <a href='https://twitter.com/' className='text-blue-500 hover:underline'>
            Twitter
          </a>
          <a href='https://www.instagram.com/' className='text-blue-500 hover:underline'>
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
};


export default Profile;
