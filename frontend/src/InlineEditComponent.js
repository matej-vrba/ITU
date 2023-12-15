import {socket} from "./socket"
import {progress} from "./progress"
// Inline edit component

// sends post request to endpoint with id and value, expects response to be json
// containing what was saved
// optionally can bind to websocekt event specified in listenEvent.
// The purpoise of this is when other user uses inline edit, backend server should
// upon submitting send websocket notification about this and other clients should
// update their value accordingly
export default function InlineEdit ({ value, setValue, endpoint, id, listenEvent }) {
  const onChange = (event) => setValue(event.target.value);
  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Escape") {
      event.target.blur();
    }
  };

  const onFocusLost = (event) => {
    //socket.timeout(5000).emit(socketEvent, id, event.target.value, () => {});
    progress.start();
    fetch('http://localhost:5000/' + endpoint,
          {
            method: 'POST',
            body: JSON.stringify({
              "value": event.target.value
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
      .then(response => response.json())
      .then(response => {
        progress.finish();
        setValue(response['value'])
      })
  }
  if(listenEvent)
    socket.on(listenEvent, function(msg){
      setValue(msg['value']);
    })

  return (
    <input
      className="inline-edit"
      type="text"
      aria-label="Field name"
      value={value}
      onChange={onChange}
      onBlur={onFocusLost}
      onKeyDown={onKeyDown}
    />
  )
}
