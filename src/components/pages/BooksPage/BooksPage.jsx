import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import './BooksPage.scss';
import { Link } from 'react-router-dom';


const BooksPage = () => {
  const [userAvatars, setUserAvatars] = useState({});

  const [books, setBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newBook, setNewBook] = useState({
    id: null,
    title: '',
    author: '',
    contact: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'books'), async (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(booksData);
  
      // Get unique userIds
      const userIds = [...new Set(booksData.map(book => book.userId))];
  
      // Fetch userInfo documents for those userIds
      const avatars = {};
      for (const uid of userIds) {
        try {
          const userDoc = await getDoc(doc(db, 'userInfo', uid));
          if (userDoc.exists()) {
            avatars[uid] = userDoc.data().photoURL;
          }
        } catch (err) {
          console.error(`Error fetching avatar for ${uid}:`, err);
        }
      }
  
      setUserAvatars(avatars);
    });
  
    return () => unsubscribe();
  }, []);
  

    const addOrUpdateBook = async () => {
    const { id, title, author, contact, description, imageUrl } = newBook;
    if (!title || !author || !description || !imageUrl) {
      alert('Будь ласка, заповніть всі поля');
      return;
    }
  
    try {
      if (isEditing && id) {
        // Update existing book
        await updateDoc(doc(db, 'books', id), {
          title,
          author,
          contact,
          description,
          imageUrl,
          userPhotoURL: auth.currentUser.photoURL || `${process.env.PUBLIC_URL}/no_avatar.png`,
        });
  
        // Update the book in the local state
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === id
              ? { ...book, title, author, contact, description, imageUrl }
              : book
          )
        );
      } else {
        const docRef = await addDoc(collection(db, 'books'), {
          title,
          author,
          contact,
          description,
          imageUrl,
          userId: auth.currentUser.uid,
          userPhotoURL: auth.currentUser.photoURL || `${process.env.PUBLIC_URL}/no_avatar.png`,
        });
  
        setBooks((prevBooks) => [
          ...prevBooks,
          {
            id: docRef.id,
            title,
            author,
            contact,
            description,
            imageUrl,
            userId: auth.currentUser.uid,
            userPhotoURL: auth.currentUser.photoURL || `${process.env.PUBLIC_URL}/no_avatar.png`,
          },
        ]);
      }
  
      setModalVisible(false);
      setNewBook({ id: null, title: '', author: '', contact: '', description: '', imageUrl: '' });
      setIsEditing(false);
    } catch (err) {
      console.error('Firebase error:', err);
    }
  };

  const handleEdit = (book) => {
    setNewBook({
      id: book.id, // Ensure the ID is set
      title: book.title,
      author: book.author,
      contact: book.contact,
      description: book.description,
      imageUrl: book.imageUrl,
      userPhotoURL: book.userPhotoURL, // Include user photo if needed
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю книгу?')) {
      try {
        await deleteDoc(doc(db, 'books', id));
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <div className="books-page">
    <div className="container">
      <p className="info">
        <strong>Strangely and non natural seems a person, that exists without books</strong>
        <br />
        <span> ©️ Taras Shevchenko</span>
      </p>

      <button className="add-btn" onClick={() => setModalVisible(true)}>+ Add book</button>

      <div className="book-list">
        {books.map(book => (
          <div key={book.id || book.title} className="book">
            <Link to={`/account/${book.userId}`} className="creator-link">
              <img
                src={
                  userAvatars[book.userId]?.startsWith('http')
                    ? userAvatars[book.userId]
                    : `${process.env.PUBLIC_URL}${userAvatars[book.userId] || '/no_avatar.png'}`
                }
                alt="User Avatar"
                className="creator-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${process.env.PUBLIC_URL}/no_avatar.png`;
                }}
              />
            </Link>

 
            <strong>{book.title} — {book.author}</strong>
            <p>{book.description}</p>
            <img src={`${process.env.PUBLIC_URL}${book.imageUrl}`} alt={book.title} className="book-image" />
            {book.userId === auth.currentUser.uid && (
              <div className="actions">
                <button onClick={() => handleEdit(book)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(book.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit' : 'Add'} book </h3>
            <input
              placeholder="Назва книги"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <input
              placeholder="Автор книги"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            />
            <input
              placeholder="Контакт"
              value={newBook.contact}
              onChange={(e) => setNewBook({ ...newBook, contact: e.target.value })}
            />
            <textarea
              placeholder="Опис"
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  setNewBook({ ...newBook, imageUrl: reader.result });
                };
                reader.readAsDataURL(file);
              }}
            />
            <button onClick={addOrUpdateBook}>
              {isEditing ? 'Оновити книгу' : 'Додати книгу'}
            </button>
            <button onClick={() => setModalVisible(false)}>Скасувати</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default BooksPage;