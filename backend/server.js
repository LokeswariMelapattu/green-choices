const express = require('express');
const routeRoutes = require('./routes/routes.js');
require('dotenv').config();

const app = express();

app.use(express.json());

// Routes
app.use('/', routeRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});