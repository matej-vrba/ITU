/**
*   Author: Martin Soukup
*   Login: xsouku15
*
*
*/
import React from 'react';
import { socket } from "./socket";
import { useCookies } from 'react-cookie';

const VoteDetail = ({ voteRes  }) => {

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