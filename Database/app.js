// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes')

const app = express();
const port = process.env.PORT

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/contacts', contactRoutes);
app.use("/orders", orderRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server chạy tại: http://localhost:${port}`);
});
