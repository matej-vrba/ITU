import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom";
import React, { useState,useEffect  } from 'react';
import './Categories.css';
import {socket} from "./socket"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import TrashIcon from './icons/Trash';
import ChatComponent from "./ChatComponent";

export async function loader({ params }) {
  var id = params.snippetId;

  //socket.timeout(5000).emit('get-snippet-title', id, () => {});

  return { id };
}
const InlineEdit = ({ value, setValue, titleId }) => {
  const onChange = (event) => setValue(event.target.value);
  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Escape") {
      event.target.blur();
    }
  };

  const onFocusLost = (event) => {
    socket.timeout(5000).emit('update-snippet-title', titleId, event.target.value, () => {});
  }

  return (
    <input
      type="text"
      aria-label="Field name"
      value={value}
      onChange={onChange}
      onBlur={onFocusLost}
      onKeyDown={onKeyDown}
    />
  )
}

function ProjectDetail({params}) {
  const { id } = useLoaderData();
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
        navigate('/project/' + 1);//TODO
      }
      ) ;
    return false;
  }


  return (
    <>

      <h3><InlineEdit value={title} setValue={setTitle} titleId={id} /><a title="Delete this snippet" onClick={del} href="/project"><TrashIcon/></a></h3>


      <div className="code-wrapper">
        <div className="code-line"><span className="lang">C</span><span className="date">{date}</span></div>
        <SyntaxHighlighter preTag={<p>aa</p>} wrapLines="true" showLineNumbers="true" language="javascript" style={monokai}>
          {code}
        </SyntaxHighlighter>
      </div>
      <ChatComponent 
      id={id}/>
    </>
  )
}
export default ProjectDetail;
