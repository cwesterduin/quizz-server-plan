// in App.js
import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import { Chat } from './components'
import { addMessage } from './actions'
import { useDispatch, useSelector } from 'react-redux'

const serverEndpoint = "http://localhost:3000";

function App() {
  const [socket, setSocket] = useState(null);
  const messages = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    const socket = io(serverEndpoint);
    setSocket({ socket });
    socket.on('admin-message', msg => console.log(msg));
    socket.on('incoming-message', ({ username, message }) => {
      console.log(`${username} says: ${message}`);
      dispatch(addMessage(username, message))
    })
    return () => {
        socket.disconnect()
    }
  }, []);


  const sendMessage = () => socket.socket.emit('new-message', {username: socket.socket.id, message: 'I know'});


  return (
    <>
    <div id="App">Hi</div>
    <Chat messages={messages} sendMessage={sendMessage}/>
    </>
  )
}

export default App