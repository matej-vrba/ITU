import './Project.css';
import { useState,useEffect  } from 'react'
import { Outlet, NavLink, Link, useParams } from "react-router-dom";
import PlusIcon from './icons/Plus'
import React from 'react';
import {DataContext} from './index'

function Projects({params}) {
  const [snippets, setSnippets] = useState([1,2,3,4]);


  const addSnippet = () => {
    fetch('http://localhost:5000/newSnippet',{
      'methods':'GET'
    })
      .then(response => response.json())
      .then(response => {setSnippets([
        ...snippets,
        response
      ])}

           )
      .catch(error => console.log(error))
  }

  let { snippetId } = useParams();
  var [title, setTitle] = useState(snippets[snippetId-1]);
  Projects.setTitle = setTitle;

  useEffect(() => {
    if( Projects.setTitle != undefined ){
      Projects.setTitle(title);
    }
  }, [title]);

  const list = snippets.map(s =>
    {

      return(
        <NavLink draggable="false"
              className="btn text-left"
              to={"/project/" + s}
              onClick={()=>{
                setTitle(s);
              }
                      }
        >
          {s}
        </NavLink>
      )
    }
  )

  const setTitleCallback = (a)=>{
    document.getElementById("snippetList").getElementsByClassName("active")[0].innerText = a;
    setTitle(a);
  }

  return (
    <>
      <div className="project-container">
        <p>
        </p>
        <div className="sidebar">
          <h2>Code2Gether</h2>
          <div id="snippetList" className="list">
            <button onClick={addSnippet} >New <PlusIcon/></button>
            {list}
          </div>
        </div>
        <div className="content">
          <Outlet context={[title, setTitleCallback]}/>
        </div>
      </div>
    </>
  )
}
export default Projects;
