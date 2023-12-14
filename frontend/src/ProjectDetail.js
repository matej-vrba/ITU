import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom";
import React, { useState,useEffect, useCallback  } from 'react';
import './Categories.css';
import {socket} from "./socket"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import TrashIcon from './icons/Trash';
import ChatComponent from "./ChatComponent";
import VoteComponent from "./VoteComponent";
import { createElement } from 'react-syntax-highlighter';
import Popup from 'reactjs-popup';

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

      <h3>
        <InlineEdit value={title} setValue={setTitle} titleId={id} />
        <a title="Delete this snippet" onClick={del} href="/project">
          <TrashIcon />
        </a>
      </h3>

      <div className="code-wrapper">
        <div className="code-line">
          <span className="lang">C</span>
          <span className="date">{date}</span>
        </div>

        {code ? (
          <SyntaxHighlighter
            preTag={<p>aa</p>}
            wrapLines={true}
            showLineNumbers={true}
            renderer={renderer}
            language="javascript"
            style={monokai}
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code here"
          />
        )}
      </div>
      <ChatComponent 
      id={id}/>
      <VoteComponent
      id={id}/>
    </>
  )
}
export default ProjectDetail;

function renderer({ rows, stylesheet, useInlineStyles }) {
  const { id } = useLoaderData();

  const submitComment = useCallback((lineNumber, e) => {
    e.preventDefault();
    console.log(event.target.elements.commentField.value)
    console.log(id)
    socket.timeout(5000).emit('add-comment',{
      snippetId: id,
      content: event.target.elements.commentField.value,
      line: lineNumber+1
    }, () => {});
  }, [id]);

  return rows.map((node, i) =>
    <span>
    {createElement({
      node,
      stylesheet,
      useInlineStyles,
      key: `code-segement${i}`
    })}
      <span className="add-comment">
        <Popup trigger=
                 {<button>+</button>}
               position="left center">
          <form onSubmit={(e) => submitComment(i, e)}>
          <input name="commentField" className="commentField" type="text" />
            <input className="btn" name="" type="submit" value="šabmit"/>
          </form>
        </Popup>
      </span>
    </span>
  );
}
