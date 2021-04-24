import React, { useState } from 'react'
import { ChatBox } from '..'

function Chat({ sendMessage, messages }){
    const [message, setMessage] = useState('')
    return (
        <>
        <form onSubmit={(event) => sendMessage(event, { message, setMessage })}>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <input type="submit" value={"submit"} />
        </form>
        <ChatBox messages={messages} />
        </>
    )
}

export default Chat