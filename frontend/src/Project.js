import './Project.css';
import { useState,useEffect  } from 'react'
import { Outlet, Link } from "react-router-dom";

function Projects({params}) {

  const [snippets, setSnippets] = useState([]);

  const addSnippet = () => {
    fetch('http://localhost:5000/newSnippet',{
      'methods':'GET'
    })
      .then(response => response.json())
      .then(response => setSnippets([
        ...snippets,
        response
      ]))
      .catch(error => console.log(error))
  }

  const list = snippets.map(s => <ul><Link to={"/project/" + s}>{s}</Link></ul>)

  return (
    <>
      <div className="project-container">
        <div className="sidebar">
          <h2>aaa</h2>

      {list}
      <button
        onClick={addSnippet}
      >new</button>
        </div>
        <div>
          <Outlet/>
        </div>
      </div>
    </>
  )
}
export default Projects;
