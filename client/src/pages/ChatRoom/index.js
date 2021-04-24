// in App.js
import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import { Chat } from '../../components'
import { addMessage } from '../../actions'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const serverEndpoint = "http://localhost:3000";

function ChatRoom() {
  const { id } = useParams()
  const [socket, setSocket] = useState(null);
  const messages = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    const socket = io(serverEndpoint);
    setSocket({ socket });
    socket.on('admin-message', msg => {
      dispatch(addMessage('admin', msg))
    })
    socket.on('incoming-message', ({ username, message }) => {
      dispatch(addMessage(username, message))
    })
    return () => {
        socket.disconnect()
    }
  }, []);


  const sendMessage = (event, { message, setMessage }) => {
    event.preventDefault()
    socket.socket.emit('new-message', {username: socket.socket.id, message: message})
    setMessage('')
  }


  return (
    <>
    <div id="App">Room: {id}</div>
    <Chat messages={messages} sendMessage={sendMessage}/>
    </>
  )
}

export default ChatRoom