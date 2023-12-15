import React, { useState, useEffect,useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '.';
import {  useNavigate } from "react-router-dom";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import TrashIcon from './icons/Trash';

const ProjectList = () => {
    const user_id = useContext(UserContext);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjects();
      }, []);


    const fetchProjects = () => {
        fetch(`http://localhost:5000/projects/${user_id}`, { method: 'GET' })
          .then((response) => response.json())
          .then((data) => setProjects(data))
          .catch((error) => console.error('Error fetching projects:', error));
      };


    const del = (id) => {
        fetch('http://localhost:5000/project/' + id, { method: 'DELETE' })
        .then(() => {
            // After deletion, fetch and update the project list
            fetchProjects();
          })
        .catch((error) => console.error('Error deleting project:', error));
        return false;
      }

    return (
        <div className="project-list">
            <div className="project-icons">
                {projects.map(project => (
                <Link to={`/project/${project.hash}`} key={project.id} className="project-icon">
                    <div className="project-overlay">
                        {/* <Link onClick={() => del(project.id)} className='trash-icon'><TrashIcon/></Link> */}
                        {project.role === 'creator' && (
                            <Link onClick={() => del(project.id)} className="trash-icon">
                                <TrashIcon />
                            </Link>
                            )}
                        <div className="project-name">{project.name}</div>
                        <div className='project-code'>
                            <SyntaxHighlighter
                                wrapLines="false"
                                language="javascript"
                                style={monokai}
                                showLineNumbers="true"
                                >
                                {project.code+'\n'.repeat(50)}

                            </SyntaxHighlighter>
                        </div>
                    </div>
                    {/* <div className="project-description">{project.role}</div> */}
                </Link>
                ))}
            </div>
            {projects.length > 0 && <h3>Your Projects</h3>}
        </div>

    );
};

export default ProjectList;
