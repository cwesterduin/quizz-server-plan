// in App.js
import io from "socket.io-client";
import React, { useState, useEffect } from "react";
const serverEndpoint = "http://localhost:3000";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io(serverEndpoint);
    setSocket({ socket });
  }, []);

  return <div id="App">Hi</div>;
}

export default App