import React, { useState,useContext } from 'react';
import { UserContext } from '.';
import { useNavigate } from "react-router-dom";
import './MainPage.scss';


const ConnectionInput = () => {
  const user_id = useContext(UserContext);
  // State to hold the input value
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  // Function to handle input changes
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your logic for handling the form submission here
    console.log('Form submitted with value:', inputValue);
    fetch('http://localhost:5000/project/connect/'+user_id+"/"+inputValue, { method: 'POST' })
    .then(response => response.json())
    .then(responseData => {
      // Access the user_id from the resolved Promise
      if(responseData.project_id)
      {
        console.log("Connectiong to project: ",responseData.project_id);
        navigate("project/"+responseData.project_id);

      }
      else
      {
        //TODO
        console.log("Wrong connect string ");
        return <p>Wrong connect string</p>;
      }
    })
  };

  return (
    <div className='connection-input'>
      <form onSubmit={handleSubmit}>
        {/* Input field */}
          <input type="text" value={inputValue} onChange={handleInputChange} placeholder='Connection String:'/>

        {/* Submit button */}
        <button type="submit">&#x21D2;</button>
        <label>
          Connect to project
        </label>

      </form>
    </div>
  );
};

export default ConnectionInput;