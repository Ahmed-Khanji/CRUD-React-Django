import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState();
  const [newTitle, setNewTitle] = useState("");

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setBooks(data);
    }
    catch (err) {
      console.log(err.message)
    }
  }

  const addBook = async () => {
    try {
      const bookData = {
        bookTitle: title,
        release_year: releaseYear
      };
      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      });
      const newBook = await response.json();
      setBooks((prev) => [...prev, newBook]);
      setTitle('');
      setReleaseYear('');
    }
    catch (err) {
      console.log(err.message)
    }
  }

  function deleteBook(pk) {
    fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
      method: 'DELETE',

    })
      .then(setBooks((prev) => prev.filter((book) => (book.id !== pk))))
      .catch(err => console.error(err.message))
  }

  const updateTitle = async (pk, release_year) => {
    try {
      const bookData = {
        bookTitle: newTitle,
        release_year
      };
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      });
      const data = await response.json();
      setBooks((prev) => prev.map((book) => {
        if (book.id === pk) return data;
        return book;
      }))
      setNewTitle('');
    }
    catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <h1> Book Website </h1>

      <div>
        <input 
          type="text" 
          placeholder='Book Title...'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input 
          type="number" 
          placeholder='Release Year...'
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <button onClick={addBook}>Add Book</button>
      </div>

      <ul>
        {books.map((book) => (
          <div>
            <p>{book.bookTitle} ({book.release_year}) <button className="delete" onClick={() => deleteBook(book.id)}>Delete</button></p>
            <input 
              type="text" 
              placeholder="New Title..." 
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button onClick={() => updateTitle(book.id, book.release_year)}>Change Title</button>
          </div>
        ))}
      </ul>
    </>
  )
}