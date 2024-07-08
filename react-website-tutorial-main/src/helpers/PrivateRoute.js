import React, {useState, useEffect} from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUserContext } from '../helpers/UserContext';
import {LoadingPage, styles} from '../helpers/LoadingPage';

function PrivateRoute({ component: Component, ...rest }) {
  const { isLoggedIn, isPaid,  isAuthenticating, authStatus } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticating) {
      setTimeout(() => {
        setIsLoading(false); // Set loading to false after verification (simulated delay)
      }, 2000); // Simulated delay of 2 seconds
    }
  }, [isAuthenticating]);

  return (
    <Route
      {...rest}
      render={(props) => (
        <div>
          <style>{styles}</style>
          { isLoading || isAuthenticating ? (
              <LoadingPage /> // Render loading component while verifying
            ) : isLoggedIn && isPaid && authStatus ? (
              <Component {...props} />
            ) : (
              <Redirect to="/contact" />
            )}
        </div>  
      )}
    />
  );
}

export default PrivateRoute;