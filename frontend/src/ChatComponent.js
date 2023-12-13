import {socket} from "./socket"
import React, { useState,useEffect  } from 'react';
import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom";

const ChatComponent = ({ id }) => {
	const [messages, setMessages] = useState([]);
  
	useEffect(() => {
		// Fetch all messages for the given snippetId
		fetchMessages();
	
		// Listen for new messages
		socket.on('messages', (newMessages) => {
		  setMessages(newMessages);
		});	
		
	  }, [id, socket]);
	
	  const fetchMessages = () => {
		// Request all messages for the given snippetId
		socket.emit('get-all-messages', id);
	  };
  
	const [newMessage, setNewMessage] = useState({ name: '', text: '' });

	const handleInputChange = (e) => {
	  setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
	};
  
	const handleSendMessage = () => {
	  if (newMessage.name && newMessage.text) {
		const messageData = {
		  name: newMessage.name,
		  text: newMessage.text,
		  snippetId: id,
		};
  
		// Emit the new message to the server
		socket.emit('send-message', messageData);
  
		// Clear the input fields
		setNewMessage({ name: '', text: '' });
	  }
	};
  
	return (

	  <div className="comments">
		{messages.map((message, index) => (
		  <div key={index} className="hide-overflow">
			<div className="comment cut-corner">
			  <h4>{message.name}</h4>
			  <p>{message.text}</p>
			</div>
		  </div>
		))}

		<div className="hide-overflow">
		  <div className="comment cut-corner">
			<input
			  type="text"
			  name="name"
			  placeholder="Your Name"
			  value={newMessage.name}
			  onChange={handleInputChange}
			/>
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