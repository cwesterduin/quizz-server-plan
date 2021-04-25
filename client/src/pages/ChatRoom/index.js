// in App.js
import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import { Chat } from '../../components'
import { addMessage } from '../../actions'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const serverEndpoint = "http://localhost:3000";

function ChatRoom() {
  const { id } = useParams()
  const [socket, setSocket] = useState(null);

  const [error, setError] = useState()
  const [loading, setLoading] = useState()
  const [room, setRoom] = useState()

  const [count, setCount] = useState(0)

  const messages = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    async function validRoom() {
      try {
        setLoading(true)
        let { data } = await axios.get(`http://localhost:3000/games/${id}`);
        setLoading(false)
        setRoom(data)
      } catch (err) {
        console.warn(err);
        setLoading(false)
        setError(err);
      }
    }
    validRoom();
  }, []);

  useEffect(() => {
    if (room) {
      const socket = io(serverEndpoint);
      setSocket({ socket });
      socket.emit("create", id);

      socket.on("count", (count) => {
        setCount(count)
      })

      socket.on("admin-message", (msg) => {
        dispatch(addMessage("admin", msg));
      });

      socket.on("incoming-message", ({ username, message }) => {
        dispatch(addMessage(username, message));
      });
      return () => {
        socket.disconnect();
      };
    } else {
    }
  }, [room]);


  const sendMessage = (event, { message, setMessage }) => {
    event.preventDefault()
    socket.socket.emit('new-message', {username: socket.socket.id, message: message})
    setMessage('')
  }


  return (
    <>
      <div id="App">Room: {id}</div><span>users: {count}</span>
{      loading ? (<div>loading...</div>) : error ? (<div>{JSON.stringify(error)}</div>
      ) : (
      <Chat messages={messages} sendMessage={sendMessage} />
      )}
    </>
  );
}

export default ChatRoom