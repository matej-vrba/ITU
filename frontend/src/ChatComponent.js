import {socket} from "./socket"
import React, { useState,useEffect  } from 'react';
import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

const ChatComponent = ({ id }) => {
	const [messages, setMessages] = useState([]);
	const [userName, setUserName] = useState('');
	const [cookies, setCookie] = useCookies(['user_id']);
	let userId = cookies.user_id;
  
	useEffect(() => {
		// Fetch all messages for the given snippetId
		fetchMessages();
		fetchName();

		// Listen for new messages
		socket.on('messages', (newMessages) => {
			console.log("Received new message ", newMessages)
			setMessages((messages) => [...messages, ...newMessages]);
		});	
		
	  }, [id, socket]);
	
	  const fetchMessages = async () => {
		try {
			const response = await fetch(`http://localhost:5000/get-all-messages/${id}`);
			const data = await response.json();
			console.log(data);
			setMessages(data);
			
		  } catch (error) {
			console.error('Error fetching messages:', error);
		  }
	  };

	  const fetchName = async () => {
		try {
		  const response = await fetch(`http://localhost:5000/user/${userId}/get-name/`);
		  const newname = await response.json();
		  console.log(newname.value);
		  setUserName(newname.value);
		} catch (error) {
		  console.error('Error fetching name:', error);
		}
	  };
	  

	  const [newMessage, setNewMessage] = useState({ name: '', text: '' });

  
	const handleInputChange = (e) => {
	  setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
	};
  
	const handleSendMessage = async () => {
	  if (newMessage.text) {
		const messageData = {
		  name: userName,
		  text: newMessage.text,
		  snippetId: id,
		};
  
		// Emit the new message to the server
		socket.emit('send-message', messageData);
  
		// Clear the input fields
		setNewMessage({ name: '', text: '' });
		fetchName();
	  }
	};
  
	return (

	  <div className="comments">
		{messages.map((message, index) => (
		  <div key={index} className="hide-overflow">
			<div className="comment cut-corner">
			  <h4>{message.name}</h4>
			  <p>{message.message}</p>
			</div>
		  </div>
		))}

		<div className="hide-overflow">
		  <div className="comment cut-corner">
			
			<textarea
			  name="text"
			  placeholder="Type your message..."
			  value={newMessage.text}
			  onChange={handleInputChange}
			/>
			<button onClick={handleSendMessage}>Send</button>
		  </div>
		</div>
	  </div>
	);
  };
  
  export default ChatComponent;