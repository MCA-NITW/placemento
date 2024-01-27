// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes.js');
const companyRoutes = require('./routes/companyRoutes.js');
const { authenticateUser } = require('./middleware/authMiddleware.js');
const statsRoutes = require('./routes/statsRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const uri = process.env.DB_CONNECTION_STRING;

mongoose
	.connect(uri)
	.then(() => console.log('Database connected!'))
	.catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

// Use the authRoutes only once
app.use('/auth', authRoutes);

// Use the companyRoutes only once
app.use('/companies', companyRoutes);

// Use the statsRoutes only once
app.use('/stats', statsRoutes);

// Use the userRoutes only once
app.use('/users', userRoutes);

app.get('/token-check', authenticateUser, (req, res) => {
	res.status(200).json({ message: 'Authorized' });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
