import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom";
import React, { useState,useEffect, useCallback  } from 'react';
import './Categories.css';
import {socket} from "./socket"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import TrashIcon from './icons/Trash';
import ChatComponent from "./ChatComponent";
import VoteComponent from "./VoteComponent";
import CodeComponent from "./CodeComponent";
import { createElement } from 'react-syntax-highlighter';
import Popup from 'reactjs-popup';
import InlineEdit from './InlineEditComponent';

export async function loader({ params }) {
  var id = params.snippetId;
  var projectHash = params.id;
  return { projectHash, id };
}

function ProjectDetail({params}) {
  const { projectHash, id } = useLoaderData();
  console.log(projectHash);
  const [title, setTitle] = useState("An unknown snippet");

  useEffect(
    () => {
      socket.on('set-snippet-title', function(msg) {
        if(msg['id'] == id){
          setTitle(msg['title']);
        }
      });
    }
  )

  const [date, setDate] = useState([]);
  const [code, setCode] = useState([]);


  useEffect(()=>{
    fetch('http://localhost:5000/snippets/' + id,{
      'methods':'GET'
    })
      .then(response => response.json())
      .then(response => {
        setDate(response['created_at'])
        setCode(response['code'])
        setTitle(response['title'])
      })
    .catch(error => console.log(error))
  },[id])


const navigate = useNavigate();
const del = (e) => {
  e.preventDefault();
  fetch('http://localhost:5000/snippets/' + id, { method: 'DELETE' })
    .then(response => {
      navigate('/project/' + projectHash);
    }
    ) ;
  return false;
}
  socket.on('snippet-deleted', (msg)=>{
    if(msg['id'] == id)
      navigate('/project/' + projectHash);
  })

  return (
    <>

    <h3>
      <InlineEdit value={title} setValue={setTitle} endpoint={`snippet/${id}/set-title`} listenEvent="snippet-title-changed" id={id} />
      <a title="Delete this snippet" onClick={del} href="/project">
        <TrashIcon />
      </a>
    </h3>

    <div className="code-wrapper">
      <div className="code-line">
        <span className="lang">C</span>
        <span className="date">{date}</span>
      </div>
      <CodeComponent/>
    </div>
      <ChatComponent 
      id={id}/>
      <VoteComponent
      id={id}/>
    </>
  )
}
export default ProjectDetail;
