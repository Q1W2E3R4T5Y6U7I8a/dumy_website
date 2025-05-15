import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/common/NavBar/NavBar';
import BottomNav from './components/common/BottomNav/BottomNav';
import HomePage from './components/pages/HomePage/HomePage';
import BooksPage from './components/pages/BooksPage/BooksPage';
import DumyPage from './components/pages/DumyPage/DumyPage';
import DumaPage from './components/pages/DumaPage/DumaPage';
import AccountPage from './components/pages/AccountPage/AccountPage';
import LoginPage from './components/pages/LoginPage/LoginPage';
import RegisterPage from './components/pages/RegisterPage/RegisterPage';
import VerifyEmailPage from './components/pages/VerifyEmailPage/VerifyEmailPage';
import PrivateRoute from './components/common/PrivateRoute/PrivateRoute';
import BackgroundMusic from './context/BackgroundMusic';
import './assets/scss/main.scss';
import AddPostPage from './components/pages/AddPostPage/AddPostPage';
import PostDetails from './components/common/PostDetails/PostDetails';
import { auth } from './firebase';
import EditPostPage from './components/pages/EditPostPage/EditPostPage';
import FriendsPage from './components/pages/FriendsPage/FriendsPage';
import MusicPage from './components/pages/MusicPage/MusicPage';
import MessagesPage from './components/pages/MessagesPage/MessagesPage';
import ConversationPage from './components/pages/ConversationPage/ConversationPage';
import ChatPage from './components/pages/ChatPage/ChatPage';
import GamesPage from './components/pages/GamesPage/GamesPage';
import HelpPage from './components/pages/HelpPage/HelpPage';

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/dumy_website">
        <div className="app">
          <BackgroundMusic>
            <NavBar />
            <div className="main-content">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/account" element={<Navigate to={`/account/${auth.currentUser?.uid}`} />} />
                <Route path="/account/:id" element={<AccountPage />} />
                <Route path="/books" element={<PrivateRoute><BooksPage /></PrivateRoute>} />
                <Route path="/dumy" element={<PrivateRoute><DumyPage /></PrivateRoute>} />
                <Route path="/dumy/add" element={<AddPostPage />} />
                <Route path="/dumy/:id" element={<PostDetails />} />
                <Route path="/dumy/edit/:id" element={<EditPostPage />} />
                <Route path="/duma" element={<PrivateRoute><DumaPage /></PrivateRoute>} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/music" element={<MusicPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/messages/:id" element={<ConversationPage />} />
                <Route path="/chats" element={<ChatPage />} />
                <Route path="/chats/:id" element={<ChatPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
            <BottomNav />
          </BackgroundMusic>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;