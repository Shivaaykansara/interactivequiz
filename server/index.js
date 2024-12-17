const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const sentenceRoutes = require("./routes/fillBlankRoutes");
const categorizedQuestionRoutes = require('./routes/categorizedQuestionRoutes');
const comprehensiveRoutes = require('./routes/comprehensiveRoute');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const corsOption = {
  origin:['https://interactivequiz.shivacodesmith.com','https://interactivequiz-bur6.onrender.com'],
  methods:'GET, PUT, POST, PATCH, DELETE, HEAD',
  credentials:true
}
// Middleware
app.use(express.json());
app.use(cors(corsOption));

app.use('/api', sentenceRoutes);
app.use('/api', categorizedQuestionRoutes);
app.use('/api', comprehensiveRoutes);

const connection = async () => {
 await mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("connection successful");
    })
    .catch((err) => console.log(err));
};

// Start Server
connection().then(() => {
    app.listen(PORT, () => {
        console.log(`listening on Port ${PORT}`);
      });
})

