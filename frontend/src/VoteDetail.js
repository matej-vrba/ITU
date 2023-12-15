import React from 'react';
import { socket } from "./socket";
import { useCookies } from 'react-cookie';

const VoteDetail = ({ id, voteRes  }) => {
  const [cookies] = useCookies(['user_id']);
  let userId = cookies.user_id;

  const handleAccept = () => {
    const voteAcc = {
      vote_id: id,
      user_id: userId,
      status: true,
    };
    socket.emit('accept-vote', voteAcc);
  };

  const handleDecline = () => {
    const voteDeny = {
      vote_id: id,
      user_id: userId,
      status: false,
    };
    socket.emit('accept-vote', voteDeny);
  };

  return (
    <>
		
		{voteRes.vote_state ? (
			<>
		<span className="vote-detail accepted">&#10003;</span>
		<button onClick={handleDecline}>Decline</button>
			</>
		) : (
			<>
		<span className="vote-detail declined">&#10008;</span>
		<button onClick={handleAccept}>Accept</button>

			</>
		)}
		
    </>
  );
}

export default VoteDetail;