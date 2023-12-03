import { useLoaderData, useOutletContext } from "react-router-dom";
import DataContext from './Project';
import React, { useState,useEffect  } from 'react';
import './Categories.css';

export async function loader({ params }) {
  var a = params.snippetId;

  return { a };
}
const InlineEdit = ({ value, setValue }) => {
  const onChange = (event) => setValue(event.target.value);
  return (
    <input
      type="text"
      aria-label="Field name"
      value={value}
      onChange={onChange}
    />
  )
}

function ProjectDetail({params}) {
  const { a } = useLoaderData();
  const [title, setTitleCallback] = useOutletContext();
  //var [info, setInfo] = React.useContext(DataContext)

  //const info = React.useContext(DataContext)

  return (
    <>
      <h3><InlineEdit value={title} setValue={setTitleCallback} /></h3>

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
      <div className="comment-wrapper">
      <div className="comment">
        <h4>Někdo</h4>
        <p>
          Může mi někdo vysvětlit 3. řádek?
        </p>
      </div>
      </div>
      <div className="comment-wrapper">
      <div className="comment">
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
