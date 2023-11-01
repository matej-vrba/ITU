import { useState,useEffect } from 'react'
import './App.css';

function App({children}) {
  const [test, setTest] = useState([]);

  // Modify the current state by setting the new data to
  // the response from the backend
  useEffect(()=>{
    fetch('http://localhost:5000/',{
      'methods':'GET'
    })
      .then(response => response.json())
    .then(response => setTest(response))
    .catch(error => console.log(error))
  },[])

  return (
    <div className="App container m-4">
      <p>
        {test["data"]}
      </p>
      {children}
    </div>
  );
}

export default App;
