import React, { useEffect, useState } from "react";

const Chat = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const gameCode = localStorage.getItem("gameId");

  useEffect(() => {
    const messageHandler = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); 
    };

    socket.on('receiveMessage', messageHandler);

    return () => {
      socket.off('receiveMessage', messageHandler); 
    };
  }, [socket]);

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleSendMessage = () => {
    if (text.trim() !== "") {
      socket.emit("sendMessage", {
        playerId: socket.id,
        gameId: gameCode,
        message: text
      });
      setText("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div id="chat-container">
      <div className="chat-messages">
        {messages.map((ele, i) => (
          <div key={i} className="message">
            <strong>{ele.name}:</strong> {ele.message}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          className="chat-input"
          type="text"
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button className="send-btn" onClick={handleSendMessage}>
          <img src="/assets/images/sendIcon.png" alt="Send" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
