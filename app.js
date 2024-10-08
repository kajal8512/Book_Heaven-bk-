const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./conn/conn");
const user = require("./routes/user");
const book = require("./routes/book");
const favourite = require("./routes/favourite");
const cart = require("./routes/cart");
const orders = require("./routes/order");

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", favourite);
app.use("/api/v1", cart);
app.use("/api/v1", orders);

// creating port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
