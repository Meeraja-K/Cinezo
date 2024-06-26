import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import malePic from '../assets/male.jpg'; // Replace with your actual image paths
import femalePic from '../assets/female.jpg'; // Replace with your actual image paths

function Profile() {
  const history = useHistory();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage or API
    const storedUserData = {
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail'),
      country: localStorage.getItem('userCountry'),
      gender: localStorage.getItem('userGender'),
      subscriptionType: localStorage.getItem('subscriptionType'),
      watchHistory: JSON.parse(localStorage.getItem('watchHistory')) || [],
    };
    setUserData(storedUserData);
  }, []);

  const handleLogout = () => {
    // Clear relevant local storage items
    localStorage.removeItem('userCountry');
    // Redirect to login/register page
    history.push('/contact');
  };

  if (!userData) {
    return <div>Loading...</div>; // Add loader or loading state if data is fetching
  }

  const profilePic = userData.gender === 'male' ? malePic : femalePic;

  return (
    <div className="profile">
      <img src={profilePic} alt="Profile Pic" />
      <h1>Welcome, {userData.name}!</h1>
      <p>Email: {userData.email}</p>
      <p>Country: {userData.country}</p>
      <p>Subscription Type: {userData.subscriptionType}</p>
      <h2>Watch History</h2>
      <ul>
        {userData.watchHistory.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
