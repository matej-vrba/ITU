import { useLoaderData, useOutletContext } from "react-router-dom";
import DataContext from './Project';
import React, { useState,useEffect  } from 'react';
import './Categories.css';
import {socket} from "./socket"

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


  return (
    <>
      <h3><InlineEdit value={title} setValue={setTitle} titleId={id} /></h3>

      <code>
        <table>
          <tr><th colspan="2"><div><span>C</span><span>2.12.2023</span></div></th></tr>
          <tr><td>01</td><td><pre>// sample code</pre></td></tr>
          <tr><td>02</td><td><pre>#include &#60;stdio.h&#62;</pre></td></tr>
          <tr><td>03</td><td><pre> </pre></td></tr>
          <tr><td>04</td><td><pre>int main(int argc, char *argv[])  &#123;</pre></td></tr>
          <tr><td>05</td><td><pre>	return 0;</pre></td></tr>
          <tr><td>06</td><td><pre>&#125;</pre></td></tr>
        </table>
      </code>
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
    </>
  )
}
export default ProjectDetail;
