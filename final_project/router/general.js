const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bookList = await new Promise((resolve) => resolve(books));
    res.json(bookList);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const bookDetails = await new Promise((resolve) => resolve(books[isbn]));
    if (bookDetails) {
      res.json(bookDetails);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book details" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const bookList = Object.values(books);
    const booksByAuthor = bookList.filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const bookList = Object.values(books);
    const booksByTitle = bookList.filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      res.json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
