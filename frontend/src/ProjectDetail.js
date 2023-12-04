import { useLoaderData, useOutletContext } from "react-router-dom";
import DataContext from './Project';
import React, { useState,useEffect  } from 'react';
import './Categories.css';
import {socket} from "./socket"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
  const [title, setTitle] = useOutletContext();
  //var [info, setInfo] = React.useContext(DataContext)
  //const info = React.useContext(DataContext)
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
      .then(response => {setDate(response['created_at'])
                         setCode(response['code'])
                         setTitle(response['title'])
                        })
    .catch(error => console.log(error))
  },[id])


  return (
    <>
      <h3><InlineEdit value={title} setValue={setTitle} titleId={id} /></h3>

      <div className="code-wrapper">
        <div className="code-line"><span className="lang">C</span><span className="date">{date}</span></div>
        <SyntaxHighlighter preTag={<p>aa</p>} wrapLines="true" showLineNumbers="true" language="javascript" style={monokai}>
          {code}
        </SyntaxHighlighter>
      </div>
      <div className="comments">

        <div className="hide-overflow">
          <div className="comment cut-corner">
            <h4>Někdo</h4>
            <p>
              Může mi někdo vysvětlit 3. řádek?
            </p>
          </div>
        </div>
        <div className="hide-overflow">
          <div className="comment cut-corner">
            <h4>Někdo jinej</h4>
            <p>
              Nepotřebuješ chápat
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
export default ProjectDetail;
