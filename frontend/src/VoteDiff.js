import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import React, { useState,useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Popup from 'reactjs-popup';
import './VoteDiff.css';

export default function ({snippet_id, vote_id}) {

  const [code, setCode] = useState([]);
  const [lang, setLang] = useState([]);
  const [removed, setRemoved] = useState([]);
  const [numAdded, setNumAdded] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:5000/snippetsWithVote/' + snippet_id + '/' + vote_id,{
      'methods':'GET'
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setCode(response['code'])
        setLang(response['lang'])
setRemoved(response['removed'])
setNumAdded(response['num_added'])
      })
    .catch(error => console.log(error))
  },[snippet_id, vote_id])
  return(
  <Popup
    trigger={<button className="button"> Diff </button>}
    modal>

        <SyntaxHighlighter
          wrapLines={true}
          showLineNumbers={true}
          language={lang}
          style={monokai}
          lineProps={lineNum => {
            let style = { display: 'block' };
            if(lineNum == removed){
              style.backgroundColor = '#952828';
            }
            if(lineNum > removed && lineNum <= removed + numAdded){
              style.backgroundColor = '#3cb25a';
            }
            return { style };
          }}
        >
          {code}
        </SyntaxHighlighter>
  </Popup>)

}
