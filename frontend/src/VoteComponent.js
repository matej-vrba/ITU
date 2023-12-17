/**
*   Author: Martin Soukup
*   Login: xsouku15
*
*
*/
import {socket} from "./socket"
import { useCookies } from 'react-cookie';
import React, { useState,useEffect  } from 'react';
import VoteResList from './VoteResList';
import './VoteComponent.css';

const VoteComponent = ({ id }) => {
	const [votes, setVotes] = useState([]);
	const [acceptedVotes, setAcceptedVotes] = useState([]);
	const [cookies, setCookie] = useCookies(['user_id']);
	let userId = cookies.user_id;

	useEffect(() => {
		
		// Fetch all messages for the given snippetId
		fetchVotes();
		//fetchAVotes();
		
		// Listen for new votes
		socket.on('votes', (newVotes) => {
			console.log("DOSTAL JSEM: ", newVotes)

			setVotes((votes) => [...votes, ...newVotes]);
		  });

		socket.on('acc-votes', (newAVotes) => {
			console.log("DOSTAL JSEM: ", newAVotes)
			setVotes((votes) => votes.filter((vote) => vote.id !== newAVotes));
			fetchAVotes();
		});

		socket.on('delete-vote', (deletedVoteId) => {
			setVotes((votes) => votes.filter((vote) => vote.id !== deletedVoteId));
			setAcceptedVotes((votes) => votes.filter((vote) => vote.id !== deletedVoteId));
		  });

		return () => {
			socket.off('votes')
			socket.off('acc-votes')
			socket.off('delete-vote')
			};
		
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
	  const fetchAVotes = async () => {
		try {
			const response = await fetch(`http://localhost:5000/get-accepted-votes/${id}`);
			const data = await response.json();
			console.log(data);
			setAcceptedVotes(data);
		} catch (error) {
			console.error('Error fetching votes:', error);
		}
	  };

	const [newVote, setNewVote] = useState({ duration: '', message: '' });

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
		  setNewVote({ message: '' });

		}
	  };


	return (
		<div className="votes">
		<div className="votes-section">
			<h2>Active Votes</h2>
			{votes.map((vote, index) => (
			<div key={index} className="vote-row">
				{vote.code_line == null ? (
				<>
					<p>{`Vote: ${vote.vote_title}`} <VoteResList id={vote.id} snippet_id={id} /></p>
				</>
				) : (
				<>
					<p>{`Update Line ${vote.code_line}: ${vote.vote_title}`} <VoteResList id={vote.id} snippet_id={id} /></p>
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
		{acceptedVotes.length > 0 &&
		<div className="votes-section">
			<h2>Accepted Votes</h2>
			{acceptedVotes.map((acceptedVote, index) => (
			<div key={index} className="vote-row">
				<p>{`Accepted Vote: ${acceptedVote.vote_title}`} </p>
			</div>
			))}
		</div>
		}
		</div>
	);
};

export default VoteComponent;