// Author: xvrbam03
import './Project.scss';
import { useState, useEffect, useRef, useContext } from 'react'
import { Outlet, NavLink, Link, useParams, useNavigate, useLoaderData } from "react-router-dom";
import PlusIcon from './icons/Plus'
import React from 'react';
import {socket} from "./socket"
import {progress} from "./progress"
import { ConnectionState } from './components/ConnectionState';
import InlineEdit from './InlineEditComponent';
import { UserContext } from '.';
import UserIcon from './icons/User';


//transalted hash of project in url to project id
export async function loader({ params }) {
  var hash = params.id;
  var actual_id = 0;
  const response = await fetch(`http://localhost:5000/project/hash/${hash}`, { method: "GET" });
  const data = await response.json();
  actual_id = data;

  progress.finish();
  socket.timeout(5000).emit('open-project', {projectId: actual_id.id});
  return {id:actual_id.id,hash:hash}
}

function Projects({params}) {
  const user_id = useContext(UserContext);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { id,hash } = useLoaderData();
  // let { id } = useParams();
  // list of snippets for this project (displayed on the left)
  const [snippets, setSnippets] = useState([]);

  const [userName, setUserName] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');


  useEffect(
    () => {

      //fetches almost all project data and store it in "projectData"
      // author Ondřej Bahunek xbahou00
      const fetchProjectData = async () => {
        try {
          fetch(`http://localhost:5000/project/${id}`)
            .then(data => data.json())
            .then(data => {
              setProjectData(data);
              setNewProjectName(data.name);
            });
          //fetch user username by id
          fetch(`http://localhost:5000//user/${user_id}/get-name/`,{method:"GET"})
            .then(data => data.json())
            .then(data => {
              setUserName(data.value);
            });
          //chech if user is part of project if not that set it up (for scenario when user connects to project with a link)
          fetch(`http://localhost:5000//project/${id}/user/${user_id}/connect`,{method:"POST"})
            .then(response => response.json())
            .then(responseData => {
              if(responseData['connected'] == false){
                console.log('failed to add user to project');
              }
            })
        } catch (error) {
          console.error('Error fetching project data:', error);
          // Handle errors as needed
        }
      };
      fetchProjectData();


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
    },[snippets]
  )


  // clicking new snippet only sends event to backend with projectId it
  // was requested from, if backend approves, it then sends new-snippet
  const navigate = useNavigate();
  const addSnippet = () => {
    fetch('http://localhost:5000/project/' + id + '/snippet/new', { method: 'POST' })
    .then(response => response.json())
    .then(response => {
        setSnippets([...snippets, response])
      navigate("/project/"+hash + '/' + response['id']);

    })
  }

  // loading snippetId, which is specified in url (/project/id/snippetId)
  let { snippetId } = useParams();
  var [title, setTitle] = useState(snippets[snippetId-1]);


  const list = snippets.map(s =>
    {
      return(
        <NavLink key={s['id']} draggable="false"
              className="btn text-left"
              to={"/project/" + hash + '/' + s['id']}
              onClick={()=>{
                setTitle(s['title']);
                progress.start();
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
          <h2><Link to="/">
            Code<span className="highlighted-number">2</span>Gether
              </Link>
          </h2>


          <h4>
          <InlineEdit value={newProjectName} endpoint={`project/${id}/set-title`} setValue={setNewProjectName} id={id} listenEvent="project-title-changed" type='project_name' />
          </h4>


          <div id="snippetList" className="list">
            <button onClick={addSnippet} >New <PlusIcon/></button>
            {list}
          </div>
          <div className='user-div'> 
            <UserIcon className="userIcon"/>
            <InlineEdit value={userName} endpoint={`user/${user_id}/set-name`} setValue={setUserName} id={user_id} listenEvent="user-name-changed" type='user_name' />
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
