const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const db = require("./database.js")

app.get("/",(req,res)=>{
    res.send("server working🔥");
})

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
