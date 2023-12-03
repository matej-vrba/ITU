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
      });

      socket.on('new-snippet', function(msg) {
        setSnippets([...snippets, msg])
      });
      socket.on('set-snippet-title', function(msg) {
        let a = snippets;
        a[msg['id']] = msg;
        setSnippets(a);
      });
    }
  )


  const addSnippet = () => {
    socket.timeout(5000).emit('add-snippet', () => {});
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
              to={"/project/" + s['id']}
              onClick={()=>{
                setTitle(s['title']);
              }
                      }
        >
          {s['title']}
        </NavLink>
      )
    }
  )

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
          <Outlet context={[title, setTitle]}/>
        </div>
      </div>
    </>
  )
}
export default Projects;
