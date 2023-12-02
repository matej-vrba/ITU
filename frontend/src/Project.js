import './Project.css';
import { useState,useEffect  } from 'react'
import { Outlet, Link } from "react-router-dom";
import PlusIcon from './icons/Plus'

function Projects({params}) {

  const [snippets, setSnippets] = useState([1,2,3,4]);

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

  const list = snippets.map(s => <Link draggable="false" className="btn text-left" to={"/project/" + s}>{s}</Link>)

  return (
    <>
      <div className="project-container">
        <div className="sidebar">
          <h2>Code2Gether</h2>
          <div className="list">
            <button onClick={addSnippet} >new <PlusIcon/></button>
            {list}
          </div>
        </div>
        <div className="content">
          <Outlet/>
        </div>
      </div>
    </>
  )
}
export default Projects;
