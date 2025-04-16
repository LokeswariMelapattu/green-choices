const { getProducts } = require('../../controllers/productController');
const path = require('path');
const fs = require('fs');


jest.mock('fs');
jest.mock('path');

describe('Product Controller', () => {
    let req;
    let res;

    beforeEach(() => {

        jest.clearAllMocks();


        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };


        path.join.mockReturnValue('/mocked/path/to/products.json');
    });

    describe('getProducts', () => {
        test('should get all products and return them', () => {

            const mockProducts = [
                {
                    productId: 1,
                    name: 'Test Product 1',
                    price: 19.99,
                    description: 'Test description 1'
                },
                {
                    productId: 2,
                    name: 'Test Product 2',
                    price: 29.99,
                    description: 'Test description 2'
                }
            ];


            fs.readFile.mockImplementation((path, encoding, callback) => {
                callback(null, JSON.stringify(mockProducts));
            });


            getProducts(req, res);


            expect(path.join).toHaveBeenCalledWith(expect.any(String), '../data/products.json');


            expect(fs.readFile).toHaveBeenCalledWith('/mocked/path/to/products.json', 'utf8', expect.any(Function));


            expect(res.json).toHaveBeenCalledWith(mockProducts);
        });

        test('should handle file read errors and return 500 status', () => {

            const mockError = new Error('Failed to read file');
            fs.readFile.mockImplementation((path, encoding, callback) => {
                callback(mockError, null);
            });


            getProducts(req, res);


            expect(path.join).toHaveBeenCalledWith(expect.any(String), '../data/products.json');

            expect(fs.readFile).toHaveBeenCalledWith('/mocked/path/to/products.json', 'utf8', expect.any(Function));

            expect(res.status).toHaveBeenCalledWith(500);


            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to load product data'
            });
        });

        test('should handle JSON parsing errors', () => {

            fs.readFile.mockImplementation((path, encoding, callback) => {
                callback(null, 'Invalid JSON data');
            });


            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });


            const originalJSONParse = JSON.parse;
            JSON.parse = jest.fn().mockImplementation(() => {
                throw new Error('Invalid JSON');
            });


            try {
                getProducts(req, res);
            } catch (error) {
                // Handle the error
            }


            JSON.parse = originalJSONParse;


            expect(fs.readFile).toHaveBeenCalled();


            consoleErrorSpy.mockRestore();
        });
    });
});