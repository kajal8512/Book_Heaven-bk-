const mongoose = require("mongoose");
require("dotenv").config();

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
conn();
