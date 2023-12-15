import React, { useState, useEffect } from 'react';
import { socket } from "./socket";
import { useCookies } from 'react-cookie';
import VoteDetail from './VoteDetail';

const VoteResList = ({ id }) => {
  const [voteRes, setVoteRes] = useState([]);
  const [cookies] = useCookies(['user_id']);
  let userId = cookies.user_id;

  useEffect(() => {
    // Fetch result of vote
    fetchResult();

    socket.on('voteRes', (newResults) => {
      console.log("Mám: ", newResults);
      setVoteRes((newResults));
    });
  }, [id, socket]);

  const fetchResult = async () => {
    try {
      const response = await fetch(`http://localhost:5000/get-all-results/${id}`);
      const data = await response.json();
      console.log(data);
      setVoteRes(data);
    } catch (error) {
      console.error('Error fetching voting results', error);
    }
  };

  return (
	<>
	{voteRes.map((voteR,index) => (
		<>
		{voteR.user_id === userId ?
			<VoteDetail
			id={voteR.id}
			voteRes={voteR}/> :
			<span>bbbbb</span>
		}
		</>
	))}
	
	</>
  );

  /*return (
    <>
      {voteRes.map((voteR, index) => (
		<>
			{voteR.user_id !== userId ?
				<>
				<VoteDetail
				key={index}
				id={voteR.id}
				voteRes={voteR}
				/>
				</>
			:	
				<>
				<button onClick={handleAccept}>Accept</button>
				<button onClick={handleDecline}>Decline</button>
				</>
			}
		</>
      ))}
    </>
  );*/
}

export default VoteResList;