// author Ondřej Bahunek xbahou00

import React, { useState } from 'react';
import UserAddIcon from './icons/UserAdd';
import FlashMessage from 'react-flash-message'

const DropdownMenu = ({ onSelect }) => {
  return (
    <div style={{position:"absolute",right:"2em",top:"-0.5em"}}>
      <button style={{backgroundColor:"#ffc800"}} onClick={() => onSelect('connectionCode')}>Connection Code</button>
      <button style={{backgroundColor:"#ffc800"}} onClick={() => onSelect('url')}>Link</button>
    </div>
  );
};

// upon clinking on csv icon of a "add user" opens a choice
// between joing joining with connection code or a link
// after clicking on choice the code/link is copied to clipboard and message is flashed
const IconClickable = ({hash}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);

  const handleIconClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const handleSelectOption = (option) => {
    if(option=="url"){
      const currentUrl = window.location.href;
      setFlashMessage(`Link copied`);
      navigator.clipboard.writeText(currentUrl);

    }
    else{
      setFlashMessage(`Code copied`);
      navigator.clipboard.writeText(hash);
    }
    setDropdownOpen(false);
  };

  return(
    <div style={{position:"relative"}}>
      <UserAddIcon onClick={handleIconClick}/>
      {isDropdownOpen && <DropdownMenu onSelect={handleSelectOption} />}
      {flashMessage && (
        <FlashMessage duration={2000}>
          <p style={{fontSize:"0.5em",position:"absolute",right:"5em",top:"0",color:"#ffc800"}}>{flashMessage}</p>
        </FlashMessage>
      )}
    </div>
  )
}

export default IconClickable;