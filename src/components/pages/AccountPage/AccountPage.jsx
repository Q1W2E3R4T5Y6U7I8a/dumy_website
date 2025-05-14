import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db, auth } from '../../../firebase';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import Post from '../../common/Post/Post';
import { updateProfile } from 'firebase/auth';
import './AccountPage.scss';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AccountPage = () => {
  const [friends, setFriends] = useState([]);
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [userBooks, setUserBooks] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const avatarOptions = [
    '/avatar_1.png',
    '/avatar_2.png',
    '/avatar_3.png',
    '/avatar_4.png',
    '/avatar_5.png',
    '/avatar_6.png',
    '/avatar_7.png',
    '/avatar_8.png',
    '/avatar_9.png',

  ];
  const selectionOptions = {
    religion: ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Atheism', 'Other'],
    politicalViews: ['Liberal', 'Conservative', 'Moderate', 'Socialist', 'Libertarian', 'Other'],
    personalPriority: ['Family', 'Career', 'Health', 'Wealth', 'Spirituality', 'Relationships'],
    importantInOthers: ['Honesty', 'Intelligence', 'Kindness', 'Humor', 'Ambition', 'Loyalty'],
    viewsOnSmoking: ['Never', 'Occasionally', 'Socially', 'Regularly', 'Against it'],
    viewsOnAlcohol: ['Never', 'Occasionally', 'Socially', 'Regularly', 'Against it']
  };

  const initialUserInfo = {
    email: '',
    displayName: '',
    photoURL: '/no_avatar.png',
    hometown: '',
    work: '',
    education: '',
    mobile: '',
    activities: '',
    interests: '',
    favoriteMusic: '',
    favoriteMovies: '',
    favoriteTVShow: '',
    favoriteBooks: '',
    favoriteGames: '',
    favoriteQuote: '',
    aboutMe: '',
    religion: '',
    politicalViews: '',
    personalPriority: '',
    importantInOthers: '',
    viewsOnSmoking: '',
    viewsOnAlcohol: '',
    inspiredBy: '',
  };
  
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      const userRef = doc(db, 'userInfo', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const friendsIds = userDoc.data().friends || [];
        const friendsData = await Promise.all(
          friendsIds.map(async (friendId) => {
            const friendRef = doc(db, 'userInfo', friendId);
            const friendDoc = await getDoc(friendRef);
            return friendDoc.exists() ? { id: friendId, ...friendDoc.data() } : null;
          })
        );
        setFriends(friendsData.filter((friend) => friend !== null));
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const userRef = doc(db, "userInfo", currentUser.uid);
        const docSnap = await getDoc(userRef);
        const q = query(collection(db, 'books'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const postsQuery = query(collection(db, 'posts'), where('userId', '==', currentUser.uid));
        const postsSnapshot = await getDocs(postsQuery);
        const posts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const firestoreData = docSnap.exists() ? docSnap.data() : {};
        const mergedData = {
          ...initialUserInfo,
          ...firestoreData,
          email: currentUser.email,
          displayName: currentUser.displayName || '',
          photoURL: currentUser.photoURL || '/no_avatar.png'
        };
        Object.keys(mergedData).forEach(key => {
          if (mergedData[key] === undefined) {
            mergedData[key] = '';
          }
        });
        
        setUserInfo(mergedData);
        setUserBooks(books);
        setUserPosts(posts);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [id]);

  const handleAvatarSelect = async (avatarUrl) => {
    try {
      await updateProfile(currentUser, { photoURL: avatarUrl });
      const userRef = doc(db, 'userInfo', currentUser.uid);
      await setDoc(userRef, { photoURL: avatarUrl }, { merge: true });
      setUserInfo(prev => ({ ...prev, photoURL: avatarUrl }));
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const userRef = doc(db, 'userInfo', currentUser.uid);
      await setDoc(userRef, userInfo, { merge: true }); 
      alert('Profile updated successfully!');
      setIsEditing(false); 
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="account-container">
      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-header">
            <img src={userInfo.photoURL} alt="Profile" className="current-avatar" />
            {isEditing ? (
              <div className="profile-name">
                <input
                  type="text"
                  name="displayName"
                  value={userInfo.displayName}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="editable-input"
                />
              </div>
            ) : (
              <h2 className="profile-name">{userInfo.displayName}</h2>
            )}
          </div>

          {isEditing && (
            <div className="avatar-selection">
              <h3>Choose Your Avatar</h3>
              <div className="avatar-grid">
                {avatarOptions.map((avatar, index) => (
                  <div 
                    key={index} 
                    className={`avatar-option ${userInfo.photoURL === avatar ? 'selected' : ''}`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentUser && (
            <>
              <button onClick={handleLogout} className="logout-btn">Log Out</button>
              <button 
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)} 
              className={`edit-profile-btn ${isEditing ? 'save' : ''}`}
            >
              {isEditing ? 'Save' : 'Edit Profile'}
            </button>
            </>
          )}

        <div className="friends-block">
        <h3>Friends ({friends.length})</h3>
          <div className="friends-list">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div key={friend.id} className="friend-card">
                  <img src={friend.photoURL || '/no_avatar.png'} alt={friend.displayName} />
                  <Link to={`/account/${friend.id}`}>{friend.displayName}</Link>
                </div>
              ))
            ) : (
              <p>No friends yet.</p>
            )}
        </div>
      </div>
        </div>
      </div>

      <div className="content-section">
        <div className="user-posts">
        <h3>Your Posts</h3>
          <div className="posts-grid">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))
            ) : (
              <p>No posts yet</p>
            )}
          </div>
        </div>

        <div className="user-books">
          <h3>Your Books</h3>
          <div className="book-list">
            {userBooks.map((book, index) => (
              <div key={book.id || index} className="book-card">
                <div className="book-cover">
                  <img src={book.imageUrl} alt={book.title} />
                </div>
                <div className="book-details">
                  <h4>{book.title}</h4>
                  <p className="author">{book.author}</p>
                  <p className="description">{book.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-info-section">
          <div className="basic-info">
            <h3>Basic Information</h3>
            <div className="form-grid">
              {['hometown', 'work', 'education', 'mobile', 'activities', 'interests'].map(field => (
                <div className="form-group" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name={field}
                      value={userInfo[field]}
                      onChange={handleInputChange}
                      className="editable-input"
                    />
                  ) : (
                    <div className="info-text">{userInfo[field] || 'Not specified'}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="favorites-section">
            <h3>Favorites</h3>
            <div className="form-grid">
              {['favoriteMusic', 'favoriteMovies', 'favoriteTVShow', 'favoriteBooks', 'favoriteGames'].map(field => (
                <div className="form-group" key={field}>
                  <label>{field.replace('favorite', 'Favorite ').replace(/([A-Z])/g, ' $1')}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name={field}
                      value={userInfo[field]}
                      onChange={handleInputChange}
                      className="editable-input"
                    />
                  ) : (
                    <div className="info-text">{userInfo[field] || 'Not specified'}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="personal-section">
            <div className="rich-text-fields">
              <div className="form-group">
                <label>Favorite Quote</label>
                {isEditing ? (
                  <textarea
                    name="favoriteQuote"
                    value={userInfo.favoriteQuote}
                    onChange={handleInputChange}
                    className="rich-textarea"
                  />
                ) : (
                  <div className="info-text">{userInfo.favoriteQuote || 'Not specified'}</div>
                )}
              </div>
              
              <div className="form-group">
                <label>About Me</label>
                {isEditing ? (
                  <textarea
                    name="aboutMe"
                    value={userInfo.aboutMe}
                    onChange={handleInputChange}
                    className="rich-textarea"
                  />
                ) : (
                  <div className="info-text">{userInfo.aboutMe || 'Not specified'}</div>
                )}
              </div>
            </div>
            
            <div className="selection-fields">
              {Object.keys(selectionOptions).map((field) => (
                <div className="form-group" key={field}>
                  <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                  {isEditing ? (
                    <select
                      name={field}
                      value={userInfo[field]}
                      onChange={handleInputChange}
                      className="styled-select"
                    >
                      <option value="">Select an option</option>
                      {selectionOptions[field].map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="info-text">{userInfo[field] || 'Not specified'}</div>
                  )}
                </div>
              ))}
              
              <div className="form-group">
                <label>Inspired By</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="inspiredBy"
                    value={userInfo.inspiredBy}
                    onChange={handleInputChange}
                    className="editable-input"
                  />
                ) : (
                  <div className="info-text">{userInfo.inspiredBy || 'Not specified'}</div>
                )}
              </div>
            </div>
          </div>      
        </div>
      </div>
    </div>
  );
};

export default AccountPage;