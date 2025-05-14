import React from 'react';
import { useParams } from 'react-router-dom';
import './ChatPage.scss';

const ChatPage = () => {
  const { id } = useParams();

  if (id) {
    return (
      <div className="chat-page">
        <h1>{id}</h1>
        {/* Add chat messages and input here */}
      </div>
    );
  }

  const chats = [
    { id: 'chat-of-admins', name: 'Chat of Admins of DUMY' },
    { id: 'fans-of-attack-on-titans', name: 'Fans of Attack on Titans' },
  ];

  return (
    <div className="chat-page">
      <h1>Public Chats</h1>
      <div className="chats-list">
        {chats.map((chat) => (
          <div key={chat.id} className="chat-card">
            <h3>{chat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;