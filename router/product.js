const { Product } = require("../model/product");
const { Categorie } = require("../model/categorie");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// http://localhost:4000/api/v1/products getting data from database
router.get(`/`, async(req, res)=>{
    const productList = await Product.find().populate('categorie');

    if(!productList){
      res.status(500).json({success: false});
    }
    res.send(productList);
});

// http://localhost:4000/api/v1/products getting data by id from database and also populate categorie
router.get(`/:id`, async(req, res)=>{
  const prod = await Product.findById(req.params.id).populate('categorie');
  
  if(!prod){
    return res.status(400).send("unsuccessfully populate data from category");
  }

  res.send(prod);

})


// http://localhost:4000/api/v1/products getting data by select perticular name from database
router.get(`/`, async(req, res)=>{
  const prod = await Product.find().select('name');
  
  if(!prod){
    return res.status(404).send("something went wrong");
  }

  res.status(202).send(prod);

})


// Post products Data to save in database
router.post(`/`, async (req, res)=>{
    const cat = Categorie.findById(req.params.cat);
    if(!cat) return res.status(404).send("categorie id unsuccessfully created");
    let product = new Product({
     name: req.body.name,
     description: req.body.description,
     richDescription: req.body.richDescription,
     image: req.body.image,
     images: req.body.images,
     brand: req.body.brand,
     price: req.body.price,
     categorie: req.body.categorie,
     rating: req.body.rating,
     numReviews: req.body.numReviews,
     isFeatured: req.body.isFeatured,
     dateCreated: req.body.dateCreated,
     countInStock: req.body.countInStock
    });
    product = await product.save()
    .then((product =>{
      res.status(201).send(product);
    }))
    .catch((err)=>{
      res.status(501).json({
         err: err,
         success: false
      })
    })
 });


// http://localhost:4000/api/v1/products Updateing a data by id from database 
router.put(`/:id`, async(req, res)=>{
  if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(404).send("categorie id is invalid");
  }
  const categ = Categorie.findById(req.body.categ);
  if(!categ) return res.status(404).send("categorie id unsuccessfully created");
  let pro = await Product.findByIdAndUpdate(
    req.params.id,
   {
    name: req.body.name,
     description: req.body.description,
     richDescription: req.body.richDescription,
     image: req.body.image,
     images: req.body.images,
     brand: req.body.brand,
     price: req.body.price,
     categorie: req.body.categorie,
     rating: req.body.rating,
     numReviews: req.body.numReviews,
     isFeatured: req.body.isFeatured,
     dateCreated: req.body.dateCreated,
     countInStock: req.body.countInStock
   },
   {
      new: true
   }
  ).then(pro=>{
      return res.status(210).send(pro);
  }).catch(err=>{
   return res.status(420).send(err.message);
  })
})



// http://localhost:4000/api/v1/products/65780802c68f6ad52f563ebe deleted data by findByIdAndRemove
router.delete('/:id',async (req, res) => {
  const deletedItem = await Product.findByIdAndRemove(req.params.id)
  .then(deletedItem=>{
      return res.status(202).json({ success: true, message: "deleted product item successfully" });
  })
  .catch(err => res.status(400).send(err.message));

})


 module.exports = router;