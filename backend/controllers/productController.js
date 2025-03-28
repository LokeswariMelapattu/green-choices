const path = require('path');
const fs = require('fs');

const getProducts = (req, res) => {
    const filePath = path.join(__dirname, '../data/products.json');

    fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
            return res.status(500).json({ error: "Failed to load product data" });
        }
        const products = JSON.parse(data);
        res.json(products);
    });
};

module.exports = { getProducts };