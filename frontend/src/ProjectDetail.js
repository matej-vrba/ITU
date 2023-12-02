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
