import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {socket} from "./socket"

const AppWrapper = ({ children }) => {
  const [cookies, setCookie] = useCookies(['user_id']);

  useEffect(() => {
    // Check if the 'user_id' cookie exists
    const userId = cookies.user_id;

    // If the 'user_id' cookie doesn't exist, set a new one
    if (!userId) {
      console.log('Cookie not found! Setting a new one...');
      fetch('http://localhost:5000/create-user/', { method: 'POST' })
      .then(response => response.json())
      .then(responseData => {
        // Access the user_id from the resolved Promise
        const userId = responseData.user_id;
        setCookie('user_id', userId, { path: '/' });
    
        console.log("Set user: ", userId);
      })
  
    } else {
      console.log('Cookie found!');
      console.log('User: ',cookies.user_id);
    }
  }, [cookies.user_id, setCookie]);

  return (
    <div className="AppWrapper">
      {children}
    </div>
  );
};

export default AppWrapper;