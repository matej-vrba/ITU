/**
*   Author: Martin Soukup
*   Login: xsouku15
*
*
*/
import React, { useState, useEffect } from 'react';
import { socket } from "./socket";
import { useCookies } from 'react-cookie';
import VoteDetail from './VoteDetail';

const VoteResList = ({ id, snippet_id  }) => {
  const [voteRes, setVoteRes] = useState([]);
  const [voteCount, setVoteCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [cookies] = useCookies(['user_id']);
  let userId = cookies.user_id;

  useEffect(() => {
    // Fetch result of vote
    fetchResult();
    fetchUsersCount();

    const handleVoteRes = (newResults) => {
      setVoteRes((voteRes) =>
        voteRes.map((vote) => (vote.id === newResults.id ? newResults : vote))
      );
      updateVoteCount(voteRes, newResults);   
    };

    socket.on('voteRes', handleVoteRes);
  
    return () => {
      // Clean up the socket event listener when the component is unmounted
      socket.off('voteRes', handleVoteRes);
    };
  }, [id, socket]);

  const fetchResult = async () => {
    try {
      const response = await fetch(`http://localhost:5000/get-all-results/${id}`);
      const data = await response.json();
      setVoteRes(data);
    } catch (error) {
      console.error('Error fetching voting results', error);
    }
  };

  const fetchUsersCount = async () => {
    try {
      const response = await fetch(`http://localhost:5000/snippet/${snippet_id}/user_count`);
      const data = await response.json();
      setUserCount(data.count);
    } catch (error) {
      console.error('Error fetching voting results', error);
    }
  };


  const handleAccept = async () => {
    const voteAcc = {
      vote_id: id,
      user_id: userId,
      status: true,
    };
    
    socket.emit('accept-vote', voteAcc);
    fetchResult();
  };

  const handleDecline = async () => {
    const voteDeny = {
      vote_id: id,
      user_id: userId,
      status: false,
    };

    socket.emit('accept-vote', voteDeny);
    fetchResult();
  };

  const updateVoteCount = (results, newResult) => {
    // Calculate the updated vote count based on the results
    const count = results.reduce((acc, result) => acc + (result.vote_state ? 1 : 0), 0) + (newResult.vote_state ? 1 : 0);
    setVoteCount(count);
  };

  return (
	<>
		{voteRes.map((voteR, index) => (
    <div key={index}>
      <VoteDetail voteRes={voteR} />
    </div>
  ))}
    <p>{`Votes: ${voteRes.length} / Total Users: ${userCount}`}</p>
		<button onClick={handleAccept}>Accept</button>
		<button onClick={handleDecline}>Decline</button>

	</>
  );

}

export default VoteResList;