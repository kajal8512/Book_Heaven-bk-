const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { authenticateToken } = require("./authUser");

// add book --admin
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { url, title, author, price, desc, language } = req.body;
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(401)
        .json({ message: "You not have access to perform admim work" });
    }
    const newBook = new Book({
      url: url,
      title: title,
      author: author,
      price: price,
      desc: desc,
      language: language,
    });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully" });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

// update book --admin
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const bookId = req.headers.bookid || req.headers.bookId;
    if (!bookId) {
      return res.status(400).json({ message: "Book id is required" });
    }

    const { url, title, author, price, desc, language } = req.body;

    // Validate required fields
    if (!url || !title || !author || !price || !desc || !language) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        url,
        title,
        author,
        price,
        desc,
        language,
      },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook });
  } catch (err) {
    console.error("Error updating book:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// delete book --admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    if (!bookid) {
      return res.status(400).json({ message: "Book id is required" });
    }

    const deletedBook = await Book.findByIdAndDelete(bookid);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// get Book by id
router.get("/get-book-by/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Book.findById(id);
    return res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

// get all books
router.get("/get-all-books", async (req, res) => {
  try {
    const data = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

// get recent 4 book
router.get("/get-recent-books", async (req, res) => {
  try {
    const data = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
