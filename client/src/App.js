import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Adjust the URL based on your server setup

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  }
  , []);

  const handleSendMessage = () => {
    socket.emit('chat message', inputMessage);
    setInputMessage('');
  }

  return (
    <div>
      <ul>
        {messages.map((message, index) => <li key={index}>{message}</li>)}
      </ul>
      <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default App;

