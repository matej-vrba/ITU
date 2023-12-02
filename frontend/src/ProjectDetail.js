import { useLoaderData } from "react-router-dom";
import './Categories.css';
import { useState,useEffect  } from 'react'

export async function loader({ params }) {
  var a = params.snippetId;
  return { a };
}

function ProjectDetail({params}) {
  const { a } = useLoaderData();
  return (
    <>
      <h3>A snippet title</h3>
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
      <p>
        { a }
      </p>
      <p>
        :3
      </p>
    </>
  )
}
export default ProjectDetail;
