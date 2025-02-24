const express = require('express');
const cors = require('cors')
const routeRoutes = require('./routes/routes.js');
require('dotenv').config();

const app = express();
app.use(cors())
// app.use(express.json());

// Routes
app.use('/', routeRoutes);


const PORT = process.env.PORT || 3000;;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});