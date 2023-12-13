import React, { useEffect,useContext,createContext } from 'react';
import { useCookies } from 'react-cookie';
import { UserContext } from '.';

const AppWrapper = ({ children }) => {
  const [cookies, setCookie] = useCookies(['user_id']);
  let userId = cookies.user_id;
  useEffect(() => {
    // Check if the 'user_id' cookie exists
    // If the 'user_id' cookie doesn't exist, set a new one
    if (!userId) {
      console.log('Cookie not found! Setting a new one...');
      fetch('http://localhost:5000/create-user/', { method: 'POST' })
      .then(response => response.json())
      .then(responseData => {
        // Access the user_id from the resolved Promise
        userId = responseData.user_id;
        setCookie('user_id', userId, { path: '/' });
        
        console.log("Set user: ", userId);
      })
  
    } else {
      console.log('Cookie found!,User: ',cookies.user_id);
    }
    //here i want to set to the Data Context user_id=cookies.user_id
  }, [cookies.user_id, setCookie]);

  return (
      <UserContext.Provider value={cookies.user_id}>
        {children}
      </UserContext.Provider>
  );
};

export default AppWrapper;
