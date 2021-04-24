import React from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

function ChatSetup() {
  const history = useHistory()
  async function newRoom() {
    try {
      let { data } = await axios.post("http://localhost:3000/games");
      console.log(data);
      history.push(`/game/${data.data}`)
    } catch (err) {
      console.warn(err);
    }
  }

  return <button onClick={newRoom}>New room</button>;
}

export default ChatSetup