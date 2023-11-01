import { useState,useEffect } from 'react'
import './App.css';

function App({children}) {

  return (
    <div className="App container m-4">
      {children}
    </div>
  );
}

export default App;
