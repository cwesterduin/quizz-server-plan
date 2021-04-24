import React from 'react'

function ChatBox({ messages }) {
  return (
    <ul style={{listStyle: 'none'}}>
      {messages.map((message, index) => {
        const msg =
          message.user === "admin" ? (
            <li style={{ fontSize: "0.8rem", color: 'green' }} key={index}>
              {message.message}
            </li>
          ) : (
            <li key={index}>{`${message.user}: ${message.message}`}</li>
          );
        return msg;
      })}
    </ul>
  );
}

export default ChatBox