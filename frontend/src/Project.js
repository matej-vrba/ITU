import './Project.scss';
import { useState,useEffect,useRef } from 'react'
import { Outlet, NavLink, Link, useParams, useNavigate } from "react-router-dom";
import PlusIcon from './icons/Plus'
import React from 'react';
import {socket} from "./socket"
import { ConnectionState } from './components/ConnectionState';

export async function loader({ params }) {
  var id = params.id;
  socket.timeout(5000).emit('open-project', {projectId: id});

  return { id };
}

function Projects({params}) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  let { id } = useParams();
  // list of snippets for this project (displayed on the left)
  const [snippets, setSnippets] = useState([]);

  const [projectData, setProjectData] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const inputRef = useRef(null);


  useEffect(
    () => {

      //fetches almost all project data and store it in "projectData"
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/project/${id}`);
          const data = await response.json();
          setProjectData(data);
          setNewProjectName(data.name);
        } catch (error) {
          console.error('Error fetching project data:', error);
          // Handle errors as needed
        }
      };

      fetchData();
      

      // When socket gets disconnected, set state appropriately to
      // display or hide notice on top of the screen
      function onConn(){
        setIsConnected(true);
      }
      function onDis(){
        setIsConnected(false);
      }
      // set-snippet-title message is received after snippet was renamed
      // on backend by current or other user
      function setSnippetTitle(msg){
        let a = snippets;
        let i = a.findIndex(x => x.id == msg['id']);
        a[i] = msg;
        setSnippets(a);
      }

      // when receiving all-snippets from server it contains json array
      // with titles of all snippets and their id
      // upon receiving this, all old snippets are replaced with new ones
      // used mainly when page is first loaded
      socket.on('all-snippets', function(msg) {
        setSnippets(msg['snippets'])
      });
      // When receiving new-snippet, new snippet was created on backend
      // this can be by current or other user
      // new snippet is appended to the list
      // it is important that when appending new snippet the order is not
      // different from what would be received in all-snippets
      socket.on('new-snippet', function(msg) {
        setSnippets([...snippets, msg])
      });
      socket.on('connect', onConn);
      socket.on('disconnect', onDis);
      socket.on('set-snippet-title', (msg) => setSnippetTitle(msg));
    }, [id]
  )


  const handleInputChange = (e) => {
    setNewProjectName(e.target.value);
  };

  const handleInputBlur = () => {
    // Call your function to rename the project
    // You may want to add additional validation here
    // to ensure the new project name is not empty or the same as the current name

    // Update state and reset editing mode
    setProjectData((prevData) => ({ ...prevData, name: newProjectName }));
    console.log("name "+newProjectName);
    fetch('http://localhost:5000/project/' + id + '/name/'+newProjectName, { method: 'POST' });
  };

  const handleInputKeyPress = (e) => {
    // If Enter key is pressed, call handleInputBlur
    if (e.key === 'Enter') {
      handleInputBlur();
        // Blur the input to lose focus
        inputRef.current.blur();
    }
  };



  // clicking new snippet only sends event to backend with projectId it
  // was requested from, if backend approves, it then sends new-snippet
  const navigate = useNavigate();
  const addSnippet = () => {
    fetch('http://localhost:5000/project/' + id + '/snippet/new', { method: 'POST' })
    .then(response => response.json())
    .then(response => {
        setSnippets([...snippets, response])
      navigate("/project/"+id + '/' + response['id']);

    })
  }

  // loading snippetId, which is specified in url (/project/id/snippetId)
  let { snippetId } = useParams();
  var [title, setTitle] = useState(snippets[snippetId-1]);
  Projects.setTitle = setTitle;
  setTitle = ()=>{};

  useEffect(() => {
    if( Projects.setTitle != undefined ){
      Projects.setTitle(title);
    }
  }, [title]);


  const list = snippets.map(s =>
    {
      return(
        <NavLink key={s['id']} draggable="false"
              className="btn text-left"
              to={"/project/" + id + '/' + s['id']}
              onClick={()=>{
                setTitle(s['title']);
              }
                      }
        >
          {s['title']}
        </NavLink>
      )
    }
  )

  // Komponenta ConnectionState je zodpovědná za nápis na vrchu stránky,
  // že je člověk offline
  return (
    <div className="App">
      <ConnectionState isConnected={ isConnected } />
      <div className="project-container">
        <p>
        </p>
        <div className="sidebar">
          <h2>Code2Gether</h2>

          <div className={`editable-project-name${
              isHovered ? '-hover' : ''} ${isClicked ? '-clicked' : ''}`}
              >
            <input
                type="text"
                value={newProjectName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyPress}
                ref={inputRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseDown={() => setIsClicked(true)}
                onMouseUp={() => setIsClicked(false)}
              />
          </div>


          <div id="snippetList" className="list">
            <button onClick={addSnippet} >New <PlusIcon/></button>
            {list}
          </div>
        </div>
        <div className="content">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
export default Projects;
