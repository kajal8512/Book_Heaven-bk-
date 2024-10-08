const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./authUser");

// add book to favourite
router.put("/add-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isFavourite = userData.favourites.includes(bookid);
    if (isFavourite) {
      return res.status(200).json({ message: "Book is already in favourite" });
    }
    const data = await User.findByIdAndUpdate(id, {
      $push: { favourites: bookid },
    });
    return res.status(200).json({ message: "Book added to favourite" });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

// remove book from favourite
router.put("/remove-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isFavourite = userData.favourites.includes(bookid);
    if (isFavourite) {
      await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
    }
    return res.status(200).json({ message: "Book removed from favourite" });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

// get all favourite books
router.get("/get-favourites-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("favourites");
    res.status(200).json({ favourites: userData.favourites });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
