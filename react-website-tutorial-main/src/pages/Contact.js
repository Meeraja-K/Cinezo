import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserContext } from '../helpers/UserContext';
import Power from "../assets/register.jpg";
import "../styles/Contact.css";

function Contact() {
  const history = useHistory();
  const { login } = useUserContext();
  const [isNewUser, setIsNewUser] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    country: '',
    age: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isNewUser ? '/api/register' : '/api/login';
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        login(formData.email, data.isPaid); // Update context on successful login/register
        localStorage.setItem('userCountry', formData.country);
        if (isNewUser) {
          alert('Registration successful! Please complete your subscription.');
          history.push('/offer');
        } else {
          if (!data.isPaid) {
            alert('Login successful! Please complete your subscription.');
            history.push('/offer');
          } else {
            history.push('/profile');
          }
        }
      } else {
        if (response.status === 409 && data.redirect) {
          alert(data.error);
          setIsNewUser(false);
          history.push('/contact');
        } else {
          alert(data.error || 'Failed to process request.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process request.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const countries = ["United States", "Canada", "United Kingdom", "Australia", "India"];

  return (
    <div className="contact">
      <div className="leftSide" style={{ backgroundImage: `url(${Power})` }}></div>
      <div className="rightSide">
        <h1>{isNewUser ? 'Register' : 'Login'}</h1>
        <form id="contact-form" onSubmit={handleSubmit}>
          {isNewUser && (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input name="name" placeholder="Enter full name..." type="text" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select name="gender" onChange={handleChange} required>
                  <option value="">Select gender...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <select name="age" onChange={handleChange} required>
                  <option value="">Select age group...</option>
                  <option value="18-20">18-20</option>
                  <option value="21-25">21-25</option>
                  <option value="26-30">26-30</option>
                  <option value="31-35">31-35</option>
                  <option value="35-40">35-40</option>
                  <option value="40 and above">40 and above</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select name="country" onChange={handleChange} required>
                  <option value="">Select country...</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input name="email" placeholder="Enter email..." type="email" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input name="password" placeholder="Enter password..." type="password" onChange={handleChange} required />
          </div>
          <button type="submit">{isNewUser ? 'Register' : 'Login'}</button>
        </form>
        <span>
          {isNewUser ? 'Already have an account? ' : 'New user? '}
          <button className="link-button" onClick={() => setIsNewUser(!isNewUser)}>
            {isNewUser ? 'Login' : 'Register'}
          </button>
        </span>
      </div>
    </div>
  );
}

export default Contact;
