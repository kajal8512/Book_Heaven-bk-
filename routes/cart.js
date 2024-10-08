const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./authUser");

// add to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isCart = userData.cart.includes(bookid);
    if (isCart) {
      return res.status(200).json({ message: "Book is already in cart" });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.status(200).json({ message: "Book added to cart" });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

// remove from cart
router.put("/remove-from-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isCart = userData.cart.includes(bookid);
    if (!isCart) {
      return res.status(400).json({ message: "Book is not in cart" });
    }
    await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
    return res.status(200).json({ message: "Book removed from cart" });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

// get a cart for particular user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();
    res.status(200).json({ data: cart });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
