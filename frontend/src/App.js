import { useState,useEffect } from 'react'
import './App.css';

function App({children}) {

  return (
    <div className="App  container mx-auto">
      {children}
    </div>
  );
}

export default App;
