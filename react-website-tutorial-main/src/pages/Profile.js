import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserContext } from '../helpers/UserContext';
import Power from "../assets/register.jpg";
import MaleIcon from "../assets/male.jpg";  
import FemaleIcon from "../assets/female.jpg";
import ProfileIcon from "../assets/profile.jpg";
import "../styles/Profile.css";

function Profile() {
  const history = useHistory();
  const { username, logout } = useUserContext();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    gender: '',
    country: '',
    age: '',
    subscriptionDays: '',
    subscriptionExpiry: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile?email=${username}`);
        const data = await response.json();
        if (response.ok) {
          setProfileData(data.profile);
        } else {
          alert(data.error || 'Failed to fetch profile data.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch profile data.');
      }
    };

    fetchProfile();
  }, [username]);

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  let genderIcon;
  switch (profileData.gender) {
    case 'male':
      genderIcon = MaleIcon;
      break;
    case 'female':
      genderIcon = FemaleIcon;
      break;
    default:
      genderIcon = ProfileIcon;
  }

  return (
    <div className="profile">
      <div className="leftSide" style={{ backgroundImage: `url(${Power})` }}></div>
      <div className="rightSide">
        <h1>Profile</h1>
        <div className="profile-details">
          <img src={genderIcon} alt="Gender Icon" className="gender-icon" />
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Gender:</strong> {profileData.gender}</p>
          <p><strong>Country:</strong> {profileData.country}</p>
          <p><strong>Age:</strong> {profileData.age}</p>
          <p><strong>Subscription Days:</strong> {profileData.subscriptionDays}</p>
          <p><strong>Subscription Expiry:</strong> {profileData.subscriptionExpiry ? new Date(profileData.subscriptionExpiry).toLocaleDateString() : ''}</p>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
