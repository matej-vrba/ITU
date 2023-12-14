import {socket} from "./socket"
import { useCookies } from 'react-cookie';
import React, { useState,useEffect  } from 'react';
import { useLoaderData, useOutletContext, useNavigate } from "react-router-dom";

const VoteComponent = ({ id }) => {
	const [votes, setVotes] = useState([]);
	const [cookies, setCookie] = useCookies(['user_id']);
	let userId = cookies.user_id;

	useEffect(() => {
		
		// Fetch all messages for the given snippetId
		fetchVotes();
		// Listen for new votes
		socket.on('votes', (newVotes) => {
			setVotes(newVotes);
		  });
	
		
	  }, [id, socket]);
	  
	  const fetchVotes = async () => {
		try {
			const response = await fetch(`http://localhost:5000/get-all-votes/${id}`);
			const data = await response.json();
			console.log(data);
			setVotes(data);
		} catch (error) {
			console.error('Error fetching votes:', error);
		}
	  };

	const [newVote, setNewVote] = useState({ duration: '', message: '' });
	const [votingResults, setVotingResults] = useState({});

	const handleVote = () => {
		if (newVote.message) {
		  const voteData = {
			vote_title: newVote.message,
			snippetId: id,
			user_id: userId,
		  };
	
		  // Emit the new vote to the server
		  socket.emit('start-vote', voteData);
	
		  // Clear the input fields
		  setNewVote({ vote: '' });
		  setVotingResults({});

		}
	  };

	const handleAccept = (id,index) => {

		const voteAcc = {
			vote_id: id,
			user_id: userId,
			status: true,
		}

		socket.emit('accept-vote',voteAcc);
		setVotingResults({ ...votingResults, [index]: true });
	};

	const handleDecline = (id,index) => {
		const voteDeny = {
			vote_id: id,
			user_id: userId,
			status: false,
		}
		socket.emit('deny-vote',voteDeny);
		setVotingResults({ ...votingResults, [index]: false });
	};

	return (

		<div className="votes">
			<h2>Active Votes</h2>
				{votes.map((vote, index) => (
				<div key={index} className="vote-row">
				{vote.code_line == null ?
					<p>{`Vote: ${vote.vote_title}`}</p> :
					<p>{`Update Line ${vote.code_line}: ${vote.vote_title}`}</p>
				}
				{!votingResults[index] && (
					<>
					<button onClick={() => handleAccept(vote.id,index)}>Accept</button>
					<button onClick={() => handleDecline(vote.id,index)}>Decline</button>
					</>
				)}
				</div>
			))}
			<div className="vote-input">
			<input
				type="text"
				name="message"
				placeholder="Vote Message"
				value={newVote.message}
				onChange={(e) => setNewVote({ ...newVote, message: e.target.value })}
			/>
			<button onClick={handleVote}>Start Vote</button>
			</div>
		</div>


	);
};

export default VoteComponent;