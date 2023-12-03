import './Project.css';
import { useState,useEffect  } from 'react'
import { Outlet, Link } from "react-router-dom";
import PlusIcon from './icons/Plus'
import React from 'react';
import {DataContext} from './index'

function Projects({params}) {
  const [snippets, setSnippets] = useState([1,2,3,4]);
  //const [value, setValue] = useState();
  //const [value, setValue] = snippets[0];
  //const [snippets, setSnippets] = useState(Array(10).fill('1'));




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

  var [info, setInfo] = useState('aaa');

  //var [info, setInfo] = React.useContext(DataContext)
  console.log("render", setInfo);
  if(setInfo == null){
    setInfo = ()=>{}
  }
  useEffect(() => {
    console.log('Count is now: ', info);
  }, [setInfo]);
  useEffect(() => {
    console.log('Count is now: ', info);
    if( Projects.i != undefined ){
      Projects.i(info);
    }
  }, [info]);
  console.log("render", setInfo);

  const list = snippets.map(s =>
    {
      const [ss, sets] = useState(s);

      useEffect(() => {
        console.log('aaa', ss);
      }, [ss]);

      return(
        <Link draggable="false"
              className="btn text-left"
              to={"/project/" + s}
              onClick={()=>{
                setInfo(ss);
                setInfo = sets;
                console.log("aabbcc");

                Projects.i = sets;
              }
                      }
        >
          {ss}</Link>
      )
    }
  )

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}
    const forceUpdate = useForceUpdate();
  const infoSet = (a)=>{
    forceUpdate();

    console.log("aa", a);
    setInfo(a);
  }
  useEffect((a) => {
    console.log("finaly?", Projects.i);
    console.log("finaly?", a);
  }, [infoSet]);


  //var [info, setInfo] = React.useContext(DataContext)

//  [info, setInfo] = useState('aaa');
  //info = "aa";

  console.log("bb", infoSet);
  return (
    <>
      <div className="project-container">
      <p> {info} </p>
        <div className="sidebar">
          <h2>Code2Gether</h2>
          <div className="list">
            <button onClick={addSnippet} >new <PlusIcon/></button>
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
