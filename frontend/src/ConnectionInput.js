// author Ondřej Bahunek xbahou00


import React, { useState,useContext } from 'react';
import { UserContext } from '.';
import { useNavigate } from "react-router-dom";
import './MainPage.scss';


// input field for entering connection code on the main page
// if the code is correct, user is registered as user of the project
// and is redirected to the project 
const ConnectionInput = () => {
  const user_id = useContext(UserContext);
  // State to hold the input value
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const [showRedShadow, setShowRedShadow] = useState(false);
  // Function to handle input changes
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted with value:', inputValue);
    fetch('http://localhost:5000/project/connect/'+user_id+"/"+inputValue, { method: 'POST' })
    .then(response => response.json())
    .then(responseData => {
      if(responseData.project_id)
      {
        console.log("Connectiong to project: ",responseData.project_id);
        navigate("project/"+responseData.project_hash);


      }
      else
      {
        console.log("Wrong connect string ");
         // Set the state to true to show the red shadow
        setShowRedShadow(true);

        // After 1 second, reset the state to false
        setTimeout(() => {
          setShowRedShadow(false);
        }, 1000);
      }
    })
  };

  return (
    <div className='connection-input'>
      <form onSubmit={handleSubmit} class={{position:"relative"}}>
          <input  className={showRedShadow ? 'red-shadow' : ''}  type="text" value={inputValue} onChange={handleInputChange} placeholder='Connection String:'/>

        <button type="submit">&#x21D2;</button>
        <label>
          Connect to project
        </label>

      </form>
    </div>
  );
};

export default ConnectionInput;