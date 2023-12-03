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
  var [info, setInfo] = useState(snippets[snippetId-1]);
  Projects.i = setInfo;

  useEffect(() => {
    console.log('Count is now: ', info);
    if( Projects.i != undefined ){
      Projects.i(info);
    }
  }, [info]);

  const list = snippets.map(s =>
    {
      const [ss, sets] = useState(s);

      useEffect(() => {
        console.log('aaa', ss);
      }, [ss]);

      return(
        <NavLink draggable="false"
              className="btn text-left"
              to={"/project/" + s}
              onClick={()=>{
                setInfo(ss);
                Projects.i = sets;
              }
                      }
        >
          {ss}
        </NavLink>
      )
    }
  )

  const infoSet = (a)=>{
    document.getElementById("snippetList").getElementsByClassName("active")[0].innerText = a;
    setInfo(a);
  }

  //var [info, setInfo] = React.useContext(DataContext)

//  [info, setInfo] = useState('aaa');
  //info = "aa";

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
          <Outlet context={[info, infoSet]}/>
        </div>
      </div>
    </>
  )
}
export default Projects;
