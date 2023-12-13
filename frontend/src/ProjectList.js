import React, { useState, useEffect,useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '.';
import {  useNavigate } from "react-router-dom";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const ProjectList = () => {
    const user_id = useContext(UserContext);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/projects/'+user_id,{method: 'GET'})
        .then(response => response.json())
        .then(data => setProjects(data))
        .catch(error => console.error('Error fetching projects:', error));
    }, []);

    return (
        <div className="project-list">
            <div className="project-icons">
                {projects.map(project => (
                <Link to={`/project/${project.id}`} key={project.id} className="project-icon">
                    <div className="project-overlay">
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
