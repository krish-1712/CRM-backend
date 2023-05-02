const mongoose =require("mongoose");

mongoose.connect(
    `mongodb+srv://krish:Q3J68N1LmXTzIJ7p@cluster0.v5ee5wa.mongodb.net/test`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );