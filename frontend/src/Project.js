import './Project.css';
import { useState,useEffect  } from 'react'
import { Outlet, NavLink, Link, useParams } from "react-router-dom";
import PlusIcon from './icons/Plus'
import React from 'react';
import {DataContext} from './index'
import {socket} from "./socket"


function Projects({params}) {
  const [snippets, setSnippets] = useState([]);

  useEffect(
    () => {
      socket.on('all-snippets', function(msg) {
        setSnippets([...msg['snippets']])
        console.log();
      });

      socket.on('new-snippet', function(msg) {
        setSnippets([...snippets, msg['snippet']])
        console.log();
      });
    }
  )


  const addSnippet = () => {
    socket.timeout(5000).emit('add-snippet', () => {
    });
    return

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
