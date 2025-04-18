// author Ondřej Bahunek xbahou00

import React, { useContext } from 'react';
import {  useNavigate } from "react-router-dom";
import { UserContext } from '.'; // Adjust the path as needed
import './MainPage.scss';

//after clicking on "create" button user create empty project and is redirected
const CreateButtom = () => {
  const user_id = useContext(UserContext);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Specify the action you want to perform when the button is clicked
    console.log('Button clicked! by user: ',user_id);
    fetch('http://localhost:5000/project/create/'+user_id, { method: 'POST' })
    .then(response => response.json())
    .then(responseData => {
      // Access the user_id from the resolved Promise
    const projectId = responseData.project_id;
    const projectHash = responseData.project_hash;
      
      console.log("Created project: ", projectId);
      navigate("project/"+projectHash);

    })
  };

  return (
    <div className="create-button">
      <button onClick={handleButtonClick}></button>
      <p>New Project</p>
    </div>
  );
};

export default CreateButtom;
