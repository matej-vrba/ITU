import React, { useContext } from 'react';
import {  useNavigate } from "react-router-dom";
import { UserContext } from '.'; // Adjust the path as needed

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
      
      console.log("Created project: ", projectId);
    navigate("project/"+projectId);

    })
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Create Project</button>
    </div>
  );
};

export default CreateButtom;
