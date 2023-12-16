// PopUpComponent.jsx
import React, { useState } from 'react';

const PopUpComponent = ({ onClose, onCopy }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleCopyClick = () => {
    onCopy(selectedOption);
    onClose();
  };

  return (
    <div className="popup">
      <div>
        <label>
          <input
            type="radio"
            value="connectionCode"
            checked={selectedOption === 'connectionCode'}
            onChange={() => setSelectedOption('connectionCode')}
          />
          Connection Code
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="url"
            checked={selectedOption === 'rule'}
            onChange={() => setSelectedOption('rule')}
          />
          Rule
        </label>
      </div>
      <button onClick={handleCopyClick}>Copy to Clipboard</button>
    </div>
  );
};

export default PopUpComponent;
