import React, { useState, useEffect,useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '.';
import {  useNavigate } from "react-router-dom";


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
        <div>
        <h2>Project List</h2>
        <div className="project-icons">
            {projects.map(project => (
            <Link to={`/project/${project.id}`} key={project.id} className="project-icon">
                {/* Customize the way you want to display the project information */}
                <div className="project-name">{project.name}</div>
                <div className="project-description">{project.role}</div>
            </Link>
            ))}
        </div>
        </div>
    );
};

export default ProjectList;
