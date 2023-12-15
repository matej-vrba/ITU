import React from 'react';
import { socket } from "./socket";
import { useCookies } from 'react-cookie';

const VoteDetail = ({ res_id, id, voteRes  }) => {
  const [cookies] = useCookies(['user_id']);
  let userId = cookies.user_id;

  return (
    <>
		
		{voteRes.vote_state ? (
			<>
		<span className="vote-detail accepted">&#10003;</span>
			</>
		) : (
			<>
		<span className="vote-detail declined">&#10008;</span>

			</>
		)}
		
    </>
  );
}

export default VoteDetail;