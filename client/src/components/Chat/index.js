import React from 'react'

function Chat({ sendMessage, messages }){
    return (
        <>
        <button onClick={sendMessage}></button>
        <p>{JSON.stringify(messages)}</p>
        </>
    )
}

export default Chat