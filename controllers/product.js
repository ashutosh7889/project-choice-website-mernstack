const Product = require('../models/Product');
const fs = require('fs');


exports.create = async(req, res) => {
    console.log('req.body: ', req.body);
    console.log('req.file: ', req.file);
    console.log('req.user: ', req.user);

    const { filename } = req.file;
    const { productName, productDesc, productPrice, productCategory, productQty } = req.body;

    try {
        let product = new Product();
        product.fileName = filename;
        product.productName = productName;
        product.productDesc = productDesc;
        product.productPrice = productPrice;
        product.productCategory = productCategory;
        product.productQty = productQty;

        await product.save();

        res.json({
            successMessage: `${productName} was created`,
            product
        })
    } catch (err) {
        console.log(err, 'productController.create error');
        res.statud(500).json({
            errorMessage: 'Please try again later'
        })
    }


    // res.json({
    //     message: 'Inside productController',
    // });
};


exports.readAll = async(req, res) => {


    try {
        const products = await Product.find({}).populate('productCategory', 'category');
        res.json({ products });
    } catch (err) {
        console.log(err, 'productController.readAll error');
        res.statud(500).json({
            errorMessage: 'Please try again later'
        })
    }


    // res.json({
    //     message: 'Inside productController',
    // });
};

exports.read = async(req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        res.json(product);
    } catch (err) {
        console.log(err, 'productController.read error');
        res.status(500).json({
            errorMessage: 'Please try again later',
        });
    }
};

exports.delete = async(req, res) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);

        fs.unlink(`uploads/${deletedProduct.fileName}`, err => {
            if (err) throw err;
            console.log(
                'Image successfully deleted from filesystem: ',
                deletedProduct.fileName
            );
        });

        res.json(deletedProduct);
    } catch (err) {
        console.log(err, 'productController.delete error');
        res.status(500).json({
            errorMessage: 'Please try again later',
        });
    }
};