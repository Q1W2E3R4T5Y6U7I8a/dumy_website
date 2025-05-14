import React from 'react';
import './HelpPage.scss';

const HelpPage = () => {
  return (
    <div className="help-page">
      <h1>Help & Info</h1>
      <div className="help-content">
        <section>
          <h2>About DUMY</h2>
          <p>
            DUMY is a platform designed to connect people, share ideas, and have fun. Whether you're here to chat, play games, or share your thoughts, DUMY has something for everyone.
          </p>
        </section>
        <section>
          <h2>Features</h2>
          <ul>
            <li>Connect with friends and make new ones.</li>
            <li>Share posts, music, and ideas.</li>
            <li>Join public chats or send private messages.</li>
            <li>Play games and explore applications.</li>
          </ul>
        </section>
        <section>
          <h2>Need Help?</h2>
          <p>
            If you encounter any issues or have questions, feel free to reach out to our support team at <a href="mailto:support@dumy.com">support@dumy.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;