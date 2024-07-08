import React, { useEffect, useState } from 'react';
import logo from '../assets/Logo.png'; 
import { useUserContext } from '../helpers/UserContext';

// CSS styles for the LoadingPage component
const styles = `
  .loading-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f0f0; /* Adjust background color as needed */
  }

  .logo {
    width: 100px; /* Adjust size as per your logo */
    height: auto;
    transition: transform 1s ease-in-out;
  }

  .rotate {
    animation: rotate 2s infinite linear; /* Adjust animation duration as needed */
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .loading-page h2 {
    margin-top: 20px;
    font-size: 1.5rem;
    color: #333; /* Adjust text color as needed */
  }
`;

// LoadingPage component
function LoadingPage() {
  const { username, setAuthStatus } = useUserContext();
  const [loadingTimeElapsed, setLoadingTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeElapsed(true);
    },); 

    return () => clearTimeout(timer);
  }, [username, setAuthStatus]);

  return (
    <div className="loading-page">
      <img src={logo} alt="Website Logo" className={`logo ${loadingTimeElapsed ? 'rotate' : ''}`} />
      <h2>Authenticating...</h2>
    </div>
  );
}

export { LoadingPage, styles };
