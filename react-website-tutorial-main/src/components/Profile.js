import React, { useEffect, useState } from 'react';

function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage or API
    const userCountry = localStorage.getItem('userCountry'); // Assuming userCountry is stored after login
    // Assuming other user data is stored in localStorage or fetched from API
    const storedUserData = {
      name: localStorage.getItem('userName'),
      age: localStorage.getItem('userAge'),
      gender: localStorage.getItem('userGender'),
      country: userCountry,
      subscriptionValidTill: localStorage.getItem('subscriptionValidTill'),
      watchHistory: JSON.parse(localStorage.getItem('watchHistory')) || [],
    };
    setUserData(storedUserData);
  }, []);

  if (!userData) {
    return <div>Loading...</div>; // Add loader or loading state if data is fetching
  }

  return (
    <div className="profile">
      <h1>Welcome, {userData.name}!</h1>
      <p>Age: {userData.age}</p>
      <p>Gender: {userData.gender}</p>
      <p>Country: {userData.country}</p>
      <p>Subscription Valid Till: {userData.subscriptionValidTill}</p>
      <h2>Watch History</h2>
      <ul>
        {userData.watchHistory.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
