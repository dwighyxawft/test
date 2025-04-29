const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Import cors
const userRoutes = require('./routes/router');
const { swaggerUi, specs } = require('./config/swagger'); // import the config
const app = express();

dotenv.config();

// Enable CORS for localhost:3000
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/users', userRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
