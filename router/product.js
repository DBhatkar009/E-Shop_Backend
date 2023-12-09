const { Product } = require("../model/product");
const express = require('express');
const router = express.Router();

// http://localhost:3000/api/v1/products getting data from database
router.get(`/`, async(req, res)=>{
    const productList = await Product.find();
    res.send(productList);
});


// Post products Data to save in database
router.post(`/`, (req, res)=>{
    const product = new Product({
     name: req.body.name,
     image: req.body.image,
     model: req.body.model,
     price: req.body.price
    });
    product.save()
    .then((item =>{
      res.status(201).json(item);
    }))
    .catch((err)=>{
      res.status(501).json({
         err: err,
         success: false
      })
    })
 });


 module.exports = router;