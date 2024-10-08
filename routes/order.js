const router = require("express").Router();
const User = require("../models/user");
const Order = require("../models/orders");
const { authenticateToken } = require("./authUser");

//  Place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;
    for (const orderData of order) {
      const newOrder = new Order({
        user: id,
        book: orderData._id,
      });
      const orderDataFromDb = await newOrder.save();
      // saving Order in user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      // clearing cart
      await User.findByIdAndUpdate(id, { $pull: { cart: orderData._id } });
    }
    return res
      .status(200)
      .json({ status: "Success", message: "Order placed successfully" });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

// get order history of particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });
    const orders = userData.orders.reverse();

    return res.status(200).json({ data: orders });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

// get all orders admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({ path: "book" })
      .populate({ path: "user" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: userData, message: "All orders" });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

// update order status admin
router.put("/update-order-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res.status(200).json({ message: "Order status updated" });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
