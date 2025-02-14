const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
app.get('/api', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log(`Server listening on port ${PORT}`);
});