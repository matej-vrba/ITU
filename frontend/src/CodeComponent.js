// Author: xvrbam03
import { useLoaderData } from "react-router-dom";
import React, { useState,useEffect, useCallback  } from 'react';
import {socket} from "./socket"
import {progress} from "./progress"
import { useCookies } from 'react-cookie';
import { createElement } from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Popup from 'reactjs-popup';
import Select from 'react-select';

export default function CodeComponent({children}){
  const { id } = useLoaderData();
  const [code, setCode] = useState([]);
  const [lang, setLang] = useState([]);
  const [createdAt, setCreatedAt] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:5000/snippets/' + id,{
      'methods':'GET'
    })
      .then(response => response.json())
      .then(response => {
        setCode(response['code'])
        setLang(response['lang'])
        setCreatedAt(response['created_at'])
      })
    .catch(error => console.log(error))
  },[id])

  var handleSubmit = (e)=>{
    e.preventDefault()
    let code = event.target.elements.codeField.value;
    let lang = event.target.elements.lang.value;
    progress.start();

    socket.timeout(5000).emit('add-code',{
      snippetId: id,
      code: code,
      lang: lang
    }, () => {});
  }

  useEffect(
    () => {
      socket.on('snippet-set-code', function(msg) {
        setCode(msg["code"])
        setLang(msg["lang"])
        console.log(msg)
        progress.finish();
      });
    }, [code]
  )
  //TODO: lepsi nazev nez create
  if(code == null || code == "")
    return(
    <div className="code-wrapper">
      <form className="list" onSubmit={handleSubmit} action="set-code">
      <div className="code-line">
        <Select name={"lang"}
                className={"searchSelect"}
                placeholder="Snippet language"
                classNamePrefix="select"
                unstyled={true}
                options={SyntaxHighlighter.supportedLanguages.map(s=>{return({"label": s, "value": s})})}
      />
      </div>
        <textarea name="codeField" cols="50" rows="10"></textarea>
        <input className="btn w-fit" name="" type="submit" value="Create"/>
      </form>
    </div>
    )
  return(

    <>
    <div className="code-wrapper">
      <div className="code-line">
        <span className="lang">{lang}</span>
        <span className="date">{createdAt}</span>
      </div>
        <SyntaxHighlighter
          wrapLines={true}
          showLineNumbers={true}
          renderer={renderer}
          language={lang}
          style={monokai}
        >
          {code}
        </SyntaxHighlighter>
    </div>
      {children}
    </>
  )
}

function renderer({ rows, stylesheet, useInlineStyles }) {
  const { id } = useLoaderData();
  const [cookies] = useCookies(['user_id']);
  const [code, setCode] = useState([]);
  useEffect(()=>{
    fetch('http://localhost:5000/snippets/' + id,{
      'methods':'GET'
    })
      .then(response => response.json())
      .then(response => {
        setCode(response['code'])
      })
    .catch(error => console.log(error))
  },[id])

  let user_id = cookies.user_id
  const submitComment = useCallback((lineNumber, e) => {
    e.preventDefault();
    console.log(event.target.elements.commentField.value)
    console.log(id)
    socket.timeout(5000).emit('add-comment',{
      snippetId: id,
      content: event.target.elements.commentField.value,
      line: lineNumber+1,
      user_id: user_id
    }, () => {});
  }, [id]);

  return rows.map((node, i) =>
    <span key={i}>
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
          {close =>
          <form onSubmit={(e) => {close();submitComment(i, e);  }}>
            <textarea cols="40" id="" name="" rows="2" name="commentField" className="commentField">
              {code ? (code + '').split('\n')[i] : ''}
            </textarea>
            <input className="btn" name="" type="submit" value="submit"/>
          </form>}
        </Popup>
      </span>
    </span>
  );
}
