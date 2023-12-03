

export function ConnectionState({isConnected}){
  if(isConnected == true){
    return(<></>)
  }

  return(
    <div className="conn-status">No internet connection</div>
  )

}
