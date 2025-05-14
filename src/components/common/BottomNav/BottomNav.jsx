import React, { useContext } from 'react';
import { BackgroundMusicContext } from '../../../context/BackgroundMusic';
import { Link } from 'react-router-dom';
import './BottomNav.scss';

const BottomNav = () => {
  const { volume, setVolume } = useContext(BackgroundMusicContext);

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
  };

  return (
    <nav className="bottomnav">
      <div className="bottomnav__center">
          <Link to="/account" className="bottomnav__link">Profile</Link>
          <Link to="/messages" className="bottomnav__link">Private Messages</Link>
          <Link to="/friends" className="bottomnav__link">Friends</Link>
          <Link to="/chats" className="bottomnav__link">Public Chats</Link>
          <Link to="/music" className="bottomnav__link">Music</Link>
          <Link to="/games" className="bottomnav__link">Games</Link>
          <Link to="/help" className="bottomnav__link">Help/Info</Link>

        <div className="bottomnav__music-container">
          <img
            src={volume === 0 ? '/stop_sound_icon.png' : '/sound_icon.png'}
            alt="music toggle"
            className="bottomnav__music-icon"
          />

          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="bottomnav__volume-slider"
          />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;