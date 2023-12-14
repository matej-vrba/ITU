import {socket} from "./socket"
import React, { useState,useEffect  } from 'react';
import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom";

const ChatComponent = ({ id }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState({ name: '', text: '' });

  
	useEffect(() => {
		// Fetch all messages for the given snippetId
		fetchMessages();
		
		
	
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
  
	const handleInputChange = (e) => {
	  setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
	};
  
	const handleSendMessage = async () => {
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
			  <p>{message.message}</p>
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